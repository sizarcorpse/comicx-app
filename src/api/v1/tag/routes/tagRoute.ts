import express from "express";
import { tagController } from "../controllers/tagController";
import { queryHandler } from "../middlewares/tagMiddleware";

import contentPhotoUploader from "../../../../config/multer/contentPhotoUpload";
import contentPhotoResize from "../../../../config/sharp/contentPhotoResize";

const router = express.Router();

router.get("/", queryHandler, tagController.getAllTags);
router.post(
  "/new",
  contentPhotoUploader,
  contentPhotoResize,
  tagController.createNewTag
);

export default router;
