import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService, Navigation } from '../angular';
import { ShellService } from './shell.service';
import { ApplicationErrorType, RouteHelpers } from './utility/route-helpers';
var ShellGuardService = /** @class */ (function () {
    /**
     * Initializes a new instance of the SmeAppReadyGuard class.
     * @param appContextService the application context service.
     * @param router the activated route.
     */
    function ShellGuardService(appContextService, router, shellService) {
        this.appContextService = appContextService;
        this.router = router;
        this.shellService = shellService;
    }
    /**
     * Guard against navigating until the app initialization is complete
     * @param route the current route snapshot
     * @param state the current router state snapshot
     */
    ShellGuardService.prototype.canActivate = function (route, state) {
        var _this = this;
        // get params and copy over them.
        var params = route.queryParams || {};
        var gatewayUrl = params[Navigation.gatewayUrl] || window.location.origin;
        // Internet Explorer is not supported
        if (MsftSme.isInternetExplorer()) {
            this.appContextService.gateway.gatewayUrl = gatewayUrl;
            RouteHelpers.navigateToError(this.router, ApplicationErrorType.UnsupportedBrowser, null, true);
            return Observable.of(true);
        }
        // if already initialized, resolve when services are ready
        if (ShellGuardService.initialized) {
            return this.appContextService.servicesReady;
        }
        return this.appContextService.servicesReady
            .take(1)
            .flatMap(function () {
            // configure gateway URL
            _this.appContextService.gateway.gatewayUrl = gatewayUrl;
            // get gateway status and connections list before returning
            return Observable.zip(_this.shellService.inventoryCaches.gatewayCache.createObservable({}), _this.appContextService.connectionManager.restoreConnections());
        })
            .map(function (_a) {
            var instance = _a[0], connections = _a[1];
            ShellGuardService.initialized = true;
            return true;
        }).catch(function (err) {
            RouteHelpers.navigateToError(_this.router, ApplicationErrorType.Generic);
            return Observable.of(false);
        });
    };
    ShellGuardService.initialized = false;
    ShellGuardService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ShellGuardService.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: Router, },
        { type: ShellService, },
    ]; };
    return ShellGuardService;
}());
export { ShellGuardService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGVsbC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxlQUFBLENBQWdCO0FBQzNDLE9BQU8sRUFBdUMsTUFBQSxFQUE0QixNQUFPLGlCQUFBLENBQWtCO0FBQ25HLE9BQU8sRUFBRSxVQUFBLEVBQW9CLE1BQU8sTUFBQSxDQUFPO0FBQzNDLE9BQU8sRUFBRSxpQkFBQSxFQUFtQixVQUFBLEVBQVcsTUFBTyxZQUFBLENBQWE7QUFFM0QsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLGlCQUFBLENBQWtCO0FBQy9DLE9BQU8sRUFBRSxvQkFBQSxFQUFzQixZQUFBLEVBQWEsTUFBTyx5QkFBQSxDQUEwQjtBQUc3RTtJQUdJOzs7O09BSUc7SUFDSCwyQkFBb0IsaUJBQW9DLEVBQVUsTUFBYyxFQUFVLFlBQTBCO1FBQWhHLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWM7SUFBSSxDQUFDO0lBRXpIOzs7O09BSUc7SUFDSSx1Q0FBVyxHQUFsQixVQUFtQixLQUE2QixFQUFFLEtBQTBCO1FBQTVFLGlCQW9DQztRQW5DRyxpQ0FBaUM7UUFDakMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDckMsSUFBSSxVQUFVLEdBQVcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUVqRixxQ0FBcUM7UUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUN2RCxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9GLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCwwREFBMEQ7UUFDMUQsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztRQUNoRCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhO2FBRXRDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDUCxPQUFPLENBQUM7WUFDTCx3QkFBd0I7WUFDeEIsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQ3ZELDJEQUEyRDtZQUMzRCxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FDakIsS0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUNuRSxLQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsQ0FDaEUsQ0FBQztRQUNOLENBQUMsQ0FBQzthQUNELEdBQUcsQ0FBQyxVQUFDLEVBQXVCO2dCQUF0QixnQkFBUSxFQUFFLG1CQUFXO1lBQ3hCLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHO1lBQ1IsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFJLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQWxEYyw2QkFBVyxHQUFHLEtBQUssQ0FBQztJQW1EaEMsNEJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0tBQ25CLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEdBQUc7UUFDM0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxHQUFHO1FBQ2hCLEVBQUMsSUFBSSxFQUFFLFlBQVksR0FBRztLQUNyQixFQUo2RixDQUk3RixDQUFDO0lBQ0Ysd0JBQUM7Q0E3REQsQUE2REMsSUFBQTtTQTdEWSxpQkFBaUIiLCJmaWxlIjoic2hlbGwtZ3VhcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=