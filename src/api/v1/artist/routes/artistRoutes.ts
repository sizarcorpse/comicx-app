import express, { Express, NextFunction, Request, Response } from "express";
import { artistController } from "../controllers/artistController";

import useCreateThumbnail from "../../../../middlewares/thumbnail/useCreateThumbnail";
import uploader from "../../../../middlewares/uploader/uploader";

const router = express.Router();
router.get("/", artistController.getAllArtist);
router.post(
  "/new",
  uploader,
  useCreateThumbnail,
  artistController.createNewArtist
);
router.patch(
  "/:artistId/update/profile",
  uploader,
  artistController.updateArtistProfile
);
router.patch(
  "/:artistId/update/profile/avatar",
  uploader,
  useCreateThumbnail,
  artistController.updateArtistProfileAvatar
);
router.patch(
  "/:artistId/update/profile/cover",
  uploader,
  useCreateThumbnail,
  artistController.updateArtistProfileCover
);

export default router;
