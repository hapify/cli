export declare class Program {
    private http;
    private options;
    private program;
    constructor();
    run(argv: string[]): Promise<void>;
    protected init(): void;
}
