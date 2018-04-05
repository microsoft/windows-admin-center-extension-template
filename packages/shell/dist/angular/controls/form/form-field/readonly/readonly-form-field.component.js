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
 * Accessable Implementation of a readonly form field
 */
var ReadonlyFormFieldComponent = /** @class */ (function (_super) {
    __extends(ReadonlyFormFieldComponent, _super);
    /**
     * Initializes a new instance of the ToggleSwitchFormFieldComponent
     */
    function ReadonlyFormFieldComponent(injector) {
        return _super.call(this, injector) || this;
    }
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    ReadonlyFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    ReadonlyFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="readonly"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"></span>\n      </label>\n      <p role=\"textbox\" [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" tabindex=\"0\">{{value}}</p>\n      <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n    "
                },] },
    ];
    /** @nocollapse */
    ReadonlyFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return ReadonlyFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { ReadonlyFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3JlYWRvbmx5L3JlYWRvbmx5LWZvcm0tZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFDcEQsT0FBTyxFQUFFLDZCQUFBLEVBQThCLE1BQU8seUJBQUEsQ0FBMEI7QUFFeEU7O0dBRUc7QUFFSDtJQUFnRCw4Q0FBc0M7SUFFbEY7O09BRUc7SUFDSCxvQ0FDSSxRQUFrQjtlQUVsQixrQkFBTSxRQUFRLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7T0FHRztJQUNPLGdEQUFXLEdBQXJCO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsV0FBVyxFQUFFLEVBQUU7U0FDbEIsQ0FBQTtJQUNMLENBQUM7SUFDRSxxQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxpQ0FBaUM7b0JBQzNDLFFBQVEsRUFBRSxnZ0JBT1Q7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHlDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxRQUFRLEdBQUc7S0FDakIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNGLGlDQUFDO0NBckNELEFBcUNDLENBckMrQyw2QkFBNkIsR0FxQzVFO1NBckNZLDBCQUEwQiIsImZpbGUiOiJyZWFkb25seS1mb3JtLWZpZWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=