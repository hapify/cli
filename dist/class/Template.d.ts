import { ISerializable, IStorable } from '../interface/Storage';
import { Engine, Input, ITemplate } from '../interface/Generator';
import { IConfigTemplate } from '../interface/Config';
import { Channel } from './Channel';
export declare class Template implements IStorable, ISerializable<ITemplate, Template>, ITemplate {
    private parent;
    /** Template storage */
    private storageService;
    /** The template's path */
    path: string;
    /** The template's type */
    engine: Engine;
    /** Denotes if the template has to to be ran for one or all models */
    input: Input;
    /** The template's path */
    contentPath: string;
    /** @deprecated Old template paths */
    legacyContentPaths: string[];
    /** The template's content */
    content: string;
    constructor(parent: Channel, object?: ITemplate);
    fromObject(object: ITemplate): Template;
    toObject(): ITemplate;
    /** Denotes if the template should be considered as empty */
    isEmpty(): boolean;
    /** Denotes if the template needs a specific model to be generated */
    needsModel(): boolean;
    /** Get the extension of the input file */
    extension(): string;
    /** Get the parent channel */
    channel(): Channel;
    load(): Promise<void>;
    save(): Promise<void>;
    private findContentPath;
    /** Compute the content path from the dynamic path */
    static computeContentPath(template: Template | IConfigTemplate): string;
    /** @deprecated */
    static computeContentPathV1(template: Template | IConfigTemplate): string;
    /** Compute the extension of the template */
    private static computeExtension;
}
