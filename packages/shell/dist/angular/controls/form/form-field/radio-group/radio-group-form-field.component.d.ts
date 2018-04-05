import { Injector, OnInit } from '@angular/core';
import { SmeInternalOptionsFormFieldComponent } from '../options-form-field/options-form-field.component';
/**
 * Accessable Implementation of a form field for a set of .sme-radio
 */
export declare class RadioGroupFormFieldComponent extends SmeInternalOptionsFormFieldComponent<any> implements OnInit {
    /**
     * The aria label for this instance
     */
    readonly ariaLabel: string;
    /**
     * Indicates the default value for immediateValidation.
     * This is meant to be overridden by derived classes
     */
    protected readonly defaultImmediateValidation: boolean;
    /**
     * Initializes a new instance of the RadioGroupFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Implementation of angular OnInit interface
     */
    ngOnInit(): void;
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
}
