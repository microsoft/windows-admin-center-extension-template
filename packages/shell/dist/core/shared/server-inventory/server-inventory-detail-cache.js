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
import { Cim } from '../../data/cim';
import { SharedCache } from '../shared-cache';
import { ServerInventoryDetail } from './server-inventory-detail';
/**
 * Server Inventory cache class.
 */
var ServerInventoryDetailCache = /** @class */ (function (_super) {
    __extends(ServerInventoryDetailCache, _super);
    /**
     * Initializes a new instance of the ServerInventoryCache class.
     *
     * @param appContext the app context.
     * @param options the option of shared cache.
     */
    function ServerInventoryDetailCache(appContext, options) {
        var _this = _super.call(this, ServerInventoryDetailCache.uniqueId, ServerInventoryDetailCache.uniqueVersion, function (params) { return _this.dataInstanceId(params); }, function (instance) { return _this.dataSerialize(instance); }, function (serialized) { return _this.dataDeserialize(serialized); }, function (params) { return _this.dataQuery(params); }, options) || this;
        _this.appContext = appContext;
        return _this;
    }
    /**
     * Defines how to collect the server inventory data.
     *
     * @param params the server inventory detail query params.
     * @return {string} the Observable of ServerInventoryDetail data.
     */
    ServerInventoryDetailCache.prototype.dataQuery = function (params) {
        // query parallel...
        return Observable.zip(this.appContext.cim.getInstanceMultiple(params.name, Cim.namespace.cimV2, Cim.cimClass.win32Processor, __assign({}, params.requestOptions, { powerShell: PowerShellScripts.Get_CimWin32Processor })), this.appContext.cim.getInstanceMultiple(params.name, Cim.namespace.cimV2, Cim.cimClass.win32PhysicalMemory, __assign({}, params.requestOptions, { powerShell: PowerShellScripts.Get_CimWin32PhysicalMemory })), this.appContext.cim.getInstanceMultiple(params.name, Cim.namespace.cimV2, Cim.cimClass.win32LogicalDisks, __assign({}, params.requestOptions, { powerShell: PowerShellScripts.Get_CimWin32LogicalDisk })), this.appContext.cim.getInstanceMultiple(params.name, Cim.namespace.cimV2, Cim.cimClass.win32NetworkAdapter, __assign({}, params.requestOptions, { powerShell: PowerShellScripts.Get_CimWin32NetworkAdapter })))
            .map(function (_a) {
            var processors = _a[0], memory = _a[1], disks = _a[2], adapters = _a[3];
            var inventory = new ServerInventoryDetail(params.name);
            // Processors
            if (processors && processors.value) {
                for (var _i = 0, _b = processors.value; _i < _b.length; _i++) {
                    var item = _b[_i];
                    inventory.processors.push(item.properties.name);
                }
            }
            // Memory
            if (memory && memory.value) {
                for (var _c = 0, _d = memory.value; _c < _d.length; _c++) {
                    var item = _d[_c];
                    inventory.totalMemory += item.properties.capacity;
                }
            }
            // DiskSpace
            if (disks && disks.value) {
                for (var _e = 0, _f = disks.value; _e < _f.length; _e++) {
                    var item = _f[_e];
                    inventory.totalDisk += item.properties.size;
                    inventory.totalFreeDiskSpace += item.properties.freeSpace;
                }
            }
            // Network adapters
            if (adapters && adapters.value) {
                var count = 0;
                for (var _g = 0, _h = adapters.value; _g < _h.length; _g++) {
                    var item = _h[_g];
                    if (item.properties.physicalAdapter === true) {
                        count++;
                    }
                }
                inventory.totalPhysicalNics = count;
            }
            return inventory;
        });
    };
    /**
     * Defines how to identify the cache entry by params.
     *
     * @param params the server inventory query params.
     * @return {sting} the id string.
     */
    ServerInventoryDetailCache.prototype.dataInstanceId = function (params) {
        return params.name;
    };
    /**
     * Defines how to de-serialize the class object from serialized data.
     *
     * @param serialized the serialized string;
     */
    ServerInventoryDetailCache.prototype.dataDeserialize = function (serialized) {
        var inventory = JSON.parse(serialized);
        return new ServerInventoryDetail(inventory.serverName, inventory);
    };
    /**
     * Defines how to serialize the class object to serialized data.
     *
     * @param instance the class instance.
     */
    ServerInventoryDetailCache.prototype.dataSerialize = function (instance) {
        // automatically stripped out class related data.
        return JSON.stringify(instance);
    };
    ServerInventoryDetailCache.uniqueId = '@msft-sme/shell:serverInventoryDetail';
    ServerInventoryDetailCache.uniqueVersion = 1;
    return ServerInventoryDetailCache;
}(SharedCache));
export { ServerInventoryDetailCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL3NlcnZlci1pbnZlbnRvcnkvc2VydmVyLWludmVudG9yeS1kZXRhaWwtY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUUxRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLFdBQVcsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUscUJBQXFCLEVBQTBELE1BQU0sMkJBQTJCLENBQUM7QUFFMUg7O0dBRUc7QUFDSDtJQUFnRCw4Q0FBMEY7SUFJdEk7Ozs7O09BS0c7SUFDSCxvQ0FBb0IsVUFBc0IsRUFBRSxPQUE0QjtRQUF4RSxZQUNJLGtCQUNJLDBCQUEwQixDQUFDLFFBQVEsRUFDbkMsMEJBQTBCLENBQUMsYUFBYSxFQUN4QyxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQTNCLENBQTJCLEVBQ3ZDLFVBQUMsUUFBUSxJQUFLLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBNUIsQ0FBNEIsRUFDMUMsVUFBQyxVQUFVLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFoQyxDQUFnQyxFQUNoRCxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQXRCLENBQXNCLEVBQ2xDLE9BQU8sQ0FBQyxTQUNmO1FBVG1CLGdCQUFVLEdBQVYsVUFBVSxDQUFZOztJQVMxQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyw4Q0FBUyxHQUFqQixVQUFrQixNQUFtQztRQUNqRCxvQkFBb0I7UUFDcEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENB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