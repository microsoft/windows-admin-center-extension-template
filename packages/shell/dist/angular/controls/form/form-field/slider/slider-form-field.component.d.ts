import { Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable range field implementation as a slider
 */
export declare class SliderFormFieldComponent extends SmeInternalFormFieldComponent<number> implements OnInit {
    /**
     * Indicates the default value for immediateValidation.
     * This is meant to be overridden by derived classes
     */
    protected readonly defaultImmediateValidation: boolean;
    /**
     * The size of each movement of the slider.
     */
    step: number;
    /**
     * The minimum value of the slider
     */
    min: number;
    /**
     * The maximum value of the slider
     */
    max: number;
    /**
     * Initializes a new instance of the SliderFormFieldComponent
     */
    constructor(injector: Injector);
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
