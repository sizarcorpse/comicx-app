import { Express, NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { artistService } from "../services/artistService";
import { artistValidator } from "../validators/artistValidator";

export const artistController = {
  async getAllArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await artistService.getAllArtist();

      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async createNewArtist(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    const avatar = get(req.files, "avatar-photo-file[0]", null);

    try {
      const { error } = artistValidator({ username }, "post");
      if (error) {
        throw new Error(error.message);
      }
      const data = await artistService.createNewArtist({ username }, avatar);
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async updateArtistProfile(req: Request, res: Response, next: NextFunction) {
    const { username, isFavorite, isActive, biography } = req.body;
    const artistId = req.params.artistId;
    try {
      const { error } = artistValidator({ username }, "patch");
      if (error) {
        throw new Error(error.message);
      }

      const isArtistExist = await artistService.isArtistExist(artistId);
      if (!isArtistExist) {
        throw new Error("Artist not found");
      }

      if (username) {
        const isUsernameTaken = await artistService.isUsernameTaken(username);
        if (isUsernameTaken) {
          throw new Error("username already taken");
        }
      }

      const data = await artistService.updateArtist(artistId, {
        username,
        isFavorite,
        isActive,
        biography,
      });
      res.status(200).json({
        status: "OK",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async updateArtistProfileAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const artistId = req.params.artistId;
    const avatar = get(req.files, "avatar-photo-file[0]", null);
    try {
      const isArtistExist = await artistService.isArtistExist(artistId);
      if (!isArtistExist) {
        throw new Error("Artist not found");
      }

      const data = await artistService.updateArtistProfileAvatar(
        artistId,
        avatar
      );
      res.status(200).json({
        status: "OK",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async updateArtistProfileCover(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const artistId = req.params.artistId;
    const cover = get(req.files, "cover-photo-file[0]", null);
    try {
      const isArtistExist = await artistService.isArtistExist(artistId);
      if (!isArtistExist) {
        throw new Error("Artist not found");
      }

      console.log(cover);

      const data = await artistService.updateArtistProfileCover(
        artistId,
        cover
      );
      res.status(200).json({
        status: "OK",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },
};
