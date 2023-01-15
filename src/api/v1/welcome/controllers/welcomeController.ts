import { Express, NextFunction, Request, Response } from "express";

import { greeting } from "../services/welcomeService";

export const welcome = {
  async greeting(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await greeting.welcome();
      res.status(200).json({ status: "OK", data: data });
    } catch (error) {
      res
        .status(400)
        .json({ status: "NOT_OK", message: "Something went wrong" });
    }
  },
};
