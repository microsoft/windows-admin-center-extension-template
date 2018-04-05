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
import { EnvironmentModuleToolState } from '../../manifest/environment-modules';
import { SharedCache } from '../shared-cache';
import { ToolInventory } from './tool-inventory';
/**
 * Tool Inventory cache class.
 */
var ToolInventoryCache = /** @class */ (function (_super) {
    __extends(ToolInventoryCache, _super);
    /**
     * Initializes a new instance of the ToolInventoryCache class.
     *
     * @param appContext the app context.
     * @param options the option of shared cache.
     */
    function ToolInventoryCache(appContext, options) {
        var _this = _super.call(this, ToolInventoryCache.uniqueId, ToolInventoryCache.uniqueVersion, function (params) { return _this.dataInstanceId(params); }, function (instance) { return _this.dataSerialize(instance); }, function (serialized) { return _this.dataDeserialize(serialized); }, function (params) { return _this.dataQuery(params); }, options) || this;
        _this.appContext = appContext;
        return _this;
    }
    /**
     * Defines how to collect the tool inventory data.
     *
     * @param params the server inventory query params.
     * @return {string} the Observable of ServerInventory data.
     */
    ToolInventoryCache.prototype.dataQuery = function (params) {
        var psSession = this.appContext.powerShell.createSession(params.name, null, params.requestOptions);
        return this.appContext.powerShell.run(psSession, params.command ? { command: params.command, script: params.script } : params.script)
            .map(function (data) {
            var inventory = new ToolInventory(params.name);
            if (data && data.results && data.results.length > 0) {
                var result = data.results[0];
                inventory.name = params.name;
                inventory.id = params.id;
                switch (result.state) {
                    case EnvironmentModuleToolState[EnvironmentModuleToolState.Available]:
                        inventory.state = EnvironmentModuleToolState.Available;
                        break;
                    case EnvironmentModuleToolState[EnvironmentModuleToolState.NotConfigured]:
                        inventory.state = EnvironmentModuleToolState.NotConfigured;
                        break;
                    case EnvironmentModuleToolState[EnvironmentModuleToolState.NotSupported]:
                    default:
                        inventory.state = EnvironmentModuleToolState.NotSupported;
                        break;
                }
                inventory.message = result.message;
                inventory.properties = [];
                var properties = result.properties;
                for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                    var pair = properties_1[_i];
                    inventory.properties.push(pair);
                }
            }
            return inventory;
        });
    };
    /**
     * Defines how to identify the cache entry by params.
     *
     * @param params the tool inventory query params.
     * @return {sting} the id string.
     */
    ToolInventoryCache.prototype.dataInstanceId = function (params) {
        return params.name + ":" + params.id;
    };
    /**
     * Defines how to deserialize the class object from seralized data.
     *
     * @param serialized the serialized string;
     */
    ToolInventoryCache.prototype.dataDeserialize = function (serialized) {
        var inventory = JSON.parse(serialized);
        return new ToolInventory(inventory.name, inventory);
    };
    /**
     * Defines how to serialize the class object to seralized data.
     *
     * @param instance the class instance.
     */
    ToolInventoryCache.prototype.dataSerialize = function (instance) {
        // automatically stripped out class related data.
        return JSON.stringify(instance);
    };
    ToolInventoryCache.uniqueId = '@msft-sme/shell:toolInventory';
    ToolInventoryCache.uniqueVersion = 0;
    return ToolInventoryCache;
}(SharedCache));
export { ToolInventoryCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL3Rvb2wtaW52ZW50b3J5L3Rvb2wtaW52ZW50b3J5LWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsV0FBVyxFQUFzQixNQUFNLGlCQUFpQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxhQUFhLEVBQWlFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEg7O0dBRUc7QUFDSDtJQUF3QyxzQ0FBa0U7SUFJdEc7Ozs7O09BS0c7SUFDSCw0QkFBb0IsVUFBc0IsRUFBRSxPQUE0QjtRQUF4RSxZQUNJLGtCQUNJLGtCQUFrQixDQUFDLFFBQVEsRUFDM0Isa0JBQWtCLENBQUMsYUFBYSxFQUNoQyxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQTNCLENBQTJCLEVBQ3ZDLFVBQUMsUUFBUSxJQUFLLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBNUIsQ0FBNEIsRUFDMUMsVUFBQyxVQUFVLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFoQyxDQUFnQyxFQUNoRCxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQXRCLENBQXNCLEVBQ2xDLE9BQU8sQ0FBQyxTQUNmO1FBVG1CLGdCQUFVLEdBQVYsVUFBVSxDQUFZOztJQVMxQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxzQ0FBUyxHQUFqQixVQUFrQixNQUEyQjtRQUN6QyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQ2pDLFNBQVMsRUFDVCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDbkYsR0FBRyxDQUFDLFVBQUMsSUFBUztZQUNYLElBQU0sU0FBUyxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixTQUFTLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQzdCLFNBQVMsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDekIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEtBQUssMEJBQTBCLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDO3dCQUNqRSxTQUFTLENBQUMsS0FBSyxHQUFHLDBCQUEwQixDQUFDLFNBQVMsQ0FBQzt3QkFDdkQsS0FBSyxDQUFDO29CQUNWLEtBQUssMEJBQTBCLENBQUMsMEJBQTBCLENBQUMsYUFBYSxDQUFDO3dCQUNyRSxTQUFTLENBQUMsS0FBSyxHQUFHLDBCQUEwQixDQUFDLGFBQWEsQ0FBQzt3QkFDM0QsS0FBSyxDQUFDO29CQUNWLEtBQUssMEJBQTBCLENBQUMsMEJBQTBCLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3pFO3dCQUNJLFNBQVMsQ0FBQyxLQUFLLEdBQUcsMEJBQTBCLENBQUMsWUFBWSxDQUFDO3dCQUMxRCxLQUFLLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxTQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ25DLFNBQVMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixJQUFNLFVBQVUsR0FBNEIsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDOUQsR0FBRyxDQUFDLENBQWEsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO29CQUF0QixJQUFJLElBQUksbUJBQUE7b0JBQ1QsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ25DO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSywyQ0FBYyxHQUF0QixVQUF1QixNQUEyQjtRQUM5QyxNQUFNLENBQUksTUFBTSxDQUFDLElBQUksU0FBSSxNQUFNLENBQUMsRUFBSSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssNENBQWUsR0FBdkIsVUFBd0IsVUFBa0I7UUFDdEMsSUFBTSxTQUFTLEdBQXNCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSywwQ0FBYSxHQUFyQixVQUFzQixRQUF1QjtRQUN6QyxpREFBaUQ7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQTFGYywyQkFBUSxHQUFHLCtCQUErQixDQUFDO0lBQzNDLGdDQUFhLEdBQUcsQ0FBQyxDQUFDO0lBMEZyQyx5QkFBQztDQTVGRCxBQTRGQyxDQTVGdUMsV0FBVyxHQTRGbEQ7U0E1Rlksa0JBQWtCIiwiZmlsZSI6InRvb2wtaW52ZW50b3J5LWNhY2hlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==