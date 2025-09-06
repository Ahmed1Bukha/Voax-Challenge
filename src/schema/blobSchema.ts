import mongoose, { model, Schema } from "mongoose";
import { BlobModel } from "../models/blob";

const blobSchemaModel = new Schema<BlobModel>({
  id: { type: String, required: true, unique: true },
  data: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // Base64 validation regex
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        return base64Regex.test(value);
      },
      message: "Data must be a valid base64 string",
    },
  },
  createdAt: { type: Date, required: true },
  size: { type: Number, required: true },
});

export const blobModel = model<BlobModel>("Blob", blobSchemaModel);
