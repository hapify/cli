import { Service } from 'typedi';
import { FilePath, JoinPath, SingleSaveFileStorage } from './SingleSave';
import * as Path from 'path';
import * as Fs from 'fs';
import { IConfig } from '../../../interface/Config';

@Service()
export class ChannelFileStorageService extends SingleSaveFileStorage<IConfig> {
	/** @inheritDoc */
	protected async serialize(content: IConfig): Promise<string> {
		return JSON.stringify(content, null, 2);
	}
	/** @inheritDoc */
	protected async deserialize(content: string): Promise<IConfig> {
		try {
			return JSON.parse(content);
		} catch (error) {
			throw new Error(`An error occurred while parsing Channel configuration: ${error.toString()}`);
		}
	}
	/** Cleanup unused files */
	async cleanup(root: FilePath, legitFiles: FilePath[]): Promise<void> {
		const joinedRoot = JoinPath(root);
		const joinedLegitFiles = legitFiles.map(JoinPath);

		const allFiles = ChannelFileStorageService.listAllFiles(joinedRoot);
		for (const filePath of allFiles) {
			if (joinedLegitFiles.indexOf(filePath) < 0) {
				Fs.unlinkSync(filePath);
			}
		}

		ChannelFileStorageService.clearEmptyDirectories(joinedRoot);
	}
	/** Get all files' absolute path from a directory */
	private static listAllFiles(rootPath: string): string[] {
		// Read the whole directory
		const entries = Fs.readdirSync(rootPath).map((dir) => Path.join(rootPath, dir));

		// Get sub-files
		const subFiles = entries
			.filter((subPath) => Fs.statSync(subPath).isDirectory())
			.map((subPath) => ChannelFileStorageService.listAllFiles(subPath))
			.reduce((flatten: string[], files: string[]) => flatten.concat(files), []);

		// Return files and sub-files
		return entries.filter((subPath) => Fs.statSync(subPath).isFile()).concat(subFiles);
	}
	/** Delete all directories if empty */
	private static clearEmptyDirectories(rootPath: string): void {
		// Remove sub-directories
		Fs.readdirSync(rootPath)
			.map((dir) => Path.join(rootPath, dir))
			.filter((subPath) => Fs.statSync(subPath).isDirectory())
			.forEach((subPath) => ChannelFileStorageService.clearEmptyDirectories(subPath));

		// Count remaining files & dirs
		const count = Fs.readdirSync(rootPath).length;

		if (count === 0) {
			Fs.rmdirSync(rootPath);
		}
	}
}
