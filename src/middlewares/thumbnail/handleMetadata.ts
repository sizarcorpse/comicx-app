import { Request } from "express-serve-static-core";
import sharp from "sharp";

export const handleMetadata = (
  req: Request,
  cover: Express.Multer.File[],
  field: string
) => {
  const coverPromise = cover.map(
    async (value: Express.Multer.File, i: number) => {
      const file = value;
      const original_image_source = file?.path;
      return sharp(original_image_source)
        .metadata()
        .then(async (meta) => {
          Object.assign(req.files[field][i], {
            format: meta.format,
            width: meta.width,
            height: meta.height,
          });
        });
    }
  );

  return coverPromise;
};
