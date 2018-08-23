import { Service } from 'typedi';
import { Command, CommanderStatic } from 'commander';
import * as Path from 'path';

@Service()
export class OptionsService {

  /** @type {commander.CommanderStatic} program */
  private program: CommanderStatic;
  /** @type {commander.CommanderStatic} program */
  private command: Command;

  /** Constructor */
  constructor() {
  }

  /**
   * Set program entity
   * @param {commander.CommanderStatic} program
   */
  setProgram(program: CommanderStatic): void {
    this.program = program;
  }
  /**
   * Set command entity
   * @param {commander.Command} command
   */
  setCommand(command: Command): void {
    this.command = command;
  }
  /**
   * Return the working directory computed with the --dir option
   * @return {string}
   */
  dir(): string {
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
  debug(): boolean {
    return !!this.program.debug;
  }
  /**
   * Get the depth for recursive search
   * @return {number}
   */
  depth(): number {
    return this.command.depth;
  }
}
