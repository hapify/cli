import { VersionScope } from '../../../interface/Version';
import { ProjectV1Parser } from './ProjectV1Parser';
import { ProjectV2Parser } from './ProjectV2Parser';
import { Parser } from '../Parser';
import { IStorableCompactProject } from '../../../interface/Storage';
export declare class ProjectParser extends Parser<IStorableCompactProject> {
    protected getScope(): VersionScope;
    protected getWorkersMap(): {
        '1': typeof ProjectV1Parser;
        '2': typeof ProjectV2Parser;
    };
}
