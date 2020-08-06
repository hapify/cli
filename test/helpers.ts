import * as Path from 'path';
import * as ChildProcess from 'child_process';

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
