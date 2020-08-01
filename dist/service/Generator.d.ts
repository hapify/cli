import { ApiService } from './Api';
import { ILimits } from '../interface/IObjects';
import { Channel } from '../class/Channel';
import { IGeneratorResult } from '../interface/IGeneratorResult';
import { Template } from '../class/Template';
import { Model } from '../class/Model';
export declare class GeneratorService {
    /** Service to call remote API */
    private apiService;
    /** Stores the limits */
    private _limits;
    /** Constructor */
    constructor();
    /** Load and returns API Service. Avoid circular dependency */
    api(): ApiService;
    /** Get the limits once and returns them */
    limits(): Promise<ILimits>;
    /**
     * Compile for a whole channel
     * @param {Channel} channel
     * @returns {Promise<IGeneratorResult[]>}
     */
    runChannel(channel: Channel): Promise<IGeneratorResult[]>;
    /**
     * Compile a template to multiple files.
     * One per model, if applicable.
     *
     * @param {Template} template
     * @returns {Promise<IGeneratorResult[]>}
     */
    runTemplate(template: Template): Promise<IGeneratorResult[]>;
    /**
     * Run generation process for one model
     *
     * @param {Template} template
     * @param {Model|null} model
     * @returns {Promise<IGeneratorResult>}
     * @throws {Error}
     *  If the template needs a model and no model is passed
     */
    run(template: Template, model: Model | null): Promise<IGeneratorResult>;
    /**
     * Compute path from a string
     *
     * @param {string} path
     * @param {Model|null} model
     *  Default null
     * @returns {string}
     */
    pathPreview(path: string, model?: Model | null): Promise<string>;
}
