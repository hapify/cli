import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';

describe('generate command', () => {
	it('success', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate',
			'hapijs_tractr',
			'--preset',
			'5c8607a696d1ff00107de412', // User
			'--preset',
			'5c86966796d1ff00107de41c', // Place
		]);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

		// Generate code
		const response = await CLI('generate', ['--dir', sandbox.getPath()]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains(['Generated', 'files', 'for channel', 'HapiJS']);

		expect(sandbox.fileExists(['routes', 'user', 'create.js'])).to.be.true();
		expect(sandbox.fileExists(['routes', 'place', 'delete.js'])).to.be.true();
		expect(sandbox.fileExists(['cmd', 'setup', 'indexes.json'])).to.be.true();
	});

	it('success with two boilerplates', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-hapijs.git',
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-ngx-components.git',
			'--preset',
			'5c8607a696d1ff00107de412', // User
		]);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 2 new dynamic boilerplates');

		// Generate code
		const response = await CLI('generate', ['--dir', sandbox.getPath()]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains(['Generated', 'files', 'for channel', 'HapiJS', 'Angular Components']);

		expect(sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'create.js'])).to.be.true();
		expect(sandbox.fileExists(['boilerplate-ngx-components', 'src', 'app', 'models', 'user', 'user.ts'])).to.be.true();
	});
});
