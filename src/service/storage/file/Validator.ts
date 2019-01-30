import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSave';

@Service()
export class ValidatorFileStorageService extends SingleSaveFileStorage<string> {
	/** @inheritDoc */
	protected async serialize(content: string): Promise<string> {
		return content;
	}
	/** @inheritDoc */
	protected async deserialize(content: string): Promise<string> {
		return content;
	}
}
