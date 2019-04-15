import * as Joi from 'joi';

export const FieldSchema = Joi.object({
	name: Joi.string().required(),
	notes: Joi.string().allow(null),
	type: Joi.string().required(),
	subtype: Joi.string()
		.required()
		.allow(null),
	reference: Joi.string()
		.required()
		.allow(null),
	primary: Joi.boolean().required(),
	unique: Joi.boolean().required(),
	label: Joi.boolean().required(),
	nullable: Joi.boolean().required(),
	multiple: Joi.boolean().required(),
	embedded: Joi.boolean().required(),
	searchable: Joi.boolean().required(),
	sortable: Joi.boolean().required(),
	hidden: Joi.boolean().required(),
	internal: Joi.boolean().required(),
	restricted: Joi.boolean().required(),
	ownership: Joi.boolean().required()
});
