import { Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable number field implementation
 */
export declare class NumberFormFieldComponent extends SmeInternalFormFieldComponent<number> implements OnInit {
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
     * Handle keydown events on the number input
     * @param event
     */
    onInputKeydown(event: KeyboardEvent): void;
    /**
     * Increments the controls value by 1 "step"
     */
    increment(): void;
    /**
     * Decrements the controls value by 1 "step"
     */
    decrement(): void;
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
