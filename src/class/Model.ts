import md5 from 'md5';
import { IModel, IField, ISerilizable, Access, IAccesses } from '../interface';
import { Field } from './';

export class Model implements ISerilizable<IModel, Model>, IModel {
	/** @type {string} The model's unique id */
	id: string;
	/** @type {string} The model's name */
	name: string;
	/** @type {Field[]} The fields of the model */
	fields: Field[];
	/** @type IAccesses The model privacy access */
	public accesses: IAccesses = {
		create: Access.GUEST,
		read: Access.GUEST,
		update: Access.GUEST,
		remove: Access.GUEST,
		search: Access.GUEST,
		count: Access.GUEST
	};

	/** Constructor */
	constructor() {}

	/** @inheritDoc */
	public fromObject(object: IModel): Model {
		this.id = object.id;
		this.name = object.name;
		this.fields = object.fields.map(
			(fieldBase: IField): Field => {
				const field = new Field();
				return field.fromObject(fieldBase);
			}
		);
		if (object.accesses) {
			this.accesses = object.accesses;
		}
		return this;
	}

	/** @inheritDoc */
	public toObject(): IModel {
		return {
			id: this.id,
			name: this.name,
			fields: this.fields.map((field: Field): IField => field.toObject()),
			accesses: this.accesses
		};
	}

	/** Create a hash for the model */
	public hash() {
		return md5(JSON.stringify(this.toObject()));
	}

	/**
	 * Randomly generate id
	 *
	 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
	 * @returns {string}
	 */
	static guid(): string {
		function _p8(s?: boolean) {
			const p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}
		return _p8() + _p8(true) + _p8(true) + _p8();
	}
}
