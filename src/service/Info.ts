import { Service } from 'typedi';
import { ChannelsService } from './Channels';
import { IField, IProject } from '../interface/IObjects';

@Service()
export class InfoService {
	/** Stores the default fields */
	private _fields: IField[];

	/** Constructor */
	constructor(private channelsService: ChannelsService) {}

	/** Get the project once and returns it */
	async project(): Promise<IProject> {
		const channel = (await this.channelsService.channels())[0];
		return channel.project.toObject();
	}

	/** Get the default model field from channel */
	async fields(): Promise<IField[]> {
		if (!this._fields) {
			// Get defined fields
			const channels = await this.channelsService.channels();
			const channel = channels.find((c) => !!c.config.defaultFields);
			this._fields = channel ? channel.config.defaultFields : [];
		}
		return this._fields;
	}
}
