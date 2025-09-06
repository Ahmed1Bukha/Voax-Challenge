// src/app.ts
import express, { Application, Request, Response } from "express";
import blobRoutes from "./routes/v1/blobRoute";
import config from "./config";
import morgan from "morgan";

const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(morgan("dev"));
app.use(`/${config.versions.v1}/blob`, blobRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("The server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
