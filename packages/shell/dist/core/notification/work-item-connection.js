var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs';
import { NotificationState } from './notification-state';
import { WorkItemManager } from './work-item-manager';
import { WorkItemRequestType } from './work-item-request';
/**
 * Work item connection to submit a powershell work item, and to query its state.
 */
var WorkItemConnection = /** @class */ (function () {
    /**
     * Initializes a new instance of the WorkItemConnection class.
     *
     * @param rpc the RPC.
     * @param gatewayConnection the gateway connection.
     * @param notificationConnection the notification connection.
     */
    function WorkItemConnection(rpc, gatewayConnection, nodeConnection, notificationConnection) {
        this.rpc = rpc;
        if (notificationConnection.notificationManager) {
            this.workItemManager = new WorkItemManager(this.rpc, gatewayConnection, nodeConnection, notificationConnection);
        }
    }
    /**
     * Submit a work item either directly to NotificationManager or through RPC.
     *
     * @param nodeName the name of the node to submit the item against.
     * @param request the work item request.
     * @return Observable the observable of WorkItemResult object.
     */
    WorkItemConnection.prototype.submit = function (nodeName, request) {
        var data = __assign({}, request, {
            type: WorkItemRequestType.PowerShellSubmit,
            sourceName: MsftSme.self().Environment.name,
            nodeName: nodeName,
            timestamp: Date.now()
        });
        if (this.workItemManager) {
            return this.workItemManager.submitWorkItem(data);
        }
        // configure PowerShell module name before sending to RPC.
        if (data.powerShellCommand && data.powerShellCommand.module == null && MsftSme.self().Init.powerShellModuleName) {
            data.powerShellCommand.module = MsftSme.self().Init.powerShellModuleName;
        }
        return Observable.fromPromise(this.rpc.submitOrQueryWorkItem(data));
    };
    /**
     * Query a work item either directly to NotificationManager or through RPC.
     *
     * @param request the work item request.
     * @return Observable the observable of WorkItemResult object.
     */
    WorkItemConnection.prototype.query = function (id) {
        var data = {
            type: WorkItemRequestType.StateQuery,
            sourceName: MsftSme.self().Environment.name,
            timestamp: Date.now(),
            id: id
        };
        if (this.workItemManager) {
            return this.workItemManager.queryWorkItem(data);
        }
        return Observable.fromPromise(this.rpc.submitOrQueryWorkItem(data));
    };
    /**
     * Find existing work item with state.
     *
     * @param nodeName the node name.
     * @param moduleName the module name.
     * @param typeId the type ID.
     * @return Observable<WorkItemFindResult> the observable of WorkItemFindResult.
     */
    WorkItemConnection.prototype.find = function (nodeName, moduleName, typeId) {
        var data = {
            sourceName: MsftSme.self().Environment.name,
            nodeName: nodeName,
            moduleName: moduleName,
            typeId: typeId
        };
        if (this.workItemManager) {
            return Observable.of(this.workItemManager.notificationConnection.notificationManager.workItemFind(data));
        }
        return Observable.fromPromise(this.rpc.workItemFind(data));
    };
    /**
     * Submit a work item either directly to NotificationManager or through RPC, and wait for completion.
     *
     * @param nodeName the name of the node to submit the work item against
     * @param request the work item request.
     * @param timeout the timeout milliseconds. (optional, default forever until unsubscribe)
     * @param interval the interval period milliseconds. (optional, default 1 sec)
     * @return Observable the observable of WorkItemResult object.
     */
    WorkItemConnection.prototype.submitAndWait = function (nodeName, request, timeout, interval) {
        if (timeout === void 0) { timeout = 0; }
        if (interval === void 0) { interval = 1000; }
        return this.waitObservable(this.submit(nodeName, request), timeout, interval);
    };
    /**
     * Wait for existing work item with state.
     *
     * @param workItemResult the work item result to wait for the final result.
     * @param timeout the timeout milliseconds. (optional, default forever until unsubscribe)
     * @param interval the interval period milliseconds. (optional, default 1 sec)
     * @return Observable<WorkItemFindResult> the observable of WorkItemFindResult.
     */
    WorkItemConnection.prototype.wait = function (workItemResult, timeout, interval) {
        if (timeout === void 0) { timeout = 0; }
        if (interval === void 0) { interval = 1000; }
        if (!workItemResult) {
            return Observable.of(null);
        }
        return this.waitObservable(Observable.of(workItemResult), timeout, interval);
    };
    /**
     * Check if work item result was finished.
     *
     * @param result the work item result.
     * @return boolean true if work item was completed with success or error.
     */
    WorkItemConnection.prototype.isFinished = function (result) {
        if (result.state !== NotificationState.Started && result.state !== NotificationState.InProgress) {
            return true;
        }
        return false;
    };
    /**
     * Wait for existing work item with state.
     *
     * @param workItemResult the work item result to wait for the final result.
     * @param timeout the timeout milliseconds. (optional, default forever until unsubscribe)
     * @param interval the interval period milliseconds. (optional, default 1 sec)
     * @return Observable<WorkItemFindResult> the observable of WorkItemFindResult.
     */
    WorkItemConnection.prototype.waitObservable = function (observable, timeout, interval) {
        var _this = this;
        if (timeout === void 0) { timeout = 0; }
        if (interval === void 0) { interval = 1000; }
        return observable
            .expand(function (result, index) {
            if (_this.isFinished(result)) {
                return Observable.empty();
            }
            else if (timeout > 0 && interval * index > timeout) {
                return Observable.throw('timeout');
            }
            return Observable.of(result)
                .delay(interval)
                .flatMap(function (resultLoop, indexLoop) { return _this.query(result.id); });
        })
            .filter(function (result, index) { return _this.isFinished(result); });
    };
    return WorkItemConnection;
}());
export { WorkItemConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvbm90aWZpY2F0aW9uL3dvcmstaXRlbS1jb25uZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQU1sQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFzQixtQkFBbUIsRUFBeUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVySDs7R0FFRztBQUNIO0lBR0k7Ozs7OztPQU1HO0lBQ0gsNEJBQ1ksR0FBUSxFQUNoQixpQkFBb0MsRUFDcEMsY0FBOEIsRUFDOUIsc0JBQThDO1FBSHRDLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFJaEIsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUNwSCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLG1DQUFNLEdBQWIsVUFBYyxRQUFnQixFQUFFLE9BQThCO1FBQzFELElBQUksSUFBSSxHQUFnQixhQUNqQixPQUFPLEVBQ1A7WUFDQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsZ0JBQWdCO1lBQzFDLFVBQVUsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7WUFDM0MsUUFBUSxFQUFFLFFBQVE7WUFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7U0FDeEIsQ0FDSixDQUFDO1FBRUYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENB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LENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksdUNBQVUsR0FBakIsVUFBa0IsTUFBc0I7UUFDcEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxpQkFBaUIsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzlGLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSywyQ0FBYyxHQUF0QixVQUF1QixVQUEyQixFQUFFLE9BQW1CLEVBQUUsUUFBdUI7UUFBaEcsaUJBY0M7UUFkbUQsd0JBQUEsRUFBQSxXQUFtQjtRQUFFLHlCQUFBLEVBQUEsZUFBdUI7UUFDM0YsTUFBTSxDQUFDLFVBQVU7YUFDYixNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsS0FBSztZQUNsQixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksUUFBUSxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUN2QixLQUFLLENBQUMsUUFBUSxDQUFDO2lCQUNmLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBRSxTQUFTLElBQUssT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FwS0EsQUFvS0MsSUFBQSIsImZpbGUiOiJ3b3JrLWl0ZW0tY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=