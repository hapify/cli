import { Service } from 'typedi';
import { SingleSave } from './SingleSave';
import * as Fs from 'fs';
import mkdirp from 'mkdirp';
import * as Path from 'path';

export type FilePath = string | string[];
export function JoinPath(path: FilePath): string {
	return path instanceof Array ? Path.join(...path) : path;
}

@Service()
export abstract class SingleSaveFileStorage extends SingleSave {
	/** Load content from path */
	public async get(path: FilePath): Promise<string> {
		const contentPath = JoinPath(path);
		const content = <string>(
			Fs.readFileSync(Path.join(...contentPath), 'utf8')
		);
		this.didLoad(contentPath, content);
		return content;
	}
	/** Load content from path */
	public async set(path: FilePath, content: string): Promise<void> {
		const contentPath = JoinPath(path);
		if (this.shouldSave(contentPath, content)) {
			mkdirp.sync(Path.dirname(contentPath));
			Fs.writeFileSync(contentPath, content, 'utf8');
		}
	}
}
