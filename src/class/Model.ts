import { IModel, ISerializable, Access, IAccesses } from '../interface';
import { Field } from './';

/** Random function */
function _p8(s?: boolean) {
	const p = (Math.random().toString(16) + '000000000').substr(2, 8);
	return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
}

export class Model implements ISerializable<IModel, Model>, IModel {
	/** @type {string} The model's unique id */
	id: string;
	/** @type {string} The model's name */
	name: string;
	/** @type {string} The model's notes */
	notes?: string;
	/** @type {Field[]} The fields of the model */
	fields: Field[];
	/** @type IAccesses The model privacy access */
	accesses: IAccesses;

	/** Constructor */
	constructor(object?: IModel) {
		if (object) {
			this.fromObject(object);
		}
	}

	/** @inheritDoc */
	public fromObject(object: IModel): Model {
		this.id = object.id;
		this.name = object.name;
		this.notes = object.notes || null;
		this.fields = object.fields.map((f) => new Field(f));
		this.accesses = object.accesses;
		return this;
	}

	/** @inheritDoc */
	public toObject(): IModel {
		return {
			id: this.id,
			name: this.name,
			notes: this.notes || null,
			fields: this.fields.map((f) => f.toObject()),
			accesses: this.accesses,
		};
	}

	/**
	 * Randomly generate id
	 *
	 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
	 * @returns {string}
	 */
	static generateTempId(): string {
		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	/** Get default accesses */
	static defaultAccesses(): IAccesses {
		return {
			create: Access.GUEST,
			read: Access.GUEST,
			update: Access.GUEST,
			remove: Access.GUEST,
			search: Access.GUEST,
			count: Access.GUEST,
		};
	}

	/** Clone the model to a new reference */
	public clone(newId: boolean): Model {
		const object = this.toObject();
		if (newId) {
			object.id = Model.generateTempId();
		}
		return new Model(object);
	}
}
