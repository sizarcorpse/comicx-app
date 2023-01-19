import { Request, Response } from "express";
import { concat } from "lodash";
import { handleMetadata } from "./handleMetadata";
import { handleResize } from "./handleResize";

const useCreateThumbnail = async (req: Request, res: Response, next: any) => {
  const avatar = req?.files["avatar-photo-file"];
  const cover = req?.files["cover-photo-file"];

  let avatarPromise = [];
  let coverPromise = [];

  if (avatar?.length > 0) {
    avatarPromise = await handleResize(req, avatar, "avatar-photo-file");
  }
  if (cover?.length > 0) {
    coverPromise = await handleMetadata(req, cover, "cover-photo-file");
  }

  Promise.all(concat(avatarPromise, coverPromise)).then(() => {
    next();
  });

  try {
  } catch (error) {
    throw error;
  }
};

export default useCreateThumbnail;
