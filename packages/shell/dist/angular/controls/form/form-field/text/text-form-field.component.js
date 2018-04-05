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
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable text field implementation
 */
var TextFormFieldComponent = /** @class */ (function (_super) {
    __extends(TextFormFieldComponent, _super);
    /**
     * Initializes a new instance of the TextFormFieldComponent
     */
    function TextFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        // set initial values for field
        _this.multiline = false;
        _this.columns = 40;
        _this.rows = 5;
        return _this;
    }
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    TextFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    TextFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="text"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <div>\n          <!-- Single Line -->\n          <input *ngIf=\"!multiline\" type=\"text\" [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" [required]=\"required\" [disabled]=\"disabled\" [(ngModel)]=\"value\" [placeholder]=\"placeholder\">\n          <!-- Multiple Line -->\n          <textarea *ngIf=\"multiline\" [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" [required]=\"required\" [disabled]=\"disabled\" [(ngModel)]=\"value\" [rows]=\"rows\" [cols]=\"cols\" [placeholder]=\"placeholder\"></textarea>\n          <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      </div>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    TextFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    TextFormFieldComponent.propDecorators = {
        'multiline': [{ type: Input },],
        'rows': [{ type: Input },],
        'columns': [{ type: Input },],
    };
    return TextFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { TextFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3RleHQvdGV4dC1mb3JtLWZpZWxkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBd0IsUUFBQSxFQUFVLEtBQUEsRUFBYyxNQUFPLGVBQUEsQ0FBZ0I7QUFDaEYsT0FBTyxFQUFFLDZCQUFBLEVBQThCLE1BQU8seUJBQUEsQ0FBMEI7QUFFeEU7O0dBRUc7QUFFSDtJQUE0QywwQ0FBa0M7SUFzQjFFOztPQUVHO0lBQ0gsZ0NBQ0ksUUFBa0I7UUFEdEIsWUFHSSxrQkFBTSxRQUFRLENBQUMsU0FNbEI7UUFMRywrQkFBK0I7UUFDL0IsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsS0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7O0lBRWxCLENBQUM7SUFFRDs7O09BR0c7SUFDTyw0Q0FBVyxHQUFyQjtRQUNJLE1BQU0sQ0FBQztZQUNILFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7SUFDTCxDQUFDO0lBQ0UsaUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxRQUFRLEVBQUUsOHFDQWNUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxxQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDSyxxQ0FBYyxHQUEyQztRQUNoRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMvQixNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMxQixTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUM1QixDQUFDO0lBQ0YsNkJBQUM7Q0ExRUQsQUEwRUMsQ0ExRTJDLDZCQUE2QixHQTBFeEU7U0ExRVksc0JBQXNCIiwiZmlsZSI6InRleHQtZm9ybS1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9