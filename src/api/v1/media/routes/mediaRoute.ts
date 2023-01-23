import express from "express";
import { mediaController } from "../controllers/mediaController";

const router = express.Router();

router.get("/info/:mediaId", mediaController.getMediaInfo);

export default router;
