
import * as Joi from 'joi';
import { AccessSchema } from './Access';
import { FieldSchema } from './Field';

export const ModelSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  fields: Joi.array().items(FieldSchema).required().min(1),
  accesses: AccessSchema
});