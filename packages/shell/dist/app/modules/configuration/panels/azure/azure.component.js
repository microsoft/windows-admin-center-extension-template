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
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppContextService, DialogService, SettingsFormService } from '../../../../../angular';
import { Net, NotificationState } from '../../../../../core';
import { ShellService } from '../../../../shell.service';
import { PanelBaseComponent } from './../panel-base.component';
var AzureComponent = /** @class */ (function (_super) {
    __extends(AzureComponent, _super);
    function AzureComponent(appContextService, router, activatedRoute, formBuilder, settingsFormService, dialogService, shellService) {
        var _this = _super.call(this, appContextService, router, activatedRoute, formBuilder, settingsFormService, dialogService, {
            name: ''
        }, 
        // TODO: refactor because this is not used
        {
            name: {
                required: 'this is a mandatory field'
            }
        }, {
            name: 'setting 1 name value'
        }, 'setting 1') || this;
        _this.shellService = shellService;
        _this.strings = MsftSme.resourcesStrings().MsftSmeShell;
        return _this;
    }
    AzureComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.aadSubscription = this.appContextService.gateway.get('gateway/aad/user').take(1).subscribe(function (response) {
            _this.identity = response;
        }, function (error) {
            _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
        });
        this.statusSubscription = this.appContextService.gateway.get('gateway/status').take(1).subscribe(function (response) {
            _this.isAadEnabled = response.isAadAuthEnabled;
        }, function (error) {
            _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
        });
    };
    AzureComponent.prototype.onSignOut = function () {
        var _this = this;
        this.signOutSubscription = this.appContextService.gateway.post('gateway/aad/signout').take(1).subscribe(function (error) {
            _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
        });
        window.location.href = 'https://login.microsoftonline.com/common/oauth2/logout';
    };
    AzureComponent.prototype.ngOnDestroy = function () {
        if (this.aadSubscription) {
            this.aadSubscription.unsubscribe();
        }
        if (this.statusSubscription) {
            this.statusSubscription.unsubscribe();
        }
        if (this.signOutSubscription) {
            this.signOutSubscription.unsubscribe();
        }
    };
    AzureComponent.prototype.showAlert = function (message, state) {
        this.appContextService.notification.alert(this.appContextService.gateway.gatewayName, state, message);
    };
    AzureComponent.decorators = [
        { type: Component, args: [{
                    template: "\n\n      <div *ngIf=\"!isAadEnabled\">\n          <p class=\"sme-padding-top-xs\">{{strings.App.SettingsDialog.azure.notConfigured}}</p>\n          <div class=\"sme-padding-top-xs\">\n              <a class=\"sme-link\" href=\"https://azure.microsoft.com/free/\" target=\"_blank\">\n                <span>{{strings.App.SettingsDialog.azure.createAccount}}</span>\n                <span class=\"sme-icon icon-win-openInNewWindow\"></span>\n              </a>\n            </div>\n      </div>\n\n      <div *ngIf=\"isAadEnabled\">\n          <div>\n              <p class=\"sme-padding-top-xs\">{{strings.App.SettingsDialog.azure.currentUser}}</p>\n              <p class=\"sme-padding-top-xs\">{{identity}}</p>\n          </div>\n          <div class=\"sme-padding-top-xs\">\n              <button type=\"button\" class=\"btn\" (click)=\"onSignOut()\">{{strings.App.SettingsDialog.azure.signOut}}</button>\n          </div>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    AzureComponent.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: FormBuilder, },
        { type: SettingsFormService, },
        { type: DialogService, },
        { type: ShellService, },
    ]; };
    return AzureComponent;
}(PanelBaseComponent));
export { AzureComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2F6dXJlL2F6dXJlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBNkIsTUFBTyxlQUFBLENBQWdCO0FBQzdELE9BQU8sRUFBRSxXQUFBLEVBQWdELE1BQU8sZ0JBQUEsQ0FBaUI7QUFDakYsT0FBTyxFQUFFLGNBQUEsRUFBZ0IsTUFBQSxFQUFPLE1BQU8saUJBQUEsQ0FBa0I7QUFFekQsT0FBTyxFQUFFLGlCQUFBLEVBQW1CLGFBQUEsRUFBZSxtQkFBQSxFQUFvQixNQUFPLHdCQUFBLENBQXlCO0FBQy9GLE9BQU8sRUFNSCxHQUFHLEVBQ0gsaUJBQWlCLEVBQ3BCLE1BQU0scUJBQUEsQ0FBc0I7QUFFN0IsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLDJCQUFBLENBQTRCO0FBRXpELE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLDJCQUFBLENBQTRCO0FBRy9EO0lBQ1ksa0NBQWdDO0lBV3hDLHdCQUNJLGlCQUFvQyxFQUNwQyxNQUFjLEVBQ2QsY0FBOEIsRUFDOUIsV0FBd0IsRUFDeEIsbUJBQXdDLEVBQ3hDLGFBQTRCLEVBQ3BCLFlBQTBCO1FBUHRDLFlBUUksa0JBQ0ksaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixjQUFjLEVBQ2QsV0FBVyxFQUNYLG1CQUFtQixFQUNuQixhQUFhLEVBQ2I7WUFDSSxJQUFJLEVBQUUsRUFBRTtTQUNYO1FBQ0QsMENBQTBDO1FBQzFDO1lBQ0ksSUFBSSxFQUFFO2dCQUNGLFFBQVEsRUFBRSwyQkFBMkI7YUFDeEM7U0FDSixFQUNEO1lBQ0ksSUFBSSxFQUFFLHNCQUFzQjtTQUMvQixFQUNELFdBQVcsQ0FBQyxTQUNuQjtRQXJCVyxrQkFBWSxHQUFaLFlBQVksQ0FBYztRQWYvQixhQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDOztJQW9DbEUsQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFBQSxpQkFpQkM7UUFoQkcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQzNGLFVBQUEsUUFBUTtZQUNKLEtBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQzVCLENBQUMsRUFDRCxVQUFBLEtBQUs7WUFDRCxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUNKLENBQUM7UUFFRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUM1RixVQUFBLFFBQVE7WUFDSixLQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNsRCxDQUFDLEVBQ0QsVUFBQSxLQUFLO1lBQ0QsS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVNLGtDQUFTLEdBQWhCO1FBQUEsaUJBT0M7UUFORyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUNuRyxVQUFBLEtBQUs7WUFDRCxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUNKLENBQUM7UUFDRixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyx3REFBd0QsQ0FBQTtJQUNuRixDQUFDO0lBRU0sb0NBQVcsR0FBbEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7SUFFTyxrQ0FBUyxHQUFqQixVQUFrQixPQUFlLEVBQUUsS0FBd0I7UUFDdkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMxQyxLQUFLLEVBQ0wsT0FBTyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUNFLHlCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLGs3QkFxQlQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDZCQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxNQUFNLEdBQUc7UUFDaEIsRUFBQyxJQUFJLEVBQUUsY0FBYyxHQUFHO1FBQ3hCLEVBQUMsSUFBSSxFQUFFLFdBQVcsR0FBRztRQUNyQixFQUFDLElBQUksRUFBRSxtQkFBbUIsR0FBRztRQUM3QixFQUFDLElBQUksRUFBRSxhQUFhLEdBQUc7UUFDdkIsRUFBQyxJQUFJLEVBQUUsWUFBWSxHQUFHO0tBQ3JCLEVBUjZGLENBUTdGLENBQUM7SUFDRixxQkFBQztDQTlIRCxBQThIQyxDQTdIVyxrQkFBa0IsR0E2SDdCO1NBOUhZLGNBQWMiLCJmaWxlIjoiYXp1cmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==