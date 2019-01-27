
import { ConfigTemplateSchema } from './Template';
import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  validatorPath: Joi.string().required(),
  project: Joi.string().hex().required(),
  name: Joi.string(),
  description: Joi.string(),
  logo: Joi.string(),
  templates: Joi.array().items(ConfigTemplateSchema).required().min(0),
});
