import { Injector } from '@angular/core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable Implementation of a readonly form field
 */
export declare class ReadonlyFormFieldComponent extends SmeInternalFormFieldComponent<boolean> {
    /**
     * Initializes a new instance of the ToggleSwitchFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
}
