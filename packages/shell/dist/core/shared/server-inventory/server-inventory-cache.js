var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { PowerShellScripts } from '../../../generated/powershell-scripts';
import { SharedCache } from '../shared-cache';
import { ServerInventory } from './server-inventory';
/**
 * Server Inventory cache class.
 */
var ServerInventoryCache = /** @class */ (function (_super) {
    __extends(ServerInventoryCache, _super);
    /**
     * Initializes a new instance of the ServerInventoryCache class.
     *
     * @param appContext the app context.
     * @param options the option of shared cache.
     */
    function ServerInventoryCache(appContext, options) {
        var _this = _super.call(this, ServerInventoryCache.uniqueId, ServerInventoryCache.uniqueVersion, function (params) { return _this.dataInstanceId(params); }, function (instance) { return _this.dataSerialize(instance); }, function (serialized) { return _this.dataDeserialize(serialized); }, function (params) { return _this.dataQuery(params); }, options) || this;
        _this.appContext = appContext;
        return _this;
    }
    /**
     * Create Server Inventory data from the script result data.
     *
     * @param name the name of server node.
     * @param data the PowerShell script result data.
     */
    ServerInventoryCache.createServerInventoryData = function (name, data) {
        var inventory = new ServerInventory(name);
        if (data && data.results && data.results.length > 0) {
            var result = data.results[0];
            var operatingSystem = result.operatingSystem;
            var computerSystem = result.computerSystem;
            inventory.isAdministrator = result.isAdministrator;
            inventory.isWmfInstalled = result.isWmfInstalled;
            inventory.name = operatingSystem.csName ? operatingSystem.csName.toString().toLowerCase() : null;
            inventory.operatingSystemName = operatingSystem.caption;
            inventory.operatingSystemSKU = operatingSystem.operatingSystemSKU;
            inventory.operatingSystemVersion = operatingSystem.version;
            inventory.productType = operatingSystem.productType;
            inventory.totalPhysicalMemory = computerSystem.totalPhysicalMemory;
            inventory.domainRole = computerSystem.domainRole;
            inventory.computerManufacturer = computerSystem.manufacturer;
            inventory.computerModel = computerSystem.model;
            inventory.totalLogicalProcessors = computerSystem.numberOfLogicalProcessors;
            if (computerSystem.partOfDomain) {
                inventory.domainName = computerSystem.domain;
            }
            else {
                inventory.workgroupName = computerSystem.workgroup;
            }
            inventory.fullyQualifiedDomainName = result.fqdn.toLowerCase();
            inventory.clusterFqdn = result.clusterFqdn ? result.clusterFqdn.toLowerCase() : null;
            inventory.isCluster = result.isCluster;
            inventory.isManagementToolsAvailable = result.isManagementToolsAvailable;
            inventory.isServerManagerAvailable = result.isServerManagerAvailable;
            inventory.isTsdbEnabled = result.isTsdbEnabled;
            inventory.isHyperVRoleInstalled = result.isHyperVRoleInstalled;
            inventory.isHyperVPowershellInstalled = result.isHyperVPowershellInstalled;
        }
        return inventory;
    };
    /**
     * Defines how to collect the server inventory data.
     *
     * @param params the server inventory query params.
     * @return {string} the Observable of ServerInventory data.
     */
    ServerInventoryCache.prototype.dataQuery = function (params) {
        var psSession = this.appContext.powerShell.createSession(params.name, null, params.requestOptions);
        return this.appContext.powerShell.run(psSession, PowerShellScripts.Get_ServerInventory)
            .map(function (data) { return ServerInventoryCache.createServerInventoryData(params.name, data); });
    };
    /**
     * Defines how to identify the cache entry by params.
     *
     * @param params the server inventory query params.
     * @return {sting} the id string.
     */
    ServerInventoryCache.prototype.dataInstanceId = function (params) {
        return params.name;
    };
    /**
     * Defines how to deserialize the class object from serialized data.
     *
     * @param serialized the serialized string;
     */
    ServerInventoryCache.prototype.dataDeserialize = function (serialized) {
        var inventory = JSON.parse(serialized);
        return new ServerInventory(inventory.serverName, inventory);
    };
    /**
     * Defines how to serialize the class object to serialized data.
     *
     * @param instance the class instance.
     */
    ServerInventoryCache.prototype.dataSerialize = function (instance) {
        // automatically stripped out class related data.
        return JSON.stringify(instance);
    };
    ServerInventoryCache.uniqueId = '@msft-sme/shell:serverInventory';
    ServerInventoryCache.uniqueVersion = 11;
    return ServerInventoryCache;
}(SharedCache));
export { ServerInventoryCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL3NlcnZlci1pbnZlbnRvcnkvc2VydmVyLWludmVudG9yeS1jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFHMUUsT0FBTyxFQUFFLFdBQVcsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUE4QyxNQUFNLG9CQUFvQixDQUFDO0FBRWpHOztHQUVHO0FBQ0g7SUFBMEMsd0NBQXdFO0lBZ0Q5Rzs7Ozs7T0FLRztJQUNILDhCQUFvQixVQUFzQixFQUFFLE9BQTRCO1FBQXhFLFlBQ0ksa0JBQ0ksb0JBQW9CLENBQUMsUUFBUSxFQUM3QixvQkFBb0IsQ0FBQyxhQUFhLEVBQ2xDLFVBQUMsTUFBTSxJQUFLLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBM0IsQ0FBMkIsRUFDdkMsVUFBQyxRQUFRLElBQUssT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUE1QixDQUE0QixFQUMxQyxVQUFDLFVBQVUsSUFBSyxPQUFBLEtBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQWhDLENBQWdDLEVBQ2hELFVBQUMsTUFBTSxJQUFLLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBdEIsQ0FBc0IsRUFDbEMsT0FBTyxDQUFDLFNBQ2Y7UUFUbUIsZ0JBQVUsR0FBVixVQUFVLENBQVk7O0lBUzFDLENBQUM7SUEzREQ7Ozs7O09BS0c7SUFDVyw4Q0FBeUIsR0FBdkMsVUFBd0MsSUFBWSxFQUFFLElBQVM7UUFDM0QsSUFBTSxTQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FB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LHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQWpFLENBQWlFLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyw2Q0FBYyxHQUF0QixVQUF1QixNQUE2QjtRQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLDhDQUFlLEdBQXZCLFVBQXdCLFVBQWtCO1FBQ3RDLElBQU0sU0FBUyxHQUF3QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssNENBQWEsR0FBckIsVUFBc0IsUUFBeUI7UUFDM0MsaURBQWlEO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUF4R2MsNkJBQVEsR0FBRyxpQ0FBaUMsQ0FBQztJQUM3QyxrQ0FBYSxHQUFHLEVBQUUsQ0FBQztJQXdHdEMsMkJBQUM7Q0ExR0QsQUEwR0MsQ0ExR3lDLFdBQVcsR0EwR3BEO1NBMUdZLG9CQUFvQiIsImZpbGUiOiJzZXJ2ZXItaW52ZW50b3J5LWNhY2hlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==