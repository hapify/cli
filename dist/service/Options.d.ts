import { Command, CommanderStatic } from 'commander';
import { GlobalConfigService } from './GlobalConfig';
import { IRemoteConfig } from '../interface/Config';
export declare class OptionsService {
    private globalConfigService;
    private program;
    private command;
    constructor(globalConfigService: GlobalConfigService);
    /** Set program entity */
    setProgram(program: CommanderStatic): void;
    /** Set command entity */
    setCommand(command: Command): void;
    /** Returns the remote config and override defaults with global config (if any) */
    remoteConfig(): IRemoteConfig;
    /** Return the working directory computed with the --dir option */
    dir(): string;
    /** Return the API Key to use (explicit or global) */
    apiKey(): string;
    /** Return the API URL to use or default URL */
    apiUrl(): string;
    /** Denotes if the debug mode is enabled */
    debug(): boolean;
    /** Get the depth for recursive search */
    depth(): number;
    /** Get the output file path */
    output(): string;
    /** Get the required http port */
    port(): number;
    /** Get the required http hostname */
    hostname(): string;
    /** Denotes if a new tab should be opened */
    open(): boolean;
}
