import { Prisma, PrismaClient } from "@prisma/client";
import fs, { unlink, unlinkSync } from "fs";
import { TagQueryParams, TagResponse } from "../type/Tag";

const prisma = new PrismaClient();

export const tagService = {
  async getAllTags(context: any) {
    const { sort, order, limit, skip }: TagQueryParams = context;

    try {
      const tags: TagResponse[] = await prisma.tag.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          [sort]: order,
        },
      });
      return tags;
    } catch (e) {
      throw new Error("Could not find tags");
    }
  },
  async createNewTag(context) {
    try {
      const isTagExist = await prisma.tag.findUnique({
        where: {
          title: context.title,
        },
      });

      if (isTagExist) {
        throw new Error("Tag already exists");
      }

      const result = await prisma.tag.create({
        data: context,
      });

      if (!result) {
        throw new Error("Create tag failed");
      }

      return result;
    } catch (error: any) {
      throw error;
    }
  },

  async unlinkTagContentPhoto(context) {
    try {
      const promises = Object.entries(context).map(([key, value]) => {
        const x = value[0];
        if (x.thumbnail) {
          unlinkSync(x.thumbnail.destination);
        }

        return unlinkSync(x.path);
      });

      Promise.all(promises);
    } catch (error) {}
  },
};
