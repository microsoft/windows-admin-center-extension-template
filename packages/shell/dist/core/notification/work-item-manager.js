import { Observable } from 'rxjs';
import { Net } from '../data/net';
import { PowerShell } from '../data/powershell';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { RpcInboundCommands } from '../rpc/rpc-base';
import { NotificationState } from './notification-state';
import { PowerShellNotification } from './powershell-notification';
import { WorkItemRequestType } from './work-item-request';
/**
 * Work item manager class.
 */
var WorkItemManager = /** @class */ (function () {
    /**
     * Initializes a new instance of the WorkItemManager class.
     *
     * @param rpc the RPC object.
     * @param gatewayConnection the gateway connection service.
     * @param nodeConnection the node connection service.
     * @param notificationManager the notification manager.
     */
    function WorkItemManager(rpc, gatewayConnection, nodeConnection, notificationConnection) {
        this.rpc = rpc;
        this.gatewayConnection = gatewayConnection;
        this.nodeConnection = nodeConnection;
        this.notificationConnection = notificationConnection;
        this.active = false;
        this.notificationManager = this.notificationConnection.notificationManager;
        this.start();
    }
    /**
     * Start the work item management.
     */
    WorkItemManager.prototype.start = function () {
        var _this = this;
        this.stop();
        this.active = true;
        // pickup active work items for last 24hours
        this.startSubscription = this.gatewayConnection.get(WorkItemManager.apiWorkItems24hours)
            .catch(function (error, obj) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.NotificationNoWorkItemFound.message;
            Logging.log({
                source: 'Notification',
                level: LogLevel.Error,
                message: message.format(Net.getErrorMessage(error))
            });
            return Observable.of({ response: { value: null } });
        })
            .switchMap(function (response) {
            if (response.value) {
                response.value.forEach(function (element) {
                    _this.notificationManager.addFromRecover(element);
                });
            }
            // start websocket status query.
            _this.powerShellNotification = new PowerShellNotification(_this.gatewayConnection.gatewayUrl);
            return Observable.fromPromise(
            // converting jQueryPromise to native Promise.
            new Promise(function (resolve, reject) { return _this.powerShellNotification.initialize().then(resolve, reject); }));
        })
            .subscribe(function () {
            // notification from the gateway...
            _this.notificationSubscription = _this.powerShellNotification.subject
                .subscribe(function (item) {
                if (item && item.message && item.message.sessionId) {
                    var id = item.message.sessionId;
                    if (!_this.notificationManager.updateFromMessage(id, item)) {
                        var message = MsftSme.resourcesStrings()
                            .MsftSmeShell.Core.Error.NotificationUnexpectedReceived.message;
                        Logging.log({
                            source: 'Notification',
                            level: LogLevel.Warning,
                            message: message.format(id)
                        });
                    }
                }
            });
            // workItem request from rpc...
            _this.rpcWorkItemSubscription = _this.rpc.moduleSubjects(RpcInboundCommands.WorkItem)
                .subscribe(function (item) {
                if (item.data.type === WorkItemRequestType.PowerShellSubmit) {
                    _this.submitWorkItem(item.data).toPromise().then(item.deferred.resolve, item.deferred.reject);
                }
                else {
                    _this.queryWorkItem(item.data).toPromise().then(item.deferred.resolve, item.deferred.reject);
                }
            });
            // subscribe the session notification to the gateway...
            _this.notificationManager.items.forEach(function (value) {
                // only if it's not finalized.
                if (value.state === NotificationState.Started || value.state === NotificationState.InProgress) {
                    _this.powerShellNotification.subscribeSession(value.id);
                }
            });
        }, function (error) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.NotificationWebsocketInitialize.message;
            Logging.log({
                source: 'Notification',
                level: LogLevel.Error,
                message: message.format(Net.getErrorMessage(error))
            });
        });
    };
    /**
     * Stop the work item management.
     */
    WorkItemManager.prototype.stop = function () {
        this.active = false;
        if (this.startSubscription) {
            this.startSubscription.unsubscribe();
            this.startSubscription = null;
        }
        if (this.notificationSubscription) {
            this.notificationSubscription.unsubscribe();
            this.notificationSubscription = null;
        }
        if (this.powerShellNotification) {
            this.powerShellNotification.uninitialize();
            this.powerShellNotification = null;
        }
        if (this.rpcWorkItemSubscription) {
            this.rpcWorkItemSubscription.unsubscribe();
            this.rpcWorkItemSubscription = null;
        }
    };
    /**
     * Create and submit a workItem.
     *
     * @param request the work item request.
     * @return Observable the WorkItemResult observable.
     */
    WorkItemManager.prototype.submitWorkItem = function (request) {
        var _this = this;
        var command = null;
        if (request.powerShellCommand || request.powerShellScript) {
            // For a non-powershell long running task (eg: azure site recovery setup), command is null.
            command = PowerShell.getPowerShellCommand(request.powerShellCommand || request.powerShellScript);
        }
        if (request.powerShellScript) {
            delete request['powerShellScript'];
        }
        if (request.powerShellCommand) {
            delete request['powerShellCommand'];
        }
        var nodeRequestOptions = PowerShell.newEndpointOptions(request.nodeRequestOptions);
        if (request.nodeRequestOptions) {
            delete request['nodeRequestOptions'];
        }
        // remember current URL where original request generated.
        request.locationPathname = window.location.pathname;
        request.locationSearch = window.location.search;
        return this.powerShellNotification.submit(this.nodeConnection, request.nodeName, command, request, nodeRequestOptions, function (result) {
            _this.notificationManager.addFromWorkItem(result.id, request, result.state, result.error);
        });
    };
    /**
     * Query a workItem.
     *
     * @param request the work item request.
     * @return Observable the WorkItemResult observable.
     */
    WorkItemManager.prototype.queryWorkItem = function (request) {
        var notification = this.notificationManager.find(request.id);
        if (notification) {
            if (notification.state === NotificationState.Error) {
                return Observable.of({
                    id: notification.id,
                    state: notification.state,
                    percent: notification.progressPercent,
                    error: notification.object
                });
            }
            return Observable.of({
                id: notification.id,
                state: notification.state,
                percent: notification.progressPercent,
                object: notification.object
            });
        }
        var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.NotificationNoIdFound.message;
        return Observable.throw(message.format(request.id));
    };
    WorkItemManager.apiWorkItems24hours = '/workitems?lastMinutes=1440';
    return WorkItemManager;
}());
export { WorkItemManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvbm90aWZpY2F0aW9uL3dvcmstaXRlbS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBR2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFbEMsT0FBTyxFQUFFLFVBQVUsRUFBcUIsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRWpELE9BQU8sRUFBRSxrQkFBa0IsRUFBZSxNQUFNLGlCQUFpQixDQUFDO0FBSWxFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxzQkFBc0IsRUFBNkIsTUFBTSwyQkFBMkIsQ0FBQztBQUU5RixPQUFPLEVBQXFDLG1CQUFtQixFQUFrQixNQUFNLHFCQUFxQixDQUFDO0FBRTdHOztHQUVHO0FBQ0g7SUFXSTs7Ozs7OztPQU9HO0lBQ0gseUJBQ1ksR0FBUSxFQUNSLGlCQUFvQyxFQUNwQyxjQUE4QixFQUMvQixzQkFBOEM7UUFIN0MsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNSLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQy9CLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFwQmxELFdBQU0sR0FBRyxLQUFLLENBQUM7UUFxQmxCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUM7UUFDM0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7T0FFRztJQUNJLCtCQUFLLEdBQVo7UUFBQSxpQkEyRUM7UUExRUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxD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