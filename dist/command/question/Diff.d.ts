import { Command } from 'commander';
import { SimpleGit } from 'simple-git/promise';
export interface DiffQuery {
    from?: string;
    to?: string;
    source?: string;
    destination?: string;
}
export declare function AskDiff(cmd: Command, qDiff: DiffQuery, git: SimpleGit): Promise<void>;
export declare function ApplyDiff(qDiff: DiffQuery, git: SimpleGit): Promise<string>;
