import { VersionedObject, VersionedObjectParser, VersionScope } from '../../interface/Version';
export declare abstract class Parser<T> {
    private input;
    private worker;
    constructor(input: VersionedObject);
    private initWorker;
    convert(): T;
    protected abstract getScope(): VersionScope;
    protected abstract getWorkersMap(): {
        [key: string]: new () => VersionedObjectParser<T>;
    };
}
