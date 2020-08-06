import { OptionsService } from './Options';
export declare class LoggerService {
    private optionsService;
    constructor(optionsService: OptionsService);
    /** Handle an error */
    handle(error: Error): LoggerService;
    /** Display a message */
    raw(message: string): LoggerService;
    /** Display a success message */
    success(message: string): LoggerService;
    /** Display an info */
    info(message: string): LoggerService;
    /** Display an info if in debug mode */
    debug(message: string): LoggerService;
    /** Display an error */
    error(message: string): LoggerService;
    /** Add new lines */
    newLine(count?: number): LoggerService;
    /** Display an error */
    warning(message: string): LoggerService;
    /** Display ascii art */
    art(): LoggerService;
    /** Get ascii art */
    getArt(): string;
    /** Display the running time */
    time(): LoggerService;
}
