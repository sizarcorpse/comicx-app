import express, { Express, NextFunction, Request, Response } from "express";
import { artistController } from "../controllers/artistController";

import useCreateThumbnail from "../../../../middlewares/thumbnail/useCreateThumbnail";
import uploader from "../../../../middlewares/uploader/uploader";
import { queryHandler } from "../middlewares/queryHandler";

const router = express.Router();
router.get("/", artistController.getArtists);
router.post(
  "/new",
  uploader,
  useCreateThumbnail,
  artistController.createArtist
);
router.patch("/:artistId/update", uploader, artistController.updateArtist);
router.patch(
  "/:artistId/update/avatar",
  uploader,
  useCreateThumbnail,
  artistController.updateArtistAvatar
);
router.patch(
  "/:artistId/update/cover",
  uploader,
  useCreateThumbnail,
  artistController.updateArtistCover
);
router.post("/:artistId/update/social", artistController.addArtistSocial);
router.patch(
  "/:artistId/update/social/:socialId",
  artistController.updateArtistSocial
);
router.delete(
  "/:artistId/update/social/:socialId",
  artistController.removeArtistSocial
);
router.patch(
  "/:artistId/collaboration/:collaboratorId",
  artistController.addArtistCollaboration
);
router.delete(
  "/:artistId/collaboration/:collaboratorId",
  artistController.removeArtistCollaboration
);
router.get(
  "/:artistId/collaborations",
  queryHandler,
  artistController.getCollaborations
);
export default router;
