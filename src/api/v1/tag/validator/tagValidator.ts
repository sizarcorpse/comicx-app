import Joi from "joi";

export const schema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string(),
  isFavorited: Joi.boolean(),
});
