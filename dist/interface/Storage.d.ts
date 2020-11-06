import { IModel } from './Generator';
import { Accesses, FieldSubType, FieldType } from '@hapify/generator/dist/interfaces';
/** Represent a class that can be stringified and un-stringified */
export interface ISerializable<IT, T> {
    /**
     * Bind properties from the base object to this object
     *  Returns this
     */
    fromObject(object: IT): T;
    /** Convert the instance to an object */
    toObject(): IT;
}
/** Represent a class that can be loaded and saved */
export interface IStorable {
    load(): Promise<void>;
    save(): Promise<void>;
}
/** Represent a class that can be loaded and saved */
export interface IStorageService<T> {
    /** List items */
    list(query: any): Promise<T[]>;
    /** List items */
    get(id: any): Promise<T>;
}
export declare type StorageType = 'local' | 'remote';
/** Represents the detailed description of a project */
export interface IStorableProject {
    /** The project's configuration version */
    version: string;
    /** The project's name */
    name?: string;
    /** The project's description */
    description?: string;
    /** The project's model list */
    models: IModel[];
}
/** Represents the compact description of a project */
export interface IStorableCompactProject {
    /** The project's configuration version */
    version: string;
    /** The project's name */
    name?: string;
    /** The project's description */
    description?: string;
    /** The project's model list */
    models: IStorableCompactModel[];
}
/** Represents the compact description of a model */
export interface IStorableCompactModel {
    /** The model's unique id */
    id: string;
    /** The model's name */
    name: string;
    /** The model privacy access */
    accesses: Accesses;
    /** The fields of the model */
    fields: IStorableCompactField[];
    /** The model's notes */
    notes?: string;
}
/** Represents the compact description of a model */
export interface IStorableCompactField {
    /** The field's name */
    name: string;
    /** The field's type */
    type: FieldType;
    /** The field's subtype */
    subtype?: FieldSubType;
    /** The field's reference if the type is entity. The GUID string of the targeted model */
    reference?: string;
    /** List of boolean properties */
    properties: CompactFieldBooleanProperty[];
    /** The field's notes */
    notes?: string;
}
/** Keys of field's boolean properties */
export declare type CompactFieldBooleanProperty = 'primary' | 'unique' | 'label' | 'nullable' | 'multiple' | 'embedded' | 'searchable' | 'sortable' | 'hidden' | 'internal' | 'restricted' | 'ownership';
