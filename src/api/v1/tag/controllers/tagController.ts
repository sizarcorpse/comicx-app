import { Express, NextFunction, Request, Response } from "express";
import { tagService } from "../services/tagService";
import { TagQueryParams } from "../type/Tag";
import { schema } from "../validator/tagValidator";

export const tagController = {
  async getAllTags(req: Request, res: Response, next: NextFunction) {
    const context: TagQueryParams = req.query;

    try {
      const data = await tagService.getAllTags(context);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async createNewTag(req: Request, res: Response, next: NextFunction) {
    const { title, description, isFavorited } = req.body;

    const info = req.body;
    const avatar = req.files["avatar-photo-file"]
      ? req.files["avatar-photo-file"][0]
      : null;
    const cover = req.files["cover-photo-file"]
      ? req.files["cover-photo-file"][0]
      : null;

    try {
      const isError = schema.validate({
        title,
        description,
        isFavorited,
      });

      if (isError.error) {
        throw new Error("Validations failed");
      }

      const isTitleExist = await tagService.tagExitsByTitle(info.title);

      if (isTitleExist) {
        throw new Error("Tag already exists");
      }

      const data = await tagService.createNewTag(info, avatar, cover);

      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      await tagService.unlinkTagContentPhoto(req.files);
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },
};
