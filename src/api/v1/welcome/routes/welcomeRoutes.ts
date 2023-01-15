import express, { Express, Request, Response } from "express";

import { welcome } from "../controllers/welcomeController";

const router = express.Router();

router.get("/", welcome.greeting);

export default router;
