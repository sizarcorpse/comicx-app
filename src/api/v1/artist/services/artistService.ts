import { Prisma, PrismaClient } from "@prisma/client";
import { Express, NextFunction, Request, Response } from "express";

import { mediaService } from "../../media/services/mediaService";

const prisma = new PrismaClient();

export const artistService = {
  async getArtists() {
    try {
      const artists = await prisma.artist.findMany({
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
          Cover: true,

          collaborations: true,
          Social: true,
        },
      });
      return artists;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async isArtistExist(artistId: string) {
    try {
      const artist = await prisma.artist.findUnique({
        where: {
          artistId: artistId,
        },
      });
      if (!artist) {
        return false;
      }
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async isUsernameTaken(username: string) {
    try {
      const artist = await prisma.artist.findUnique({
        where: {
          username: username,
        },
      });
      if (artist) {
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async createArtist(info: any, avatar: any) {
    try {
      const artist = await prisma.artist.create({
        data: {
          username: info.username,
          alias: info.alias,
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
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
        },
      });

      if (!artist) {
        throw new Error("Artist not created");
      }

      return artist;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateArtist(artistId: string, info: any) {
    try {
      const artist = await prisma.artist.update({
        where: {
          artistId,
        },
        data: {
          username: info.username,
          alias: info.alias,
          biography: info.biography,
          isFavorite: info.isFavorite && JSON.parse(info.isFavorite),
          isActive: info.isActive && JSON.parse(info.isActive),
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
        },
      });

      if (!artist) {
        throw new Error("Artist profile update failed");
      }

      return artist;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateArtistAvatar(artistId: string, avatar: any) {
    try {
      const oldAvatarId = await prisma.artist.findUnique({
        where: {
          artistId,
        },
        select: {
          Avatar: {
            select: {
              mediaId: true,
            },
          },
        },
      });
      const artist = await prisma.artist.update({
        where: {
          artistId: artistId,
        },
        data: {
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
        },
        include: {
          Avatar: {
            include: {
              Thumbnail: true,
            },
          },
        },
      });
      if (!artist) {
        throw new Error("Artist profile photo update has been failed");
      }
      if (oldAvatarId) {
        await mediaService.deleteMedia(oldAvatarId.Avatar.mediaId);
      }
      return artist;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateArtistCover(artistId: string, cover: any) {
    try {
      const oldCoverId = await prisma.artist.findUnique({
        where: {
          artistId,
        },
        select: {
          Cover: {
            select: {
              mediaId: true,
            },
          },
        },
      });

      const artist = await prisma.artist.update({
        where: {
          artistId: artistId,
        },
        data: {
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
          Cover: true,
        },
      });

      if (!artist) {
        throw new Error("Artist profile photo update has been failed");
      }

      if (oldCoverId) {
        await mediaService.deleteMedia(oldCoverId.Cover.mediaId);
      }

      return artist;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async addArtistSocial(artistId: string, social: any) {
    const socialLink = await prisma.social.create({
      data: {
        Artist: {
          connect: {
            artistId: artistId,
          },
        },
        name: social.name,
        link: social.link,
      },
    });

    if (!socialLink) {
      throw new Error("Social link not added");
    }
    return socialLink;
  },

  async removeArtistSocial(artistId: string, socialId: any) {
    const socialLink = await prisma.social.delete({
      where: {
        socialId_artistId: {
          socialId,
          artistId,
        },
      },
    });

    if (!socialLink) {
      throw new Error("Social link not added");
    }
    return socialLink;
  },

  async updateArtistSocial(artistId: string, socialId: string, social: any) {
    const socialLink = await prisma.social.update({
      where: {
        socialId_artistId: {
          socialId,
          artistId,
        },
      },
      data: {
        name: social.name,
        link: social.link,
      },
    });

    if (!socialLink) {
      throw new Error("Social link not added");
    }
    return socialLink;
  },

  async addArtistCollaboration(artistId: string, collaboratorId: string) {
    const artist = await prisma.artist.update({
      where: {
        artistId: artistId,
      },
      data: {
        collaborations: {
          connect: {
            artistId: collaboratorId,
          },
        },
      },
    });

    await prisma.artist.update({
      where: {
        artistId: collaboratorId,
      },
      data: {
        collaborations: {
          connect: {
            artistId,
          },
        },
      },
    });

    return artist;
  },

  async removeArtistCollaboration(artistId: string, collaboratorId: string) {
    const artist = await prisma.artist.update({
      where: {
        artistId: artistId,
      },
      data: {
        collaborations: {
          disconnect: {
            artistId: collaboratorId,
          },
        },
      },
    });

    await prisma.artist.update({
      where: {
        artistId: collaboratorId,
      },
      data: {
        collaborations: {
          disconnect: {
            artistId,
          },
        },
      },
    });

    return artist;
  },
};
