import { ChannelsService } from './Channels';
import { IField } from '../interface/Generator';
import { IProject } from '../interface/Objects';
import { ApiService } from './Api';
import { ILimits } from '../interface/Config';
export declare class InfoService {
    private channelsService;
    private apiService;
    /** Stores the limits */
    private _limits;
    /** Stores the default fields */
    private _fields;
    constructor(channelsService: ChannelsService, apiService: ApiService);
    /** Get the project once and returns it */
    project(): Promise<IProject>;
    /** Get the default model field from channel */
    fields(): Promise<IField[]>;
    /** Get the limits once and returns them */
    limits(): Promise<ILimits>;
}
