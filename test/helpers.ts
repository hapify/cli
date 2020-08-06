import * as Path from 'path';
import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import { IGlobalConfig } from '../src/interface/Config';
import * as Os from 'os';

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

export function GetFileContent(path: string): string {
	return Fs.readFileSync(Path.resolve(path), { encoding: 'utf8' });
}

export function GetJSONFileContent<T = object>(path: string): T {
	const content = GetFileContent(path);
	return JSON.parse(content);
}

export function GetJSONFileContentSafe<T = object>(path: string, defaultValue: T): T {
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
