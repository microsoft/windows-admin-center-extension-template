import { Injector, OnInit } from '@angular/core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable text field implementation
 */
export declare class TextFormFieldComponent extends SmeInternalFormFieldComponent<any> implements OnInit {
    /**
     * Indicates that multiple lines should be accepted
     */
    multiline: boolean;
    /**
     * Indicates the number of visible rows for multiline text fields
     * Not applicable to single line text
     */
    rows: number;
    /**
     * Indicates the number of visible columns for multiline text fields
     * Not applicable to single line text
     */
    columns: number;
    /**
     * Initializes a new instance of the TextFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
}
