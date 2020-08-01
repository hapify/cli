import * as Joi from 'joi';

export const ValidatorResultSchema = Joi.object({
	errors: Joi.array().items(Joi.string()).required().min(0),
	warnings: Joi.array().items(Joi.string()).required().min(0),
});
