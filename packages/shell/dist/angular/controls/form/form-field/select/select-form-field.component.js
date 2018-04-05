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
import { Component, Injector } from '@angular/core';
import { SmeInternalOptionsFormFieldComponent } from '../options-form-field/options-form-field.component';
/**
 * Accessable Implementation of a form field for .sme-select
 */
var SelectFormFieldComponent = /** @class */ (function (_super) {
    __extends(SelectFormFieldComponent, _super);
    /**
     * Initializes a new instance of the SelectFormFieldComponent
     */
    function SelectFormFieldComponent(injector) {
        return _super.call(this, injector) || this;
    }
    Object.defineProperty(SelectFormFieldComponent.prototype, "defaultImmediateValidation", {
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
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    SelectFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    SelectFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="select"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <div class=\"sme-select\">\n          <select [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" [required]=\"required\" [disabled]=\"disabled\" [(ngModel)]=\"value\">\n              <option *ngFor=\"let option of options\" [value]=\"option.value\">{{ option.label || option.value }}</option>\n          </select>\n      </div>\n      <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    SelectFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return SelectFormFieldComponent;
}(SmeInternalOptionsFormFieldComponent));
export { SelectFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3NlbGVjdC9zZWxlY3QtZm9ybS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQXdCLFFBQUEsRUFBd0IsTUFBTyxlQUFBLENBQWdCO0FBQ2hGLE9BQU8sRUFBRSxvQ0FBQSxFQUFxQyxNQUFPLG9EQUFBLENBQXFEO0FBRTFHOztHQUVHO0FBRUg7SUFBOEMsNENBQXlDO0lBVW5GOztPQUVHO0lBQ0gsa0NBQ0ksUUFBa0I7ZUFFbEIsa0JBQU0sUUFBUSxDQUFDO0lBQ25CLENBQUM7SUFYRCxzQkFBYyxnRUFBMEI7UUFKeEM7OztXQUdHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBV0Q7OztPQUdHO0lBQ08sOENBQVcsR0FBckI7UUFDSSxNQUFNLENBQUM7WUFDSCxXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFBO0lBQ0wsQ0FBQztJQUVFLG1DQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLCtCQUErQjtvQkFDekMsUUFBUSxFQUFFLDQ4QkFhVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsdUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0YsK0JBQUM7Q0FwREQsQUFvREMsQ0FwRDZDLG9DQUFvQyxHQW9EakY7U0FwRFksd0JBQXdCIiwiZmlsZSI6InNlbGVjdC1mb3JtLWZpZWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=