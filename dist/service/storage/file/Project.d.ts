import { SingleSaveFileStorage } from './SingleSave';
import { IStorableProject } from '../../../interface/Storage';
import { IProject } from '../../../interface/Objects';
import { IModel } from '../../../interface/Generator';
export declare class ProjectFileStorageService extends SingleSaveFileStorage<IStorableProject> {
    private booleanPropertiesNames;
    protected serialize(content: IStorableProject): Promise<string>;
    protected deserialize(content: string): Promise<IStorableProject>;
    getProject(path: string): Promise<IProject>;
    getModels(path: string): Promise<IModel[]>;
    setModels(path: string, models: IModel[]): Promise<void>;
}
