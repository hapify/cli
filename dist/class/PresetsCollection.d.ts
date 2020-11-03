import { ISerializable, IStorable } from '../interface/Storage';
import { IPreset } from '../interface/Objects';
import { Preset } from './Preset';
import { PresetsApiStorageService } from '../service/storage/api/Presets';
export declare class PresetsCollection implements IStorable, ISerializable<IPreset[], Preset[]> {
    get storageService(): PresetsApiStorageService;
    set storageService(value: PresetsApiStorageService);
    /** The list of preset instances */
    private presets;
    /** Presets storage */
    private _storageService;
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(): Promise<PresetsCollection>;
    /** Load the presets */
    load(): Promise<void>;
    save(): Promise<void>;
    /** Returns the list of presets */
    list(): Promise<Preset[]>;
    /** Returns one preset */
    get(id: string): Promise<Preset>;
    fromObject(object: IPreset[]): Preset[];
    toObject(): IPreset[];
}
