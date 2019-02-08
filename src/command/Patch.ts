import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService } from '../service';
import { AskDiff, ApplyDiff, DiffQuery } from './question';

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
		// Get source and destination
		const command = await ApplyDiff(qDiif, git);
		logger.info(`Run this command:\n${command}`);

		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
