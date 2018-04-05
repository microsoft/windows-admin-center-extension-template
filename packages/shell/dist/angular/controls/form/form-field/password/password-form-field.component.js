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
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable password field implementation
 */
var PasswordFormFieldComponent = /** @class */ (function (_super) {
    __extends(PasswordFormFieldComponent, _super);
    /**
     * Initializes a new instance of the PasswordFormFieldComponent
     */
    function PasswordFormFieldComponent(injector) {
        return _super.call(this, injector) || this;
    }
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    PasswordFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    PasswordFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="password"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <div>\n          <input type=\"password\" [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" [required]=\"required\" [disabled]=\"disabled\" [(ngModel)]=\"value\" [placeholder]=\"placeholder\">\n          <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      </div>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    PasswordFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return PasswordFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { PasswordFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3Bhc3N3b3JkL3Bhc3N3b3JkLWZvcm0tZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUF3QixRQUFBLEVBQXdCLE1BQU8sZUFBQSxDQUFnQjtBQUNoRixPQUFPLEVBQUUsNkJBQUEsRUFBOEIsTUFBTyx5QkFBQSxDQUEwQjtBQUV4RTs7R0FFRztBQUVIO0lBQWdELDhDQUFrQztJQUU5RTs7T0FFRztJQUNILG9DQUNJLFFBQWtCO2VBRWxCLGtCQUFNLFFBQVEsQ0FBQztJQUNuQixDQUFDO0lBRUQ7OztPQUdHO0lBQ08sZ0RBQVcsR0FBckI7UUFDSSxNQUFNLENBQUM7WUFDSCxXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFBO0lBQ0wsQ0FBQztJQUNFLHFDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLGlDQUFpQztvQkFDM0MsUUFBUSxFQUFFLHcxQkFXVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gseUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0YsaUNBQUM7Q0F6Q0QsQUF5Q0MsQ0F6QytDLDZCQUE2QixHQXlDNUU7U0F6Q1ksMEJBQTBCIiwiZmlsZSI6InBhc3N3b3JkLWZvcm0tZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==