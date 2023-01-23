import { Prisma, PrismaClient } from "@prisma/client";
import { Express, NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();
export const mediaService = {
  async getMediaInfo(mediaId: string) {
    try {
      const media = await prisma.media.findFirst({
        where: {
          mediaId,
        },
        include: {
          Thumbnail: true,
        },
      });

      if (!media) {
        throw new Error("Media does not exists");
      }

      return media;
    } catch (error: any) {
      throw error;
    }
  },
};
