import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, ChannelsService } from '../service';
import { cPath } from './helpers';
import * as Fs from 'fs';
import {
	ProjectQuery,
	AskProject,
	SetupProject,
	BoilerplateQuery,
	AskBoilerplate,
	FindBoilerplate,
	AskPreset,
	ApplyPreset
} from './question';

const SimpleGit = require('simple-git/promise');

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const channelsService = Container.get(ChannelsService);

export async function NewCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		const qProject: ProjectQuery = {};
		const qBoilerplate: BoilerplateQuery = {};

		// ---------------------------------
		// Verify current dir
		const currentDir = options.dir();
		const files = Fs.readdirSync(currentDir);
		if (files.length) {
			throw new Error(
				'Current folder is not empty, cannot create a new project.'
			);
		}

		// =================================
		// Get project
		await AskProject(cmd, qProject);

		// =================================
		// Get boilerplate
		await AskBoilerplate(cmd, qBoilerplate);

		// =================================
		// Get presets
		const qPresets = await AskPreset(cmd);

		// =================================
		// Create project if necessary
		await SetupProject(qProject);

		// =================================
		// Get boilerplate URL
		await FindBoilerplate(qBoilerplate);

		// =================================
		// Clone git repo
		const git = SimpleGit(currentDir);
		await git.clone(qBoilerplate.url, currentDir);

		// =================================
		// Init & validate channel for this new folder
		await channelsService.changeProject(qProject.id);

		// =================================
		// Get models and apply presets if necessary
		await ApplyPreset(qPresets);

		logger.success(
			`Created a new dynamic boilerplate in ${cPath(
				currentDir
			)}. Run 'hpf serve' to edit.`
		);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
