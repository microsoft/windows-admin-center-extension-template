import { EventEmitter, StaticProvider } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { ValidationAlerts } from '../validation-alert/validation-alert';
import { FormValidatorBase } from '../validators/base-validator';
/**
 * Arguments for the @see FormFieldValidatorDirective.customValidate Output event
 */
export interface CheckValidationEventArgs {
    /**
     * The form control that we are validating
     */
    formControl: FormControl;
    /**
     * An empty object to return populate with validation alerts
     */
    alerts: ValidationAlerts;
}
/**
 * Provider for the FormFieldValidatorDirective directive
 */
export declare const FORM_FIELD_VALIDATOR: StaticProvider;
/**
 * Implementation of Validator for sme-form-field
 * The selector for this directive must match @see FormFieldComponent.selector. see FormFieldComponent for details.
 */
export declare class FormFieldValidatorDirective extends FormValidatorBase {
    /**
     * EventEmitter for checking validation and raising alerts
     * Subscribers are expected to populate the 'alerts' map with there own validation alerts
     */
    customValidate: EventEmitter<CheckValidationEventArgs>;
    /**
     * Instantiates a new instance of FormFieldValidatorDirective
     */
    constructor();
    /**
     * Implementation of Validator interface.
     * Validates the value of this elements form control. Use the @see checkValidate event to hook into this function.
     * @param c The FormControl attached to this element
     * @return null when valid, otherwise returns a validation object in the form of "{ errorType: {valid: false} }".
     */
    validate(c: FormControl): ValidationErrors | null;
}
