import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService, DialogService } from '../angular';
import { Logging, NotificationState } from '../core';
import { DayZeroDialogComponent } from './modules/dialogs/day-zero-dialog/day-zero-dialog.component';
import { ShellService } from './shell.service';
import { RouteHelpers } from './utility/route-helpers';
var ShellComponent = /** @class */ (function () {
    function ShellComponent(appContextService, shellService, dialogService, activeRoute) {
        this.appContextService = appContextService;
        this.shellService = shellService;
        this.dialogService = dialogService;
        this.activeRoute = activeRoute;
        this.strings = appContextService.resourceCache.getStrings();
        ShellService.setApplicationReady(false);
    }
    /**
     * Update the navigation title.
     *
     * @param appContextService the application context service.
     * @param snapshot the route snapshot.
     */
    ShellComponent.navigationTitle = function (appContextService, snapshot) {
        // this is default view. Don't want to include as a sub menu.
        return MsftSme.resourcesStrings().MsftSmeShell.App.Shell.applicationTitle;
    };
    ShellComponent.prototype.ngOnInit = function () {
        var _this = this;
        Logging.trace({ view: 'sme-shell', instance: '', action: 'ngOnInit' });
        // In the E2E test, we want to disable the Day Zero dialog by setting the URL parameter "disableDayZero" to true.
        if (!this.activeRoute.snapshot.queryParams[RouteHelpers.queryParams.disableDayZero]) {
            this.shellService.getShellUserSettings()
                .flatMap(function (settings) {
                if (settings.dayZeroEnabled) {
                    return _this.dialogService.show(DayZeroDialogComponent.dayZeroDialogComponentId, {})
                        .flatMap(function () { return settings.trySave(function () { return settings.completeDayZeroExperience(); }); });
                }
                return Observable.of(null);
            })
                .catch(function (error) {
                _this.appContextService.notification.alert(null, NotificationState.Error, _this.strings.MsftSmeShell.App.Shell.getUserProfileError.format(error));
                return null;
            })
                .take(1) // take(1) ensures the observable chain is cleaned up.
                .subscribe();
        }
    };
    ShellComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-shell',
                    template: "\n      <div class=\"sme-layout-absolute sme-position-inset-none\">\n          <router-outlet></router-outlet>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    ShellComponent.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: ShellService, },
        { type: DialogService, },
        { type: ActivatedRoute, },
    ]; };
    return ShellComponent;
}());
export { ShellComponent };
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLENBQUMsQ0FBQyxzREFBc0Q7aUJBQzlELFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDO0lBQ0UseUJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLG9JQUlUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCw2QkFBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEdBQUc7UUFDM0IsRUFBQyxJQUFJLEVBQUUsWUFBWSxHQUFHO1FBQ3RCLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztRQUN2QixFQUFDLElBQUksRUFBRSxjQUFjLEdBQUc7S0FDdkIsRUFMNkYsQ0FLN0YsQ0FBQztJQUNGLHFCQUFDO0NBN0RELEFBNkRDLElBQUE7U0E3RFksY0FBYyIsImZpbGUiOiJzaGVsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9