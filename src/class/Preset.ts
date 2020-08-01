import { ISerializable } from '../interface/ISerializable';
import { IPreset } from '../interface/IObjects';
import { Model } from './Model';

export class Preset implements ISerializable<IPreset, Preset>, IPreset {
	/** @type {string} The preset's unique id */
	id: string;
	/** @type {string} The preset icon */
	icon: string;
	/** @type {string} The preset's name */
	name: string;
	/** @type {string} The preset's name in french */
	name__fr: string;
	/** @type {string} The preset's name */
	description: string;
	/** @type {string} The preset's name in french */
	description__fr: string;
	/** @type {Model[]} The models of the model */
	models: Model[];

	/** Constructor */
	constructor(object?: IPreset) {
		if (object) {
			this.fromObject(object);
		}
	}

	/** @inheritDoc */
	public fromObject(object: IPreset): Preset {
		this.id = object.id;
		this.icon = object.icon;
		this.name = object.name;
		this.name__fr = object.name__fr;
		this.description = object.description;
		this.description__fr = object.description__fr;
		this.models = object.models.map((m) => new Model(m));
		return this;
	}

	/** @inheritDoc */
	public toObject(): IPreset {
		return {
			id: this.id,
			icon: this.icon,
			name: this.name,
			name__fr: this.name__fr,
			description: this.description,
			description__fr: this.description__fr,
			models: this.models.map((m) => m.toObject()),
		};
	}
}
