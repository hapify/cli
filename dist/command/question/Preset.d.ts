import { Command } from 'commander';
export declare function AskPreset(cmd: Command): Promise<string[]>;
export declare function ApplyPreset(qPresets: string[]): Promise<boolean>;
