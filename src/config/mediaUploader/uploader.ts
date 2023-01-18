import { Express, Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { uploaderConfig } from "./uploaderConfig";

import { decorationDestination, decorationFilename } from "./decoration";
import { renderDestination, renderFilename } from "./render";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const { mediaFields, mediaStorageDir } = uploaderConfig;

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    switch (file.fieldname) {
      case mediaFields.AVATAR:
      case mediaFields.COVER:
        return decorationDestination(req, file, cb);

      case mediaFields.RENDER:
        return renderDestination(req, file, cb);
    }
  },
  filename: function (req, file, cb) {
    switch (file.fieldname) {
      case mediaFields.AVATAR:
      case mediaFields.COVER:
        return decorationFilename(req, file, cb);

      case mediaFields.RENDER:
        return renderFilename(req, file, cb);
    }
  },
});

const upload1 = multer({ storage: storage1 }).fields([
  { name: mediaFields.AVATAR, maxCount: 1 },
  { name: mediaFields.COVER, maxCount: 1 },
  { name: mediaFields.RENDER },
]);

const uploader = (req: Request, res: any, next: any) => {
  upload1(req, res, (err: any) => {
    next();
  });
};

export default uploader;
