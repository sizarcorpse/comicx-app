import express from "express";
import { tagController } from "../controllers/tagController";
import { queryHandler } from "../middlewares/tagMiddleware";

import useCreateThumbnail from "../../../../libs/thumbnail/useCreateThumbnail";
import uploader from "../../../../libs/uploader/uploader";

const router = express.Router();

router.get("/", queryHandler, tagController.getAllTags);
router.post("/new", uploader, useCreateThumbnail, tagController.createNewTag);
router.patch(
  "/edit/:tagId",
  uploader,
  useCreateThumbnail,
  tagController.updateTag
);

export default router;
