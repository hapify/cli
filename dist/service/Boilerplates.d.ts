import { BoilerplatesCollection } from '../class/BoilerplatesCollection';
export declare class BoilerplatesService {
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns the boilerplates collection
     * @return {BoilerplatesCollection}
     * @throws {Error}
     */
    collection(): Promise<BoilerplatesCollection>;
}
