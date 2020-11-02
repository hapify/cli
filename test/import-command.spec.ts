import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';
import { IStorableCompactProject } from '../src/interface/Storage';

describe('import command', () => {
	it('success', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', ['--dir', sandbox.getPath(), '--boilerplate', 'hapijs_tractr', '--no-presets']);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

		// Generate code
		const response = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'5c8607a696d1ff00107de412', // User
			'--preset',
			'5c86966796d1ff00107de41c', // Place
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.be.contains(['apply 2 preset']);

		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['hapify-models.json']);
		expect(hapifyModelsJSON.models.map((m) => m.name)).to.includes(['User', 'Place']);
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
			'--no-presets',
		]);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 2 new dynamic boilerplates');

		// Generate code
		const response = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'5c8607a696d1ff00107de412', // User
			'--preset',
			'5c86966796d1ff00107de41c', // Place
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.be.contains(['apply 2 preset']);

		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['boilerplate-hapijs', 'hapify-models.json']);
		expect(hapifyModelsJSON.models.map((m) => m.name)).to.includes(['User', 'Place']);

		const hapifyModelsJSON2 = sandbox.getJSONFileContent<IStorableCompactProject>(['boilerplate-ngx-components', 'hapify-models.json']);
		expect(hapifyModelsJSON2.models.map((m) => m.name)).to.includes(['User', 'Place']);
	});

	it('already has models', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', ['--dir', sandbox.getPath(), '--boilerplate', 'hapijs_tractr', '--no-presets']);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

		// Generate code
		const response = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'5c8607a696d1ff00107de412', // User
			'--preset',
			'5c86966796d1ff00107de41c', // Place
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.be.contains(['apply 2 preset']);

		// Generate again
		const response2 = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'5c8607a696d1ff00107de412', // User
			'--preset',
			'5c86966796d1ff00107de41c', // Place
		]);

		expect(response2.stderr).to.be.empty();
		expect(response2.code).to.equal(0);
		expect(response2.stdout).to.be.contains(['Ignore presets import', 'Operation aborted']);
	});
});
