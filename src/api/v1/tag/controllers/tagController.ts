import { Express, NextFunction, Request, Response } from "express";
import { tagService } from "../services/tagService";
import { Tag, TagQueryParams } from "../type/Tag";
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
    try {
      // const isError = schema.validate({
      //   title,
      //   description,
      //   isFavorited,
      // });

      // if (isError.error) {
      //   await tagService.unlinkTagContentPhoto(req.files);
      //   throw new Error("Validations failed");
      // }

      // const newTag: Tag = {
      //   title,
      //   description,
      //   isFavorited: isFavorited,
      //   photoUrl: `${req.files["avatar-photo-file"][0].destination}/${req.files["avatar-photo-file"][0].filename}`,
      //   coverPhotoUrl: `${req.files["cover-photo-file"][0].destination}/${req.files["cover-photo-file"][0].filename}`,
      // };

      // const data = await tagService.createNewTag(newTag);

      const data = req.files;

      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },
};
