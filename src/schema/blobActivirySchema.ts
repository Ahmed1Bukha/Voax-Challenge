import mongoose from "mongoose";

import { Schema, model } from "mongoose";
import { BlobActivityModel } from "../models/blobActivity";

const blobActivitySchema = new Schema<BlobActivityModel>(
  {
    blobId: { type: String, required: true },
    action: { type: String, required: true },
    success: { type: Boolean, required: true },
    metadata: {
      url: { type: String },
      userAgent: { type: String },
      ip: { type: String },
      timestamp: { type: String },
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

export const blobActivityModel = model<BlobActivityModel>(
  "BlobActivity",
  blobActivitySchema
);
