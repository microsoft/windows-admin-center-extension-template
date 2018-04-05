import { TemplateRef } from '@angular/core';
/**
 * Defines a generic option for control types that display multiple options.
 * These include, radio, checklist, multiselect, select, etc...
 * The current implementation is pretty basic, but could be extended to support a variety of features
 */
export declare class FormFieldOptionComponent {
    /**
     * The value of this option.
     */
    value: any;
    /**
     * The label of this option.
     */
    label: string;
    /**
     * The template ref of the option. The way this template ref is used varies form control to control
     */
    subFormTemplate: TemplateRef<any>;
}
