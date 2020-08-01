import * as Joi from 'joi';
import { ValidationError } from "joi";
export declare const ValidatorResultSchema: Joi.ObjectSchema;
export declare function TransformValidationMessage(error: ValidationError): ValidationError;
