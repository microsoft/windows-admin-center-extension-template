import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * Implementation of ControlValueAccessor for sme-form-field
 * The selector for this directive must match @see FormFieldComponent.selector. see FormFieldComponent for details.
 */
var FormFieldAccessorDirective = /** @class */ (function () {
    /**
     * Constructs a new instance of FormInputBaseComponent
     */
    function FormFieldAccessorDirective() {
        // Initialize Values.
        this.onChange = MsftSme.noop;
        this.onTouched = MsftSme.noop;
        this.disabled = false;
    }
    /**
     * Implementation of ControlValueAccessor interface.
     * Registers a callback function that should be called when the control's value changes in the UI.
     * @param fn the onChange function to call when the control should propagated changes to the view
     */
    FormFieldAccessorDirective.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Implementation of ControlValueAccessor interface.
     * Registers a callback function that should be called when the control receives a blur event.
     * @param fn the onTouched function to call when the control should be considered blurred
     */
    FormFieldAccessorDirective.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Implementation of ControlValueAccessor interface.
     * Called when the controls status changes to or from "DISABLED"
     * @param isDisabled Indicates if the control should be disabled.
     */
    FormFieldAccessorDirective.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    /**
     * Implementation of ControlValueAccessor interface.
     * This method will be called by the forms API to write to the view when programmatic (model -> view) changes are requested.
     * @param value The new value of the model for this form control
     */
    FormFieldAccessorDirective.prototype.writeValue = function (value, triggerChange) {
        if (triggerChange === void 0) { triggerChange = false; }
        this.value = value;
        if (triggerChange) {
            this.onChange(value);
        }
    };
    /**
     * Safety wrapper around value. Value should only be changed from writeValue method
     */
    FormFieldAccessorDirective.prototype.getValue = function () {
        return this.value;
    };
    FormFieldAccessorDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector > Reason: see comment above
                    selector: 'sme-form-field',
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(function () { return FormFieldAccessorDirective; }), multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    FormFieldAccessorDirective.ctorParameters = function () { return []; };
    return FormFieldAccessorDirective;
}());
export { FormFieldAccessorDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQtYWNjZXNzb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsVUFBQSxFQUF5QyxNQUFPLGVBQUEsQ0FBZ0I7QUFDcEYsT0FBTyxFQUF3QixpQkFBQSxFQUFrQixNQUFPLGdCQUFBLENBQWlCO0FBRXpFOzs7R0FHRztBQUVIO0lBc0JJOztPQUVHO0lBQ0g7UUFDSSxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHFEQUFnQixHQUF2QixVQUF3QixFQUEyQjtRQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHNEQUFpQixHQUF4QixVQUF5QixFQUFrQjtRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHFEQUFnQixHQUF2QixVQUF3QixVQUFtQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLCtDQUFVLEdBQWpCLFVBQWtCLEtBQWEsRUFBRSxhQUE4QjtRQUE5Qiw4QkFBQSxFQUFBLHFCQUE4QjtRQUMzRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLDZDQUFRLEdBQWY7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBQ0UscUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QiwwRUFBMEU7b0JBQzFFLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFNBQVMsRUFBRTt3QkFDUCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSwwQkFBMEIsRUFBMUIsQ0FBMEIsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7cUJBQ3pHO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx5Q0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNGLGlDQUFDO0NBekZELEFBeUZDLElBQUE7U0F6RlksMEJBQTBCIiwiZmlsZSI6ImZvcm0tZmllbGQtYWNjZXNzb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==