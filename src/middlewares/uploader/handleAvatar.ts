import { Request } from "express";
import fs from "fs";
import { config } from "./uploaderConfig";
const { storageDir } = config;

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const handleAvatarDest = async (
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

export const handleAvatarFilename = async (
  req: Request,
  file: Express.Multer.File,
  cb: FileNameCallback
) => {
  const mimetype = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
  ]);
  const fieldname = file.fieldname;
  const mime = mimetype.get(file.mimetype);
  const new_title = `${fieldname}-${Date.now()}${mime}`;
  cb(null, new_title);
};
