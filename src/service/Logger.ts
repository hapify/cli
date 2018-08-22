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
   * @return {string}
   */
  handle(error: Error) {
    const message = this.optionsService.debug() ?
      error.stack.toString() : error.toString();
    console.error(chalk.red(message));
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
}
