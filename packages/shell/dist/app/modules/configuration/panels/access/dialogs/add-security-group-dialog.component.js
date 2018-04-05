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
import { AppContextService, BaseDialogComponent, DialogService } from '../../../../../../angular';
import { AccessService } from '../access.service';
var AddSecurityGroupDialogComponent = /** @class */ (function (_super) {
    __extends(AddSecurityGroupDialogComponent, _super);
    /**
     * Initializes a new instance of the ConfirmationDialogComponent class.
     */
    function AddSecurityGroupDialogComponent(dialogService, appContextService, formBuilder, accessService) {
        var _this = _super.call(this, dialogService) || this;
        _this.appContextService = appContextService;
        _this.formBuilder = formBuilder;
        _this.accessService = accessService;
        _this.strings = _this.appContextService.resourceCache.getStrings().MsftSmeShell;
        // TODO: Write logic to change this value.
        _this.hideNonStandard = false;
        return _this;
    }
    /**
     * Shows the dialog.
     */
    AddSecurityGroupDialogComponent.prototype.show = function (options) {
        if (!options) {
            throw new Error('ConfirmationDialogComponent.show: Options are required to show the dialog.');
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
    AddSecurityGroupDialogComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.initializeForm();
    };
    /**
     * The method to call when the confirm button is clicked.
     */
    AddSecurityGroupDialogComponent.prototype.onConfirm = function () {
        var results = {
            confirmed: true,
            name: this.name.trim(),
            secGroupType: this.form.get('securityGroupType').value
        };
        this.hide(results);
    };
    AddSecurityGroupDialogComponent.prototype.closeRequested = function (reason) {
        this.onCancel();
    };
    /**
     * The method to call when the cancel button is clicked.
     */
    AddSecurityGroupDialogComponent.prototype.onCancel = function () {
        var results = {
            confirmed: false
        };
        this.hide(results);
    };
    /**
     * Initializes the form components;
     */
    AddSecurityGroupDialogComponent.prototype.initializeForm = function () {
        this.securityGroupTypeSelection = 'SecurityGroup';
        this.form = this.formBuilder.group({
            name: [
                this.name,
                [
                    Validators.required
                ]
            ],
            securityGroupType: [
                this.securityGroupTypeSelection,
                [
                    Validators.required
                ]
            ]
        });
    };
    AddSecurityGroupDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-access-add-security-group-dialog',
                    template: "\n      <sme-dialog #dialog (keyup.enter)=\"onConfirm()\">\n          <sme-dialog-header>\n              <h3 id=\"sme-dialog-title\">{{strings.App.SettingsDialog.access.addSecurityGroupHeader}}</h3>\n          </sme-dialog-header>\n          <sme-dialog-content>\n              <form id=\"sme-add-securityGroupForm\" [formGroup]=\"form\" style=\"position:relative\">\n                  <div class=\"form-group\">\n                      <label for=\"sme-securityGroup-name\" class=\"required-input-label\">{{strings.App.SettingsDialog.access.securityGroupName}}</label>\n                      <input id=\"sme-securityGroup-name\" type=\"text\" class=\"form-control\" formControlName=\"name\" [(ngModel)]=\"name\" aria-required=\"true\" required autofocus>\n                      <label class=\"required-input-label\">{{strings.App.SettingsDialog.access.securityGroupType}}</label>\n                      <div class=\"radio\">\n                          <label for=\"sme-securityGroup-type\">\n                              <input id=\"sme-securityGroup-type\" type=\"radio\" aria-required=\"true\" formControlName=\"securityGroupType\" [(ngModel)]='securityGroupTypeSelection' value='SecurityGroup'/>\n                              <span>{{strings.App.SettingsDialog.access.securityGroup}}</span>\n                          </label>\n                      </div>\n                      <div class=\"radio\">\n                          <label for=\"sme-securityGroup-smartCardGroup\">\n                              <input id=\"sme-securityGroup-smartCardGroup\" type=\"radio\" formControlName=\"securityGroupType\" [(ngModel)]='securityGroupTypeSelection' value='SmartCardGroup'/>\n                              <span>{{strings.App.SettingsDialog.access.smartCardSecurityGroup}}</span>\n                          </label>\n                      </div>\n                      <!--Device group validation work will be reenabled after January release when we have clear info of what to check for.-->\n                      <!-- <div class=\"radio\">\n                          <label>\n                              <input type=\"radio\" name=\"securityGroupType\" formControlName=\"securityGroupType\" value='Machine' [(ngModel)]='securityGroupType' [attr.disabled] = 'hideNonStandard'/>\n                              <span>{{strings.App.SettingsDialog.access.machineSecurityGroup}}</span>\n                          </label>\n                      </div> -->\n                  </div>\n              </form>\n          </sme-dialog-content>\n          <sme-dialog-footer>\n              <div class=\"pull-right\">\n                  <button type=\"submit\" form=\"sme-add-securityGroupForm\" class=\"btn btn-primary\" [disabled]=\"!form.valid\" (click)=\"onConfirm()\">{{strings.App.SettingsDialog.access.save}}</button>\n                  <button type=\"button\" class=\"btn\" (click)=\"onCancel()\">{{strings.App.SettingsDialog.access.cancel}}</button>\n              </div>\n          </sme-dialog-footer>\n      </sme-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    AddSecurityGroupDialogComponent.ctorParameters = function () { return [
        { type: DialogService, },
        { type: AppContextService, },
        { type: FormBuilder, },
        { type: AccessService, },
    ]; };
    return AddSecurityGroupDialogComponent;
}(BaseDialogComponent));
export { AddSecurityGroupDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9kaWFsb2dzL2FkZC1zZWN1cml0eS1ncm91cC1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFrQixNQUFPLGVBQUEsQ0FBZ0I7QUFDbEQsT0FBTyxFQUFFLFdBQUEsRUFBd0IsVUFBQSxFQUFXLE1BQU8sZ0JBQUEsQ0FBaUI7QUFFcEUsT0FBTyxFQUNILGlCQUFpQixFQUNqQixtQkFBbUIsRUFHbkIsYUFBYSxFQUNoQixNQUFNLDJCQUFBLENBQTRCO0FBR25DLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyxtQkFBQSxDQUFvQjtBQTBDbEQ7SUFBcUQsbURBQXNFO0lBZ0J2SDs7T0FFRztJQUNILHlDQUNJLGFBQTRCLEVBQ3BCLGlCQUFvQyxFQUNwQyxXQUF3QixFQUN4QixhQUE0QjtRQUp4QyxZQU1JLGtCQUFNLGFBQWEsQ0FBQyxTQUN2QjtRQUxXLHVCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsbUJBQWEsR0FBYixhQUFhLENBQWU7UUFyQmpDLGFBQU8sR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBVyxDQUFDLFlBQVksQ0FBQztRQVd6RiwwQ0FBMEM7UUFDbkMscUJBQWUsR0FBRyxLQUFLLENBQUM7O0lBWS9CLENBQUM7SUFFRDs7T0FFRztJQUNJLDhDQUFJLEdBQVgsVUFBWSxPQUFpQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7UUFDbEcsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDakQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDM0IsTUFBTSxDQUFDLGlCQUFNLElBQUksWUFBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQ7O09BRUc7SUFDSSxrREFBUSxHQUFmO1FBQ0ksaUJBQU0sUUFBUSxXQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7T0FFRztJQUNJLG1EQUFTLEdBQWhCO1FBQ0ksSUFBTSxPQUFPLEdBQTRCO1lBQ3JDLFNBQVMsRUFBRSxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3RCLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUs7U0FDekQsQ0FBQztRQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLHdEQUFjLEdBQXJCLFVBQXNCLE1BQVc7UUFDN0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7T0FFRztJQUNJLGtEQUFRLEdBQWY7UUFDSSxJQUFNLE9BQU8sR0FBNEI7WUFDckMsU0FBUyxFQUFFLEtBQUs7U0FDbkIsQ0FBQztRQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssd0RBQWMsR0FBdEI7UUFDSSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsZUFBZSxDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDL0IsSUFBSSxFQUFFO2dCQUNGLElBQUksQ0FBQyxJQUFJO2dCQUNUO29CQUNJLFVBQVUsQ0FBQyxRQUFRO2lCQUN0QjthQUNKO1lBQ0QsaUJBQWlCLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLDBCQUEwQjtnQkFDL0I7b0JBQ0ksVUFBVSxDQUFDLFFBQVE7aUJBQ3RCO2FBQ0o7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UsMENBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsc0NBQXNDO29CQUNoRCxRQUFRLEVBQUUsNDlGQXdDVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsOENBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztRQUN2QixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxXQUFXLEdBQUc7UUFDckIsRUFBQyxJQUFJLEVBQUUsYUFBYSxHQUFHO0tBQ3RCLEVBTDZGLENBSzdGLENBQUM7SUFDRixzQ0FBQztDQTNKRCxBQTJKQyxDQTNKb0QsbUJBQW1CLEdBMkp2RTtTQTNKWSwrQkFBK0IiLCJmaWxlIjoiYWRkLXNlY3VyaXR5LWdyb3VwLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9