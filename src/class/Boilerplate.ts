import { IBoilerplate, ISerializable } from '../interface';

export class Boilerplate implements ISerializable<IBoilerplate, Boilerplate>, IBoilerplate {
	/** The boilerplate's unique id */
	id: string;
	/** The boilerplate sluh */
	slug: string;
	/** The boilerplate's name */
	name: string;
	/** The boilerplate's repository url */
	git_url: string;

	/** Constructor */
	constructor(object?: IBoilerplate) {
		if (object) {
			this.fromObject(object);
		}
	}

	/** @inheritDoc */
	public fromObject(object: IBoilerplate): Boilerplate {
		this.id = object.id;
		this.slug = object.slug;
		this.name = object.name;
		this.git_url = object.git_url;
		return this;
	}

	/** @inheritDoc */
	public toObject(): IBoilerplate {
		return {
			id: this.id,
			slug: this.slug,
			name: this.name,
			git_url: this.git_url,
		};
	}
}
