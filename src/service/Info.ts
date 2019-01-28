import { Container, Service } from 'typedi';
import { ApiService } from './Api';
import { ChannelsService } from './Channels';
import { ILimits, IProject, IField } from '../interface';

@Service()
export class InfoService {
	/** Stores the project instance */
	private _project: IProject;
	/** Stores the default fields */
	private _fields: IField[];
	/** Stores the limits */
	private _limits: ILimits;

	/** Service to call remote API */
	private apiService: ApiService;

	/** Constructor */
	constructor(private channelsService: ChannelsService) {}

	/** Load and returns API Service. Avoid circular dependency */
	api() {
		if (typeof this.apiService === 'undefined') {
			this.apiService = Container.get(ApiService);
		}
		return this.apiService;
	}

	/** Get the project once and returns it */
	async project(): Promise<IProject> {
		if (!this._project) {
			const channel = (await this.channelsService.channels())[0];
			this._project = (await this.api().get(
				`project/${channel.config.project}`
			)).data;
		}
		return this._project;
	}

	/** Get the limits once and returns them */
	async limits(): Promise<ILimits> {
		if (!this._limits) {
			this._limits = (await this.api().get('generator/limits')).data;
		}
		return this._limits;
	}

	/** Get the default model field from channel */
	async fields(): Promise<IField[]> {
		if (!this._fields) {
			// Get defined fields
			const channels = await this.channelsService.channels();
			const channel = channels.find(c => !!c.defaultFields);
			this._fields = channel ? channel.defaultFields : [];
		}
		return this._fields;
	}
}
