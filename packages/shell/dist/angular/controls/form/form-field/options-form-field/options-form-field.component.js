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
import { ContentChildren } from '@angular/core';
import { FormFieldComponent } from '../form-field.component';
import { FormFieldOptionComponent } from './form-field-option.component';
/**
 * Defines a base class form form field components with options
 */
var OptionsFormFieldComponent = /** @class */ (function (_super) {
    __extends(OptionsFormFieldComponent, _super);
    function OptionsFormFieldComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionsFormFieldComponent.propDecorators = {
        'options': [{ type: ContentChildren, args: [FormFieldOptionComponent,] },],
    };
    return OptionsFormFieldComponent;
}(FormFieldComponent));
export { OptionsFormFieldComponent };
/**
 * Internal base component for SME form fields with options.
 * It simply removes the need to supply the string type parameter to FormFieldComponent
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
var SmeInternalOptionsFormFieldComponent = /** @class */ (function (_super) {
    __extends(SmeInternalOptionsFormFieldComponent, _super);
    function SmeInternalOptionsFormFieldComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SmeInternalOptionsFormFieldComponent;
}(OptionsFormFieldComponent));
export { SmeInternalOptionsFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL29wdGlvbnMtZm9ybS1maWVsZC9vcHRpb25zLWZvcm0tZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsZUFBQSxFQUFxQyxNQUFPLGVBQUEsQ0FBZ0I7QUFFckUsT0FBTyxFQUFFLGtCQUFBLEVBQW1CLE1BQU8seUJBQUEsQ0FBMEI7QUFDN0QsT0FBTyxFQUFFLHdCQUFBLEVBQXlCLE1BQU8sK0JBQUEsQ0FBZ0M7QUFFekU7O0dBRUc7QUFDSDtJQUFpRSw2Q0FBb0M7SUFBckc7O0lBU0EsQ0FBQztJQUhNLHdDQUFjLEdBQTJDO1FBQ2hFLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRyxFQUFFLEVBQUU7S0FDMUUsQ0FBQztJQUNGLGdDQUFDO0NBVEQsQUFTQyxDQVRnRSxrQkFBa0IsR0FTbEY7U0FUWSx5QkFBeUI7QUFXdEM7Ozs7R0FJRztBQUNIO0lBQWtFLHdEQUEwQztJQUE1Rzs7SUFFQSxDQUFDO0lBQUQsMkNBQUM7QUFBRCxDQUZBLEFBRUMsQ0FGaUUseUJBQXlCLEdBRTFGIiwiZmlsZSI6Im9wdGlvbnMtZm9ybS1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9