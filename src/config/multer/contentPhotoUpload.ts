import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: async function (req, file, cb: DestinationCallback) {
    const { signature } = req.body;
    const directory = `uploads/.config/${signature}`;

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
  },

  filename: function (req, file, cb: FileNameCallback) {
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
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const mimetype = ["image/jpeg", "image/png"];

  if (mimetype.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
};

const upload = multer({
  storage,
  fileFilter,
}).fields([
  {
    name: "avatar-photo-file",
    maxCount: 1,
  },
  {
    name: "cover-photo-file",
    maxCount: 1,
  },
]);

const contentPhotoUploader = (req: Request, res: any, next: any) => {
  upload(req, res, (err: any) => {
    next();
  });
};

export default contentPhotoUploader;
