import { Express, NextFunction, Request, Response } from "express";

import { tagService } from "../services/tagService";

export const tagController = {
  async sample(req: Request, res: Response, next: NextFunction) {
    // code here
    try {
    } catch (error) {
      res
        .status(400)
        .json({ status: "NOT_OK", message: "Something went wrong" });
    }
  },
};
