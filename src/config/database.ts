import mongoose from "mongoose";
import config from "./config";
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.database.dbUrl;

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
