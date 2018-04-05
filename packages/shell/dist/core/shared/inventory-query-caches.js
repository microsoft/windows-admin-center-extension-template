import { Observable } from 'rxjs';
import { QueryCache } from '../data/query-cache';
import { ClusterInventoryCache } from '../shared/cluster-inventory/cluster-inventory-cache';
import { GatewayInventoryCache } from '../shared/gateway-inventory/gateway-inventory-cache';
import { GatewayInventoryDetailCache } from '../shared/gateway-inventory/gateway-inventory-detail-cache';
import { ServerInventoryCache } from '../shared/server-inventory/server-inventory-cache';
import { ServerInventoryDetailCache } from '../shared/server-inventory/server-inventory-detail-cache';
import { ToolInventoryCache } from '../shared/tool-inventory/tool-inventory-cache';
var InventoryQueryCaches = /** @class */ (function () {
    function InventoryQueryCaches(appContext, options) {
        var _this = this;
        this.appContext = appContext;
        this.serverInventorySharedContext = {
            name: null,
            server: false,
            detail: false,
            shared: null
        };
        this.gatewayCached = false;
        var cacheOptions;
        if (options.serverCache) {
            cacheOptions = options.serverCache.expiration ? { expiration: options.serverCache.expiration } : null;
            this.serverInventoryCache = new ServerInventoryCache(this.appContext, cacheOptions);
            this.serverCache = new QueryCache(function (params) { return _this.createServerInventory(params); }, function (params) { return params.name; });
        }
        if (options.serverCache && options.serverCombinedCache) {
            cacheOptions = options.serverCombinedCache.expiration ? { expiration: options.serverCombinedCache.expiration } : null;
            this.serverInventoryDetailCache = new ServerInventoryDetailCache(this.appContext, cacheOptions);
            this.serverCombinedCache = new QueryCache(function (params) { return _this.createServerInventoryCombined(params); }, function (params) { return params.name; }, function () { return _this.serverInventoryCacheNodeName = null; });
        }
        if (options.gatewayCache) {
            cacheOptions = options.gatewayCache.expiration ? { expiration: options.gatewayCache.expiration } : null;
            this.gatewayInventoryCache = new GatewayInventoryCache(this.appContext, cacheOptions);
            this.gatewayCache = new QueryCache(function (params) { return _this.createGatewayInventory(params); }, function (params) { return 'gateway'; });
        }
        if (options.gatewayCache && options.gatewayCombinedCache) {
            cacheOptions = options.gatewayCombinedCache.expiration ? { expiration: options.gatewayCombinedCache.expiration } : null;
            this.gatewayInventoryDetailCache = new GatewayInventoryDetailCache(this.appContext, cacheOptions);
            this.gatewayCombinedCache = new QueryCache(function (params) { return _this.createGatewayInventoryCombined(params); }, function (params) { return 'gateway'; }, function () { return _this.gatewayCached = false; });
        }
        if (options.clusterCache) {
            cacheOptions = options.clusterCache.expiration ? { expiration: options.clusterCache.expiration } : null;
            this.clusterInventoryCache = new ClusterInventoryCache(this.appContext, cacheOptions);
            this.clusterCache = new QueryCache(function (params) { return _this.createClusterInventory(params); }, function (params) { return params.name; });
        }
        if (options.toolCache) {
            cacheOptions = options.toolCache.expiration ? { expiration: options.toolCache.expiration } : null;
            this.toolInventoryCache = new ToolInventoryCache(this.appContext, cacheOptions);
        }
    }
    /**
     * Clear all session storage.
     */
    InventoryQueryCaches.prototype.clear = function () {
        sessionStorage.clear();
    };
    /**
     * Query tool inventory and make the query to be sequential to hold consistency of inventory cache.
     *
     * @param params the parameters of tool inventory.
     */
    InventoryQueryCaches.prototype.toolQuery = function (params) {
        var _this = this;
        var observable = Observable.create(function (observer) {
            var queueItem = { observer: observer, params: params };
            _this.toolCacheQueue.push(queueItem);
            if (_this.toolCacheQueue.length === 1) {
                _this.toolInventoryCache.query(queueItem.params)
                    .catch(function (error, caught) {
                    queueItem.observer.error(error);
                    return Observable.of(null);
                })
                    .expand(function (inventory, index) {
                    if (inventory) {
                        queueItem.observer.next(inventory.instance);
                        queueItem.observer.complete();
                    }
                    MsftSme.remove(_this.toolCacheQueue, queueItem);
                    if (_this.toolCacheQueue.length > 0) {
                        queueItem = _this.toolCacheQueue[0];
                        return _this.toolInventoryCache.query(queueItem.params)
                            .catch(function (error, caught) {
                            queueItem.observer.error(error);
                            return Observable.of(null);
                        });
                    }
                    return Observable.empty();
                })
                    .subscribe();
            }
        });
        return observable;
    };
    /**
     * Create server inventory query.
     * - It shares the query with ServerInventory and ServerInventoryCombined. Keep track the request and re-create if asked twice.
     *
     * @param params the inventory query parameters.
     * @param detail the state of server query or detail query.
     * @return Observable<ServerInventory> Shared ServerInventory observable.
     */
    InventoryQueryCaches.prototype.createServerInventory = function (params, detail) {
        // check
        // - if not created yet.
        // - if requested server name is changed.
        // - if server query second time.
        // - if detail query second time.
        var createNew = !this.serverInventorySharedContext.shared
            || params.name !== this.serverInventorySharedContext.name
            || (this.serverInventorySharedContext.server && !detail)
            || (this.serverInventorySharedContext.detail && detail);
        if (!createNew) {
            if (detail) {
                this.serverInventorySharedContext.detail = true;
            }
            else {
                this.serverInventorySharedContext.server = true;
            }
            // return shared pre-created one.
            return this.serverInventorySharedContext.shared;
        }
        // creates new shared observable.
        var observable = this.serverInventoryCache.query({ name: params.name }).map(function (inventory) { return inventory.instance; });
        if (params && params.retry) {
            observable = observable.retry(params.retry);
        }
        this.serverInventorySharedContext = { name: params.name, server: !detail, detail: !!detail, shared: observable.share() };
        return this.serverInventorySharedContext.shared;
    };
    InventoryQueryCaches.prototype.createServerInventoryCombined = function (params) {
        var observable;
        if (!this.serverInventoryCacheNodeName || this.serverInventoryCacheNodeName !== params.name) {
            this.serverInventoryCacheNodeName = params.name;
            observable = Observable.zip(this.createServerInventory(params, true), this.serverInventoryDetailCache.query({ name: params.name })
                .map(function (inventory) { return inventory.instance; }));
        }
        else {
            observable = Observable.zip(this.serverInventoryCache.refresh({ name: params.name })
                .map(function (inventory) { return inventory.instance; }), this.serverInventoryDetailCache.refresh({ name: params.name })
                .map(function (inventory) { return inventory.instance; }));
        }
        if (params && params.retry) {
            return observable.retry(params.retry);
        }
        return observable;
    };
    InventoryQueryCaches.prototype.createGatewayInventory = function (params) {
        var observable = this.gatewayInventoryCache.query({}).map(function (inventory) { return inventory.instance; });
        if (params && params.retry) {
            return observable.retry(params.retry);
        }
        return observable;
    };
    InventoryQueryCaches.prototype.createGatewayInventoryCombined = function (params) {
        var observable;
        if (!this.gatewayCached) {
            this.gatewayCached = true;
            observable = Observable.zip(this.gatewayInventoryCache.query({}).map(function (inventory) { return inventory.instance; }), this.gatewayInventoryDetailCache.query({}).map(function (inventory) { return inventory.instance; }));
        }
        else {
            observable = Observable.zip(this.gatewayInventoryCache.refresh({}).map(function (inventory) { return inventory.instance; }), this.gatewayInventoryDetailCache.refresh({}).map(function (inventory) { return inventory.instance; }));
        }
        if (params && params.retry) {
            return observable.retry(params.retry);
        }
        return observable;
    };
    InventoryQueryCaches.prototype.createClusterInventory = function (params) {
        var observable = this.clusterInventoryCache.query({ name: params.name }).map(function (inventory) { return inventory.instance; });
        if (params && params.retry) {
            return observable.retry(params.retry);
        }
        return observable;
    };
    return InventoryQueryCaches;
}());
export { InventoryQueryCaches };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL2ludmVudG9yeS1xdWVyeS1jYWNoZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBWSxNQUFNLE1BQU0sQ0FBQztBQUU1QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFakQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFFNUYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFFNUYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFFekcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sbURBQW1ELENBQUE7QUFFeEYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sMERBQTBELENBQUE7QUFFckcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUE2Qm5GO0lBeUJJLDhCQUFvQixVQUFzQixFQUFFLE9BQXFDO1FBQWpGLGlCQWdEQztRQWhEbUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQWxCbEMsaUNBQTRCLEdBQUc7WUFDbkMsSUFBSSxFQUFVLElBQUk7WUFDbEIsTUFBTSxFQUFFLEtBQUs7WUFDYixNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sRUFBK0IsSUFBSTtTQUM1QyxDQUFDO1FBR00sa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFXMUIsSUFBSSxZQUFnQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3RHLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixDQUFD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dEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQ25CLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLFFBQVEsRUFBbEIsQ0FBa0IsQ0FBQyxFQUN6RSxJQUFJLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxRQUFRLEVBQWxCLENBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQzdGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUNuQixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxRQUFRLEVBQWxCLENBQWtCLENBQUMsRUFDM0UsSUFBSSxDQUFDLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsUUFBUSxFQUFsQixDQUFrQixDQUFDLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRU8scURBQXNCLEdBQTlCLFVBQStCLE1BQWtDO1FBQzdELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLFFBQVEsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO1FBQzlHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0E5TkEsQUE4TkMsSUFBQSIsImZpbGUiOiJpbnZlbnRvcnktcXVlcnktY2FjaGVzLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==