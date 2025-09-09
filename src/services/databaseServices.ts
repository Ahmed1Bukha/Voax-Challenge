import config from "../config/config";
import { BlobModel } from "../models/blob";
import { BlobActivityModel } from "../models/blobActivity";
import { BlobMetadataModel } from "../models/blobMetadata";
import { blobActivityModel } from "../schema/blobActivirySchema";
import { blobModel } from "../schema/blobSchema";
import { blobMetadataModel } from "../schema/blobMetadataSchema";
import { userModel } from "../schema/userSchema";
import { UserModel } from "../models/user";

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

  async saveBlobMetaData(blobMetaData: BlobMetadataModel) {
    const newBlobMetaData = new blobMetadataModel(blobMetaData);
    const savedBlobMetaData = await newBlobMetaData.save();
    return savedBlobMetaData;
  }

  async getBlob(id: string) {
    const blob = await blobModel.findOne({
      id: id,
    });
    return blob;
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    const user = await userModel.findOne({ email: email });
    return user;
  }

  async createUser(user: UserModel): Promise<UserModel> {
    const newUser = new userModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }
}
