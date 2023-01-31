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
    alias: Joi.string().min(2).max(256),
    biography: Joi.string(),
    isFavorite: Joi.boolean(),
    isActive: Joi.boolean(),
  });

  return schema.tailor(type).validate(artist);
};

export const socialLinkValidator = (social: object, type: requestType) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(33)
      .alter({
        post: (schema) => schema.required(),
        patch: (schema) => schema.optional(),
      }),
    link: Joi.string()
      .min(2)
      .max(33)
      .alter({
        post: (schema) => schema.required(),
        patch: (schema) => schema.optional(),
      }),
  });

  return schema.tailor(type).validate(social);
};
