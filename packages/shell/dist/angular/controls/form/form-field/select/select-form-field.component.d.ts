import { Injector, OnInit } from '@angular/core';
import { SmeInternalOptionsFormFieldComponent } from '../options-form-field/options-form-field.component';
/**
 * Accessable Implementation of a form field for .sme-select
 */
export declare class SelectFormFieldComponent extends SmeInternalOptionsFormFieldComponent<any> implements OnInit {
    /**
     * Indicates the default value for immediateValidation.
     * This is meant to be overridden by derived classes
     */
    protected readonly defaultImmediateValidation: boolean;
    /**
     * Initializes a new instance of the SelectFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
}
