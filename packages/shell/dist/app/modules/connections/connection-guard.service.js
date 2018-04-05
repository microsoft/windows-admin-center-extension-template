import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService } from '../../../angular';
import { ConnectionUtility, EnvironmentModule, GatewayMode, LiveConnectionStatusType, Logging, LogLevel } from '../../../core';
import { ShellService } from '../../shell.service';
import { RouteHelpers } from '../../utility/route-helpers';
var ConnectionGuardService = /** @class */ (function () {
    /**
     * Initializes a new instance of the ConnectionGuardService class.
     * @param appContextService the application context service.
     * @param router the angular router.
     */
    function ConnectionGuardService(appContextService, router, shellService) {
        this.appContextService = appContextService;
        this.router = router;
        this.shellService = shellService;
    }
    /**
     * Guard against navigating until the app initialization is complete
     * @param route the current route snapshot
     * @param state the current router state snapshot
     */
    ConnectionGuardService.prototype.canActivate = function (route, state) {
        var _this = this;
        var params = RouteHelpers.getFullShellRoutingParameters(route);
        if (!params.connectionType || !params.connectionName) {
            this.redirectRoute(route);
            return false;
        }
        if (!params.connectionFriendlyType
            && EnvironmentModule.getFriendlyUrlSegmentForConnectionType(params.connectionType, false)) {
            // reroute to friendly version of the route
            RouteHelpers.navigateToTool(this.router, params);
            return false;
        }
        // if parameters are acceptable, then search for the connection
        return this.appContextService.connectionManager
            .findConnection(params.connectionName, params.connectionType)
            .flatMap(function (connection) {
            if (!connection) {
                // if the type passed in the route does not have a provider, then redirect back to solution
                var validConnectionType = EnvironmentModule.getEntryPointsByType(['connectionProvider'])
                    .some(function (cp) { return cp.connectionType === params.connectionType; });
                if (!validConnectionType) {
                    _this.redirectRoute(route);
                    return Observable.of(false);
                }
                // otherwise, create a default connection
                connection = {
                    id: ConnectionUtility.createConnectionId(params.connectionType, params.connectionName),
                    name: params.connectionName,
                    type: params.connectionType
                };
            }
            _this.appContextService.activeConnection.value = connection;
            return _this.shellService.inventoryCaches.gatewayCache.createObservable()
                .take(1)
                .flatMap(function (gateway) {
                // handle app mode routing, don't allow localhost connections
                if (gateway.mode === GatewayMode.App
                    && (!params.connectionName || params.connectionName !== RouteHelpers.appModeConnectionName)) {
                    RouteHelpers.navigateToAppHome(_this.router, gateway);
                    return Observable.of(false);
                }
                return _this.routeToLiveConnection(params, connection);
            });
        })
            .take(1);
    };
    /**
     * Determines and activates the best redirect route
     * @param route the current route snapshot
     */
    ConnectionGuardService.prototype.redirectRoute = function (route) {
        // TODO: navigate to connection 404, for now go to the solutions connections pages
        var params = RouteHelpers.getFullShellRoutingParameters(route);
        if (params.solution) {
            RouteHelpers.navigateToConnections(this.router, params.solution);
        }
        else {
            // if something really went wrong, navigate to home
            RouteHelpers.navigateToHome(this.router);
        }
    };
    /**
     * Routes to the live connection
     * @param params The routing parameters
     * @param connection The connection
     */
    ConnectionGuardService.prototype.routeToLiveConnection = function (params, connection) {
        var _this = this;
        return this.appContextService.connectionStream.getLiveConnection(connection).flatMap(function (result) {
            var connectionStatus = result.status && result.status.type;
            // TODO: need to handle more cases here.
            if (connectionStatus === LiveConnectionStatusType.Unauthorized) {
                ShellService.setApplicationReady(false);
                return _this.appContextService.authorizationManager.getNewToken(params.connectionName)
                    .map(function (token) {
                    return true;
                })
                    .catch(function (error) {
                    Logging.log({ level: LogLevel.Warning, message: error.message, source: 'ConnectionGuardService' });
                    RouteHelpers.navigateToHome(_this.router);
                    return Observable.of(false);
                });
            }
            return Observable.of(true);
        });
    };
    ConnectionGuardService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ConnectionGuardService.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: Router, },
        { type: ShellService, },
    ]; };
    return ConnectionGuardService;
}());
export { ConnectionGuardService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2Nvbm5lY3Rpb25zL2Nvbm5lY3Rpb24tZ3VhcmQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sZUFBQSxDQUFnQjtBQUMzQyxPQUFPLEVBQXVDLE1BQUEsRUFBNEIsTUFBTyxpQkFBQSxDQUFrQjtBQUNuRyxPQUFPLEVBQUUsVUFBQSxFQUFvQixNQUFPLE1BQUEsQ0FBTztBQUMzQyxPQUFPLEVBQUUsaUJBQUEsRUFBOEIsTUFBTyxrQkFBQSxDQUFtQjtBQUNqRSxPQUFPLEVBRUgsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQixXQUFXLEVBRVgsd0JBQXdCLEVBQ3hCLE9BQU8sRUFDUCxRQUFRLEVBQ1gsTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBRSxZQUFBLEVBQWEsTUFBTyxxQkFBQSxDQUFzQjtBQUNuRCxPQUFPLEVBQUUsWUFBQSxFQUFxQyxNQUFPLDZCQUFBLENBQThCO0FBR25GO0lBQ0k7Ozs7T0FJRztJQUNILGdDQUFvQixpQkFBb0MsRUFBVSxNQUFjLEVBQVUsWUFBMEI7UUFBaEcsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUFJLENBQUM7SUFFekg7Ozs7T0FJRztJQUNJLDRDQUFXLEdBQWxCLFVBQW1CLEtBQTZCLEVBQUUsS0FBMEI7UUFBNUUsaUJBbURDO1FBbERHLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztR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QUMsSUFBSSxDQUFDLENBQUM7WUFDSixtREFBbUQ7WUFDbkQsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssc0RBQXFCLEdBQTdCLFVBQThCLE1BQThCLEVBQUUsVUFBc0I7UUFBcEYsaUJBb0JDO1FBbkJHLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtZQUN2RixJQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0Qsd0NBQXdDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzdELFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFeEMsTUFBTSxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztxQkFDaEYsR0FBRyxDQUFDLFVBQUMsS0FBSztvQkFDUCxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLFVBQUMsS0FBSztvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQztvQkFDbkcsWUFBWSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQ3hDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUM7WUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRSxpQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7S0FDbkIsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHFDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxNQUFNLEdBQUc7UUFDaEIsRUFBQyxJQUFJLEVBQUUsWUFBWSxHQUFHO0tBQ3JCLEVBSjZGLENBSTdGLENBQUM7SUFDRiw2QkFBQztDQXBIRCxBQW9IQyxJQUFBO1NBcEhZLHNCQUFzQiIsImZpbGUiOiJjb25uZWN0aW9uLWd1YXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9