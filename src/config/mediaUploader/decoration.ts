import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { uploaderConfig } from "./uploaderConfig";
const { mediaFields, mediaStorageDir } = uploaderConfig;

export const decorationDestination = async (
  req: Request,
  file: Express.Multer.File,
  cb
) => {
  const { ref } = req.body;
  const directory = `${mediaStorageDir.CONFIG_UPLOAD_DIR}/${ref}`;

  try {
    await fs.promises.access(directory);
    cb(null, directory);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.promises.mkdir(directory, { recursive: true });
      cb(null, directory);
    } else {
      throw err;
    }
  }
};

export const decorationFilename = async (
  req: Request,
  file: Express.Multer.File,
  cb
) => {
  const { title } = req.body;
  const mimetype = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
  ]);
  const refactor_title = new String(title).replace(/\s+/g, "-").toLowerCase();
  const fieldname = file.fieldname;
  const mime = mimetype.get(file.mimetype);
  const new_title = `${refactor_title}-${fieldname}${mime}`;
  cb(null, new_title);
};
