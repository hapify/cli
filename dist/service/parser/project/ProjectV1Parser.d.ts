import { VersionedObjectParser } from '../../../interface/Version';
import { IStorableCompactProject } from '../../../interface/Storage';
import { IV1StorableCompactProject } from '../../../interface/legacy/v1/Storage';
export declare class ProjectV1Parser implements VersionedObjectParser<IStorableCompactProject> {
    convert(input: IV1StorableCompactProject): IStorableCompactProject;
}
