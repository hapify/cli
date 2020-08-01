import { Command, CommanderStatic } from 'commander';
import { GlobalConfigService } from './GlobalConfig';
import { IRemoteConfig } from '../interface/IObjects';
export declare class OptionsService {
    private globalConfigService;
    /** @type {commander.CommanderStatic} program */
    private program;
    /** @type {commander.CommanderStatic} program */
    private command;
    /** Constructor */
    constructor(globalConfigService: GlobalConfigService);
    /**
     * Set program entity
     * @param {commander.CommanderStatic} program
     */
    setProgram(program: CommanderStatic): void;
    /**
     * Set command entity
     * @param {commander.Command} command
     */
    setCommand(command: Command): void;
    /** Returns the remote config and override defaults with global config (if any) */
    remoteConfig(): IRemoteConfig;
    /** @return {string} Return the working directory computed with the --dir option */
    dir(): string;
    /** @return {string} Return the API Key to use (explicit or global) */
    apiKey(): string;
    /** @return {string} Return the API URL to use or default URL */
    apiUrl(): string;
    /** @return {boolean} Denotes if the debug mode is enabled */
    debug(): boolean;
    /** @return {number} Get the depth for recursive search */
    depth(): number;
    /** @return {string} Get the output file path */
    output(): string;
    /** @return {number} Get the required http port */
    port(): number;
    /** @return {string} Get the required http hostname */
    hostname(): string;
    /** @return {boolean} Denotes if a new tab should be opened */
    open(): boolean;
}
