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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Component, HostBinding, Injector } from '@angular/core';
import { SmeInternalOptionsFormFieldComponent } from '../options-form-field/options-form-field.component';
/**
 * Accessable Implementation of a form field for a set of .sme-checkbox
 */
var ChecklistFormFieldComponent = /** @class */ (function (_super) {
    __extends(ChecklistFormFieldComponent, _super);
    /**
     * Initializes a new instance of the ChecklistFormFieldComponent
     */
    function ChecklistFormFieldComponent(injector) {
        return _super.call(this, injector) || this;
    }
    Object.defineProperty(ChecklistFormFieldComponent.prototype, "ariaLabel", {
        /**
         * The aria label for this instance
         */
        get: function () {
            return this.getMergedDescriptionLabel();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnInit interface
     */
    ChecklistFormFieldComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setAttribute('role', 'group');
    };
    /**
     * Handle for when any option is checked or unchecked
     */
    ChecklistFormFieldComponent.prototype.onOptionChanged = function () {
        // in order to actually trigger value changes, we need to assign the object to a new object. 
        // cloning the object achieves this purpose.
        this.value = __assign({}, this.value);
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    ChecklistFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    ChecklistFormFieldComponent.prototype.validate = function (c) {
        var _this = this;
        if (this.required) {
            if (MsftSme.isNullOrUndefined(this.value)) {
                return { required: true };
            }
            var keys = Object.keys(this.value);
            if (keys.length === 0 || keys.every(function (k) { return !_this.value[k]; })) {
                return { required: true };
            }
        }
        return _super.prototype.validate.call(this, c);
    };
    ChecklistFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="checklist"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <ng-container *ngIf=\"value\">\n          <ng-container *ngFor=\"let option of options\">\n              <div class=\"sme-checkbox\">\n                  <label>\n                      <input type=\"checkbox\" [attr.aria-label]=\"option.label\" (change)=\"onOptionChanged()\" [attr.aria-checked]=\"!!value[option.value]\" [(ngModel)]=\"value[option.value]\" [attr.aria-required]=\"required\" [disabled]=\"disabled\">\n                      <span aria-hidden=\"true\">{{option.label}}</span>\n                  </label>\n              </div>\n              <fieldset *ngIf=\"option.subFormTemplate\" [disabled]=\"disabled || !value[option.value]\">\n                  <sme-option-template-loader [template]=\"option.subFormTemplate\" [data]=\"option\" [optionIndex]=\"optionIndex\"></sme-option-template-loader>\n              </fieldset>\n          </ng-container>\n      </ng-container>\n\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    ChecklistFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    ChecklistFormFieldComponent.propDecorators = {
        'ariaLabel': [{ type: HostBinding, args: ['attr.aria-label',] },],
    };
    return ChecklistFormFieldComponent;
}(SmeInternalOptionsFormFieldComponent));
export { ChecklistFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL2NoZWNrbGlzdC9jaGVja2xpc3QtZm9ybS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxXQUFBLEVBQWEsUUFBQSxFQUF3QixNQUFPLGVBQUEsQ0FBZ0I7QUFHaEYsT0FBTyxFQUFFLG9DQUFBLEVBQXFDLE1BQU8sb0RBQUEsQ0FBcUQ7QUFFMUc7O0dBRUc7QUFFSDtJQUFpRCwrQ0FBZ0U7SUFVN0c7O09BRUc7SUFDSCxxQ0FDSSxRQUFrQjtlQUVsQixrQkFBTSxRQUFRLENBQUM7SUFDbkIsQ0FBQztJQVhELHNCQUFXLGtEQUFTO1FBSnBCOztXQUVHO2FBRUg7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDNUMsQ0FBQzs7O09BQUE7SUFXRDs7T0FFRztJQUNJLDhDQUFRLEdBQWY7UUFDSSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxxREFBZSxHQUF0QjtRQUNJLDZGQUE2RjtRQUM3Riw0Q0FBNEM7UUFDNUMsSUFBSSxDQUFDLEtBQUssZ0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDTyxpREFBVyxHQUFyQjtRQUNJLE1BQU0sQ0FBQztZQUNILFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sOENBQVEsR0FBbEIsVUFBbUIsQ0FBYztRQUFqQyxpQkFjQztRQVpHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDOUIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsaUJBQU0sUUFBUSxZQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRSxzQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxrQ0FBa0M7b0JBQzVDLFFBQVEsRUFBRSwrNENBcUJUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwwQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDSywwQ0FBYyxHQUEyQztRQUNoRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUcsRUFBRSxFQUFFO0tBQ2pFLENBQUM7SUFDRixrQ0FBQztDQXBHRCxBQW9HQyxDQXBHZ0Qsb0NBQW9DLEdBb0dwRjtTQXBHWSwyQkFBMkIiLCJmaWxlIjoiY2hlY2tsaXN0LWZvcm0tZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==