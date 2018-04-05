import { Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationAlerts } from '../../validation-alert/validation-alert';
import { SmeInternalOptionsFormFieldComponent } from '../options-form-field/options-form-field.component';
/**
 * Accessable Implementation of a form field for a set of .sme-checkbox
 */
export declare class ChecklistFormFieldComponent extends SmeInternalOptionsFormFieldComponent<MsftSme.StringMap<boolean>> implements OnInit {
    /**
     * The aria label for this instance
     */
    readonly ariaLabel: string;
    /**
     * Initializes a new instance of the ChecklistFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Implementation of angular OnInit interface
     */
    ngOnInit(): void;
    /**
     * Handle for when any option is checked or unchecked
     */
    onOptionChanged(): void;
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    protected validate(c: FormControl): ValidationAlerts;
}
