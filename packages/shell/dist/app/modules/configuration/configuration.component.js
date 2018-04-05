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
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppContextService, CommonSettingsComponentBase } from '../../../angular';
import { Net, NotificationState } from '../../../core';
var ConfigurationComponent = /** @class */ (function (_super) {
    __extends(ConfigurationComponent, _super);
    function ConfigurationComponent(appContextService, router) {
        var _this = _super.call(this) || this;
        _this.appContextService = appContextService;
        _this.router = router;
        _this.strings = MsftSme.resourcesStrings();
        _this.settingItems = [];
        _this.settingItems.push({
            label: _this.strings.MsftSmeShell.App.SettingsDialog.general,
            routeParams: {
                commands: ['general']
            },
            smeIconClassName: 'sme-icon-settings'
        });
        return _this;
    }
    ConfigurationComponent.navigationTitle = function (appContextService, snapshot) {
        return MsftSme.resourcesStrings().MsftSmeShell.App.SettingsDialog.title;
    };
    ConfigurationComponent.prototype.confirmContinueEditingDialogOptions = function (dirtyForm, allForms) {
        return {
            cancelButtonText: this.strings.MsftSmeShell.App.SettingsDialog.ConfirmationDialog.Discard,
            confirmButtonText: this.strings.MsftSmeShell.App.SettingsDialog.ConfirmationDialog.Continue,
            message: this.strings.MsftSmeShell.App.SettingsDialog.ConfirmationDialog.Message.format(JSON.stringify(dirtyForm.value)),
            title: this.strings.MsftSmeShell.App.SettingsDialog.ConfirmationDialog.Title
        };
    };
    ConfigurationComponent.prototype.ngOnInit = function () {
        // Here are the rules deciding when to show or hide some tabs:
        // 1. Access tab should be shown only in service mode AND only to admins.
        // 2. Azure tab should be shown to everyone in service mode
        var _this = this;
        this.statusSubscription = this.appContextService.gateway
            .get('gateway/status')
            .take(1)
            .subscribe(function (gateway) {
            if (gateway.gatewayMode === 'Service') {
                _this.accessSubscription = _this.appContextService.gateway
                    .get('gateway/access/check')
                    .take(1)
                    .subscribe(function (response) {
                    if (response) {
                        _this.settingItems.push({
                            label: _this.strings.MsftSmeShell.App.SettingsDialog.access.toolTitle,
                            routeParams: {
                                commands: ['access']
                            },
                            smeIconClassName: 'sme-icon-localAdmin'
                        });
                    }
                    _this.settingItems.push({
                        label: _this.strings.MsftSmeShell.App.SettingsDialog.azure.title,
                        routeParams: {
                            commands: ['azure']
                        },
                        smeIconClassName: 'sme-icon-azureLogo'
                    });
                }, function (error) {
                    _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
                });
            }
        }, function (error) {
            _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
        });
    };
    ConfigurationComponent.prototype.onDestroy = function () {
        if (this.statusSubscription) {
            this.statusSubscription.unsubscribe();
        }
        if (this.accessSubscription) {
            this.accessSubscription.unsubscribe();
        }
    };
    ConfigurationComponent.prototype.showAlert = function (message, state) {
        this.appContextService.notification.alert(this.appContextService.gateway.gatewayName, state, message);
    };
    ConfigurationComponent.prototype.onCloseClick = function () {
        this.router.navigate(['/']);
    };
    ConfigurationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-configuration',
                    template: "\n      <div class=\"sme-layout-absolute sme-position-inset-none sme-arrange-stack-v\">\n          <sme-common-settings settingsTitle=\"{{strings.MsftSmeShell.App.SettingsDialog.title}}\" [settings]=\"settingItems\" aria-labelledby=\"sme-setting-title\">\n          </sme-common-settings>\n          <div class=\"sme-layout-float-left sme-margin-left-xl\">\n              <div class=\"sme-padding-spread-v-xxxl sme-margin-left-xxxl\">\n                  <button type=\"button\" class=\"btn btn-secondary\" (click)=\"onCloseClick()\">{{strings.MsftSmeShell.Angular.Common.close}}</button>\n              </div>\n          </div>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    ConfigurationComponent.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: Router, },
    ]; };
    return ConfigurationComponent;
}(CommonSettingsComponentBase));
export { ConfigurationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQWtCLE1BQU8sZUFBQSxDQUFnQjtBQUVsRCxPQUFPLEVBQTBCLE1BQUEsRUFBTyxNQUFPLGlCQUFBLENBQWtCO0FBRWpFLE9BQU8sRUFDNkIsaUJBQUEsRUFBbUIsMkJBQUEsRUFFdEQsTUFBTSxrQkFBQSxDQUFtQjtBQUMxQixPQUFPLEVBTUgsR0FBRyxFQUNILGlCQUFpQixFQUNwQixNQUFNLGVBQUEsQ0FBZ0I7QUFLdkI7SUFBNEMsMENBQTJCO0lBVW5FLGdDQUFvQixpQkFBb0MsRUFBVSxNQUFjO1FBQWhGLFlBQ0ksaUJBQU8sU0FVVjtRQVhtQix1QkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQVR6RSxhQUFPLEdBQVksT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUM7UUFDdkQsa0JBQVksR0FBbUMsRUFBRSxDQUFDO1FBVXJELEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUNsQjtZQUNJLEtBQUssRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU87WUFDM0QsV0FBVyxFQUFFO2dCQUNULFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQzthQUN4QjtZQUNELGdCQUFnQixFQUFFLG1CQUFtQjtTQUN4QyxDQUNKLENBQUM7O0lBQ04sQ0FBQztJQWZhLHNDQUFlLEdBQTdCLFVBQThCLGlCQUFvQyxFQUFFLFFBQWdDO1FBQ2hHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7SUFDckYsQ0FBQztJQWVNLG9FQUFtQyxHQUExQyxVQUNJLFNBQW9CLEVBQ3BCLFFBQXFCO1FB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QUMsV0FBVyxFQUFFLENBQUM7UUFDMUMsQ0FBQztJQUNMLENBQUM7SUFFTywwQ0FBUyxHQUFqQixVQUFrQixPQUFlLEVBQUUsS0FBd0I7UUFDdkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMxQyxLQUFLLEVBQ0wsT0FBTyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVNLDZDQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRSxpQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSx5b0JBVVQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHFDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxNQUFNLEdBQUc7S0FDZixFQUg2RixDQUc3RixDQUFDO0lBQ0YsNkJBQUM7Q0F4SEQsQUF3SEMsQ0F4SDJDLDJCQUEyQixHQXdIdEU7U0F4SFksc0JBQXNCIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==