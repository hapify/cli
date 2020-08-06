import { SingleSaveFileStorage } from './SingleSave';
export declare class TemplatesFileStorageService extends SingleSaveFileStorage<string> {
    protected serialize(content: string): Promise<string>;
    protected deserialize(content: string): Promise<string>;
}
