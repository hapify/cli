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
	constructor(private optionsService: OptionsService) {}

	/** Handle an error */
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

	/** Display a message */
	raw(message: string): LoggerService {
		console.log(message);
		return this;
	}

	/** Display a success message */
	success(message: string): LoggerService {
		console.log(`${chalk.green('✓')} ${message}`);
		return this;
	}

	/** Display an info */
	info(message: string): LoggerService {
		console.log(`${chalk.blueBright('•')} ${message}`);
		return this;
	}

	/** Display an info if in debug mode */
	debug(message: string): LoggerService {
		if (this.optionsService.debug()) {
			console.log(`${chalk.cyan('*')} ${message}`);
		}
		return this;
	}

	/** Display an error */
	error(message: string): LoggerService {
		console.log(`${chalk.red('✖')} ${message}`);
		return this;
	}

	/** Add new lines */
	newLine(count: number = 1): LoggerService {
		console.log(`\n`.repeat(count - 1));
		return this;
	}

	/** Display an error */
	warning(message: string): LoggerService {
		console.log(`${chalk.yellow('!')} ${message}`);
		return this;
	}

	/** Display ascii art */
	art(): LoggerService {
		console.log(this.getArt());
		return this;
	}

	/** Get ascii art */
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

	/** Display the running time */
	time(): LoggerService {
		if (this.optionsService.debug()) {
			const message = `Process ran in ${process.uptime()}`;
			console.log(message);
		}
		return this;
	}
}
