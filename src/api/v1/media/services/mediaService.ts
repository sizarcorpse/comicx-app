import { Prisma, PrismaClient } from "@prisma/client";
import { unlinkSync } from "fs";
import { concat, get } from "lodash";

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
  async getMediaFilename(filename: string) {
    try {
      const media = await prisma.media.findFirst({
        where: {
          filename,
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
  async getThumbInfo(thumbId: string) {
    try {
      const thumb = await prisma.thumbnail.findFirst({
        where: {
          thumbnailId: thumbId,
        },
      });

      if (!thumb) {
        throw new Error("Thumb does not exists");
      }

      return thumb;
    } catch (error: any) {
      throw error;
    }
  },
  async deleteMedia(mediaId: string) {
    try {
      const media = await prisma.media.delete({
        where: {
          mediaId: mediaId,
        },
        include: {
          Thumbnail: true,
        },
      });

      if (!media) {
        throw new Error("Media does not exists");
      }

      const mediaOriginalPath = get(media, "path", []);
      const mediaThumbnailPath = get(media, "Thumbnail.path", []);

      concat(mediaOriginalPath, mediaThumbnailPath).map((item) => {
        if (item != "" || item != undefined) {
          unlinkSync(item);
        }
      });

      return media;
    } catch (error) {
      throw error;
    }
  },
  async unlinkMedia(files: any) {
    try {
      const promises = Object.entries(files).map(([key, value]) => {
        const file = value[0];
        if (file?.thumbnail) {
          unlinkSync(file.thumbnail.path);
        }
        return unlinkSync(file.path);
      });
      Promise.all(promises);
    } catch (error) {}
  },
};
