import { IStorable } from '../interface/IStorable';
import { ISerializable } from '../interface/ISerializable';
import { IPreset } from '../interface/IObjects';
import { Preset } from './Preset';
import { PresetsApiStorageService } from '../service/storage/api/Presets';
export declare class PresetsCollection implements IStorable, ISerializable<IPreset[], Preset[]> {
    get storageService(): PresetsApiStorageService;
    set storageService(value: PresetsApiStorageService);
    /** @type {Preset[]} The list of preset instances */
    private presets;
    /** Presets storage */
    private _storageService;
    /** @type {string} The loaded instance */
    private static instance;
    /** Constructor */
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(): Promise<PresetsCollection>;
    /**
     * Load the presets
     * @return {Promise<void>}
     */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /**
     * Returns the list of presets
     * @returns {Promise<Preset[]>}
     */
    list(): Promise<Preset[]>;
    /**
     * Returns one preset
     * @returns {Promise<Preset>}
     */
    get(id: string): Promise<Preset>;
    /** @inheritDoc */
    fromObject(object: IPreset[]): Preset[];
    /** @inheritDoc */
    toObject(): IPreset[];
}
