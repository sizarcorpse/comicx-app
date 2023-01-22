import { Prisma, PrismaClient } from "@prisma/client";
import fs, { unlink, unlinkSync } from "fs";
import { any } from "joi";
import { concat } from "lodash";
import { Tag, TagQueryParams } from "../type/Tag";
const prisma = new PrismaClient();

export const tagService = {
  async getAllTags(context: any) {
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

  async tagExitsById(id: string) {
    try {
      const result = await prisma.tag.findUnique({
        where: {
          tagId: id,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async createNewTag(info: any, avatar: any, cover: any) {
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
                          destination: avatar.thumbnail.destination,
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

  async unlinkTagContentPhoto(context) {
    try {
      const promises = Object.entries(context).map(([key, value]) => {
        const file = value[0];
        if (file?.thumbnail) {
          unlinkSync(file.thumbnail.destination);
        }

        return unlinkSync(file.path);
      });

      Promise.all(promises);
    } catch (error) {}
  },

  async updateTag(tagId: string, info: any, avatar: any, cover: any) {
    try {
      // If new avatar or cover is updated ? remove current file from storage.
      if (avatar || cover) {
        const destinations: any = await prisma.tag.findUnique({
          where: {
            tagId: tagId,
          },
          select: {
            Avatar: {
              select: {
                mediaId: true,
                path: true,
                Thumbnail: {
                  select: {
                    destination: true,
                  },
                },
              },
            },
            Cover: {
              select: {
                mediaId: true,
                path: true,
              },
            },
          },
        });

        if (destinations) {
          // If Tag already has an Avatar ? update Avatar with new Avatar
          if (avatar && destinations.Avatar) {
            const avatarMediaId = destinations.Avatar.mediaId;
            const avatarOriginalPath = destinations.Avatar.path;
            const avatarThumbnailPath =
              destinations.Avatar.Thumbnail.destination;

            await prisma.media.delete({
              where: {
                mediaId: avatarMediaId,
              },
            });

            concat(avatarOriginalPath, avatarThumbnailPath).map((path) => {
              unlinkSync(path);
            });
          }

          // If Tag already has an Cover ? update Avatar with new Cover
          if (cover && destinations.Cover) {
            const coverOriginalPath = destinations.Cover.path;
            const coverMediaId = destinations.Cover.mediaId;
            await prisma.media.delete({
              where: {
                mediaId: coverMediaId,
              },
            });
            if (coverOriginalPath) {
              unlinkSync(coverOriginalPath);
            }
          }
        }
      }

      // Update Tag with provided fields
      const updateTag = await prisma.tag.update({
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
                          destination: avatar.thumbnail.destination,
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

      if (!updateTag) {
        throw new Error("Create tag failed");
      }

      return updateTag;
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
};
