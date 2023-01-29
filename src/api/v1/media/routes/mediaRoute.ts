import express from "express";
import { mediaController } from "../controllers/mediaController";

const router = express.Router();

router.get("/info/:mediaId", mediaController.getMediaInfo);
router.get("/stream/:mediaId", mediaController.streamMedia);
router.get("/file/:filename", mediaController.streamMediaWithFilename);
router.delete("/stream/:mediaId", mediaController.deleteMedia);
router.get("/stream/thumb/:thumbId", mediaController.streamThumb);

export default router;
