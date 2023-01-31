import { Request } from "express";

import multer from "multer";
import { config } from "./uploaderConfig";

import { handleAvatarDest, handleAvatarFilename } from "./handleAvatar";
import { handleCoverDest, handleCoverFilename } from "./handleCover";
import { handleRenderDest, handleRenderFilename } from "./handleRender";

const { fieldsName } = config;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    switch (file.fieldname) {
      case fieldsName.AVATAR:
        return handleAvatarDest(req, file, cb);
      case fieldsName.COVER:
        return handleCoverDest(req, file, cb);
      case fieldsName.RENDER:
        return handleRenderDest(req, file, cb);
    }
  },

  filename: async (req, file, cb) => {
    switch (file.fieldname) {
      case fieldsName.AVATAR:
        return handleAvatarFilename(req, file, cb);
      case fieldsName.COVER:
        return handleCoverFilename(req, file, cb);
      case fieldsName.RENDER:
        return handleRenderFilename(req, file, cb);
    }
  },
});

const upload = multer({ storage: storage }).fields([
  { name: fieldsName.AVATAR, maxCount: 1 },
  { name: fieldsName.COVER, maxCount: 1 },
  { name: fieldsName.RENDER },
]);

const uploader = (req: Request, res: any, next: any) => {
  upload(req, res, (err: any) => {
    next();
  });
};

export default uploader;
