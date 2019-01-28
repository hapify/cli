import * as Joi from 'joi';

export const GlobalConfigSchema = Joi.object({
	apiKey: Joi.string().min(1)
});
