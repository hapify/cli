import { VersionedObjectParser } from '../../../interface/Version';
import { IStorableCompactProject } from '../../../interface/Storage';
export declare class ProjectV2Parser implements VersionedObjectParser<IStorableCompactProject> {
    convert(input: IStorableCompactProject): IStorableCompactProject;
}
