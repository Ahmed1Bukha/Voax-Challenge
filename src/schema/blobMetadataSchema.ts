import mongoose, { model, Schema } from "mongoose";
import { BlobMetadataModel } from "../models/blobMetadata";

const blobMetadataSchemaModel = new Schema<BlobMetadataModel>({
  id: { type: String, required: true, unique: true },
  storageType: { type: String, required: true },
  metadata: {
    size: { type: Number, required: true },
    createdAt: { type: Date, required: true },
  },
});

export const blobMetadataModel = model<BlobMetadataModel>(
  "BlobMetadata",
  blobMetadataSchemaModel
);
