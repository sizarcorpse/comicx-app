import { Request } from "express-serve-static-core";
import sharp from "sharp";

export const handleResize = (
  req: Request,
  avatar: Express.Multer.File[],
  field: string
) => {
  const avatarPromise = avatar.map(
    async (value: Express.Multer.File, i: number) => {
      const file = value;
      const original_image_source = file?.path;
      const thumbnail_destination =
        `${file?.destination}/` + "thumb-" + `${file?.filename}`;

      return sharp(original_image_source)
        .metadata()
        .then(async (meta) => {
          Object.assign(req.files[field][i], {
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
              Object.assign(req.files[field][i], {
                thumbnail: {
                  format: meta.format,
                  width: meta.width,
                  height: meta.height,
                  size: meta.size,
                  path: thumbnail_destination,
                },
              });
            });
        });
    }
  );

  return avatarPromise;
};
