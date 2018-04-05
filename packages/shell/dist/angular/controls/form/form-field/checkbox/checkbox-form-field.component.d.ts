import { Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable Implementation of a form field for .sme-checkbox
 */
export declare class CheckboxFormFieldComponent extends SmeInternalFormFieldComponent<boolean> {
    /**
     * Indicates that this checkbox should operate in indeterminate mode. That is, it should report value as null, true, or false.
     */
    indeterminate: boolean;
    /**
     * Initializes a new instance of the TagsInputComponent
     */
    constructor(injector: Injector);
    /**
     * Handler for clicking on the checkbox
     */
    onCheckboxClicked(): void;
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    protected validate(c: FormControl): {
        [key: string]: any;
    };
}
