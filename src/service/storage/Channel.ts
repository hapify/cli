import { Service } from 'typedi';
import { FilePath, JoinPath, SingleSaveFileStorage } from './SingleSaveFile';
import * as Path from 'path';
import * as Fs from 'fs';

@Service()
export class ChannelStorageService extends SingleSaveFileStorage {
	/**
	 * Cleanup unused files
	 * @param root
	 * @param legitFiles
	 */
	async cleanup(root: FilePath, legitFiles: FilePath[]): Promise<void> {
		const joinedRoot = JoinPath(root);
		const joinedLegitFiles = legitFiles.map(JoinPath);

		const allFiles = ChannelStorageService.listAllFiles(joinedRoot);
		for (const filePath of allFiles) {
			if (joinedLegitFiles.indexOf(filePath) < 0) {
				Fs.unlinkSync(filePath);
			}
		}

		ChannelStorageService.clearEmptyDirectories(joinedRoot);
	}

	/**
	 * Get all files' absolute path from a directory
	 * @param {string} rootPath
	 * @return {string[]}
	 */
	private static listAllFiles(rootPath: string): string[] {
		// Read the whole directory
		const entries = Fs.readdirSync(rootPath).map(dir =>
			Path.join(rootPath, dir)
		);

		// Get sub-files
		const subFiles = entries
			.filter(subPath => Fs.statSync(subPath).isDirectory())
			.map(subPath => ChannelStorageService.listAllFiles(subPath))
			.reduce(
				(flatten: string[], files: string[]) => flatten.concat(files),
				[]
			);

		// Return files and sub-files
		return entries
			.filter(subPath => Fs.statSync(subPath).isFile())
			.concat(subFiles);
	}

	/**
	 * Delete all directories if empty
	 * @param {string} rootPath
	 */
	private static clearEmptyDirectories(rootPath: string): void {
		// Remove sub-directories
		Fs.readdirSync(rootPath)
			.map(dir => Path.join(rootPath, dir))
			.filter(subPath => Fs.statSync(subPath).isDirectory())
			.forEach(subPath =>
				ChannelStorageService.clearEmptyDirectories(subPath)
			);

		// Count remaining files & dirs
		const count = Fs.readdirSync(rootPath).length;

		if (count === 0) {
			Fs.rmdirSync(rootPath);
		}
	}
}
