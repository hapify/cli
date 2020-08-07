export declare type FilePath = string | string[];
export declare function JoinPath(path: FilePath): string;
export declare abstract class SingleSaveFileStorage<T> {
    /** The template's content's md5 hash */
    private contentMd5;
    /** Load content from path */
    get(path: FilePath): Promise<T>;
    /** Load content from path */
    set(path: FilePath, input: T): Promise<void>;
    /** Check if the resource exists */
    exists(path: FilePath): boolean;
    /** Resolve path */
    resolve(path: FilePath): string;
    /** Convert content to string before saving */
    protected abstract serialize(content: T): Promise<string>;
    /** Convert content to string before saving */
    protected abstract deserialize(content: string): Promise<T>;
    /** Should be called after loading to hash the content */
    protected didLoad(bucket: string, data: string): void;
    /**
     * Denotes if the data has changed and update the hash if necessary
     * This method should not be called twice at the same time as it updates the hash.
     */
    protected shouldSave(bucket: string, data: string): boolean;
}
