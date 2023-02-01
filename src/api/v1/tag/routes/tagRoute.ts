import express from "express";
import { tagController } from "../controllers/tagController";
import { queryHandler } from "../middlewares/tagMiddleware";

import useCreateThumbnail from "../../../../middlewares/thumbnail/useCreateThumbnail";
import uploader from "../../../../middlewares/uploader/uploader";

const router = express.Router();

router.get("/", queryHandler, tagController.getTags);
router.post("/new", uploader, useCreateThumbnail, tagController.createTag);
router.patch(
  "/update/:tagId",
  uploader,
  useCreateThumbnail,
  tagController.updateTag
);
router.get("/:tagId", tagController.getTag);
router.delete("/:tagId", tagController.deleteTag);

export default router;
