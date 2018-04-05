import { AppContext } from '../../data/app-context';
import { SharedCache, SharedCacheOptions } from '../shared-cache';
import { ServerInventory, ServerInventoryData, ServerInventoryParams } from './server-inventory';
/**
 * Server Inventory cache class.
 */
export declare class ServerInventoryCache extends SharedCache<ServerInventory, ServerInventoryData, ServerInventoryParams> {
    private appContext;
    private static uniqueId;
    private static uniqueVersion;
    /**
     * Create Server Inventory data from the script result data.
     *
     * @param name the name of server node.
     * @param data the PowerShell script result data.
     */
    static createServerInventoryData(name: string, data: any): ServerInventory;
    /**
     * Initializes a new instance of the ServerInventoryCache class.
     *
     * @param appContext the app context.
     * @param options the option of shared cache.
     */
    constructor(appContext: AppContext, options?: SharedCacheOptions);
    /**
     * Defines how to collect the server inventory data.
     *
     * @param params the server inventory query params.
     * @return {string} the Observable of ServerInventory data.
     */
    private dataQuery(params);
    /**
     * Defines how to identify the cache entry by params.
     *
     * @param params the server inventory query params.
     * @return {sting} the id string.
     */
    private dataInstanceId(params);
    /**
     * Defines how to deserialize the class object from serialized data.
     *
     * @param serialized the serialized string;
     */
    private dataDeserialize(serialized);
    /**
     * Defines how to serialize the class object to serialized data.
     *
     * @param instance the class instance.
     */
    private dataSerialize(instance);
}
