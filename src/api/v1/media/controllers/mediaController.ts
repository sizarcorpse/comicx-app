import { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import mime from "mime-types";
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

  async streamMedia(req: Request, res: Response) {
    const mediaId = req.params.mediaId;

    try {
      const data = await mediaService.getMediaInfo(mediaId);

      const stream = fs.createReadStream(data.path);
      res.setHeader("Content-Type", data.mimetype);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      stream.pipe(res);
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async streamMediaWithFilename(req: Request, res: Response) {
    const mediaFilename = req.params.filename;
    try {
      const data = await mediaService.getMediaFilename(mediaFilename);

      const stream = fs.createReadStream(data.path);
      res.setHeader("Content-Type", data.mimetype);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      stream.pipe(res);
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async streamThumb(req: Request, res: Response) {
    const thumbId = req.params.thumbId;

    try {
      const data = await mediaService.getThumbInfo(thumbId);

      const stream = fs.createReadStream(data.path);
      const mm = mime.lookup(data.path);
      res.setHeader("Content-Type", mm as string);
      stream.pipe(res);
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async deleteMedia(req: Request, res: Response) {
    const mediaId = req.params.mediaId;

    try {
      const data = await mediaService.deleteMedia(mediaId);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },
};
