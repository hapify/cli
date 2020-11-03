import Joi, { ValidationError } from 'joi';
export declare const ValidatorResultSchema: Joi.ObjectSchema<any>;
export declare function TransformValidationMessage(error: ValidationError): ValidationError;
