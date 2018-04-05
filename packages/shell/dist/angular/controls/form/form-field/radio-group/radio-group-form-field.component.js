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
import { Component, HostBinding, Injector } from '@angular/core';
import { SmeInternalOptionsFormFieldComponent } from '../options-form-field/options-form-field.component';
/**
 * Accessable Implementation of a form field for a set of .sme-radio
 */
var RadioGroupFormFieldComponent = /** @class */ (function (_super) {
    __extends(RadioGroupFormFieldComponent, _super);
    /**
     * Initializes a new instance of the RadioGroupFormFieldComponent
     */
    function RadioGroupFormFieldComponent(injector) {
        return _super.call(this, injector) || this;
    }
    Object.defineProperty(RadioGroupFormFieldComponent.prototype, "ariaLabel", {
        /**
         * The aria label for this instance
         */
        get: function () {
            return this.getMergedDescriptionLabel();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadioGroupFormFieldComponent.prototype, "defaultImmediateValidation", {
        /**
         * Indicates the default value for immediateValidation.
         * This is meant to be overridden by derived classes
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnInit interface
     */
    RadioGroupFormFieldComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setAttribute('role', 'radiogroup');
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    RadioGroupFormFieldComponent.prototype.createIdBag = function () {
        return {
            groupName: ''
        };
    };
    RadioGroupFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="radiogroup"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\" *ngIf=\"label\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <ng-container *ngFor=\"let option of options; let optionIndex = index\">\n          <div class=\"sme-radio\">\n              <label>\n                  <input type=\"radio\" [attr.aria-label]=\"option.label\" [attr.aria-selected]=\"option.value === value\" [attr.aria-checked]=\"option.value === value\" [name]=\"idBag.groupName\" [value]=\"option.value\" [(ngModel)]=\"value\" [attr.aria-required]=\"required\" [disabled]=\"disabled\">\n                  <span aria-hidden=\"true\">{{option.label}}</span>\n              </label>\n          </div>\n          <fieldset *ngIf=\"option.subFormTemplate\" [disabled]=\"disabled || option.value !== value\">\n              <sme-option-template-loader [template]=\"option.subFormTemplate\" [data]=\"option\" [optionIndex]=\"optionIndex\"></sme-option-template-loader>\n          </fieldset>\n      </ng-container>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    RadioGroupFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    RadioGroupFormFieldComponent.propDecorators = {
        'ariaLabel': [{ type: HostBinding, args: ['attr.aria-label',] },],
    };
    return RadioGroupFormFieldComponent;
}(SmeInternalOptionsFormFieldComponent));
export { RadioGroupFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3JhZGlvLWdyb3VwL3JhZGlvLWdyb3VwLWZvcm0tZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFdBQUEsRUFBYSxRQUFBLEVBQXdCLE1BQU8sZUFBQSxDQUFnQjtBQUNoRixPQUFPLEVBQUUsb0NBQUEsRUFBcUMsTUFBTyxvREFBQSxDQUFxRDtBQUUxRzs7R0FFRztBQUVIO0lBQWtELGdEQUF5QztJQWtCdkY7O09BRUc7SUFDSCxzQ0FDSSxRQUFrQjtlQUVsQixrQkFBTSxRQUFRLENBQUM7SUFDbkIsQ0FBQztJQW5CRCxzQkFBVyxtREFBUztRQUpwQjs7V0FFRzthQUVIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQzVDLENBQUM7OztPQUFBO0lBTUQsc0JBQWMsb0VBQTBCO1FBSnhDOzs7V0FHRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQVdEOztPQUVHO0lBQ0ksK0NBQVEsR0FBZjtRQUNJLGlCQUFNLFFBQVEsV0FBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7O09BR0c7SUFDTyxrREFBVyxHQUFyQjtRQUNJLE1BQU0sQ0FBQztZQUNILFNBQVMsRUFBRSxFQUFFO1NBQ2hCLENBQUE7SUFDTCxDQUFDO0lBRUUsdUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsbUNBQW1DO29CQUM3QyxRQUFRLEVBQUUsaTRDQWtCVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsMkNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0ssMkNBQWMsR0FBMkM7UUFDaEUsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLGlCQUFpQixFQUFHLEVBQUUsRUFBRTtLQUNqRSxDQUFDO0lBQ0YsbUNBQUM7Q0E1RUQsQUE0RUMsQ0E1RWlELG9DQUFvQyxHQTRFckY7U0E1RVksNEJBQTRCIiwiZmlsZSI6InJhZGlvLWdyb3VwLWZvcm0tZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==