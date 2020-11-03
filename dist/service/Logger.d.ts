import { OptionsService } from './Options';
declare type LogType = 'stderr' | 'stdout';
declare type LoggerOutput = {
    [key in LogType]: string;
};
export declare class LoggerService {
    private optionsService;
    private output;
    constructor(optionsService: OptionsService);
    /** Handle an error */
    handle(error: Error): this;
    /** Handle an error */
    handleAndExit(error: Error, code?: number): this;
    /** Display a message */
    raw(message: string): this;
    /** Display a success message */
    success(message: string): this;
    /** Display an info */
    info(message: string): this;
    /** Display an info if in debug mode */
    debug(message: string): this;
    /** Display an error */
    error(message: string): this;
    /** Add new lines */
    newLine(count?: number): this;
    /** Display an error */
    warning(message: string): this;
    /** Display ascii art */
    art(): this;
    /** Get ascii art */
    getArt(): string;
    /** Display the running time */
    time(): this;
    private log;
    getOutput(): LoggerOutput;
}
export {};
