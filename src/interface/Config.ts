import { Engine, IField, IModel, Input } from './Generator';

export interface IConfigTemplate {
	/** The template's path */
	path: string;
	/** The template's type */
	engine: Engine;
	/** Denotes if the template has to to be ran for one or all models */
	input: Input;
}
export interface IConfig {
	/** The channel's configuration version */
	version: string;
	/** The channel's validation script path */
	validatorPath: string;
	/** The project id containing the models or the project file path */
	project: string;
	/** The channel's name */
	name?: string;
	/** The channel's short description */
	description?: string;
	/** The channel's logo URL */
	logo?: string;
	/** A list of model that should be added on each new model */
	defaultFields?: IField[];
	/** The templates of the channel */
	templates: IConfigTemplate[];
}
export interface IProjectConfig {
	/** The project's configuration version */
	version: string;
	/** The project's name */
	name?: string;
	/** The project's description */
	description?: string;
	/** The project's model list */
	models: IModel[];
}

export interface ILimits {
	/** The max number of allowed projects */
	projects: number;
	/** The max number of allowed models */
	models: number;
	/** The max number of allowed fields by models */
	fields: number;
	/** The max number of allowed templates */
	templates: number;
}

export interface IRemoteConfig {
	/** The API URL */
	uri: string;
	/** The max number of models that can be queried */
	modelsLimit: number;
	/** The max number of presets that can be queried */
	presetsLimit: number;
	/** The max number of projects that can be queried */
	projectsLimit: number;
	/** The max number of boilerplates that can be queried */
	boilerplatesLimit: number;
}

export interface IInternalConfig {
	/** Max duration to process validator */
	validatorTimeout: number;
}

export interface IGlobalConfig {
	/** The API Key */
	apiKey?: string;
	/** The API Url */
	apiUrl?: string;
}
