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
    try {
      const isError = schema.validate(req.body);

      if (isError.error) {
        throw new Error("Validation failed");
      }

      const newTag: Tag = {
        title: req.body.title,
        tagPhoto: req.body.tagPhoto,
        tagCoverPhoto: req.body.tagCoverPhoto,
      };

      const data = await tagService.createNewTag(newTag);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: "Something went wrong xx",
        error: error,
      });
    }
  },
};
