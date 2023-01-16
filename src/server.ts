import * as bodyParser from "body-parser";

import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(helmet());
app.use(morgan("short"));

import galleryUploader from "./multer-config";
import createThumbnail from "./thumbnail-config";

app.post("/upload", galleryUploader, createThumbnail, async (req, res) => {
  res.status(200).json({ status: "OK", message: req.files });
});

//
const port = process.env.PORT;

app.use((req, res, next) => {
  res.status(404).send({ status: "NOT OK", error: "Not found" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
