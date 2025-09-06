import * as dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  bucket: process.env.BUCKET as string,
  versions: {
    v1: "v1",
  },
  AWS: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
    AWS_REGION: (process.env.AWS_REGION as string) || "us-east-1",
  },
  database: {
    dbUrl: process.env.MONGODB_URI as string,
  },
};

export default config;
