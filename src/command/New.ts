import { Container } from 'typedi';
import { Command } from 'commander';
import { cHigh, cImportant, cMedium, cPath } from './helpers';
import * as Rimraf from 'rimraf';
import * as Fs from 'fs';
import * as Path from 'path';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';
import { AskBoilerplate, BoilerplateQuery, FindBoilerplate } from './question/Boilerplate';
import { ApplyPreset, AskPreset } from './question/Preset';

const SimpleGit = require('simple-git/promise');

const GetDirectories = (s: string) =>
	Fs.readdirSync(s)
		.map((n: string) => Path.join(s, n))
		.filter((d: string) => Fs.lstatSync(d).isDirectory());

export async function NewCommand(cmd: Command) {
	// Get services
	const options = Container.get(OptionsService);
	const logger = Container.get(LoggerService);

	options.setCommand(cmd);

	// ---------------------------------
	// Action starts
	const qBoilerplate: BoilerplateQuery = {};

	// ---------------------------------
	// Verify current dir
	const currentDir = options.dir();
	const files = Fs.readdirSync(currentDir);
	if (files.length) {
		throw new Error('Current folder is not empty, cannot create a new project.');
	}

	// =================================
	// Get boilerplate
	await AskBoilerplate(cmd, qBoilerplate);

	// =================================
	// Get presets
	const qPresets = await AskPreset(cmd);

	// =================================
	// Get boilerplate URL
	await FindBoilerplate(qBoilerplate);

	// =================================
	// Clone git repo
	// Init & validate channel for this new folder
	const git = SimpleGit(currentDir);
	const count = qBoilerplate.urls.length;
	if (count > 1) {
		for (const url of qBoilerplate.urls) {
			await git.clone(url);
		}
		const dirs = GetDirectories(currentDir);
		for (const dir of dirs) {
			Rimraf.sync(Path.join(dir, '.git'));
		}
	} else {
		await git.clone(qBoilerplate.urls[0], currentDir);
		Rimraf.sync(Path.join(currentDir, '.git'));
	}

	// =================================
	// Get models and apply presets if necessary
	await ApplyPreset(qPresets);

	logger.success(
		`Created ${count} new dynamic boilerplate${count > 1 ? 's' : ''} in ${cPath(currentDir)}.
Run ${cMedium('hpf use')} to connect a remote project (optional).
Run ${cHigh('hpf serve')} to edit models and templates.
Run ${cImportant('hpf generate')} to generate the source code.`
	);
	// Action Ends
	// ---------------------------------
}
