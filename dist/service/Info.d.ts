import { ChannelsService } from './Channels';
import { IProject, IField } from '../interface';
export declare class InfoService {
    private channelsService;
    /** Stores the default fields */
    private _fields;
    /** Constructor */
    constructor(channelsService: ChannelsService);
    /** Get the project once and returns it */
    project(): Promise<IProject>;
    /** Get the default model field from channel */
    fields(): Promise<IField[]>;
}