import { Express, NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { mediaService } from "../../media/services/mediaService";
import { tagService } from "../services/tagService";
import { TagQueryParams } from "../type/Tag";
import { tagValidator } from "../validator/tagValidator";

export const tagController = {
  async getTags(req: Request, res: Response, next: NextFunction) {
    const context: TagQueryParams = req.query;

    try {
      const data = await tagService.getTags(context);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async createTag(req: Request, res: Response, next: NextFunction) {
    const { title, description, isFavorited } = req.body;
    const info = req.body;
    const avatar = get(req.files, "avatar-photo-file[0]", null);
    const cover = get(req.files, "cover-photo-file[0]", null);

    try {
      const isError = tagValidator(
        {
          title,
          description,
          isFavorited,
        },
        "post"
      );
      if (isError.error) {
        throw new Error("Validations failed");
      }

      const isTitleExist = await tagService.tagExitsByTitle(info.title);
      if (isTitleExist) {
        throw new Error("Tag already exists");
      }

      const data = await tagService.createTag(info, avatar, cover);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      await mediaService.unlinkMedia(req.files);
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async updateTag(req: Request, res: Response, next: NextFunction) {
    const info = req.body;
    const tagId = req.params.tagId;
    const avatar = get(req.files, "avatar-photo-file[0]", null);
    const cover = get(req.files, "cover-photo-file[0]", null);

    try {
      const isError = tagValidator(info, "patch");
      if (isError.error) {
        throw new Error("Validations failed");
      }

      const isIdExist = await tagService.tagExitsById(tagId);
      if (!isIdExist) {
        throw new Error("Tag does not exists");
      }

      if (info.title) {
        const isTitleExist = await tagService.tagExitsByTitle(info.title);
        if (isTitleExist) {
          throw new Error("Tag Name already taken");
        }
      }

      const data = await tagService.updateTag(tagId, info, avatar, cover);
      res.status(200).json({ status: "OK", data });
    } catch (error: any) {
      await mediaService.unlinkMedia(req.files);
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async getTag(req: Request, res: Response, next: NextFunction) {
    const tagId = req.params.tagId;

    try {
      const data = await tagService.getTag(tagId);
      res.status(200).json({ status: "OK", data });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async deleteTag(req: Request, res: Response, next: NextFunction) {
    const tagId = req.params.tagId;

    try {
      const data = await tagService.deleteTag(tagId);

      res.status(200).json({ status: "OK", data });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },
};
