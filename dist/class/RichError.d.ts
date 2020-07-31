export interface RichErrorData {
    type: string;
    code: number;
    details?: string;
    lineNumber?: number;
    columnNumber?: number;
}
export declare class RichError implements Error {
    name: string;
    message: string;
    stack?: string;
    data?: RichErrorData;
    constructor(message: string, data?: RichErrorData);
}
