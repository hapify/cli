import { ChannelsService } from './Channels';
import { IField } from '../interface/Generator';
import { IProject } from '../interface/Objects';
import { ILimits } from '../interface/Config';
import { AuthenticatedApiService } from './AuthenticatedApi';
export declare class InfoService {
    private channelsService;
    private authenticatedApiService;
    /** Stores the limits */
    private _limits;
    /** Stores the default fields */
    private _fields;
    constructor(channelsService: ChannelsService, authenticatedApiService: AuthenticatedApiService);
    /** Get the project once and returns it */
    project(): Promise<IProject>;
    /** Get the default model field from channel */
    fields(): Promise<IField[]>;
    /** Get the limits once and returns them */
    limits(): Promise<ILimits>;
}
