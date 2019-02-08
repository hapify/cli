import { Command } from 'commander';
import * as Inquirer from 'inquirer';
import { SimpleGit } from 'simple-git/promise';

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
			default: 'hapify'
		}
	])) as any).source;

	const commits = (await git.log([qDiff.source, '-n', '20', '--'])).all.map(
		c => ({ name: `[${c.date}] ${c.message}`, value: c.hash })
	);

	qDiff.from = ((await Inquirer.prompt([
		{
			name: 'from',
			message: 'Choose the first commit',
			type: 'list',
			choices: [
				{ name: 'Enter a commit hash', value: null },
				new Inquirer.Separator(),
				...commits
			],
			when: () => commits.length > 0
		},
		{
			name: 'from',
			message: 'Enter the first commit hash',
			when: (answer: any) => !answer.from,
			validate: input => input.length > 0
		}
	])) as any).from;

	qDiff.to = ((await Inquirer.prompt([
		{
			name: 'to',
			message: 'Choose the second commit',
			type: 'list',
			choices: [
				{ name: 'Enter a commit hash', value: null },
				new Inquirer.Separator(),
				...commits
			],
			when: () => commits.length > 0
		},
		{
			name: 'to',
			message: 'Enter the second commit hash',
			when: (answer: any) => !answer.to,
			validate: input => input.length > 0
		}
	])) as any).to;

	qDiff.destination = ((await Inquirer.prompt([
		{
			name: 'destination',
			message: 'Choose a destination branch',
			type: 'list',
			choices: branches.all,
			default: 'develop'
		}
	])) as any).destination;

	console.log(qDiff);
}
export async function ApplyDiff(
	qDiff: DiffQuery,
	git: SimpleGit
): Promise<string> {
	return `git checkout ${qDiff.destination} && git format-patch --stdout ${
		qDiff.from
	}..${qDiff.to} | git am -3 -k`;
}
