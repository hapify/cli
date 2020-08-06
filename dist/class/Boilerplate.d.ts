import { ISerializable } from '../interface/Storage';
import { IBoilerplate } from '../interface/Objects';
export declare class Boilerplate implements ISerializable<IBoilerplate, Boilerplate>, IBoilerplate {
    /** The boilerplate's unique id */
    id: string;
    /** The boilerplate slug */
    slug: string;
    /** The boilerplate's name */
    name: string;
    /** The boilerplate's repository url */
    git_url: string;
    /** Constructor */
    constructor(object?: IBoilerplate);
    /** @inheritDoc */
    fromObject(object: IBoilerplate): Boilerplate;
    /** @inheritDoc */
    toObject(): IBoilerplate;
}
