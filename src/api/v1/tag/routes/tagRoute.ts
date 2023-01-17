import express from "express";
import { tagController } from "../controllers/tagController";
import { queryHandler } from "../middlewares/tagMiddleware";

const router = express.Router();

router.get("/", queryHandler, tagController.getAllTags);
router.post("/new", tagController.createNewTag);

export default router;
