import { Request, Response } from "express";
import blobSchema from "../models/blob";
import ResponseHandler from "../utils/responseHandler";
export default class BlobController {
  constructor() {}

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
