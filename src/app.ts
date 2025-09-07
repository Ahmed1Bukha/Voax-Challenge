// src/app.ts
import express, { Application, Request, Response } from "express";
import blobRoutes from "./routes/v1/blobRoute";
import activityRoutes from "./routes/v1/activityRoute";
import config from "./config/config";
import morgan from "morgan";
import * as dotenv from "dotenv";
import connectDB from "./config/database";
dotenv.config();

const app: Application = express();
const port = config.port;
connectDB();

console.log(config.storageType);

app.use(express.json());
app.use(morgan("dev"));
app.use(`/${config.versions.v1}/blobs`, blobRoutes);
app.use(`/${config.versions.v1}/activity`, activityRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("The server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
