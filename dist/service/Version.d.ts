import { CurrentVersions, VersionScope } from '../interface/Version';
export declare class VersionService {
    private supportedVersions;
    private currentVersions;
    constructor();
    ensureVersionIsSupported(scope: VersionScope, version: string): void;
    getCurrentVersion<T extends VersionScope>(scope: T): CurrentVersions[T];
}
