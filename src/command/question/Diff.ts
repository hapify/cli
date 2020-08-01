import { Command } from 'commander';
import * as Inquirer from 'inquirer';
import { SimpleGit } from 'simple-git/promise';
import { exec } from 'child_process';
import * as util from 'util';
import { Container } from 'typedi';
import { OptionsService } from '../../service/Options';

const options = Container.get(OptionsService);

export interface DiffQuery {
	from?: string;
	to?: string;
	source?: string;
	destination?: string;
}
export async function AskDiff(cmd: Command, qDiff: DiffQuery, git: SimpleGit) {
	const branches = await git.branchLocal();

	qDiff.source = ((await Inquirer.prompt([
		{
			name: 'source',
			message: 'Choose a source branch',
			type: 'list',
			choices: branches.all,
			default: 'hapify',
		},
	])) as any).source;

	const commits = (await git.log([qDiff.source, '-n', '20', '--'])).all.map((c) => ({ name: `[${c.date}] ${c.message}`, value: c.hash }));

	qDiff.from = ((await Inquirer.prompt([
		{
			name: 'from',
			message: 'Choose the first commit',
			type: 'list',
			choices: [{ name: 'Enter a commit hash', value: null }, new Inquirer.Separator(), ...commits],
			default: commits.length > 1 ? commits[1].value : null,
			when: () => commits.length > 0,
		},
		{
			name: 'from',
			message: 'Enter the first commit hash',
			when: (answer: any) => !answer.from,
			validate: (input) => input.length > 0,
		},
	])) as any).from;

	qDiff.to = ((await Inquirer.prompt([
		{
			name: 'to',
			message: 'Choose the second commit',
			type: 'list',
			choices: [{ name: 'Enter a commit hash', value: null }, new Inquirer.Separator(), ...commits],
			default: commits.length > 0 ? commits[0].value : null,
			when: () => commits.length > 0,
		},
		{
			name: 'to',
			message: 'Enter the second commit hash',
			when: (answer: any) => !answer.to,
			validate: (input) => input.length > 0,
		},
	])) as any).to;

	qDiff.destination = ((await Inquirer.prompt([
		{
			name: 'destination',
			message: 'Choose a destination branch',
			type: 'list',
			choices: branches.all,
			default: 'develop',
		},
	])) as any).destination;
}
export async function ApplyDiff(qDiff: DiffQuery, git: SimpleGit): Promise<string> {
	const command = `git format-patch --stdout ${qDiff.from}..${qDiff.to} | git am -3 -k`;
	const confirm = ((await Inquirer.prompt([
		{
			name: 'confirm',
			message: `Confirm run command: "${command}" on branch ${qDiff.destination}`,
			type: 'confirm',
			default: false,
		},
	])) as any).confirm;

	if (confirm) {
		await git.checkout(qDiff.destination);
		const { stdout, stderr } = await util.promisify(exec)(command, {
			cwd: options.dir(),
		});
		if (stderr && stderr.length) {
			throw new Error(`${stderr}\n${stdout}`);
		}
		return stdout;
	}

	return null;
}
