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
import { Directive, EventEmitter, forwardRef, Output } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { FormValidatorBase } from '../validators/base-validator';
/**
 * Provider for the FormFieldValidatorDirective directive
 */
export var FORM_FIELD_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return FormFieldValidatorDirective; }),
    multi: true
};
/**
 * Implementation of Validator for sme-form-field
 * The selector for this directive must match @see FormFieldComponent.selector. see FormFieldComponent for details.
 */
var FormFieldValidatorDirective = /** @class */ (function (_super) {
    __extends(FormFieldValidatorDirective, _super);
    /**
     * Instantiates a new instance of FormFieldValidatorDirective
     */
    function FormFieldValidatorDirective() {
        var _this = _super.call(this) || this;
        /**
         * EventEmitter for checking validation and raising alerts
         * Subscribers are expected to populate the 'alerts' map with there own validation alerts
         */
        _this.customValidate = new EventEmitter();
        return _this;
    }
    /**
     * Implementation of Validator interface.
     * Validates the value of this elements form control. Use the @see checkValidate event to hook into this function.
     * @param c The FormControl attached to this element
     * @return null when valid, otherwise returns a validation object in the form of "{ errorType: {valid: false} }".
     */
    FormFieldValidatorDirective.prototype.validate = function (c) {
        var alerts = _super.prototype.validate.call(this, c) || {};
        this.customValidate.emit({ formControl: c, alerts: alerts });
        return this.nullIfNoAlerts(alerts);
    };
    FormFieldValidatorDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector > Reason: see comment above
                    selector: 'sme-form-field',
                    providers: [FORM_FIELD_VALIDATOR]
                },] },
    ];
    /** @nocollapse */
    FormFieldValidatorDirective.ctorParameters = function () { return []; };
    FormFieldValidatorDirective.propDecorators = {
        'customValidate': [{ type: Output },],
    };
    return FormFieldValidatorDirective;
}(FormValidatorBase));
export { FormFieldValidatorDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQtdmFsaWRhdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxZQUFBLEVBQWMsVUFBQSxFQUFZLE1BQUEsRUFBdUIsTUFBTyxlQUFBLENBQWdCO0FBQzVGLE9BQU8sRUFBZSxhQUFBLEVBQXNELE1BQU8sZ0JBQUEsQ0FBaUI7QUFFcEcsT0FBTyxFQUFFLGlCQUFBLEVBQWtCLE1BQU8sOEJBQUEsQ0FBK0I7QUFpQmpFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sb0JBQUEsR0FBdUM7SUFDaEQsT0FBTyxFQUFFLGFBQUE7SUFDVCxXQUFXLEVBQUUsVUFBQSxDQUFXLGNBQU0sT0FBQSwyQkFBQSxFQUFBLENBQUEsQ0FBNEI7SUFDMUQsS0FBSyxFQUFFLElBQUE7Q0FDVixDQUFDO0FBRUY7OztHQUdHO0FBRUg7SUFBaUQsK0NBQWlCO0lBUzlEOztPQUVHO0lBQ0g7UUFBQSxZQUNJLGlCQUFPLFNBQ1Y7UUFaRDs7O1dBR0c7UUFFSSxvQkFBYyxHQUEyQyxJQUFJLFlBQVksRUFBNEIsQ0FBQzs7SUFPN0csQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksOENBQVEsR0FBZixVQUFnQixDQUFjO1FBQzFCLElBQUksTUFBTSxHQUFxQixpQkFBTSxRQUFRLFlBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0Usc0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QiwwRUFBMEU7b0JBQzFFLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNwQyxFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsMENBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDSywwQ0FBYyxHQUEyQztRQUNoRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO0tBQ3BDLENBQUM7SUFDRixrQ0FBQztDQXhDRCxBQXdDQyxDQXhDZ0QsaUJBQWlCLEdBd0NqRTtTQXhDWSwyQkFBMkIiLCJmaWxlIjoiZm9ybS1maWVsZC12YWxpZGF0b3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==