import { Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler";
import DatabaseServices from "../services/databaseServices";

export default class ActivityController {
  private databaseServices: DatabaseServices;

  constructor() {
    this.databaseServices = new DatabaseServices();
  }

  async getBlobActivity(req: Request, res: Response) {
    try {
      const blobActivity = await this.databaseServices.getAllBlobActivity();
      console.log("Blob activity fetched:", blobActivity);
      return ResponseHandler.success(
        res,
        blobActivity,
        "Blob activity fetched successfully"
      );
    } catch (error) {
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  }
}
