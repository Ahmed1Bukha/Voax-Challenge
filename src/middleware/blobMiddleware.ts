import { Request, Response, NextFunction } from "express";
import DatabaseServices from "../services/databaseServices";
import { BlobActivityModel } from "../models/blobActivity";

const databaseServices = new DatabaseServices();

export const saveBlobActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Store the original res.end method
  const originalEnd = res.end.bind(res);

  // Override res.end to capture the response
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    // Call the original end method first
    const result = originalEnd(chunk, encoding, cb);

    // Now capture the activity after the response is sent
    captureBlobActivity(req, res).catch(console.error);

    return result;
  };

  next();
};

const captureBlobActivity = async (req: Request, res: Response) => {
  try {
    const blobActivity: BlobActivityModel = {
      blobId: req.params.id || req.params.blobId || "",
      action: req.method,
      success: res.statusCode >= 200 && res.statusCode < 300,
      metadata: {
        url: req.url,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    };

    await databaseServices.createBlobActivity(blobActivity);
  } catch (error) {
    console.error("Error saving blob activity:", error);
  }
};
