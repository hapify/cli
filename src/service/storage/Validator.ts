import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSaveFile';

@Service()
export class ValidatorStorageService extends SingleSaveFileStorage {}
