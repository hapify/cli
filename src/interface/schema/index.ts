import { ValidationError } from 'joi';

export * from './Model';
export * from './Field';
export * from './Access';
export * from './Channel';
export * from './Template';
export * from './ValidatorResult';

export function TransformValidationMessage(error: ValidationError): ValidationError {
  if (error.details && error.details.length) {
    error.message = error.details.map(d => `${d.message} (${d.path.join('.')})`).join('. ');
  }
  return error;
}