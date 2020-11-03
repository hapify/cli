import { Command } from 'commander';
export interface ProjectQuery {
    id?: string;
    name?: string;
    description?: string;
}
export declare function AskLocalProject(cmd: Command, qProject: ProjectQuery): Promise<void>;
export declare function AskRemoteProject(cmd: Command, qProject: ProjectQuery): Promise<void>;
export declare function SetupRemoteProject(qProject: ProjectQuery): Promise<void>;
