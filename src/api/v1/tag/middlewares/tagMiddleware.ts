import { NextFunction, Request, Response } from "express";

export const queryHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.query.page = req.query.page ?? "1";
  req.query.limit = req.query.limit ?? "1";
  req.query.skip = `${
    (parseInt(req.query.page as string) - 1) *
    parseInt(req.query.limit as string)
  }`;
  req.query.sort = req.query.sort ?? "createdAt";
  req.query.order = req.query.order ?? "asc";

  next();
};
