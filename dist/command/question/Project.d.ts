import { Command } from 'commander';
export interface ProjectQuery {
    id?: string;
    name?: string;
    description?: string;
}
export declare function AskProject(cmd: Command, qProject: ProjectQuery): Promise<void>;
export declare function SetupProject(qProject: ProjectQuery): Promise<void>;
