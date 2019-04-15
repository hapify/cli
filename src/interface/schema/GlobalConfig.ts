import * as Joi from 'joi';

export const GlobalConfigSchema = Joi.object({
	apiKey: Joi.string()
		.length(48)
		.description('test')
});
