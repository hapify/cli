import * as Path from 'path';
import * as Fs from 'fs';
import { IGlobalConfig } from '../src/interface/Config';
import * as Os from 'os';
import mkdirp from 'mkdirp';
import * as Rimraf from 'rimraf';
import { Container } from 'typedi';
import { LoggerService } from '../src/service/Logger';
import { Program } from '../src/class/Program';

interface CliReturn {
	code: number;
	stdout: string;
	stderr: string;
}

export async function CLI(cmd: string, args: string[]): Promise<CliReturn> {
	// Clear context
	Container.reset();
	// Execute fake node command
	const logger = Container.get(LoggerService);
	await new Program().run(['node', 'test.js', '--silent', cmd].concat(args)).catch((error) => {
		logger.handle(error);
	});
	const output = Container.get(LoggerService).getOutput();

	return {
		code: output.stderr.length ? 1 : 0,
		stdout: output.stdout,
		stderr: output.stderr,
	};
}

export const ProjectDir = Path.resolve(__dirname, '..');
export const SamplesDir = Path.resolve(ProjectDir, 'samples');
export const SampleHapiJSDir = Path.resolve(SamplesDir, 'hapijs');

export function GetFileContent(path: string, encoding = 'utf8'): string {
	return Fs.readFileSync(Path.resolve(path), { encoding });
}

export function GetJSONFileContent<T = unknown>(path: string, encoding = 'utf8'): T {
	const content = GetFileContent(path, encoding);
	return JSON.parse(content);
}

export function GetJSONFileContentSafe<T = unknown>(path: string, defaultValue: T): T {
	try {
		const content = GetFileContent(path);
		return JSON.parse(content);
	} catch (e) {
		return defaultValue;
	}
}
export function GetGlobalConfig(): IGlobalConfig {
	return GetJSONFileContentSafe<IGlobalConfig>(`${Os.homedir()}/.hapify/config.json`, {});
}

export class Sandbox {
	private readonly rootPath: string;
	constructor(private name: string = 'sandbox') {
		this.rootPath = Path.join(ProjectDir, 'test', name);
		this.create();
	}
	private create(): void {
		// Make dir if not exists
		mkdirp.sync(this.rootPath);
	}
	clear(): void {
		Rimraf.sync(this.rootPath);
		this.create();
	}
	cloneFrom(path: string): void {}

	getPath(subPath: string[] = []): string {
		return Path.join(this.rootPath, ...subPath);
	}

	getFileContent(subPath: string[], encoding = 'utf8'): string {
		return GetFileContent(Path.join(this.rootPath, ...subPath), encoding);
	}
	getJSONFileContent<T = unknown>(subPath: string[], encoding = 'utf8'): T {
		return GetJSONFileContent<T>(Path.join(this.rootPath, ...subPath), encoding);
	}
	fileExists(subPath: string[]): boolean {
		const path = Path.join(this.rootPath, ...subPath);
		return Fs.existsSync(path) && Fs.lstatSync(path).isFile();
	}
	dirExists(subPath: string[]): boolean {
		const path = Path.join(this.rootPath, ...subPath);
		return Fs.existsSync(path) && Fs.lstatSync(path).isDirectory();
	}
	touch(name = 'placeholder', content = ''): void {
		Fs.writeFileSync(Path.join(this.rootPath, name), content);
	}
}
