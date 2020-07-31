import { Command } from 'commander';
export interface ChannelDescriptionQuery {
    name?: string;
    description?: string;
    logo?: string;
}
export declare function DescribeChannel(cmd: Command, qChannelDescription: ChannelDescriptionQuery): Promise<void>;
