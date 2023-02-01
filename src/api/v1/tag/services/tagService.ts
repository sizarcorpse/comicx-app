import { PrismaClient } from "@prisma/client";
import fs, { unlink, unlinkSync } from "fs";
import { concat, get } from "lodash";
import { mediaService } from "../../media/services/mediaService";
import { Tag, TagQueryParams } from "../type/Tag";

const prisma = new PrismaClient();

export const tagService = {
  async getTags(context: any) {
    const { sort, order, limit, skip }: TagQueryParams = context;

    try {
      const tags: Tag[] = await prisma.tag.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          [sort]: order,
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
          Cover: true,
        },
      });
      return tags;
    } catch (e) {
      throw new Error("Could not find tags");
    }
  },

  async tagExitsByTitle(title: string) {
    try {
      const result = await prisma.tag.findUnique({
        where: {
          title: title,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async tagExitsById(tagId: string) {
    try {
      const result = await prisma.tag.findUnique({
        where: {
          tagId,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async createTag(info: any, avatar: any, cover: any) {
    try {
      const result = await prisma.tag.create({
        data: {
          title: info.title,
          description: info.description,
          Avatar: avatar
            ? {
                create: {
                  fieldname: avatar.fieldname,
                  mimetype: avatar.mimetype,
                  destination: avatar.destination,
                  filename: avatar.filename,
                  path: avatar.path,
                  size: avatar.size,
                  format: avatar.format,
                  width: avatar.width,
                  height: avatar.height,
                  Thumbnail: avatar.thumbnail
                    ? {
                        create: {
                          format: avatar.thumbnail.format,
                          width: avatar.thumbnail.width,
                          height: avatar.thumbnail.height,
                          size: avatar.thumbnail.size,
                          path: avatar.thumbnail.path,
                        },
                      }
                    : undefined,
                },
              }
            : undefined,
          Cover: cover
            ? {
                create: {
                  fieldname: cover.fieldname,
                  mimetype: cover.mimetype,
                  destination: cover.destination,
                  filename: cover.filename,
                  path: cover.path,
                  size: cover.size,
                  format: cover.format,
                  width: cover.width,
                  height: cover.height,
                },
              }
            : undefined,
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
          Cover: true,
        },
      });

      if (!result) {
        throw new Error("Create tag failed");
      }

      return result;
    } catch (error: any) {
      throw error;
    }
  },

  async updateTag(tagId: string, info: any, avatar: any, cover: any) {
    try {
      // If new avatar or cover is updated ? remove current file from disk storage.
      if (avatar || cover) {
        const destinations: any = await prisma.tag.findUnique({
          where: {
            tagId: tagId,
          },
          select: {
            Avatar: {
              select: {
                mediaId: true,
              },
            },
            Cover: {
              select: {
                mediaId: true,
              },
            },
          },
        });

        if (destinations) {
          // If Tag already has an Avatar ? update Avatar with new Avatar
          if (avatar && destinations.Avatar) {
            const avatarMediaId = destinations.Avatar.mediaId;
            await mediaService.deleteMedia(avatarMediaId);
          }

          // If Tag already has an Cover ? update Avatar with new Cover
          if (cover && destinations.Cover) {
            const coverMediaId = destinations.Cover.mediaId;
            await mediaService.deleteMedia(coverMediaId);
          }
        }
      }

      // Update Tag with provided fields
      const updatedTag = await prisma.tag.update({
        where: {
          tagId: tagId,
        },
        data: {
          title: info.title,
          description: info.description,
          isFavorited: info.isFavorited && JSON.parse(info.isFavorited),
          Avatar: avatar
            ? {
                create: {
                  fieldname: avatar.fieldname,
                  mimetype: avatar.mimetype,
                  destination: avatar.destination,
                  filename: avatar.filename,
                  path: avatar.path,
                  size: avatar.size,
                  format: avatar.format,
                  width: avatar.width,
                  height: avatar.height,
                  Thumbnail: avatar.thumbnail
                    ? {
                        create: {
                          format: avatar.thumbnail.format,
                          width: avatar.thumbnail.width,
                          height: avatar.thumbnail.height,
                          size: avatar.thumbnail.size,
                          path: avatar.thumbnail.path,
                        },
                      }
                    : undefined,
                },
              }
            : undefined,
          Cover: cover
            ? {
                create: {
                  fieldname: cover.fieldname,
                  mimetype: cover.mimetype,
                  destination: cover.destination,
                  filename: cover.filename,
                  path: cover.path,
                  size: cover.size,
                  format: cover.format,
                  width: cover.width,
                  height: cover.height,
                },
              }
            : undefined,
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
          Cover: true,
        },
      });

      if (!updatedTag) {
        throw new Error("Create tag failed");
      }

      return updatedTag;
    } catch (error: any) {
      throw error;
    }
  },

  async getTag(tagId: string) {
    try {
      const tag = await prisma.tag.findUnique({
        where: {
          tagId: tagId,
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },

          Cover: true,
        },
      });

      if (!tag) {
        throw new Error("Tag does not exists");
      }

      return tag;
    } catch (error: any) {
      throw error;
    }
  },

  async deleteTag(tagId: string) {
    try {
      const deletedTag = await prisma.tag.delete({
        where: {
          tagId: tagId,
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
          Cover: true,
        },
      });

      if (!deletedTag) {
        throw new Error("Tag does not exists");
      }

      const avatarOriginalPath = get(deletedTag, "Avatar.path", []);
      const avatarThumbnailPath = get(deletedTag, "Avatar.Thumbnail.path", []);
      const coverOriginalPath = get(deletedTag, "Cover.path", []);
      concat(avatarOriginalPath, coverOriginalPath, avatarThumbnailPath).map(
        (item) => {
          if (item != "" || item != undefined) {
            unlinkSync(item);
          }
        }
      );

      return deletedTag;
    } catch (error: any) {
      throw error;
    }
  },
};
