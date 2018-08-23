import { Service } from 'typedi';
import chalk from 'chalk';
import { OptionsService } from './Options';

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
   */
  handle(error: Error): void {
    const message = this.optionsService.debug() ?
      error.stack.toString() : error.toString();
    console.error(chalk.red(message));
  }
  /**
   * Display a success message
   * @param {string} message
   */
  success(message: string): void {
    console.log(chalk.green(message));
  }
  /**
   * Display a message
   * @param {string} message
   */
  raw(message: string): void {
    console.log(message);
  }
  /**
   * Display an info
   * @param {string} message
   */
  info(message: string): void {
    console.log(chalk.blueBright(message));
  }
  /**
   * Display ascii art
   */
  art() {
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
  }
  /**
   * Display the running time
   */
  time(): void {
    const message = `Process ran in ${process.uptime()}`;
    console.log(message);
  }
}
