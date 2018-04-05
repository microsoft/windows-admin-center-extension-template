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
import { AppContextService, BaseDialogComponent, DialogService } from '../../../../../../angular';
import { Net, NotificationState } from '../../../../../../core';
import { AccessService } from '../access.service';
var ChangeAccessControlDialogComponent = /** @class */ (function (_super) {
    __extends(ChangeAccessControlDialogComponent, _super);
    /**
     * Initializes a new instance of the ConfirmationDialogComponent class.
     */
    function ChangeAccessControlDialogComponent(dialogService, appContextService, formBuilder, accessService) {
        var _this = _super.call(this, dialogService) || this;
        _this.appContextService = appContextService;
        _this.formBuilder = formBuilder;
        _this.accessService = accessService;
        _this.strings = _this.appContextService.resourceCache.getStrings().MsftSmeShell;
        return _this;
    }
    /**
     * Shows the dialog.
     */
    ChangeAccessControlDialogComponent.prototype.show = function (options) {
        if (!options) {
            throw new Error('Options are required to show the dialog.');
        }
        this.form.reset();
        this.initializeForm();
        this.cancelButtonText = options.cancelButtonText;
        this.confirmButtonText = options.confirmButtonText;
        this.message = options.message;
        this.title = options.title;
        this.form.markAsPristine();
        return _super.prototype.show.call(this, options);
    };
    /**
     * The method run when the component is initialized.
     */
    ChangeAccessControlDialogComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.initializeForm();
    };
    /**
     * The method to call when the confirm button is clicked.
     */
    ChangeAccessControlDialogComponent.prototype.onConfirm = function () {
        var results = {
            confirmed: true,
            accessType: this.form.get('accessType').value
        };
        this.hide(results);
    };
    ChangeAccessControlDialogComponent.prototype.closeRequested = function (reason) {
        this.onCancel();
    };
    /**
     * The method to call when the cancel button is clicked.
     */
    ChangeAccessControlDialogComponent.prototype.onCancel = function () {
        var results = {
            confirmed: false
        };
        this.hide(results);
    };
    ChangeAccessControlDialogComponent.prototype.onAdGroupClick = function () {
        this.onPrem = true;
        this.azure = false;
    };
    ChangeAccessControlDialogComponent.prototype.onAadClick = function () {
        this.azure = true;
        this.onPrem = false;
    };
    ChangeAccessControlDialogComponent.prototype.ngOnDestroy = function () {
        if (this.rootSubscription) {
            this.rootSubscription.unsubscribe();
        }
        if (this.appSubscription) {
            this.appSubscription.unsubscribe();
        }
    };
    /**
     * Initializes the form components;
     */
    ChangeAccessControlDialogComponent.prototype.initializeForm = function () {
        var _this = this;
        this.rootSubscription = this.appContextService.gateway.get('gateway/status').take(1).subscribe(function (response) {
            if (response) {
                _this.accessTypeSelection = response.isAadAuthEnabled === true ? 'AzureActiveDirectory' : 'ActiveDirectoryGroups';
                _this.aadAuthEnabled = response.isAadAuthEnabled;
                _this.aadAppCreated = response.isAzureAppCreated;
                if (_this.aadAppCreated) {
                    _this.getAzureAppInfo();
                }
                _this.azure = _this.aadAuthEnabled;
                _this.onPrem = !_this.azure;
            }
        }, function (error) {
            _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
        });
        this.form = this.formBuilder.group({
            accessType: this.accessTypeSelection
        });
    };
    ChangeAccessControlDialogComponent.prototype.showAlert = function (message, state) {
        this.appContextService.notification.alert(this.appContextService.gateway.gatewayName, state, message);
    };
    ChangeAccessControlDialogComponent.prototype.getAzureAppInfo = function () {
        var _this = this;
        this.appSubscription = this.accessService.getAzureApplicationInfo().take(1).subscribe(function (response) {
            if (response && response.appClientId && response.appObjectId) {
                _this.appClientId = response.appClientId;
                _this.appObjectId = response.appObjectId;
            }
        });
    };
    ChangeAccessControlDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-change-access-control-dialog',
                    template: "\n      <sme-dialog #dialog (keyup.enter)=\"onConfirm()\">\n          <sme-dialog-header>\n              <h3 id=\"sme-dialog-title\">{{strings.App.SettingsDialog.access.changeType}}</h3>\n          </sme-dialog-header>\n          <sme-dialog-content>\n              <form id=\"sme-add-azureGroupInfoForm\" [formGroup]=\"form\" style=\"position:relative\">\n                  <div class=\"form-group\">\n                      <label for=\"sme-accessType\" class=\"required-input-label\">{{strings.App.SettingsDialog.access.controlUsing}}</label>\n                      <div class=\"radio\">\n                          <label for=\"sme-activeDirectoryGroups\" (click)=\"onAdGroupClick()\">\n                              <input id=\"sme-activeDirectoryGroups\" type=\"radio\" aria-required=\"true\" formControlName=\"accessType\" [(ngModel)]='accessTypeSelection'\n                                  value='ActiveDirectoryGroups' />\n                              <span>{{strings.App.SettingsDialog.access.onPrem}}</span>\n                          </label>\n                      </div>\n                      <div class=\"radio\">\n                          <label for=\"sme-azureActiveDirectory\">\n                              <input id=\"sme-azureActiveDirectory\" (click)=\"onAadClick()\" type=\"radio\" formControlName=\"accessType\" [(ngModel)]='accessTypeSelection'\n                                  value='AzureActiveDirectory' />\n                              <span>{{strings.App.SettingsDialog.access.azureAd}}</span>\n                          </label>\n                      </div>\n\n                      <div *ngIf=\"azure && !aadAppCreated\">\n                          <h6>{{strings.App.SettingsDialog.access.connectToGateway}}</h6>\n                          <div class=\"sme-padding-top-xs dialog-message\">{{strings.App.SettingsDialog.access.connectToGatewayDesc}}   &nbsp;\n                          </div>\n                          <div class=\"sme-padding-top-xs\">\n                              <p>{{strings.App.SettingsDialog.access.connectToGatewayTitle}}  &nbsp;</p>\n                              <ol class=\"sme-list-numeric sme-padding-left-lg\" type=\"1\">\n                                  <li><a href=\"https://aka.ms/HonoluluAADscript\" class=\"sme-link\" target=\"_blank\">{{strings.App.SettingsDialog.access.connectStep1}}</a></li>\n                                  <li>{{strings.App.SettingsDialog.access.connectStep2}}</li>\n                                  <li>{{strings.App.SettingsDialog.access.connectStep3}}</li>\n                              </ol>\n                              <div class=\"sme-padding-top-xs\">\n                                  <a href=\"https://aka.ms/HonoluluGatewayAccess\" class=\"sme-link\" target=\"_blank\">\n                                      <span>{{strings.App.SettingsDialog.access.learnMore}}  </span>\n                                      <span class=\"sme-icon icon-win-openInNewWindow\"></span>\n                                  </a>\n                              </div>\n                          </div>\n                      </div>\n\n                      <div *ngIf=\"azure && aadAppCreated\">\n                          <h6>{{strings.App.SettingsDialog.access.manageTitle}}  </h6>\n                          <div class=\"sme-padding-top-xs dialog-message\">{{strings.App.SettingsDialog.access.manageDesc}}  &nbsp;\n                          </div>\n                          <div class=\"sme-padding-top-xs\">\n                              <p>{{strings.App.SettingsDialog.access.manageSubTitle}}  </p>\n                              <ol class=\"sme-list-numeric sme-padding-left-lg\" type=\"1\">\n                                  <li>\n                                      <a class=\"sme-link\" target=\"_blank\" href=\"https://portal.azure.com/#blade/Microsoft_AAD_IAM/ManagedAppMenuBlade/Overview/objectId/{{appObjectId}}/appId/{{appClientId}}\">\n                                          {{strings.App.SettingsDialog.access.manageStep1}}\n                                          <span class=\"sme-icon icon-win-openInNewWindow\"></span>\n                                      </a>\n                                  </li>                  \n                                  <li>{{strings.App.SettingsDialog.access.manageStep2}}</li>\n                                  <li>{{strings.App.SettingsDialog.access.manageStep3}}</li>\n                                  <a href=\"https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal\" class=\"sme-link\"\n                                      target=\"_blank\">\n                                      <span>{{strings.App.SettingsDialog.access.learnMore}}</span>\n                                      <span class=\"sme-icon icon-win-openInNewWindow\"></span>\n                                  </a>\n                              </ol>\n                              <p class=\"sme-padding-top-xs\">{{strings.App.SettingsDialog.access.manageStep4}}</p>\n                          </div>\n                      </div>\n                  </div>\n              </form>\n              <div class=\"pull-left sme-margin-top-md\">\n                  <div class=\"col-md-3 info-icon-div\">\n                      <div class=\"sme-icon sme-icon-warning icon-size info-icon\"> </div>\n                  </div>\n                  <p>{{strings.App.SettingsDialog.access.saveWarning}}</p>\n              </div>\n          </sme-dialog-content>\n          <sme-dialog-footer>\n              <div class=\"pull-right\">\n                  <!-- Save should be enabled after AAD app is created if they have selected Azure radio button -->\n                  <button type=\"submit\" form=\"sme-add-azureGroupInfoForm\" class=\"btn btn-primary\" [disabled]=\"azure && !aadAppCreated\" (click)=\"onConfirm()\">{{strings.App.SettingsDialog.access.save}}</button>\n                  <button type=\"button\" class=\"btn\" (click)=\"onCancel()\">{{strings.App.SettingsDialog.access.cancel}}</button>\n              </div>\n          </sme-dialog-footer>\n      </sme-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    ChangeAccessControlDialogComponent.ctorParameters = function () { return [
        { type: DialogService, },
        { type: AppContextService, },
        { type: FormBuilder, },
        { type: AccessService, },
    ]; };
    return ChangeAccessControlDialogComponent;
}(BaseDialogComponent));
export { ChangeAccessControlDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9kaWFsb2dzL2NoYW5nZS1hY2Nlc3MtY29udHJvbC1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUE2QixNQUFPLGVBQUEsQ0FBZ0I7QUFDN0QsT0FBTyxFQUFFLFdBQUEsRUFBbUMsTUFBTyxnQkFBQSxDQUFpQjtBQUVwRSxPQUFPLEVBQ0gsaUJBQWlCLEVBQ2pCLG1CQUFtQixFQUduQixhQUFhLEVBQ2hCLE1BQU0sMkJBQUEsQ0FBNEI7QUFDbkMsT0FBTyxFQUFFLEdBQUEsRUFBSyxpQkFBQSxFQUFrQixNQUFPLHdCQUFBLENBQXlCO0FBRWhFLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyxtQkFBQSxDQUFvQjtBQXdDbEQ7SUFDSSxzREFBc0Y7SUFvQnRGOztPQUVHO0lBQ0gsNENBQ0ksYUFBNEIsRUFDcEIsaUJBQW9DLEVBQ3BDLFdBQXdCLEVBQ3hCLGFBQTRCO1FBSnhDLFlBTUksa0JBQU0sYUFBYSxDQUFDLFNBQ3ZCO1FBTFcsdUJBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxpQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQXpCakMsYUFBTyxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFXLENBQUMsWUFBWSxDQUFDOztJQTRCekYsQ0FBQztJQUVEOztPQUVHO0lBQ0ksaURBQUksR0FBWCxVQUFZLE9BQXlDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFLENB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QUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQyxFQUNELFVBQUEsS0FBSztZQUNELEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztRQUVQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDL0IsVUFBVSxFQUFFLElBQUksQ0FBQyxtQkFBbUI7U0FDdkMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLHNEQUFTLEdBQWpCLFVBQWtCLE9BQWUsRUFBRSxLQUF3QjtRQUN2RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FDckMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQzFDLEtBQUssRUFDTCxPQUFPLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRU8sNERBQWUsR0FBdkI7UUFBQSxpQkFPQztRQU5HLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxRQUFRO1lBQzFGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxLQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7Z0JBQ3hDLEtBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0UsNkNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsa0NBQWtDO29CQUM1QyxRQUFRLEVBQUUsOGdNQXFGVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsaURBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztRQUN2QixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxXQUFXLEdBQUc7UUFDckIsRUFBQyxJQUFJLEVBQUUsYUFBYSxHQUFHO0tBQ3RCLEVBTDZGLENBSzdGLENBQUM7SUFDRix5Q0FBQztDQXRQRCxBQXNQQyxDQXJQRyxtQkFBbUIsR0FxUHRCO1NBdFBZLGtDQUFrQyIsImZpbGUiOiJjaGFuZ2UtYWNjZXNzLWNvbnRyb2wtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=