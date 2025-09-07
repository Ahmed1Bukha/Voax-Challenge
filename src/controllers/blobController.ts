import { Request, Response } from "express";
import blobSchema from "../models/blob";
import ResponseHandler from "../utils/responseHandler";
import S3Service, { S3RequestError } from "../services/S3Client";
import config from "../config/config";
import DatabaseServices from "../services/databaseServices";
import LocalStorage from "../services/localStorage";
import { StorageType } from "../utils/enums/storageEnums";
import { blobMetadataModel } from "../schema/blobMetadataSchema";
import { BlobMetadataModel } from "../models/blobMetadata";
export default class BlobController {
  private s3Service: S3Service;
  private databaseServices: DatabaseServices;
  private localStorage: LocalStorage;
  constructor() {
    this.s3Service = new S3Service({
      accessKeyId: config.AWS.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS.AWS_SECRET_ACCESS_KEY,
      region: config.AWS.AWS_REGION,
    });
    this.databaseServices = new DatabaseServices();
    this.localStorage = new LocalStorage();
  }

  async getBlobFromDatabase(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return ResponseHandler.failure(res, "Id is required", 400);
      }

      const blob = await this.databaseServices.getBlob(id);

      if (!blob) {
        return ResponseHandler.failure(res, "Blob not found", 404);
      }

      return res.json({
        id: blob.id,
        data: blob.data,
        createdAt: blob.createdAt,
        size: blob.size,
      });
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  async createBlobInDatabase(req: Request, res: Response) {
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
      const result = await this.databaseServices.createBlob(blob.data);
      await this.saveBlobMetaData(
        blob.data.id,
        config.storageType,
        blob.data.size ?? 0,
        blob.data.createdAt
      );
      return ResponseHandler.success(res, result, "Blob created successfully");
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  async getBlobFromS3(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return ResponseHandler.failure(res, "Key is required", 400);
      }
      const result = await this.s3Service.getObject(config.bucket, id);
      const headers = await this.s3Service.headObject(config.bucket, id);
      if (!headers.headers["date"]) {
        return ResponseHandler.failure(res, "Date not found", 404);
      }
      const utcIsoString = new Date(headers.headers["date"]).toISOString();

      return res.json({
        id: id,
        data: result.body,
        createdAt: utcIsoString,
        size: result.body.length,
      });
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
      await this.saveBlobMetaData(
        blob.data.id,
        config.storageType,
        blob.data.size ?? 0,
        blob.data.createdAt
      );
      return ResponseHandler.success(
        res,
        result.body,
        "Blob created successfully"
      );
    } catch (error) {
      if (error instanceof S3RequestError) {
        console.log("Error from S3RequestError");
        return ResponseHandler.failure(res, error.message, error.statusCode);
      }
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  async saveBlobToLocalStorage(req: Request, res: Response) {
    try {
      const data = req.body;
      const chosenPath = req.query.path as string;
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
      const result = await this.localStorage.saveFileBlob(
        blob.data,
        chosenPath
      );
      await this.saveBlobMetaData(
        blob.data.id,
        config.storageType,
        blob.data.size ?? 0,
        blob.data.createdAt
      );
      return ResponseHandler.success(res, result, "Blob saved successfully");
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }
  async getBlobFromLocalStorage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return ResponseHandler.failure(res, "Key is required", 400);
      }
      const chosenPath = req.query.path as string;
      const result = await this.localStorage.getFileBlob(id, chosenPath);
      return res.json({
        id: result?.id,
        data: result?.data,
        createdAt: result?.createdAt,
        size: result?.size,
      });
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }

  private async saveBlobMetaData(
    id: string,
    storageType: StorageType,
    size: number,
    createdAt: Date
  ) {
    try {
      const blobMetaData: BlobMetadataModel = new blobMetadataModel({
        id: id,
        storageType: storageType,
        metadata: {
          size: size,
          createdAt: createdAt,
        },
      });
      const savedBlobMetaData = await this.databaseServices.saveBlobMetaData(
        blobMetaData
      );
      return savedBlobMetaData;
    } catch (error) {
      throw error;
    }
  }
}
