import * as Joi from 'joi';
import { TemplateEngine, TemplateInput } from '../../enum';

const engines = [TemplateEngine.Hpf, TemplateEngine.JavaScript];
const inputs = [TemplateInput.One, TemplateInput.All];

export const TemplateSchema = Joi.object({
	path: Joi.string().required(),
	engine: Joi.string()
		.valid(engines)
		.required(),
	input: Joi.string()
		.valid(inputs)
		.required(),
	content: Joi.string()
		.required()
		.allow('')
});

export const ConfigTemplateSchema = Joi.object({
	path: Joi.string().required(),
	engine: Joi.string()
		.valid(engines)
		.required(),
	input: Joi.string()
		.valid(inputs)
		.required()
});
