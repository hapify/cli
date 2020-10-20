import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';
import { IConfig } from '../src/interface/Config';

describe('init command', () => {
	it('success', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const channelName = 'Test channel';
		const channelDescription = 'Test channel description';
		const channelLogo = 'http://example.com/logo';

		const response = await CLI('init', [
			'--dir',
			sandbox.getPath(),
			'--channel-name',
			channelName,
			'--channel-desc',
			channelDescription,
			'--channel-logo',
			channelLogo,
		]);

		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains(['Initialized a channel in', sandbox.getPath()]);
		expect(response.stderr).to.be.empty();

		const hapifyJSON = sandbox.getJSONFileContent<IConfig>(['hapify.json']);
		expect(hapifyJSON.name).to.equal(channelName);
		expect(hapifyJSON.description).to.equal(channelDescription);
		expect(hapifyJSON.logo).to.equal(channelLogo);
		expect(hapifyJSON.version).to.equal('1');
		expect(hapifyJSON.project).to.be.a.string();
		expect(hapifyJSON.validatorPath).to.be.a.string();
		expect(hapifyJSON.defaultFields).to.be.an.array();
		expect(hapifyJSON.templates).to.be.an.array();

		// Test files
		expect(sandbox.fileExists([hapifyJSON.project])).to.be.true();
		expect(sandbox.fileExists([hapifyJSON.validatorPath])).to.be.true();
		for (const template of hapifyJSON.templates) {
			const realPath = `${template.path.replace('{kebab}', 'model')}.${template.engine}`;
			expect(sandbox.fileExists(['hapify', realPath])).to.be.true();
		}
	});
	it('busy folder', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();
		sandbox.touch('hapify.json', JSON.stringify({}));

		const channelName = 'Test channel';
		const channelDescription = 'Test channel description';
		const channelLogo = 'http://example.com/logo';

		const response = await CLI('init', [
			'--dir',
			sandbox.getPath(),
			'--channel-name',
			channelName,
			'--channel-desc',
			channelDescription,
			'--channel-logo',
			channelLogo,
		]);

		expect(response.code).to.equal(1);
		expect(response.stdout).to.be.empty();
		expect(response.stderr).to.contains('channel already exists');
	});
});
