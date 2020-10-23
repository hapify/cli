import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';

describe('new command', () => {
	it('success', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', ['--dir', sandbox.getPath(), '--boilerplate', 'hapijs_tractr', '--no-presets']);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
	});
	it('success with two', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-hapijs.git',
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-ngx-components.git',
			'--no-presets',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 2 new dynamic boilerplates');

		expect(sandbox.dirExists(['hapijs_tractr'])).to.be.true();
		expect(sandbox.dirExists(['ngx_dashboard_tractr'])).to.be.true();
	});
});
