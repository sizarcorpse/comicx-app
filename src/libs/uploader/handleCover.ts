import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { config } from "./uploaderConfig";
const { fieldsName, storageDir } = config;

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const handleCoverDest = async (
  req: Request,
  file: Express.Multer.File,
  cb: DestinationCallback
) => {
  const { ref } = req.body;

  if (!ref) {
    return cb(new Error("EMPTY_REF"), "false");
  }

  const directory = `${storageDir.CONFIG_UPLOAD_DIR}/${ref}`;

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

export const handleCoverFilename = async (
  req: Request,
  file: Express.Multer.File,
  cb: FileNameCallback
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
