import { Injector, OnInit } from '@angular/core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable password field implementation
 */
export declare class PasswordFormFieldComponent extends SmeInternalFormFieldComponent<any> implements OnInit {
    /**
     * Initializes a new instance of the PasswordFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
}
