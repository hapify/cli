import { OptionsService } from './Options';
export declare class LoggerService {
    private optionsService;
    /**
     * Constructor
     * @param {OptionsService} optionsService
     */
    constructor(optionsService: OptionsService);
    /**
     * Handle an error
     * @param {Error} error
     * @return {LoggerService}
     */
    handle(error: Error): LoggerService;
    /**
     * Display a message
     * @param {string} message
     * @return {LoggerService}
     */
    raw(message: string): LoggerService;
    /**
     * Display a success message
     * @param {string} message
     * @return {LoggerService}
     */
    success(message: string): LoggerService;
    /**
     * Display an info
     * @param {string} message
     * @return {LoggerService}
     */
    info(message: string): LoggerService;
    /**
     * Display an info if in debug mode
     * @param {string} message
     * @return {LoggerService}
     */
    debug(message: string): LoggerService;
    /**
     * Display an error
     * @param {string} message
     */
    error(message: string): LoggerService;
    /**
     * Add new lines
     * @param {number} count
     * @return {LoggerService}
     */
    newLine(count?: number): LoggerService;
    /**
     * Display an error
     * @param {string} message
     * @return {LoggerService}
     */
    warning(message: string): LoggerService;
    /**
     * Display ascii art
     * @return {LoggerService}
     */
    art(): LoggerService;
    /**
     * Get ascii art
     * @return {string}
     */
    getArt(): string;
    /**
     * Display the running time
     * @return {LoggerService}
     */
    time(): LoggerService;
}
