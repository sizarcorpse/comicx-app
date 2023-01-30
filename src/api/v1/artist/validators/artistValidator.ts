import Joi from "joi";

type requestType = "post" | "patch";

export const artistValidator = (artist: object, type: requestType) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(2)
      .max(256)
      .alter({
        post: (schema) => schema.required(),
        patch: (schema) => schema.optional(),
      })
      .messages({
        "string.base": "You must provide a `username`",
        "string.empty": "You must provide a `username`",
        "string.required": "You must provide a `username`",
        "string.min": "`username` at least 2 characters",
        "string.max": "`username` can not be more than 255 characters",
      }),
    biography: Joi.string(),
    isFavorite: Joi.boolean(),
    isActive: Joi.boolean(),
  });

  return schema.tailor(type).validate(artist);
};
