
import * as Joi from 'joi';

const engines = ['hpf', 'js'];
const inputs = ['one', 'all'];

export const TemplateSchema = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  engine: Joi.string().valid(engines).required(),
  input: Joi.string().valid(inputs).required(),
  content: Joi.string().required().allow('')
});

export const ConfigTemplateSchema = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  engine: Joi.string().valid(engines).required(),
  input: Joi.string().valid(inputs).required()
});
