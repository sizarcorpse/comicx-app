import { Express, NextFunction, Request, Response } from "express";
import { mediaService } from "../services/mediaService";

export const mediaController = {
  async getMediaInfo(req: Request, res: Response) {
    const mediaId = req.params.mediaId;

    try {
      console.log("x", mediaId);

      const data = await mediaService.getMediaInfo(mediaId);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },
};
