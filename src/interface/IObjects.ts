export interface IConfigTemplate {
	/** @type {string} The template's path */
	path: string;
	/** @type {string} The template's type */
	engine: string;
	/** @type {string} Denotes if the template has to to be ran for one or all models */
	input: string;
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

export interface IField {
	/** @type {string} The field's name */
	name: string;
	/** @type {string} The field's type */
	type: string;
	/** @type {string} The field's subtype */
	subtype: string | null;
	/** @type {string} The field's reference if the type is entity. The GUID string of the targeted model */
	reference: string | null;
	/** @type {boolean} Should be used as a primary key or not */
	primary: boolean;
	/** @type {boolean} Should be used as a unique key or not */
	unique: boolean;
	/** @type {boolean} Should be used as a label or not */
	label: boolean;
	/** @type {boolean} Denotes if the field can be empty or not */
	nullable: boolean;
	/** @type {boolean} Denotes if the field is an array of values */
	multiple: boolean;
	/** @type {boolean} Indicate whether the field is important (should be always exposed explicitly) */
	important: boolean;
	/** @type {boolean} Indicate whether the field is searchable or not */
	searchable: boolean;
	/** @type {boolean} Indicate whether the field is sortable or not */
	sortable: boolean;
	/** @type {boolean} Indicate whether the field is private (should not be exposed) */
	isPrivate: boolean;
	/** @type {boolean} Indicate whether the field is for an internal use only (should not be defined by an user) */
	internal: boolean;
	/** @type {boolean} Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
	restricted: boolean;
	/** @type {boolean} Indicate that this field defines the owner of the entity */
	ownership: boolean;
}

/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
export class Access {
	static GUEST = 'guest';
	static AUTHENTICATED = 'auth';
	static OWNER = 'owner';
	static ADMIN = 'admin';

	/**
	 * Returns the list of permissions ordered by restriction
	 * @return {string[]}
	 */
	static list(): string[] {
		return [Access.ADMIN, Access.OWNER, Access.AUTHENTICATED, Access.GUEST];
	}
}

/** Define the access for each available action */
export interface IAccesses {
	create: string;
	read: string;
	update: string;
	remove: string;
	search: string;
	count: string;

	[s: string]: string;
}

export interface IModel {
	/** @type {string} The model's unique id */
	id: string;
	/** @type {string} The model's name */
	name: string;
	/** @type {IField[]} The fields of the model */
	fields: IField[];
	/** @type IAccesses The model privacy access */
	accesses: IAccesses;
}

export interface ITemplate extends IConfigTemplate {
	/** @type {string} The template's content */
	content: string;
}

export interface IChannel {
	/** @type {string} The channel's unique id */
	id: string;
	/** @type {string} The channel's name */
	name: string;
	/** @type {string} The channel's short description */
	description: string;
	/** @type {string} The channel's logo URL */
	logo: string;
	/** @type {ITemplate[]} The templates of the channel */
	templates: ITemplate[];
	/** @type {string} The channel's validation script */
	validator: string;
}

export interface IPreset {
	/** The preset's unique id */
	id: string;
	/** The preset icon */
	icon: string;
	/** The preset's name */
	name: string;
	/** The preset's name in french */
	name__fr: string;
	/** The preset's name */
	description: string;
	/** The preset's name in french */
	description__fr: string;
	/** The models of the preset */
	models: IModel[];
}

export interface IBoilerplate {
	/** The boilerplate's unique id */
	id: string;
	/** The boilerplate sluh */
	slug: string;
	/** The boilerplate's name */
	name: string;
	/** The boilerplate's repository url */
	git_url: string;
}

export interface IProject {
	/** The project's unique id */
	id: string;
	/** The project's creation date */
	created_at: number;
	/** The project's name */
	name: string;
	/** The project's description */
	description?: string | null;
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
