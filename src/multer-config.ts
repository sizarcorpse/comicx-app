import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// DiskStorage Configuration
const storage = multer.diskStorage({
  destination: async (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    const { artist, assetsType, assetName, issue } = req.body;

    // Path Variables.
    let artistDir = "";
    let assetsTypeDir = "";
    let assetNameDir = "";
    let issueDir = "";

    // Check artist name is valid.
    if (!artist || artist === "") {
      return cb(new Error("INVALID_ARTIST"), "false");
    } else {
      artistDir = artist;
    }

    // Check assets type is valid.
    if (!assetsType || assetsType === "") {
      return cb(new Error("INVALID_ASSETS_TYPE"), "false");
    } else {
      const defaultType = ["Album", "Animation", "Still"];

      if (!defaultType.includes(assetsType)) {
        return cb(new Error("INVALID_ASSETS_TYPE"), "false");
      } else {
        assetsTypeDir = assetsType;
      }
    }

    // Check assets name is valid.
    assetNameDir = assetName ? assetName : "";
    // Set issue
    issueDir = issue ? `Issue ${issue}` : "";
    // Created Directory
    const directory = `uploads/${artistDir}/${assetsTypeDir}/${assetNameDir}/${issueDir}`;

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

  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, file.originalname);
  },
});

// FileFiler Configuration
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
};

// Multer Configuration
const upload = multer({
  storage,
  fileFilter,
});

const imagesUpload = upload.array("images");

const galleryUploader = (req: Request, res: any, next: any) => {
  imagesUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          status: "NOT_OK",
          message: "Files `fieldname` name not match",
        });
      }
    } else if (err) {
      switch (err.message) {
        case "INVALID_ARTIST":
          return res.status(400).json({
            status: "NOT_OK",
            message: "Field `artist` can not be empty",
          });

        case "INVALID_ASSETS_TYPE":
          return res.status(400).json({
            status: "NOT_OK",
            message:
              "Field `assetsType` can not be empty and it must contains [album, animation, still]",
          });

        case "INVALID_FILE_TYPE":
          return res.status(400).json({
            status: "NOT_OK",
            message: "File type invalid only image and video allowed",
          });
      }
    }
    next();
  });
};

export default galleryUploader;
