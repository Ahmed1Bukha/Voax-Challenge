import config from "../config/config";
import { BlobModel } from "../models/blob";
import { BlobActivityModel } from "../models/blobActivity";
import { blobActivityModel } from "../schema/blobActivirySchema";
import { blobModel } from "../schema/blobSchema";

export default class DatabaseServices {
  constructor() {}

  async createBlobActivity(blobActivity: BlobActivityModel) {
    const newBlobActivity = new blobActivityModel(blobActivity);
    const savedBlobActivity = await newBlobActivity.save();
    console.log("Blob activity saved:", savedBlobActivity);
    return savedBlobActivity;
  }

  async getAllBlobActivity() {
    const blobActivity = await blobActivityModel.find();
    return blobActivity;
  }

  async createBlob(blob: BlobModel) {
    const newBlob = new blobModel({
      ...blob,
    });
    const savedBlob = await newBlob.save();
    return savedBlob;
  }

  async getBlob(id: string) {
    const blob = await blobModel.findOne({
      id: id,
    });
    return blob;
  }
}
