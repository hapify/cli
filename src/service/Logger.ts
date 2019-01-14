import { Service } from 'typedi';
import chalk from 'chalk';
import { OptionsService } from './Options';

@Service()
export class LoggerService {

  /**
   * Constructor
   * @param {OptionsService} optionsService
   */
  constructor(private optionsService: OptionsService) {
  }

  /**
   * Handle an error
   * @param {Error} error
   * @return {LoggerService}
   */
  handle(error: Error): LoggerService {
    const message = this.optionsService.debug() ?
      error.stack.toString() : error.toString();
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
    console.log(chalk.magentaBright(
      '  _    _             _  __       \n' +
      ' | |  | |           (_)/ _|      \n' +
      ' | |__| | __ _ _ __  _| |_ _   _ \n' +
      ' |  __  |/ _` | \'_ \\| |  _| | | |\n' +
      ' | |  | | (_| | |_) | | | | |_| |\n' +
      ' |_|  |_|\\__,_| .__/|_|_|  \\__, |\n' +
      '              | |           __/ |\n' +
      '              |_|          |___/ '
    ));
    return this;
  }

  /**
   * Display the running time
   * @return {LoggerService}
   */
  time(): LoggerService {
    const message = `Process ran in ${process.uptime()}`;
    console.log(message);
    return this;
  }
}
