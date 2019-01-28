import { IWebSocketMessage } from './IWebSocketMessage';
import * as Joi from 'joi';

export interface IWebSocketHandler {
	/**
	 * Denotes if the handler can handle this message
	 * @param {IWebSocketMessage} message
	 * @return {boolean}
	 */
	canHandle(message: IWebSocketMessage): boolean;

	/**
	 * Handle message.
	 * Returns data if necessary, null otherwise
	 * @param {IWebSocketMessage} message
	 * @return {Promise<any>}
	 */
	handle(message: IWebSocketMessage): Promise<any>;

	/**
	 * Returns the JOi validator for the input payload
	 * @return {Schema}
	 */
	validator(): Joi.Schema;
}
