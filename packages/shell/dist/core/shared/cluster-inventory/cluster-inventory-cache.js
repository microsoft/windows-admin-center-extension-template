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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs';
import { PowerShellScripts } from '../../../generated/powershell-scripts';
import { ServerInventoryCache } from '../server-inventory/server-inventory-cache';
import { SharedCache } from '../shared-cache';
import { ClusterInventory } from './cluster-inventory';
import { ClusterNodeInventory } from './cluster-node-inventory';
/**
 * Cluster Inventory cache class.
 */
var ClusterInventoryCache = /** @class */ (function (_super) {
    __extends(ClusterInventoryCache, _super);
    /**
     * Initializes a new instance of the ClusterInventoryCache class.
     *
     * @param appContext the app context.
     * @param options the option of shared cache.
     */
    function ClusterInventoryCache(appContext, options) {
        var _this = _super.call(this, ClusterInventoryCache.uniqueId, ClusterInventoryCache.uniqueVersion, function (params) { return _this.dataInstanceId(params); }, function (instance) { return _this.dataSerialize(instance); }, function (serialized) { return _this.dataDeserialize(serialized); }, function (params) { return _this.dataQuery(params); }, options) || this;
        _this.appContext = appContext;
        _this.serverInventoryCache = new ServerInventoryCache(appContext);
        return _this;
    }
    /**
     * Defines how to identify the cache entry by params.
     *
     * @param params the server inventory query params.
     * @return {sting} the id string.
     */
    ClusterInventoryCache.prototype.dataInstanceId = function (params) {
        return params.name;
    };
    /**
     * Defines how to deserialize the class object from serialized data.
     *
     * @param serialized the serialized string;
     */
    ClusterInventoryCache.prototype.dataDeserialize = function (serialized) {
        var inventory = JSON.parse(serialized);
        return new ClusterInventory(inventory.clusterName, inventory);
    };
    /**
     * Defines how to serialize the class object to serialized data.
     *
     * @param instance the class instance.
     */
    ClusterInventoryCache.prototype.dataSerialize = function (instance) {
        // automatically stripped out class related data.
        return JSON.stringify(instance);
    };
    /**
     * Defines how to collect the cluster inventory data.
     *
     * @param params the server inventory query params.
     * @return {string} the Observable of ClusterInventory data.
     */
    ClusterInventoryCache.prototype.dataQuery = function (params) {
        var _this = this;
        // options object will be updated at the http layer, so it makes an each copy before passing.
        var options = __assign({}, params.requestOptions);
        var clusterPsSession = this.appContext.powerShell.createSession(params.name, null, options);
        var clusterNodePsSession = this.appContext.powerShell.createSession(params.name, null, options);
        return Observable.zip(this.appContext.powerShell.run(clusterPsSession, PowerShellScripts.Get_ClusterInventory), this.appContext.powerShell.run(clusterNodePsSession, PowerShellScripts.Get_ClusterNodes))
            .map(function (_a) {
            var cluster = _a[0], nodes = _a[1];
            var inventory = new ClusterInventory(params.name);
            if (!cluster || !cluster.results || cluster.results.length === 0) {
                return inventory;
            }
            if (!nodes || !nodes.results || nodes.results.length === 0) {
                return inventory;
            }
            var nodesResult = nodes.results[0];
            var clusterResult = cluster.results[0];
            var nodesResultLower = {};
            // make node name and fqdn are all lower casing.
            inventory.isClusterCmdletAvailable = clusterResult.isClusterCmdletAvailable;
            clusterResult.fqdn = clusterResult.fqdn.toLowerCase();
            inventory.fqdn = clusterResult.fqdn;
            inventory.currentClusterNode = clusterResult.currentClusterNode.toLowerCase();
            inventory.nodeNames = [];
            for (var node in nodesResult) {
                if (node && nodesResult[node] && nodesResult[node].name) {
                    nodesResult[node].name = nodesResult[node].name.toLowerCase();
                    nodesResult[node].fullyQualifiedDomainName = nodesResult[node].fullyQualifiedDomainName.toLowerCase();
                    inventory.nodeNames.push(nodesResult[node].name);
                    var nodeLower = node.toLowerCase();
                    nodesResultLower[nodeLower] = nodesResult[node];
                }
            }
            inventory.isS2dEnabled = clusterResult.isS2DEnabled;
            inventory.isBritannicaEnabled = clusterResult.isBritannicaEnabled;
            inventory.isClusterHealthCmdletAvailable = clusterResult.isClusterHealthCmdletAvailable;
            inventory.isHyperVPowershellInstalled = false;
            inventory.isHyperVRoleInstalled = false;
            inventory.isManagementToolsAvailable = false;
            inventory.isTsdbEnabled = false;
            inventory.nodeMap = nodesResultLower;
            return inventory;
        })
            .flatMap(function (inventory) { return _this.queryClusterNodeInventories(inventory, params); });
    };
    /**
     * Defines how to collect the cluster node-server inventory data.
     * @param clusterInventory  the initial cluster inventory query params.
     * @param params the parameters for cluster inventory query.
     * @return Observable<ClusterInventory> the Observable of ClusterInventory data.
     */
    ClusterInventoryCache.prototype.queryClusterNodeInventories = function (clusterInventory, params) {
        var _this = this;
        if (!clusterInventory.nodeNames || clusterInventory.nodeNames.length === 0) {
            return Observable.of(clusterInventory);
        }
        var serverNames = clusterInventory.nodeNames.map(function (nodeName) { return clusterInventory.nodeMap[nodeName].fullyQualifiedDomainName; });
        var authToken = this.appContext.authorizationManager.getSavedNodeToken(params.name);
        var options = {};
        if (params.requestOptions) {
            options = __assign({}, params.requestOptions);
            if (options.authToken == null && authToken) {
                // override auth token if not there.
                options.authToken = authToken;
            }
        }
        else if (authToken) {
            options.authToken = authToken;
        }
        var batchSession = this.appContext.powerShell.createBatchSession(serverNames, null, options);
        return this.appContext.powerShell.runBatchSingleCommand(batchSession, PowerShellScripts.Get_ServerInventory)
            .map(function (responseItems) {
            for (var index = 0; index < responseItems.length; index++) {
                var currentServer = serverNames[index];
                var serverNameParts = currentServer.split('.');
                var serverName = serverNameParts.length > 1 ? serverNameParts[0] : currentServer;
                var response = responseItems[index];
                if (response.error || response.errors) {
                    // send back the first error.
                    var message = (response.error && response.error.message) ||
                        (response.errors && response.errors[0] && response.errors[0].message);
                    throw new Error(message);
                }
                var data = response.properties;
                var serverInventory = ServerInventoryCache.createServerInventoryData(serverName, data);
                _this.serverInventoryCache.save({ name: serverName }, serverInventory);
                var inventoryServerName = clusterInventory.nodeMap[clusterInventory.currentClusterNode].name;
                if (serverName === inventoryServerName) {
                    clusterInventory.isHyperVPowershellInstalled = serverInventory.isHyperVPowershellInstalled;
                    clusterInventory.isHyperVRoleInstalled = serverInventory.isHyperVRoleInstalled;
                    clusterInventory.isManagementToolsAvailable = serverInventory.isManagementToolsAvailable;
                    clusterInventory.isTsdbEnabled = serverInventory.isTsdbEnabled;
                }
                // combine cluster node inventory and server inventory
                var clusterNodeInventory = new ClusterNodeInventory(serverName);
                var clusterServerInventory = clusterInventory.nodeMap[serverName];
                Object.assign(clusterNodeInventory, serverInventory);
                for (var property in clusterServerInventory) {
                    if (property) {
                        clusterNodeInventory[property] = clusterServerInventory[property];
                    }
                }
                clusterInventory.nodeMap[serverName] = clusterNodeInventory;
            }
            return clusterInventory;
        });
    };
    ClusterInventoryCache.uniqueId = '@msft-sme/shell:clusterInventory';
    ClusterInventoryCache.uniqueVersion = 1; // increment this if you make breaking changes
    return ClusterInventoryCache;
}(SharedCache));
export { ClusterInventoryCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL2NsdXN0ZXItaW52ZW50b3J5L2NsdXN0ZXItaW52ZW50b3J5LWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFPMUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEYsT0FBTyxFQUFFLFdBQVcsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQWdELE1BQU0scUJBQXFCLENBQUM7QUFDckcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEU7O0dBRUc7QUFDSDtJQUEyQyx5Q0FBMkU7SUFNbEg7Ozs7O09BS0c7SUFDSCwrQkFBb0IsVUFBc0IsRUFBRSxPQUE0QjtRQUF4RSxZQUNJLGtCQUNJLHFCQUFxQixDQUFDLFFBQVEsRUFDOUIscUJBQXFCLENBQUMsYUFBYSxFQUNuQyxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQTNCLENBQTJCLEVBQ3ZDLFVBQUMsUUFBUSxJQUFLLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBNUIsQ0FBNEIsRUFDMUMsVUFBQyxVQUFVLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFoQyxDQUFnQyxFQUNoRCxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQXRCLENBQXNCLEVBQ2xDLE9BQU8sQ0FBQyxTQUdmO1FBWG1CLGdCQUFVLEdBQVYsVUFBVSxDQUFZO1FBVXRDLEtBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFD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QyxDQUFDO2dCQUM3QixDQUFDO2dCQUVELElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQ2pDLElBQU0sZUFBZSxHQUFHLG9CQUFvQixDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFekYsS0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFdEUsSUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBRS9GLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLGdCQUFnQixDQUFDLDJCQUEyQixHQUFHLGVBQWUsQ0FBQywyQkFBMkIsQ0FBQztvQkFDM0YsZ0JBQWdCLENBQUMscUJBQXFCLEdBQUcsZUFBZSxDQUFDLHFCQUFxQixDQUFDO29CQUMvRSxnQkFBZ0IsQ0FBQywwQkFBMEIsR0FBRyxlQUFlLENBQUMsMEJBQTBCLENBQUM7b0JBQ3pGLGdCQUFnQixDQUFDLGFBQWEsR0FBRyxlQUFlLENBQUMsYUFBYSxDQUFDO2dCQUNuRSxDQUFDO2dCQUVELHNEQUFzRDtnQkFDdEQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRSxJQUFNLHNCQUFzQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFckQsR0FBRyxDQUFDLENBQUMsSUFBTSxRQUFRLElBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNYLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxHQUFHLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN0RSxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLG9CQUFvQixDQUFDO1lBQ2hFLENBQUM7WUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBNUxjLDhCQUFRLEdBQUcsa0NBQWtDLENBQUM7SUFDOUMsbUNBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7SUE0THBGLDRCQUFDO0NBOUxELEFBOExDLENBOUwwQyxXQUFXLEdBOExyRDtTQTlMWSxxQkFBcUIiLCJmaWxlIjoiY2x1c3Rlci1pbnZlbnRvcnktY2FjaGUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9