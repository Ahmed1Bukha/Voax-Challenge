import config from "../config/config";
import { BlobActivityModel } from "../models/blobActivity";
import { blobActivityModel } from "../schema/blobActivirySchema";

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
}
