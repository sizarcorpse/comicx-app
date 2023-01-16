import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const tagService = {
  async getAllTags() {
    try {
      const tags = await prisma.tag.findMany();
      return tags;
    } catch (error) {
      throw new Error("Something went wrong");
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
};
