import { Injector, OnInit } from '@angular/core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
export declare class ToggleSwitchFormFieldComponent extends SmeInternalFormFieldComponent<boolean> implements OnInit {
    /**
     * Indicates the default value for immediateValidation.
     * This is meant to be overridden by derived classes
     */
    protected readonly defaultImmediateValidation: boolean;
    /**
     * The label to show when the switch is on
     */
    labelOn: string;
    /**
     * The label to show when the switch is off
     */
    labelOff: string;
    /**
     * The aria label for this instance
     */
    readonly ariaLabel: string;
    /**
     * Initializes a new instance of the ToggleSwitchFormFieldComponent
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
