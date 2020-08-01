import { ConfigTemplateSchema } from './Template';
import * as Joi from 'joi';
import { FieldSchema } from './Field';

const Versions = ['1'];

export const ConfigSchema = Joi.object({
	version: Joi.string().valid(Versions).required(),
	validatorPath: Joi.string().required(),
	project: Joi.string().hex().required(),
	name: Joi.string(),
	description: Joi.string(),
	logo: Joi.string(),
	defaultFields: Joi.array().items(FieldSchema).min(0),
	templates: Joi.array().items(ConfigTemplateSchema).required().min(0),
});
