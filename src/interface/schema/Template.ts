
import * as Joi from 'joi';

export const TemplateSchema = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  engine: Joi.string().required(),
  input: Joi.string().required(),
  content: Joi.string().required().allow('')
});
