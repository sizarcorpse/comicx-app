import express, { Express, NextFunction, Request, Response } from 'express'; 
 import {tagController} from '../controllers/tagController' 
 
const router = express.Router(); 
router.get("/", tagController.sample); 
export default router;
