import { IRemoteConfig } from '../interface';

export const RemoteConfigStaging: IRemoteConfig = {
	// uri: 'http://api.dev.hapify.io/v1',
	uri: 'https://api.staging.hapify.io/v1',
	modelsLimit: 120,
	presetsLimit: 100,
	projectsLimit: 100,
	boilerplatesLimit: 100
};

export const RemoteConfigProduction: IRemoteConfig = {
	uri: 'https://api.hapify.io/v1',
	modelsLimit: 120,
	presetsLimit: 100,
	projectsLimit: 100,
	boilerplatesLimit: 100
};
