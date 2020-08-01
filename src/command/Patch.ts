import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';
import { ApplyDiff, AskDiff, DiffQuery } from './question/Diff';

const SimpleGit = require('simple-git/promise');

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

export async function PatchCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		const qDiif: DiffQuery = {};
		const currentDir = options.dir();

		// =================================
		// Clone git repo
		const git = SimpleGit(currentDir);

		// =================================
		// Get source and destination
		await AskDiff(cmd, qDiif, git);

		// =================================
		// Run patch
		const result = await ApplyDiff(qDiif, git);
		if (result === null) {
			logger.info('Aborted');
		} else {
			logger.success(`Success:\n${result}`);
		}

		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
