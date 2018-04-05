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
import { Directive, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { KeyCode } from '../../../../core';
import { ValidationAlertSeverity } from '../validation-alert/validation-alert';
import { FormValidatorBase } from './base-validator';
/**
 * Provider for the FormFieldValidatorDirective directive
 */
export var CAPSLOCK_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return CapsLockValidatorDirective; }),
    multi: true
};
/**
 * A Directive that adds the adds a warning when the CAPSLOCK key is on.
 * Applies to sme-form-field[type="password] and [smeCapsLock]
 */
var CapsLockValidatorDirective = /** @class */ (function (_super) {
    __extends(CapsLockValidatorDirective, _super);
    /**
     * Instantiates a new instance of CapsLockValidatorDirective
     */
    function CapsLockValidatorDirective() {
        var _this = _super.call(this) || this;
        /**
         * Internal placeholder for warnOnCapsLock
         */
        _this.internalWarnOnCapsLock = true;
        /**
         * Indicates the state of the capslock key
         */
        _this.isCapsLockOn = false;
        // Microsoft Edge looks for this value to disable the automatic capslock warning. For consistency, we want to use our own behavior;
        document.msCapsLockWarningOff = true;
        return _this;
    }
    Object.defineProperty(CapsLockValidatorDirective.prototype, "warnOnCapsLock", {
        /**
         * Indicates that a warning should be thrown if capslock is on
         */
        get: function () { return this.internalWarnOnCapsLock; },
        set: function (value) {
            // warn if value is undefined or truthy and not 'false' string
            this.internalWarnOnCapsLock = MsftSme.isUndefined(value) || (!!value && "" + value !== 'false');
            this.revalidate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of Validator interface.
     * Validates the state of the capslock key for this form control
     * @param c The FormControl attached to this element
     * @return null when valid, otherwise returns a validation object
     */
    CapsLockValidatorDirective.prototype.validate = function (c) {
        var alerts = _super.prototype.validate.call(this, c) || {};
        if (this.warnOnCapsLock && this.isCapsLockOn) {
            var strings_1 = MsftSme.self().Resources.strings;
            alerts['smeCapsLock'] = {
                valid: true,
                message: strings_1.MsftSmeShell.Angular.Common.Form.Validation.Capslock.message,
                severity: ValidationAlertSeverity.Warning
            };
        }
        return this.nullIfNoAlerts(alerts);
    };
    /**
     * We dont have a way to truly monitor for capslock.
     * The best we can do is listen to every keydown and turn the warning on if we detect that its on
     * @param event
     */
    CapsLockValidatorDirective.prototype.onKeydown = function (event) {
        var oldIsCapsLockOn = this.isCapsLockOn;
        this.isCapsLockOn = event.getModifierState(KeyCode[KeyCode.CapsLock]);
        if (oldIsCapsLockOn !== this.isCapsLockOn) {
            this.revalidate();
        }
    };
    CapsLockValidatorDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:max-line-length
                    selector: '[smeCapsLock][formControlName],[smeCapsLock][formControl],[smeCapsLock][ngModel],sme-form-field[type="password"][formControlName],sme-form-field[type="password"][formControl],sme-form-field[type="password"][ngModel]',
                    providers: [CAPSLOCK_VALIDATOR]
                },] },
    ];
    /** @nocollapse */
    CapsLockValidatorDirective.ctorParameters = function () { return []; };
    CapsLockValidatorDirective.propDecorators = {
        'warnOnCapsLock': [{ type: Input, args: ['smeCapsLock',] },],
        'onKeydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    };
    return CapsLockValidatorDirective;
}(FormValidatorBase));
export { CapsLockValidatorDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS92YWxpZGF0b3JzL2NhcHNsb2NrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxVQUFBLEVBQVksWUFBQSxFQUFjLEtBQUEsRUFBc0IsTUFBTyxlQUFBLENBQWdCO0FBQzNGLE9BQU8sRUFBZSxhQUFBLEVBQWMsTUFBTyxnQkFBQSxDQUFpQjtBQUM1RCxPQUFPLEVBQUUsT0FBQSxFQUFRLE1BQU8sa0JBQUEsQ0FBbUI7QUFFM0MsT0FBTyxFQUFvQix1QkFBQSxFQUF3QixNQUFPLHNDQUFBLENBQXVDO0FBQ2pHLE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLGtCQUFBLENBQW1CO0FBRXJEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sa0JBQUEsR0FBcUM7SUFDOUMsT0FBTyxFQUFFLGFBQUE7SUFDVCxXQUFXLEVBQUUsVUFBQSxDQUFXLGNBQU0sT0FBQSwwQkFBQSxFQUFBLENBQUEsQ0FBMkI7SUFDekQsS0FBSyxFQUFFLElBQUE7Q0FDVixDQUFDO0FBRUY7OztHQUdHO0FBRUg7SUFBZ0QsOENBQWlCO0lBdUI3RDs7T0FFRztJQUNIO1FBQUEsWUFDSSxpQkFBTyxTQUdWO1FBakJEOztXQUVHO1FBQ0ssNEJBQXNCLEdBQUcsSUFBSSxDQUFDO1FBRXRDOztXQUVHO1FBQ0ssa0JBQVksR0FBRyxLQUFLLENBQUM7UUFPekIsbUlBQW1JO1FBQ25JLFFBQVEsQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7O0lBQ3pDLENBQUM7SUF4QkQsc0JBQVcsc0RBQWM7UUFKekI7O1dBRUc7YUFFSCxjQUF1QyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQzthQUM1RSxVQUEwQixLQUFjO1lBQ3BDLDhEQUE4RDtZQUM5RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBRyxLQUFPLEtBQUssT0FBTyxDQUFDLENBQUM7WUFDaEcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RCLENBQUM7OztPQUwyRTtJQTBCNUU7Ozs7O09BS0c7SUFDSSw2Q0FBUSxHQUFmLFVBQWdCLENBQWM7UUFDMUIsSUFBSSxNQUFNLEdBQXFCLGlCQUFNLFFBQVEsWUFBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLFNBQU8sR0FBWSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUN4RCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUc7Z0JBQ3BCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE9BQU8sRUFBRSxTQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTztnQkFDN0UsUUFBUSxFQUFFLHVCQUF1QixDQUFDLE9BQU87YUFDNUMsQ0FBQztRQUNOLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUVJLDhDQUFTLEdBQWhCLFVBQWlCLEtBQW9CO1FBQ2pDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDeEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQztJQUNMLENBQUM7SUFDRSxxQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLDJDQUEyQztvQkFDM0MsUUFBUSxFQUFFLHlOQUF5TjtvQkFDbk8sU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUM7aUJBQ2xDLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx5Q0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLHlDQUFjLEdBQTJDO1FBQ2hFLGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsRUFBRyxFQUFFLEVBQUU7UUFDN0QsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFHLEVBQUUsRUFBRTtLQUN0RSxDQUFDO0lBQ0YsaUNBQUM7Q0E5RUQsQUE4RUMsQ0E5RStDLGlCQUFpQixHQThFaEU7U0E5RVksMEJBQTBCIiwiZmlsZSI6ImNhcHNsb2NrLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=