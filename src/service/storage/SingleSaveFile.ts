import { Service } from 'typedi';
import { SingleSave } from './SingleSave';
import * as Fs from 'fs';
import mkdirp from 'mkdirp';
import * as Path from 'path';

export type FilePath = string | string[];
export function JoinPath(path: FilePath): string {
	return path instanceof Array ? Path.join(...path) : <string>path;
}

@Service()
export abstract class SingleSaveFileStorage<T> extends SingleSave {
	/** Load content from path */
	public async get(path: FilePath): Promise<T> {
		const contentPath = JoinPath(path);
		const content = <string>(
			Fs.readFileSync(Path.join(...contentPath), 'utf8')
		);
		this.didLoad(contentPath, content);
		return await this.deserialize(content);
	}
	/** Load content from path */
	public async set(path: FilePath, input: T): Promise<void> {
		const content = await this.serialize(input);
		const contentPath = JoinPath(path);
		if (this.shouldSave(contentPath, content)) {
			mkdirp.sync(Path.dirname(contentPath));
			Fs.writeFileSync(contentPath, content, 'utf8');
		}
	}
	/** Check if the resource exsists */
	public async exists(path: FilePath): Promise<boolean> {
		return Fs.existsSync(JoinPath(path));
	}
	/** Convert content to string before saving */
	protected abstract async serialize(content: T): Promise<string>;
	/** Convert content to string before saving */
	protected abstract async deserialize(content: string): Promise<T>;
}
