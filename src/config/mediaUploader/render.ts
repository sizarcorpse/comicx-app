import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { uploaderConfig } from "./uploaderConfig";
const { mediaFields, mediaStorageDir } = uploaderConfig;

export const renderDestination = async (
  req: Request,
  file: Express.Multer.File,
  cb
) => {
  // cb(null, "uploads");
};

export const renderFilename = async (
  req: Request,
  file: Express.Multer.File,
  cb
) => {
  // cb(null, file.fieldname + "-" + Date.now());
};
