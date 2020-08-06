import { Engine, IField, Input } from './Generator';
export interface IConfigTemplate {
    /** @type {string} The template's path */
    path: string;
    /** @type {string} The template's type */
    engine: Engine;
    /** @type {string} Denotes if the template has to to be ran for one or all models */
    input: Input;
}
export interface IConfig {
    /** @type {string} The channel's configuration version */
    version: string;
    /** @type {string} The channel's validation script path */
    validatorPath: string;
    /** @type {string} The project id containing the models */
    project: string;
    /** @type {string} The channel's name */
    name?: string;
    /** @type {string} The channel's short description */
    description?: string;
    /** @type {string} The channel's logo URL */
    logo?: string;
    /** @type {IField[]} A list of model that should be added on each new model */
    defaultFields?: IField[];
    /** @type {IConfigTemplate[]} The templates of the channel */
    templates: IConfigTemplate[];
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
    /** @type {string} The API Key */
    apiKey?: string;
    /** @type {string} The API Url */
    apiUrl?: string;
}
