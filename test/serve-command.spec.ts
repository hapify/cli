import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Fetch, Sandbox } from './helpers';
import { Container } from 'typedi';
import { HttpServerService } from '../src/service/HttpServer';

describe('serve command', () => {
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
		]);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

		// Generate code
		const response = await CLI('serve', ['--dir', sandbox.getPath(), '--no-open']);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains(['Server is running at', 'localhost']);

		const host = /http:\/\/localhost:(\d+)/.exec(response.stdout);
		expect(host).to.not.be.empty();
		const rootUrl = host[0];
		const port = Number(host[1]);
		const url = `${rootUrl}/ws.json`;
		const authJson = await Fetch<{ url: string }>(url);

		expect(authJson.url).to.contains(['ws://localhost', '4800']);

		// Stop server
		const http = Container.get(HttpServerService);
		await http.stop();
	});
});
