import { SingleSaveFileStorage } from './SingleSave';
import { IProjectConfig } from '../../../interface/Config';
export declare class ProjectFileStorageService extends SingleSaveFileStorage<IProjectConfig> {
    protected serialize(content: IProjectConfig): Promise<string>;
    protected deserialize(content: string): Promise<IProjectConfig>;
}
