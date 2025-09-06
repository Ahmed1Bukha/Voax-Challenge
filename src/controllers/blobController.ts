import { Request, Response } from "express";
import blobSchema from "../models/blob";
import ResponseHandler from "../utils/responseHandler";
import S3Service from "../services/S3Client";
import config from "../config";

export default class BlobController {
  private s3Service: S3Service;
  constructor() {
    this.s3Service = new S3Service({
      accessKeyId: config.AWS.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS.AWS_SECRET_ACCESS_KEY,
      region: config.AWS.AWS_REGION,
    });
  }

  async getBlob(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return ResponseHandler.failure(res, "Id is required", 400);
      }

      const blob = blobSchema.parse({
        id,
        data: Buffer.from("8239u423t2uior").toString("base64"),
        createdAt: new Date(),
        size: 100,
      });

      if (!blob) {
        return ResponseHandler.failure(res, "Blob not found", 404);
      }

      return ResponseHandler.success(
        res,
        blob.data,
        "Blob retrieved successfully"
      );
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  async getBlobFromS3(req: Request, res: Response) {
    try {
      const key = req.params.key;
      if (!key) {
        return ResponseHandler.failure(res, "Key is required", 400);
      }
      const result = await this.s3Service.getObject(config.bucket, key);
      return ResponseHandler.success(
        res,
        result.body,
        "Blob retrieved successfully"
      );
    } catch (error) {
      console.log(error);
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  async putBlobToS3(req: Request, res: Response) {
    try {
      const data = req.body;
      const blob = blobSchema.safeParse({
        ...data,
        size: data.data.length,
      });

      if (!blob.success) {
        return ResponseHandler.failure(
          res,
          "Blob values are invalid",
          400,
          blob.error
        );
      }
      const result = await this.s3Service.putObject(
        config.bucket,
        blob.data.id,
        blob.data.data
      );
      return ResponseHandler.success(
        res,
        result.body,
        "Blob created successfully"
      );
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  async createBlob(req: Request, res: Response) {
    try {
      const data = req.body;
      const blob = blobSchema.safeParse({
        ...data,
        size: data.data.length,
      });

      if (!blob.success) {
        return ResponseHandler.failure(
          res,
          "Blob values are invalid",
          400,
          blob.error
        );
      }

      return ResponseHandler.success(
        res,
        blob.data,
        "Blob created successfully",
        201
      );
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }
}
