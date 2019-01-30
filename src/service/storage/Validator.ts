import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSaveFile';

@Service()
export class ValidatorStorageService extends SingleSaveFileStorage<string> {
	/** @inheritDoc */
	protected async serialize(content: string): Promise<string> {
		return content;
	}
	/** @inheritDoc */
	protected async deserialize(content: string): Promise<string> {
		return content;
	}
}
