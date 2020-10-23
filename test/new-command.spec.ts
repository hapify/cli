import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';
import { IStorableCompactProject } from '../src/interface/Storage';

describe('new command', () => {
	it('success by slug', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', ['--dir', sandbox.getPath(), '--boilerplate', 'hapijs_tractr', '--no-presets']);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
	});
	it('success by id', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', ['--dir', sandbox.getPath(), '--boilerplate-id', '5c77197a98ebdb001075f3a5', '--no-presets']);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
	});
	it('success by url (x2) with preset', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-hapijs.git',
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-ngx-components.git',
			'--preset',
			'5c8607a696d1ff00107de412',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 2 new dynamic boilerplates');

		expect(sandbox.dirExists(['boilerplate-hapijs'])).to.be.true();
		expect(sandbox.dirExists(['boilerplate-ngx-components'])).to.be.true();
	});
	it('success with presets', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate',
			'hapijs_tractr',
			'--preset',
			'5c8607a696d1ff00107de412',
			'--preset',
			'5c86966796d1ff00107de41c',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
		expect(sandbox.fileExists(['hapify-models.json'])).to.be.true();
		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['hapify-models.json']);
		expect(hapifyModelsJSON.models.length).to.least(2);
		expect(hapifyModelsJSON.models.some((m) => m.name.toLowerCase() === 'user')).to.be.true();
		expect(hapifyModelsJSON.models.some((m) => m.name.toLowerCase() === 'place')).to.be.true();
	});
	it('busy folder', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();
		sandbox.touch('hapify.json', JSON.stringify({}));

		const response = await CLI('new', ['--dir', sandbox.getPath(), '--boilerplate', 'hapijs_tractr', '--no-presets']);

		expect(response.code).to.equal(1);
		expect(response.stdout).to.be.empty();
		expect(response.stderr).to.contains('folder is not empty');
	});
});
