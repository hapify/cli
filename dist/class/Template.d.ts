import { IStorable } from '../interface/IStorable';
import { ISerializable } from '../interface/ISerializable';
import { IConfigTemplate, ITemplate } from '../interface/IObjects';
import { Channel } from './Channel';
export declare class Template implements IStorable, ISerializable<ITemplate, Template>, ITemplate {
    private parent;
    /** @type {string} */
    private static defaultFolder;
    /** Template storage */
    private storageService;
    /** @type {string} The template's path */
    path: string;
    /** @type {string} The template's type */
    engine: string;
    /** @type {string} Denotes if the template has to to be ran for one or all models */
    input: string;
    /** @type {string} The template's path */
    contentPath: string;
    /** @type {string} The template's content */
    content: string;
    /** Constructor */
    constructor(parent: Channel, object?: ITemplate);
    /** @inheritDoc */
    fromObject(object: ITemplate): Template;
    /** @inheritDoc */
    toObject(): ITemplate;
    /**
     * Denotes if the template should be considered as empty
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Denotes if the template needs a specific model to be generated
     * @returns {boolean}
     */
    needsModel(): boolean;
    /**
     * Get the extension of the input file
     * @returns {string}
     */
    extension(): string;
    /**
     * Get the parent channel
     * @returns {Channel}
     */
    channel(): Channel;
    /** @inheritDoc */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /**
     * Check resource validity
     * @throws {Error}
     */
    private validate;
    /**
     * Compute the content path from the dynamic path
     * @param {Template|IConfigTemplate} template
     * @return {string}
     */
    static computeContentPath(template: Template | IConfigTemplate): string;
    /**
     * Compute the extension of the template
     * @param {Template|IConfigTemplate} template
     * @return {string}
     */
    private static computeExtension;
}
