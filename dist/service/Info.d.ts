import { ChannelsService } from './Channels';
import { IField } from '../interface/Generator';
import { IProject } from '../interface/Objects';
export declare class InfoService {
    private channelsService;
    /** Stores the default fields */
    private _fields;
    constructor(channelsService: ChannelsService);
    /** Get the project once and returns it */
    project(): Promise<IProject>;
    /** Get the default model field from channel */
    fields(): Promise<IField[]>;
}
