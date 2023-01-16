import { Express, NextFunction, Request, Response } from "express";

import { tagService } from "../services/tagService";

export const tagController = {
  async sample(req: Request, res: Response, next: NextFunction) {
    const data = await tagService.getAllTags();
    res.status(200).json({ status: "OK", data: data });
    try {
    } catch (error) {
      res
        .status(400)
        .json({ status: "NOT_OK", message: "Something went wrong" });
    }
  },
};
