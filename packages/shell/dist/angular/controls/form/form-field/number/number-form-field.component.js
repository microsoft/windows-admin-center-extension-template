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
import { Component, Injector, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { KeyCode } from '../../../../../core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable number field implementation
 */
var NumberFormFieldComponent = /** @class */ (function (_super) {
    __extends(NumberFormFieldComponent, _super);
    /**
     * Initializes a new instance of the SliderFormFieldComponent
     */
    function NumberFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.step = 1;
        _this.min = 0;
        return _this;
        // no default maximum
    }
    /**
     * Handle keydown events on the number input
     * @param event
     */
    NumberFormFieldComponent.prototype.onInputKeydown = function (event) {
        // In Microsoft Edge and IE, numeric inputs will scroll the page while incrementing/decrementing the number.
        switch (event.keyCode) {
            case KeyCode.UpArrow: {
                event.preventDefault();
                this.increment();
                break;
            }
            case KeyCode.DownArrow: {
                event.preventDefault();
                this.decrement();
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * Increments the controls value by 1 "step"
     */
    NumberFormFieldComponent.prototype.increment = function () {
        var value = MsftSme.isNumber(this.value) ? this.value : this.min - 1;
        this.value = value + this.step;
    };
    /**
     * Decrements the controls value by 1 "step"
     */
    NumberFormFieldComponent.prototype.decrement = function () {
        var value = MsftSme.isNumber(this.value) ? this.value : this.min + 1;
        this.value = value - this.step;
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    NumberFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    NumberFormFieldComponent.prototype.validate = function (c) {
        // angulars min and max validator only work via code. So we implement them here.
        if (!MsftSme.isNullOrUndefined(this.min) && this.value < this.min) {
            var errors = Validators.min(this.min)(c);
            if (errors) {
                return errors;
            }
        }
        if (!MsftSme.isNullOrUndefined(this.max) && this.value > this.max) {
            var errors = Validators.max(this.max)(c);
            if (errors) {
                return errors;
            }
        }
        return _super.prototype.validate.call(this, c);
    };
    NumberFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="number"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n              <span class=\"sme-position-flex-auto\">{{label}}</span>\n              <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n              <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n          </label>\n      <div>\n          <input type=\"number\" [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" autocomplete=\"off\" [required]=\"required\" [disabled]=\"disabled\" [(ngModel)]=\"value\" [max]=\"max\" [attr.aria-valuemax]=\"max\" [min]=\"min\" [attr.aria-valuemin]=\"min\"\n              [step]=\"step\" [placeholder]=\"placeholder\" (keydown)=\"onInputKeydown($event)\">\n          <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      </div>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    NumberFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    NumberFormFieldComponent.propDecorators = {
        'step': [{ type: Input },],
        'min': [{ type: Input },],
        'max': [{ type: Input },],
    };
    return NumberFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { NumberFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL251bWJlci9udW1iZXItZm9ybS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQXdCLFFBQUEsRUFBVSxLQUFBLEVBQWMsTUFBTyxlQUFBLENBQWdCO0FBQ2hGLE9BQU8sRUFBZSxVQUFBLEVBQVcsTUFBTyxnQkFBQSxDQUFpQjtBQUN6RCxPQUFPLEVBQUUsT0FBQSxFQUFRLE1BQU8scUJBQUEsQ0FBc0I7QUFDOUMsT0FBTyxFQUFFLDZCQUFBLEVBQThCLE1BQU8seUJBQUEsQ0FBMEI7QUFFeEU7O0dBRUc7QUFFSDtJQUE4Qyw0Q0FBcUM7SUFtQi9FOztPQUVHO0lBQ0gsa0NBQ0ksUUFBa0I7UUFEdEIsWUFHSSxrQkFBTSxRQUFRLENBQUMsU0FJbEI7UUFIRyxLQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztRQUNiLHFCQUFxQjtJQUN6QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksaURBQWMsR0FBckIsVUFBc0IsS0FBb0I7UUFDdEMsNEdBQTRHO1FBQzVHLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNuQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDakIsS0FBSyxDQUFDO1lBQ1YsQ0FBQztZQUNELEtBQUssT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNyQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDakIsS0FBSyxDQUFDO1lBQ1YsQ0FBQztZQUNELFNBQVMsQ0FBQztnQkFBQyxNQUFNLENBQUM7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