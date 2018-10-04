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
  /** @return {boolean} Denotes if the debug mode is enabled */
  debug(): boolean { return !!this.program.debug; }
  /** @return {number} Get the depth for recursive search */
  depth(): number { return this.command.depth; }
  /** @return {string} Get the output file path */
  output(): string { return this.command.output; }
  /** @return {number} Get the required http port */
  port(): number { return this.command.port; }
  /** @return {string} Get the required http hostname */
  hostname(): string { return this.command.hostname; }
  /** @return {boolean} Denotes if a new tab should be opened */
  open(): boolean { return !!this.command.open; }
}
