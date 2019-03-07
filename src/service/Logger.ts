import { Service } from 'typedi';
import chalk from 'chalk';
import { OptionsService } from './Options';

interface ErrorData {
	type: string;
	code: number;
}
interface RichError extends Error {
	data: ErrorData;
}

@Service()
export class LoggerService {
	/**
	 * Constructor
	 * @param {OptionsService} optionsService
	 */
	constructor(private optionsService: OptionsService) {}

	/**
	 * Handle an error
	 * @param {Error} error
	 * @return {LoggerService}
	 */
	handle(error: Error): LoggerService {
		let message = '✖ ';
		if ((<RichError>error).data) {
			const data = (<RichError>error).data;
			message += `[${data.type}:${data.code}] `;
		}
		message += error.message;
		if (this.optionsService.debug()) {
			message += `\n${error.stack.toString()}`;
		}
		console.error(chalk.red(message));
		return this;
	}

	/**
	 * Display a message
	 * @param {string} message
	 * @return {LoggerService}
	 */
	raw(message: string): LoggerService {
		console.log(message);
		return this;
	}

	/**
	 * Display a success message
	 * @param {string} message
	 * @return {LoggerService}
	 */
	success(message: string): LoggerService {
		console.log(`${chalk.green('✓')} ${message}`);
		return this;
	}

	/**
	 * Display an info
	 * @param {string} message
	 * @return {LoggerService}
	 */
	info(message: string): LoggerService {
		console.log(`${chalk.blueBright('•')} ${message}`);
		return this;
	}

	/**
	 * Display an info if in debug mode
	 * @param {string} message
	 * @return {LoggerService}
	 */
	debug(message: string): LoggerService {
		if (this.optionsService.debug()) {
			console.log(`${chalk.cyan('*')} ${message}`);
		}
		return this;
	}

	/**
	 * Display an error
	 * @param {string} message
	 */
	error(message: string): LoggerService {
		console.log(`${chalk.red('✖')} ${message}`);
		return this;
	}

	/**
	 * Add new lines
	 * @param {number} count
	 * @return {LoggerService}
	 */
	newLine(count: number = 1): LoggerService {
		console.log(`\n`.repeat(count - 1));
		return this;
	}

	/**
	 * Display an error
	 * @param {string} message
	 * @return {LoggerService}
	 */
	warning(message: string): LoggerService {
		console.log(`${chalk.yellow('!')} ${message}`);
		return this;
	}

	/**
	 * Display ascii art
	 * @return {LoggerService}
	 */
	art(): LoggerService {
		console.log(this.getArt());
		return this;
	}

	/**
	 * Get ascii art
	 * @return {string}
	 */
	getArt(): string {
		return chalk.magentaBright(
			'  _    _             _  __       \n' +
				' | |  | |           (_)/ _|      \n' +
				' | |__| | __ _ _ __  _| |_ _   _ \n' +
				" |  __  |/ _` | '_ \\| |  _| | | |\n" +
				' | |  | | (_| | |_) | | | | |_| |\n' +
				' |_|  |_|\\__,_| .__/|_|_|  \\__, |\n' +
				'              | |           __/ |\n' +
				'              |_|          |___/ '
		);
	}

	/**
	 * Display the running time
	 * @return {LoggerService}
	 */
	time(): LoggerService {
		if (this.optionsService.debug()) {
			const message = `Process ran in ${process.uptime()}`;
			console.log(message);
		}
		return this;
	}
}
