import { Request, Response } from "express";
import sharp from "sharp";

const createThumbnail = async (req: Request, res: Response, next: any) => {
  try {
    const files = req.files as Express.Multer.File[];
    const promises = files.map(async (file) => {
      const original_image_source = file?.path;
      const thumbnail_destination =
        `${file?.destination}/` + "thumb" + `${file?.originalname}`;

      sharp(original_image_source)
        .metadata()
        .then((metadata) => {
          const width: number = metadata.width!;
          const height: number = metadata.height!;

          let widthThumb: number;
          let heightThumb: number;

          const aspectRatio: number = width / height;

          if (aspectRatio > 1) {
            widthThumb = 320;
            heightThumb = 240;
          } else {
            widthThumb = 240;
            heightThumb = 320;
          }
          return sharp(original_image_source)
            .resize({
              width: widthThumb,
              height: heightThumb,
              // fit: sharp.fit.cover,
              withoutEnlargement: true,
            })
            .jpeg({ quality: 100 })
            .png({ quality: 100 })
            .withMetadata()
            .toFile(thumbnail_destination);
        });
    });
    await Promise.all(promises);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "NOT_OK",
      message: "Something wrong happen while creating thumbnail",
    });
  }
};

export default createThumbnail;
