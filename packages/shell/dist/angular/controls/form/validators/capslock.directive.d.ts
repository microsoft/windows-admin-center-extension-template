import { StaticProvider } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationAlerts } from '../validation-alert/validation-alert';
import { FormValidatorBase } from './base-validator';
/**
 * Provider for the FormFieldValidatorDirective directive
 */
export declare const CAPSLOCK_VALIDATOR: StaticProvider;
/**
 * A Directive that adds the adds a warning when the CAPSLOCK key is on.
 * Applies to sme-form-field[type="password] and [smeCapsLock]
 */
export declare class CapsLockValidatorDirective extends FormValidatorBase {
    /**
     * Indicates that a warning should be thrown if capslock is on
     */
    warnOnCapsLock: boolean;
    /**
     * Internal placeholder for warnOnCapsLock
     */
    private internalWarnOnCapsLock;
    /**
     * Indicates the state of the capslock key
     */
    private isCapsLockOn;
    /**
     * Instantiates a new instance of CapsLockValidatorDirective
     */
    constructor();
    /**
     * Implementation of Validator interface.
     * Validates the state of the capslock key for this form control
     * @param c The FormControl attached to this element
     * @return null when valid, otherwise returns a validation object
     */
    validate(c: FormControl): ValidationAlerts | null;
    /**
     * We dont have a way to truly monitor for capslock.
     * The best we can do is listen to every keydown and turn the warning on if we detect that its on
     * @param event
     */
    onKeydown(event: KeyboardEvent): void;
}
