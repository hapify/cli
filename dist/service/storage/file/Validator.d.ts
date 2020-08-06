import { SingleSaveFileStorage } from './SingleSave';
export declare class ValidatorFileStorageService extends SingleSaveFileStorage<string> {
    protected serialize(content: string): Promise<string>;
    protected deserialize(content: string): Promise<string>;
}
