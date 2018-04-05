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
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable Implementation of a form field for .sme-checkbox
 */
var CheckboxFormFieldComponent = /** @class */ (function (_super) {
    __extends(CheckboxFormFieldComponent, _super);
    /**
     * Initializes a new instance of the TagsInputComponent
     */
    function CheckboxFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.indeterminate = false;
        return _this;
    }
    /**
     * Handler for clicking on the checkbox
     */
    CheckboxFormFieldComponent.prototype.onCheckboxClicked = function () {
        // to mimic the behaviour of html checkboxes, 
        // when the checkbox is clicked (and not disabled), we reset the indeterminate state to false.
        if (!this.disabled) {
            this.indeterminate = false;
        }
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    CheckboxFormFieldComponent.prototype.createIdBag = function () {
        return {
            labelSpan: '',
            detailsSpan: ''
        };
    };
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    CheckboxFormFieldComponent.prototype.validate = function (c) {
        // translate 'required' on checkbox to 'requiredTrue' validator. 
        // requiredTrue does not have  a directive, and the required directive does not surface an error for false values
        if (this.required) {
            var requiredTrue = Validators.requiredTrue(c);
            if (requiredTrue) {
                return requiredTrue;
            }
        }
        return _super.prototype.validate.call(this, c);
    };
    CheckboxFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="checkbox"]',
                    template: "\n      <div class=\"sme-checkbox\">\n          <label class=\"sme-arrange-stack-h\">\n              <input type=\"checkbox\" \n                  [attr.aria-labeledby]=\"idBag.labelSpan\"\n                  [attr.aria-describedby]=\"idBag.detailsSpan\" \n                  [attr.aria-checked]=\"value\" \n                  [attr.aria-required]=\"required\"  \n                  [indeterminate]=\"indeterminate\" \n                  [required]=\"required\" \n                  [disabled]=\"disabled\"\n                  [(ngModel)]=\"value\"\n                  (click)=\"onCheckboxClicked()\">\n              <span class=\"sme-position-flex-auto\" [id]=\"idBag.labelSpan\">{{label}}</span>\n              <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\" aria-hidden=\"true\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n              <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" aria-hidden=\"true\" *ngIf=\"details\" [title]=\"details\"> </span>\n          </label>\n          <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      </div>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    CheckboxFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    CheckboxFormFieldComponent.propDecorators = {
        'indeterminate': [{ type: Input },],
    };
    return CheckboxFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { CheckboxFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL2NoZWNrYm94L2NoZWNrYm94LWZvcm0tZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFFBQUEsRUFBVSxLQUFBLEVBQU0sTUFBTyxlQUFBLENBQWdCO0FBQzNELE9BQU8sRUFBZSxVQUFBLEVBQVcsTUFBTyxnQkFBQSxDQUFpQjtBQUN6RCxPQUFPLEVBQUUsNkJBQUEsRUFBOEIsTUFBTyx5QkFBQSxDQUEwQjtBQUV4RTs7R0FFRztBQUVIO0lBQWdELDhDQUFzQztJQVFsRjs7T0FFRztJQUNILG9DQUNJLFFBQWtCO1FBRHRCLFlBR0ksa0JBQU0sUUFBUSxDQUFDLFNBRWxCO1FBREcsS0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0lBQy9CLENBQUM7SUFFRDs7T0FFRztJQUNJLHNEQUFpQixHQUF4QjtRQUNJLDhDQUE4QztRQUM5Qyw4RkFBOEY7UUFDOUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNPLGdEQUFXLEdBQXJCO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsU0FBUyxFQUFFLEVBQUU7WUFDYixXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFBO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNPLDZDQUFRLEdBQWxCLFVBQW1CLENBQWM7UUFDN0IsaUVBQWlFO1FBQ2pFLGlIQUFpSDtRQUNqSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVELE1BQU0sQ0FBQyxpQkFBTSxRQUFRLFlBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNFLHFDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLGlDQUFpQztvQkFDM0MsUUFBUSxFQUFFLHl0Q0FvQlQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHlDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxRQUFRLEdBQUc7S0FDakIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNLLHlDQUFjLEdBQTJDO1FBQ2hFLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0tBQ2xDLENBQUM7SUFDRixpQ0FBQztDQXZGRCxBQXVGQyxDQXZGK0MsNkJBQTZCLEdBdUY1RTtTQXZGWSwwQkFBMEIiLCJmaWxlIjoiY2hlY2tib3gtZm9ybS1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9