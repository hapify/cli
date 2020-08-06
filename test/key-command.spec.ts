import { expect } from '@hapi/code';
import 'mocha';
import { CLI } from './helpers';

describe('key command', () => {
	it('set wrong key', async () => {
		const response = await CLI('key', ['wrong_format']);
		expect(response.code).to.equal(1);
		expect(response.stdout).to.be.empty();
		expect(response.stderr).to.contains(['Global config format error', 'apiKey']);
	})
		.timeout(10000)
		.slow(8000);
});
