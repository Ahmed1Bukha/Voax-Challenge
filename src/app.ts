// src/app.ts
import express, { Application, Request, Response } from "express";
import blobRoutes from "./routes/v1/blobRoute";
import config from "./config/config";
import morgan from "morgan";
import * as dotenv from "dotenv";
import connectDB from "./config/database";
import session, { SessionOptions } from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/v1/authRoutes";
import DatabaseServices from "./services/databaseServices";
import "./config/passport";
dotenv.config();

const app: Application = express();
const port = config.port;
connectDB();

console.log(config.storageType);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const sessionConfig: SessionOptions = {
  secret: config.SESSION.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.database.dbUrl,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

//Routes:--------------------------------
app.use(`/${config.versions.v1}/blobs`, blobRoutes);
app.use(`/${config.versions.v1}/auth`, authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("The server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
