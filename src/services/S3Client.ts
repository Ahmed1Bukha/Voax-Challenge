import * as https from "https";
import * as crypto from "crypto";
import {
  AWSCredentials,
  S3RequestOptions,
  S3Response,
  SignatureComponents,
  CanonicalRequestComponents,
} from "../types/S3Types";
class S3AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "S3AuthenticationError";
  }
}

export class S3RequestError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "S3RequestError";
    this.statusCode = statusCode;
  }
}

export default class S3Service {
  private readonly credentials: AWSCredentials;
  private readonly service: string = "s3";
  constructor(credentials: AWSCredentials) {
    this.validateCredentials(credentials);
    this.credentials = credentials;
  }

  private validateCredentials(credentials: AWSCredentials): void {
    if (
      !credentials.accessKeyId ||
      !credentials.secretAccessKey ||
      !credentials.region
    ) {
      throw new S3AuthenticationError("Missing required AWS credentials");
    }
  }
  public createSignature(
    method: string,
    host: string,
    path: string,
    queryParams: Record<string, string>,
    headers: Record<string, string>,
    payload: string | Buffer,
    timestamp: Date
  ): SignatureComponents {
    const date = timestamp.toISOString().slice(0, 10).replace(/-/g, "");
    const datetime = timestamp.toISOString().replace(/[:\-]|\.\d{3}/g, "");

    // Step 1: Create canonical request
    const canonicalComponents = this.createCanonicalRequest(
      method,
      path,
      queryParams,
      headers,
      payload
    );

    // Step 2: Create string to sign
    const credentialScope = `${date}/${this.credentials.region}/${this.service}/aws4_request`;
    const canonicalRequestHash = crypto
      .createHash("sha256")
      .update(canonicalComponents.canonicalRequest)
      .digest("hex");

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      datetime,
      credentialScope,
      canonicalRequestHash,
    ].join("\n");

    // Step 3: Calculate signature
    const signingKey = this.getSigningKey(date);
    const signature = crypto
      .createHmac("sha256", signingKey)
      .update(stringToSign)
      .digest("hex");

    // Step 4: Create authorization header
    const authorization = `AWS4-HMAC-SHA256 Credential=${this.credentials.accessKeyId}/${credentialScope}, SignedHeaders=${canonicalComponents.signedHeaders}, Signature=${signature}`;

    return {
      canonicalRequest: canonicalComponents.canonicalRequest,
      stringToSign,
      signature,
      authorization,
    };
  }
  private createCanonicalRequest(
    method: string,
    path: string,
    queryParams: Record<string, string>,
    headers: Record<string, string>,
    payload: string | Buffer
  ): CanonicalRequestComponents & { canonicalRequest: string } {
    // Canonical URI
    const canonicalURI = this.encodeURI(path);

    // Canonical query string
    const canonicalQueryString = Object.keys(queryParams)
      .sort()
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            queryParams[key] || ""
          )}`
      )
      .join("&");

    // Canonical headers
    const sortedHeaders = Object.keys(headers).sort();
    const canonicalHeaders =
      sortedHeaders
        .map(
          (key) =>
            `${key.toLowerCase()}:${headers[key]?.toString().trim() || ""}`
        )
        .join("\n") + "\n";

    const signedHeaders = sortedHeaders
      .map((key) => key.toLowerCase())
      .join(";");

    // Payload hash
    const payloadHash = crypto
      .createHash("sha256")
      .update(payload || "")
      .digest("hex");

    const canonicalRequest = [
      method,
      canonicalURI,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    return {
      method,
      canonicalURI,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
      canonicalRequest,
    };
  }

  private encodeURI(path: string): string {
    return encodeURIComponent(path).replace(/%2F/g, "/");
  }

  private getSigningKey(date: string): Buffer {
    const kDate = crypto
      .createHmac("sha256", `AWS4${this.credentials.secretAccessKey}`)
      .update(date)
      .digest();

    const kRegion = crypto
      .createHmac("sha256", kDate)
      .update(this.credentials.region)
      .digest();

    const kService = crypto
      .createHmac("sha256", kRegion)
      .update(this.service)
      .digest();

    const kSigning = crypto
      .createHmac("sha256", kService)
      .update("aws4_request")
      .digest();

    return kSigning;
  }

  /**
   * Makes an authenticated HTTP request to S3
   */
  public async makeRequest(options: S3RequestOptions): Promise<S3Response> {
    const timestamp = new Date();
    const host = `${options.bucket}.s3.${this.credentials.region}.amazonaws.com`;
    const path = options.key ? `/${options.key}` : "/";

    const payload = options.payload || "";
    const payloadBuffer = Buffer.isBuffer(payload)
      ? payload
      : Buffer.from(payload, "utf8");

    const headers: Record<string, string> = {
      Host: host,
      "X-Amz-Date": timestamp.toISOString().replace(/[:\-]|\.\d{3}/g, ""),
      "X-Amz-Content-Sha256": crypto
        .createHash("sha256")
        .update(payloadBuffer)
        .digest("hex"),
      ...options.additionalHeaders,
    };

    const signatureComponents = this.createSignature(
      options.method,
      host,
      path,
      options.queryParams || {},
      headers,
      payloadBuffer,
      timestamp
    );

    headers["Authorization"] = signatureComponents.authorization;

    const queryString = options.queryParams
      ? "?" +
        Object.keys(options.queryParams)
          .map((k) => `${k}=${options.queryParams![k]}`)
          .join("&")
      : "";

    return new Promise((resolve, reject) => {
      const requestOptions: https.RequestOptions = {
        hostname: host,
        port: 443,
        path: path + queryString,
        method: options.method,
        headers: headers,
      };

      const req = https.request(requestOptions, (res) => {
        let data = "";

        res.on("data", (chunk: Buffer) => {
          data += chunk.toString();
        });

        res.on("end", () => {
          const response: S3Response = {
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body: data,
          };

          if (res.statusCode && res.statusCode >= 400) {
            reject(
              new S3RequestError(`S3 request failed: ${data}`, res.statusCode)
            );
          } else {
            resolve(response);
          }
        });
      });

      req.on("error", (err: Error) => {
        console.log("Request failed: ", err.message);
        reject(new S3RequestError(`Request failed: ${err.message}`, 0));
      });

      if (payloadBuffer.length > 0) {
        req.write(payloadBuffer);
      }
      req.end();
    });
  }

  public async getObject(bucket: string, key: string): Promise<S3Response> {
    return this.makeRequest({
      method: "GET",
      bucket,
      key,
    });
  }

  /**
   * Put object to bucket
   */
  public async putObject(
    bucket: string,
    key: string,
    data: string | Buffer,
    contentType: string = "application/octet-stream"
  ): Promise<S3Response> {
    const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");

    // Check if key already exists
    try {
      const result = await this.headObject(bucket, key);
      console.log(result);
      // If headObject succeeds, the key exists
      console.log("Key already exists");
      throw new S3RequestError("Key already exists", 409);
    } catch (error) {
      // If headObject fails with 404, the key doesn't exist (which is what we want)
      if (error instanceof S3RequestError && error.statusCode === 404) {
        console.log("Key does not exist, proceeding with upload");
      } else {
        // If it's any other error, re-throw it
        throw error;
      }
    }
    return this.makeRequest({
      method: "PUT",
      bucket,
      key,
      payload: dataBuffer,
      additionalHeaders: {
        "Content-Type": contentType,
        "Content-Length": dataBuffer.length.toString(),
      },
    });
  }

  public async headObject(bucket: string, key: string): Promise<S3Response> {
    return this.makeRequest({
      method: "HEAD",
      bucket,
      key,
    });
  }
}
