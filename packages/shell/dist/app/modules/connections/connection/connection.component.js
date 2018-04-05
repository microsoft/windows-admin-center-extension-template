import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppContextService } from '../../../../angular';
import { GatewayMode } from '../../../../core';
import { ShellService } from '../../../shell.service';
import { RouteHelpers } from '../../../utility/route-helpers';
var ConnectionComponent = /** @class */ (function () {
    function ConnectionComponent(route, router, appContextService, shellService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.appContextService = appContextService;
        this.shellService = shellService;
        this.strings = MsftSme.resourcesStrings().MsftSmeShell.App.Connections;
        this.gatewayMode = GatewayMode;
        this.subscription = this.router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .subscribe(function (event) {
            var shellParams = RouteHelpers.getFullShellRoutingParameters(_this.route.snapshot);
            if (_this.connectionName !== shellParams.connectionName) {
                _this.connectionName = shellParams.connectionName;
                _this.rbacConnection = !!_this.appContextService.authorizationManager.getJeaEndpoint(_this.connectionName);
                var connection = _this.appContextService.connectionManager.connections.find(function (item) { return item.name === _this.connectionName; });
                if (connection) {
                    _this.appContextService.connectionManager.updateConnectionLastCheckedTime(connection)
                        .take(1).subscribe();
                }
            }
        });
    }
    ConnectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Logging.trace(<TelemetryRecord>{
        //     view: 'sme-connections',
        //     instance: '',
        //     action: 'ngOnInit'
        // });
        this.gatewaySubscription = this.shellService.inventoryCaches.gatewayCache.createObservable({})
            .subscribe(function (gateway) { return _this.gateway = gateway; });
    };
    ConnectionComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
        this.gatewaySubscription.unsubscribe();
    };
    ConnectionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-connection',
                    template: "\n      <div class=\"sme-layout-absolute sme-position-inset-none sme-arrange-stack-v\">\n          <header *ngIf=\"gateway && gateway.mode !== gatewayMode.App\" role=\"banner\" class=\"sme-layout-tool-header sme-position-flex-none\">\n              <h2>{{connectionName}}</h2>\n              <h2 *ngIf=\"rbacConnection\" title=\"{{strings.RbacBadge.tooltip}}\">{{strings.RbacBadge.label}}</h2>\n              <!-- <sme-badge *ngIf=\"rbacConnection\" type=\"warning\" [label]=\"strings.RbacBadge.label\" [description]=\"strings.RbacBadge.tooltip\"></sme-badge> -->\n          </header>\n          <div class=\"sme-layout-relative sme-position-flex-auto\">\n              <router-outlet></router-outlet>\n          </div>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    ConnectionComponent.ctorParameters = function () { return [
        { type: ActivatedRoute, },
        { type: Router, },
        { type: AppContextService, },
        { type: ShellService, },
    ]; };
    return ConnectionComponent;
}());
export { ConnectionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2Nvbm5lY3Rpb25zL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBNkIsTUFBTyxlQUFBLENBQWdCO0FBQzdELE9BQU8sRUFBRSxjQUFBLEVBQXdDLGFBQUEsRUFBdUIsTUFBQSxFQUFPLE1BQU8saUJBQUEsQ0FBa0I7QUFHeEcsT0FBTyxFQUFFLGlCQUFBLEVBQWtCLE1BQU8scUJBQUEsQ0FBc0I7QUFDeEQsT0FBTyxFQUFpRCxXQUFBLEVBQVksTUFBTyxrQkFBQSxDQUFtQjtBQUU5RixPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8sd0JBQUEsQ0FBeUI7QUFDdEQsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLGdDQUFBLENBQWlDO0FBRzlEO0lBV0ksNkJBQ1ksS0FBcUIsRUFDckIsTUFBYyxFQUNkLGlCQUFvQyxFQUNwQyxZQUEwQjtRQUp0QyxpQkFtQkM7UUFsQlcsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFiL0IsWUFBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBSTNFLGdCQUFXLEdBQUcsV0FBVyxDQUFDO1FBVTdCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2FBQ2pDLE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssWUFBWSxhQUFhLEVBQTlCLENBQThCLENBQUM7YUFDL0MsU0FBUyxDQUFDLFVBQUEsS0FBSztZQUNaLElBQUksV0FBVyxHQUFHLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xGLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQztnQkFDakQsS0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3hHLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFJLENBQUMsY0FBYyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7Z0JBQ3hILEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsS0FBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLCtCQUErQixDQUFDLFVBQVUsQ0FBQzt5QkFDL0UsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUM3QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVNLHNDQUFRLEdBQWY7UUFBQSxpQkFRQztRQVBHLG1DQUFtQztRQUNuQywrQkFBK0I7UUFDL0Isb0JBQW9CO1FBQ3BCLHlCQUF5QjtRQUN6QixNQUFNO1FBQ04sSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7YUFDekYsU0FBUyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEVBQXRCLENBQXNCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0seUNBQVcsR0FBbEI7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBQ0UsOEJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUscXVCQVdUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxrQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsY0FBYyxHQUFHO1FBQ3hCLEVBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRztRQUNoQixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxZQUFZLEdBQUc7S0FDckIsRUFMNkYsQ0FLN0YsQ0FBQztJQUNGLDBCQUFDO0NBdEVELEFBc0VDLElBQUE7U0F0RVksbUJBQW1CIiwiZmlsZSI6ImNvbm5lY3Rpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==