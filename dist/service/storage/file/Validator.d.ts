import { SingleSaveFileStorage } from './SingleSave';
export declare class ValidatorFileStorageService extends SingleSaveFileStorage<string> {
    /** @inheritDoc */
    protected serialize(content: string): Promise<string>;
    /** @inheritDoc */
    protected deserialize(content: string): Promise<string>;
}
