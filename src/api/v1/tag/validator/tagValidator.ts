import Joi from "joi";

export const schema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  tagPhoto: Joi.string().min(3).max(100),
  tagCoverPhoto: Joi.string().min(3).max(100),
});
