import { ControlValueAccessor } from '@angular/forms';
/**
 * Implementation of ControlValueAccessor for sme-form-field
 * The selector for this directive must match @see FormFieldComponent.selector. see FormFieldComponent for details.
 */
export declare class FormFieldAccessorDirective<TModel> implements ControlValueAccessor {
    /**
     * Indicates that this form control is disabled
     */
    disabled: boolean;
    /**
     * Placeholder for the onChange callback that is registered by the Forms API
     */
    onChange: MsftSme.Action1<TModel>;
    /**
     * Placeholder for the onTouched callback that is registered by the Forms API
     */
    onTouched: MsftSme.Action;
    /**
     * The form controls actual value
     */
    private value;
    /**
     * Constructs a new instance of FormInputBaseComponent
     */
    constructor();
    /**
     * Implementation of ControlValueAccessor interface.
     * Registers a callback function that should be called when the control's value changes in the UI.
     * @param fn the onChange function to call when the control should propagated changes to the view
     */
    registerOnChange(fn: MsftSme.Action1<TModel>): void;
    /**
     * Implementation of ControlValueAccessor interface.
     * Registers a callback function that should be called when the control receives a blur event.
     * @param fn the onTouched function to call when the control should be considered blurred
     */
    registerOnTouched(fn: MsftSme.Action): void;
    /**
     * Implementation of ControlValueAccessor interface.
     * Called when the controls status changes to or from "DISABLED"
     * @param isDisabled Indicates if the control should be disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Implementation of ControlValueAccessor interface.
     * This method will be called by the forms API to write to the view when programmatic (model -> view) changes are requested.
     * @param value The new value of the model for this form control
     */
    writeValue(value: TModel, triggerChange?: boolean): void;
    /**
     * Safety wrapper around value. Value should only be changed from writeValue method
     */
    getValue(): TModel;
}
