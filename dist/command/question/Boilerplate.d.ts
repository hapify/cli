import { Command } from 'commander';
export interface BoilerplateQuery {
    id?: string;
    slug?: string;
    urls?: string[];
}
export declare function AskBoilerplate(cmd: Command, qBoilerplate: BoilerplateQuery): Promise<void>;
export declare function FindBoilerplate(qBoilerplate: BoilerplateQuery): Promise<void>;
