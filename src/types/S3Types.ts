import { IncomingHttpHeaders } from "http";

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface S3RequestOptions {
  method: string;
  bucket: string;
  key?: string;
  queryParams?: Record<string, string>;
  payload?: string | Buffer;
  additionalHeaders?: Record<string, string>;
}

export interface S3Response {
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: string;
}

export interface SignatureComponents {
  canonicalRequest: string;
  stringToSign: string;
  signature: string;
  authorization: string;
}

export interface CanonicalRequestComponents {
  method: string;
  canonicalURI: string;
  canonicalQueryString: string;
  canonicalHeaders: string;
  signedHeaders: string;
  payloadHash: string;
}
