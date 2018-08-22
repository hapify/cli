import { Service } from 'typedi';
import { CommanderStatic } from 'commander';
import * as Path from 'path';

@Service()
export class OptionsService {

  /** @type {commander.CommanderStatic} program */
  private program: CommanderStatic;

  /** Constructor */
  constructor() {
  }

  /**
   * Set program entity
   * @param {commander.CommanderStatic} program
   */
  attach(program: CommanderStatic): void {
    this.program = program;
  }
  /**
   * Return the working directory computed with the --dir option
   * @return {string}
   */
  dir() {
    if (this.program.dir) {
      if (Path.isAbsolute(this.program.dir)) {
        return this.program.dir;
      }
      return Path.resolve(process.cwd(), this.program.dir);
    }
    return process.cwd();
  }
  /**
   * Denotes if the debug mode is enabled
   * @return {boolean}
   */
  debug() {
    return !!this.program.debug;
  }
}
