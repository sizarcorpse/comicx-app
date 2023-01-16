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
};
