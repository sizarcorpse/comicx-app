import Joi from "joi";

type requestType = "post" | "patch";

export const tagValidator = (tag: any, type: string) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(30)
      .alter({
        post: (schema) => schema.required(),
        patch: (schema) => schema.optional(),
      }),
    description: Joi.string(),
    isFavorited: Joi.boolean(),
    ref: Joi.string(),
  });

  return schema.tailor(type).validate(tag);
};
