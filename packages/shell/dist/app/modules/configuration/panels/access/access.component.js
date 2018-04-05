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
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService, DialogService, SettingsFormService } from '../../../../../angular';
import { Net, NotificationState } from '../../../../../core';
import { PanelBaseComponent } from '.././panel-base.component';
import { AccessService } from './access.service';
var AccessComponent = /** @class */ (function (_super) {
    __extends(AccessComponent, _super);
    function AccessComponent(appContextService, router, activatedRoute, dialogService, formbuilder, settingsFormService) {
        var _this = _super.call(this, appContextService, router, activatedRoute, formbuilder, settingsFormService, dialogService, {
            name: ''
        }, 
        // TODO : Remove these validations from here, include in add group dialog.
        {
            name: {
                required: 'this is a mandatory field'
            }
        }, {
            name: 'setting 1 name value'
        }, 'setting 1') || this;
        _this.strings = MsftSme.resourcesStrings().MsftSmeShell;
        _this.accessService = new AccessService(_this.appContextService);
        return _this;
    }
    AccessComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sampleForm = this.formbuilder.group({
            name: [this.modelData.name, Validators.required]
        });
        this.rootSubscription = this.appContextService.gateway
            .get('gateway/status')
            .take(1)
            .subscribe(function (response) {
            if (response) {
                _this.azureAppCreated = response.isAzureAppCreated;
                _this.aadAuthEnabled = response.isAadAuthEnabled;
                _this.setCurrentAccessControlType();
            }
        });
        _super.prototype.ngOnInit.call(this);
    };
    AccessComponent.prototype.onChangeClick = function () {
        var _this = this;
        var sub = this.onChangeAccessClick().subscribe(function () {
            _this.setCurrentAccessControlType();
            sub.unsubscribe();
        });
    };
    AccessComponent.prototype.onChangeAccessClick = function () {
        var _this = this;
        var dialogOptions = {
            cancelButtonText: this.strings.App.SettingsDialog.access.cancel,
            confirmButtonText: this.strings.App.SettingsDialog.access.save,
            message: this.strings.App.SettingsDialog.access.addSecurityGroupMessage,
            title: this.strings.App.SettingsDialog.access.addSecurityGroupHeader
        };
        return this.dialogService.show('sme-change-access-control-dialog', dialogOptions).flatMap(function (result) {
            if (result.confirmed) {
                if (result.accessType === 'AzureActiveDirectory') {
                    return _this.accessService.enableAadAuthentication().map(function () {
                        _this.aadAuthEnabled = true;
                        _this.showSuccessAlert(_this.strings.App.SettingsDialog.access.aadSuccessMessage);
                        return true;
                    }).catch(function (error) {
                        _this.showErrorAlert(Net.getErrorMessage(error));
                        return Observable.of(true);
                    });
                }
                else {
                    return _this.accessService.disableAadAuthentication().map(function (x) {
                        _this.aadAuthEnabled = false;
                        _this.showSuccessAlert(_this.strings.App.SettingsDialog.access.adSuccessMessage);
                        return true;
                    }).catch(function (error) {
                        _this.showErrorAlert(Net.getErrorMessage(error));
                        return Observable.of(true);
                    });
                }
            }
            return Observable.of(true);
        }).catch(function (error) {
            _this.showErrorAlert(Net.getErrorMessage(error));
            return Observable.of(true);
        });
    };
    AccessComponent.prototype.ngOnDestroy = function () {
        if (this.rootSubscription) {
            this.rootSubscription.unsubscribe();
        }
        if (this.appSubscription) {
            this.appSubscription.unsubscribe();
        }
    };
    AccessComponent.prototype.setCurrentAccessControlType = function () {
        this.currentType = this.aadAuthEnabled === true ?
            this.strings.App.SettingsDialog.access.accessControlType.azureAD
            : this.strings.App.SettingsDialog.access.accessControlType.onPrem;
        if (this.aadAuthEnabled) {
            this.getAzureAppInfo();
        }
    };
    AccessComponent.prototype.showErrorAlert = function (message) {
        this.appContextService.notification.alert(this.appContextService.gateway.gatewayName, NotificationState.Error, message);
    };
    AccessComponent.prototype.showSuccessAlert = function (message) {
        this.appContextService.notification.alert(this.appContextService.gateway.gatewayName, NotificationState.Informational, message);
    };
    AccessComponent.prototype.getAzureAppInfo = function () {
        var _this = this;
        this.appSubscription = this.accessService.getAzureApplicationInfo().take(1).subscribe(function (response) {
            if (response && response.appClientId && response.appObjectId) {
                _this.appClientId = response.appClientId;
                _this.appObjectId = response.appObjectId;
            }
        });
    };
    AccessComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-access',
                    template: "\n      <div class=\"flex-layout vertical stretch-absolute\">\n        <span>{{strings.App.SettingsDialog.access.currentType}} </span>\n        <span class=\"sme-padding-top-xs\">{{currentType}}</span>\n        <div class=\"sme-padding-top-xs\">\n          <button class=\"btn btn-primary\" form=\"sme-accessTypeForm\" type=\"change\" (click)=\"onChangeClick()\">{{strings.App.SettingsDialog.access.changeType}}</button>\n        </div>\n        <div class=\"sme-padding-top-xs\">\n          <a class=\"sme-link\" href=\"https://aka.ms/honoluluGatewayAccess\" target=\"_blank\">\n            <span>{{strings.App.SettingsDialog.access.learnMoreAboutControlling}}</span>\n            <span class=\"sme-icon icon-win-openInNewWindow\"></span>\n          </a>\n        </div>\n        <div class=\"sme-padding-top-xs\" *ngIf=\"aadAuthEnabled\">\n          <p>{{strings.App.SettingsDialog.access.manageGuide}}  </p>\n          <ol class=\"sme-list-numeric sme-padding-left-lg\" type=\"1\">\n            <li>\n              <a class=\"sme-link\" target=\"_blank\" href=\"https://portal.azure.com/#blade/Microsoft_AAD_IAM/ManagedAppMenuBlade/Overview/objectId/{{appObjectId}}/appId/{{appClientId}}\">\n                {{strings.App.SettingsDialog.access.manageStep1}}\n                <span class=\"sme-icon icon-win-openInNewWindow\"></span>\n              </a>\n            </li>\n            <li>{{strings.App.SettingsDialog.access.manageStep2}}</li>\n            <li>{{strings.App.SettingsDialog.access.manageStep3}}</li>\n          </ol>\n          <span>{{strings.App.SettingsDialog.access.manageNote}}</span>\n        </div>\n        <sme-tool-header *ngIf=\"!aadAuthEnabled\" class=\"sme-padding-top-xs\">\n          <p class=\"sme-icon sme-icon-info icon-size sme-position-flex-none m-r-xxs\">{{strings.App.SettingsDialog.access.description}}</p>\n          <ul class=\"nav nav-tabs\" role=\"tablist\">\n            <li role=\"presentation\">\n              <a role=\"tab\" routerLink=\"users\" routerLinkActive=\"active\">{{strings.App.SettingsDialog.access.gatewayUsers}}</a>\n            </li>\n            <li role=\"presentation\">\n              <a role=\"tab\" routerLink=\"admins\" routerLinkActive=\"active\">{{strings.App.SettingsDialog.access.gatewayAdmins}}</a>\n            </li>\n          </ul>\n        </sme-tool-header>\n        <div class=\"auto-flex-size relative\" [class.sme-layout-none]=\"aadAuthEnabled\">\n          <router-outlet></router-outlet>\n        </div>\n      </div>\n\n      <sme-confirmation-dialog id=\"sme-confirmation-dialog\"></sme-confirmation-dialog>\n      <sme-change-access-control-dialog id=\"sme-change-access-control-dialog\"></sme-change-access-control-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    AccessComponent.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: DialogService, },
        { type: FormBuilder, },
        { type: SettingsFormService, },
    ]; };
    return AccessComponent;
}(PanelBaseComponent));
export { AccessComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9hY2Nlc3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUE2QixNQUFPLGVBQUEsQ0FBZ0I7QUFDN0QsT0FBTyxFQUFFLFdBQUEsRUFBcUMsVUFBQSxFQUFXLE1BQU8sZ0JBQUEsQ0FBaUI7QUFDakYsT0FBTyxFQUFFLGNBQUEsRUFBZ0IsTUFBQSxFQUFPLE1BQU8saUJBQUEsQ0FBa0I7QUFDekQsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLE1BQUEsQ0FBTztBQUVsQyxPQUFPLEVBQUUsaUJBQUEsRUFBZ0QsYUFBQSxFQUFlLG1CQUFBLEVBQW9CLE1BQU8sd0JBQUEsQ0FBeUI7QUFDNUgsT0FBTyxFQUFFLEdBQUEsRUFBSyxpQkFBQSxFQUFrQixNQUFPLHFCQUFBLENBQXNCO0FBRzdELE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLDJCQUFBLENBQTRCO0FBQy9ELE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyxrQkFBQSxDQUFtQjtBQUlqRDtJQUNZLG1DQUErQjtJQWV2Qyx5QkFBWSxpQkFBb0MsRUFBRSxNQUFjLEVBQUUsY0FBOEIsRUFDNUYsYUFBNEIsRUFBRSxXQUF3QixFQUN0RCxtQkFBd0M7UUFGNUMsWUFHSSxrQkFDSSxpQkFBaUIsRUFDakIsTUFBTSxFQUNOLGNBQWMsRUFDZCxXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGFBQWEsRUFDYjtZQUNJLElBQUksRUFBRSxFQUFFO1NBQ1g7UUFDRCwwRUFBMEU7UUFDMUU7WUFDSSxJQUFJLEVBQUU7Z0JBQ0YsUUFBUSxFQUFFLDJCQUEyQjthQUN4QztTQUNKLEVBQ0Q7WUFDSSxJQUFJLEVBQUUsc0JBQXNCO1NBQy9CLEVBQ0QsV0FBVyxDQUFDLFNBRW5CO1FBcENNLGFBQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUM7UUFt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QUFDO2dCQUMzRCxLQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7Z0JBQ3hDLEtBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUM1QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0UsMEJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsWUFBWTtvQkFDdEIsUUFBUSxFQUFFLGlxRkE2Q1Q7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDhCQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxNQUFNLEdBQUc7UUFDaEIsRUFBQyxJQUFJLEVBQUUsY0FBYyxHQUFHO1FBQ3hCLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztRQUN2QixFQUFDLElBQUksRUFBRSxXQUFXLEdBQUc7UUFDckIsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEdBQUc7S0FDNUIsRUFQNkYsQ0FPN0YsQ0FBQztJQUNGLHNCQUFDO0NBOU1ELEFBOE1DLENBN01XLGtCQUFrQixHQTZNN0I7U0E5TVksZUFBZSIsImZpbGUiOiJhY2Nlc3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==