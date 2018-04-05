import { FormControl, Validator } from '@angular/forms';
import { ValidationAlerts } from '../validation-alert/validation-alert';
/**
 * Base class for form validation.
 */
export declare class FormValidatorBase implements Validator {
    /**
     * Revalidates the model attached to this validator
     */
    protected revalidate: MsftSme.Action;
    /**
     * Instantiates a new instance of FormValidatorBase
     */
    constructor();
    /**
     * Implementation of Validator interface.
     * Validates the value of this elements form control. Use the @see checkValidate event to hook into this function.
     * @param c The FormControl attached to this element
     * @return null when valid, otherwise returns a validation object in the form of "{ errorType: {valid: false} }".
     */
    validate(c: FormControl): ValidationAlerts | null;
    /**
     * Implementation of Validator interface.
     * registers a change function that should be called anytime revalidation needs to occur
     */
    registerOnValidatorChange(fn: MsftSme.Action): void;
    /**
     * Checks if an alerts object has alerts and returns it, otherwise returns null.
     * @param alerts The alerts to check
     */
    protected nullIfNoAlerts(alerts: ValidationAlerts): ValidationAlerts | null;
}
