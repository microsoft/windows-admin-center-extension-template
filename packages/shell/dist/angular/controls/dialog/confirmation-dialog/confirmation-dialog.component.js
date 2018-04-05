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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { RpcAlertSeverity } from '../../../../core/rpc/rpc-dialogs';
import { Deprecated } from '../../common';
import { BaseDialogComponent } from '../base-dialog.component';
import { DialogService } from '../dialog.service';
var ConfirmationDialogComponent = /** @class */ (function (_super) {
    __extends(ConfirmationDialogComponent, _super);
    /**
     * Initializes a new instance of the ConfirmationDialogComponent class.
     */
    function ConfirmationDialogComponent(dialogService) {
        return _super.call(this, dialogService) || this;
    }
    /**
     * handler for when a close is requested
     * this override cancels the confirmation when requested to close
     * @param reason - reason for the close following DialogCloseReason
     */
    ConfirmationDialogComponent.prototype.closeRequested = function (reason) {
        this.onCancel();
    };
    /**
     * Shows the dialog.
     *
     * @param options The options for the dialog.
     * @return The dialog result subject.
     */
    ConfirmationDialogComponent.prototype.show = function (options) {
        if (!options) {
            throw new Error('ConfirmationDialogComponent.show: Options are required to show the dialog.');
        }
        var result = _super.prototype.show.call(this, options);
        this.cancelButtonText = options.cancelButtonText;
        this.checkboxText = options.checkboxText;
        this.doubleCheckText = options.doubleCheckText;
        this.checked = false;
        this.doubleChecked = false;
        this.confirmButtonText = options.confirmButtonText;
        this.message = options.message;
        this.title = options.title;
        this.alert = options.alert;
        this.alertButtonStyle = options.alertButtonStyle;
        return result;
    };
    Object.defineProperty(ConfirmationDialogComponent.prototype, "isCritical", {
        get: function () {
            return (this.alert && this.alert.severity === RpcAlertSeverity.Error) || this.alertButtonStyle === RpcAlertSeverity.Error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfirmationDialogComponent.prototype, "isWarning", {
        get: function () {
            return (this.alert && this.alert.severity === RpcAlertSeverity.Warning) || this.alertButtonStyle === RpcAlertSeverity.Warning;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The method to call when the confirm button is clicked.
     */
    ConfirmationDialogComponent.prototype.onConfirm = function () {
        this.hide({
            confirmed: true,
            checkboxResult: (this.checkboxText) ? this.checked : null
        });
    };
    /**
     * The method to call when the cancel button is clicked.
     */
    ConfirmationDialogComponent.prototype.onCancel = function () {
        this.hide({
            confirmed: false
        });
    };
    ConfirmationDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-confirmation-dialog',
                    template: "\n      <sme-dialog #dialog dialogMode=\"centered\" [clickBackdrop]='false'>\n          <sme-dialog-header>\n              <h2 id=\"sme-dialog-title\">{{ title }}</h2>\n          </sme-dialog-header>\n          <sme-dialog-content>\n              <p id=\"sme-dialog-desc\">{{ message }}</p>\n              <div class=\"sme-checkbox sme-margin-top-sm\" *ngIf=\"checkboxText\">\n                  <label class=\"sme-font-body\">\n              <input type=\"checkbox\" [(ngModel)]=\"checked\"/>\n              <span>{{checkboxText}}</span>\n            </label>\n              </div>\n              <div class=\"sme-checkbox sme-margin-top-xs\" *ngIf=\"doubleCheckText\">\n                  <label class=\"sme-font-body\">\n                    <input type=\"checkbox\" [(ngModel)]=\"doubleChecked\"/>\n                    <span>{{doubleCheckText}}</span>\n                  </label>\n              </div>\n              <sme-alert *ngIf=\"alert\" [showBackground]=\"true\" [alert]=\"alert\"></sme-alert>\n          </sme-dialog-content>\n          <sme-dialog-footer>\n              <button type=\"button\" [class.sme-button-critical]=\"isCritical\" [class.sme-button-warning]=\"isWarning\" class=\"sme-button-primary\" [disabled]=\"doubleCheckText && !doubleChecked\" (click)=\"onConfirm()\">{{ confirmButtonText }}</button>\n              <button type=\"button\" (click)=\"onCancel()\">{{ cancelButtonText }}</button>\n          </sme-dialog-footer>\n      </sme-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    ConfirmationDialogComponent.ctorParameters = function () { return [
        { type: DialogService, },
    ]; };
    ConfirmationDialogComponent = __decorate([
        Deprecated({
            deprecatedSince: '02/20/18',
            alternateSignature: 'AppContextService.frame.showDialogConfirmation',
            suppressForShell: true
        }),
        __metadata("design:paramtypes", [DialogService])
    ], ConfirmationDialogComponent);
    return ConfirmationDialogComponent;
}(BaseDialogComponent));
export { ConfirmationDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGlhbG9nL2NvbmZpcm1hdGlvbi1kaWFsb2cvY29uZmlybWF0aW9uLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBRTFDLE9BQU8sRUFBWSxnQkFBQSxFQUFpQixNQUFPLGtDQUFBLENBQW1DO0FBQzlFLE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxjQUFBLENBQWU7QUFDMUMsT0FBTyxFQUFFLG1CQUFBLEVBQWlELE1BQU8sMEJBQUEsQ0FBMkI7QUFFNUYsT0FBTyxFQUFFLGFBQUEsRUFBYyxNQUFPLG1CQUFBLENBQW9CO0FBd0VsRDtJQUFpRCwrQ0FBd0U7SUFpQnJIOztPQUVHO0lBQ0gscUNBQVksYUFBNEI7ZUFDcEMsa0JBQU0sYUFBYSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksb0RBQWMsR0FBckIsVUFBc0IsTUFBeUI7UUFDM0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLDBDQUFJLEdBQVgsVUFBWSxPQUFrQztRQUMxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7UUFDbEcsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLGlCQUFNLElBQUksWUFBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQ2pELElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBRWpELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELHNCQUFXLG1EQUFVO2FBQXJCO1lBQ0ksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssZ0JBQWdCLENBQUMsS0FBSyxDQUFBO1FBQzdILENBQUM7OztPQUFBO0lBQ0Qsc0JBQVcsa0RBQVM7YUFBcEI7WUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUE7UUFDakksQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNJLCtDQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQztZQUNOLFNBQVMsRUFBRSxJQUFJO1lBQ2YsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQzVELENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNJLDhDQUFRLEdBQWY7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ04sU0FBUyxFQUFFLEtBQUs7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNFLHNDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLHM4Q0EwQlQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDBDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxhQUFhLEdBQUc7S0FDdEIsRUFGNkYsQ0FFN0YsQ0FBQztJQXZIVywyQkFBMkI7UUFMdkMsVUFBVSxDQUFDO1lBQ1IsZUFBZSxFQUFFLFVBQVU7WUFDM0Isa0JBQWtCLEVBQUUsZ0RBQWdEO1lBQ3BFLGdCQUFnQixFQUFFLElBQUk7U0FDekIsQ0FBQzt5Q0FxQjZCLGFBQWE7T0FwQi9CLDJCQUEyQixDQXdIdkM7SUFBRCxrQ0FBQztDQXhIRCxBQXdIQyxDQXhIZ0QsbUJBQW1CLEdBd0huRTtTQXhIWSwyQkFBMkIiLCJmaWxlIjoiY29uZmlybWF0aW9uLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9