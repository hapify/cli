import { SingleSaveFileStorage } from './SingleSave';
import { IStorableProject } from '../../../interface/Storage';
import { IProject } from '../../../interface/Objects';
import { IModel } from '../../../interface/Generator';
import { VersionService } from '../../Version';
import { ConverterService } from '../../Converter';
export declare class ProjectFileStorageService extends SingleSaveFileStorage<IStorableProject> {
    private versionService;
    private converterService;
    constructor(versionService: VersionService, converterService: ConverterService);
    protected serialize(content: IStorableProject): Promise<string>;
    protected deserialize(content: string): Promise<IStorableProject>;
    getProject(path: string): Promise<IProject>;
    setProject(path: string, project: IProject, models?: IModel[]): Promise<void>;
    getModels(path: string): Promise<IModel[]>;
    setModels(path: string, models: IModel[]): Promise<void>;
}
