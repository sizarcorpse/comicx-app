import { Express, NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { artistService } from "../services/artistService";
import {
  artistValidator,
  socialLinkValidator,
} from "../validators/artistValidator";

export const artistController = {
  async getArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await artistService.getArtists();

      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({ status: "NOT_OK", message: error.message });
    }
  },

  async createArtist(req: Request, res: Response, next: NextFunction) {
    const { username, alias } = req.body;
    const avatar = get(req.files, "avatar-photo-file[0]", null);

    try {
      const { error } = artistValidator({ username, alias }, "post");
      if (error) {
        throw new Error(error.message);
      }
      const data = await artistService.createArtist(
        { username, alias },
        avatar
      );
      res.status(200).json({ status: "OK", data: data });
    } catch (error: any) {
      res.status(400).json({
        status: "NOT_OK",
        message: error.message,
      });
    }
  },

  async updateArtist(req: Request, res: Response, next: NextFunction) {
    const { username, alias, isFavorite, isActive, biography } = req.body;
    const artistId = req.params.artistId;
    try {
      const { error } = artistValidator(
        { username, alias, isFavorite, isActive, biography },
        "patch"
      );
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
        alias,
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

  async updateArtistAvatar(req: Request, res: Response, next: NextFunction) {
    const artistId = req.params.artistId;
    const avatar = get(req.files, "avatar-photo-file[0]", null);
    try {
      const isArtistExist = await artistService.isArtistExist(artistId);
      if (!isArtistExist) {
        throw new Error("Artist not found");
      }

      const data = await artistService.updateArtistAvatar(artistId, avatar);
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

  async updateArtistCover(req: Request, res: Response, next: NextFunction) {
    const artistId = req.params.artistId;
    const cover = get(req.files, "cover-photo-file[0]", null);
    try {
      const isArtistExist = await artistService.isArtistExist(artistId);
      if (!isArtistExist) {
        throw new Error("Artist not found");
      }

      console.log(cover);

      const data = await artistService.updateArtistCover(artistId, cover);
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

  async addArtistSocial(req: Request, res: Response, next: NextFunction) {
    const artistId = req.params.artistId;
    const { name, link } = req.body;
    try {
      const { error } = socialLinkValidator({ name, link }, "post");
      if (error) {
        throw new Error(error.message);
      }

      const data = await artistService.addArtistSocial(artistId, {
        name,
        link,
      });

      res.status(200).json({
        status: "OK",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeArtistSocial(req: Request, res: Response, next: NextFunction) {
    const artistId = req.params.artistId;
    const socialId = req.params.socialId;
    try {
      const data = await artistService.removeArtistSocial(artistId, socialId);

      res.status(200).json({
        status: "OK",
        message: "Social Link deleted successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateArtistSocial(req: Request, res: Response, next: NextFunction) {
    const artistId = req.params.artistId;
    const socialId = req.params.socialId;
    const { name, link } = req.body;
    try {
      const { error } = socialLinkValidator({ name, link }, "patch");
      if (error) {
        throw new Error(error.message);
      }
      const data = await artistService.updateArtistSocial(artistId, socialId, {
        name,
        link,
      });
      res.status(200).json({
        status: "OK",
        message: "Social Link updated successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async addArtistCollaboration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const artistId = req.params.artistId;
    const collaboratorId = req.params.collaboratorId;

    try {
      const data = await artistService.addArtistCollaboration(
        artistId,
        collaboratorId
      );
      res.status(200).json({
        status: "OK",
        message: "Collaboration updated successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeArtistCollaboration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const artistId = req.params.artistId;
    const collaboratorId = req.params.collaboratorId;

    try {
      const data = await artistService.removeArtistCollaboration(
        artistId,
        collaboratorId
      );
      res.status(200).json({
        status: "OK",
        message: "Collaboration updated successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
