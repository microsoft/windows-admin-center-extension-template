import { QueryList } from '@angular/core';
import { Strings } from '../../../../../generated/strings';
import { FormFieldComponent } from '../form-field.component';
import { FormFieldOptionComponent } from './form-field-option.component';
/**
 * Defines a base class form form field components with options
 */
export declare class OptionsFormFieldComponent<TStrings, TModel> extends FormFieldComponent<TStrings, TModel> {
    /**
     * The options for this control.
     */
    options: QueryList<FormFieldOptionComponent>;
}
/**
 * Internal base component for SME form fields with options.
 * It simply removes the need to supply the string type parameter to FormFieldComponent
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
export declare class SmeInternalOptionsFormFieldComponent<TModel> extends OptionsFormFieldComponent<Strings, TModel> {
}
