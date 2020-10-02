import { Channel } from '../class/Channel';
import { IGeneratorResult } from '../interface/Generator';
import { Template } from '../class/Template';
import { Model } from '../class/Model';
export declare class GeneratorService {
    /** Compile for a whole channel */
    runChannel(channel: Channel): Promise<IGeneratorResult[]>;
    /**
     * Compile a template to multiple files.
     * One per model, if applicable.
     */
    runTemplate(template: Template): Promise<IGeneratorResult[]>;
    /**
     * Run generation process for one template/model
     * @throws {Error} If the template needs a model and no model is passed
     */
    run(template: Template, model: Model | null): Promise<IGeneratorResult>;
    /** Compute path from a string */
    pathPreview(path: string, model?: Model | null): Promise<string>;
}
