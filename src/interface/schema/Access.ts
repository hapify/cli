import { Access } from '../IObjects';
import * as Joi from 'joi';

const accesses = [
	Access.ADMIN,
	Access.OWNER,
	Access.AUTHENTICATED,
	Access.GUEST
];
export const AccessSchema = Joi.object({
	create: Joi.string()
		.valid(accesses)
		.required(),
	read: Joi.string()
		.valid(accesses)
		.required(),
	update: Joi.string()
		.valid(accesses)
		.required(),
	remove: Joi.string()
		.valid(accesses)
		.required(),
	search: Joi.string()
		.valid(accesses)
		.required(),
	count: Joi.string()
		.valid(accesses)
		.required()
});
