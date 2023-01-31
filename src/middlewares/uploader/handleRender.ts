import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { config } from "./uploaderConfig";
const { fieldsName, storageDir } = config;

export const handleRenderDest = async (
  req: Request,
  file: Express.Multer.File,
  cb
) => {
  // cb(null, "uploads");
};

export const handleRenderFilename = async (
  req: Request,
  file: Express.Multer.File,
  cb
) => {
  // cb(null, file.fieldname + "-" + Date.now());
};
