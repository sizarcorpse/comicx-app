import { Express, Request, Response } from "express";
import sharp from "sharp";

const contentPhotoResize = async (req: Request, res: Response, next: any) => {
  try {
    const promises = Object.entries(req.files["avatar-photo-file"]).map(
      async ([key, value]) => {
        const file = value as Express.Multer.File;
        const original_image_source = file?.path;
        const thumbnail_destination =
          `${file?.destination}/` + "thumb" + `${file?.filename}`;

        return sharp(original_image_source)
          .metadata()
          .then(async (meta) => {
            Object.assign(req.files["avatar-photo-file"][0], {
              format: meta.format,
              width: meta.width,
              height: meta.height,
            });
            return sharp(original_image_source)
              .resize({
                width: 400,
                height: 400,
                fit: sharp.fit.cover,
                withoutEnlargement: true,
              })
              .jpeg({ quality: 100 })
              .png({ quality: 100 })
              .toFile(thumbnail_destination)
              .then((meta) => {
                Object.assign(req.files["avatar-photo-file"][0], {
                  thumbnail: {
                    format: meta.format,
                    width: meta.width,
                    height: meta.height,
                    size: meta.size,
                    destination: thumbnail_destination,
                  },
                });
              });
          });
      }
    );
    Promise.all(promises).then(() => {
      next();
    });
  } catch (error) {
    throw error;
  }
};

export default contentPhotoResize;
