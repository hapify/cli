import { Service } from 'typedi';
import { SingleSave } from './SingleSave';
import * as Fs from 'fs';
import mkdirp from 'mkdirp';
import * as Path from 'path';

@Service()
export class TemplatesStorageService extends SingleSave {
	/** Load content from path */
	public async get(contentPath: string): Promise<string> {
		const content = <string>Fs.readFileSync(contentPath, 'utf8');
		this.didLoad(contentPath, content);
		return content;
	}
	/** Load content from path */
	public async set(contentPath: string, content: string): Promise<void> {
		if (this.shouldSave(contentPath, content)) {
			mkdirp.sync(Path.dirname(contentPath));
			Fs.writeFileSync(contentPath, content, 'utf8');
		}
	}
}
