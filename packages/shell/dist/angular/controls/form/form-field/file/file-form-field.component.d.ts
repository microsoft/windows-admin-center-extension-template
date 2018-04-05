import { ElementRef, Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationAlerts } from '../../validation-alert/validation-alert';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable file field implementation
 */
export declare class FileFormFieldComponent extends SmeInternalFormFieldComponent<File | FileList> implements OnInit {
    /**
     * The file input part of this control
     */
    fileInput: ElementRef;
    /**
     * Indicates that multiple files are allowed
     */
    multiple: boolean;
    /**
     * Indicates the type of files that are allowed
     */
    fileTypes: string[];
    /**
     * The label to use on the select button
     */
    buttonLabel: string;
    /**
     * The format to use when multiple files are selected
     */
    multipleFileFormat: string;
    /**
     * Gets selected files label
     */
    selectedFilesLabel: string;
    /**
     * Gets the files currently selected
     */
    private readonly files;
    /**
     * Indicates if there are any files selected
     */
    private readonly hasFiles;
    /**
     * Indicates if there are any file type restrictions
     */
    private readonly hasFileTypes;
    /**
     * Returns a formatted accept property for our file input
     */
    readonly accept: string;
    /**
     * Initializes a new instance of the FileFormFieldComponent
     */
    constructor(injector: Injector);
    /**
     * Occurs when the text input was clicked
     */
    textElementClick(e: MouseEvent): void;
    /**
     * Occurs when the file input has changed
     */
    onFileChanged(): void;
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    protected validate(c: FormControl): ValidationAlerts;
}
