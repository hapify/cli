import * as Path from 'path';
import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import { IGlobalConfig } from '../src/interface/Config';
import * as Os from 'os';
import mkdirp from 'mkdirp';
import * as Rimraf from 'rimraf';

interface CliReturn {
	code: number;
	stdout: string;
	stderr: string;
}

export function CLI(cmd: string, args: string[]): Promise<CliReturn> {
	const entryPoint = Path.resolve('src/index.ts');
	const cwd = Path.resolve('./');
	return new Promise((resolve) => {
		const ls = ChildProcess.fork(entryPoint, [cmd].concat(args), { cwd, silent: true });
		let stdout: string = '';
		let stderr: string = '';
		const pushStdout = (data: string) => {
			stdout += data;
		};
		const pushStderr = (data: string) => {
			stderr += data;
		};
		ls.stdout.on('data', pushStdout);
		ls.stderr.on('data', pushStderr);
		ls.on('exit', (code) => {
			resolve({
				code,
				stdout,
				stderr,
			});
		});
	});
}

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
		this.rootPath = Path.join(__dirname, name);
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
}
