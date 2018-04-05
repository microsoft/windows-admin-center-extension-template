import { DoCheck, Injector, OnInit } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { Strings } from '../../../../generated/strings';
import { BaseComponent } from '../../common/base.component';
import { ValidationAlert, ValidationAlerts, ValidationResult } from '../validation-alert/validation-alert';
/**
 * Base component class for form fields
 * A circular reference would be created by injecting both ngModel
 * and providing @see ControlValueAccessor and @see Validator implementations on the same component.
 * Therefore, we have broken the FormField component into 3 parts.
 *  - The @see FormFieldValidatorDirective handles the implementation of @see Validator and @see NG_VALIDATORS
 *  - The @see FormFieldAccessorDirective handles the implementation of @see ControlValueAccessor and @see NG_VALUE_ACCESSOR
 *  - This @see FormFieldComponent is our glue that pulls it all together with labels and alerts and injects the NgControl instance safely.
 *
 * In order for this to work, all three components must use the same base selector @see FormFieldComponent.selector.
 * This is enforced in the constructor of this component,
 * However the directives are done by convention and will just crash if the injector cannot find them.
 *
 */
export declare class FormFieldComponent<TStrings, TModel> extends BaseComponent<TStrings> implements OnInit, DoCheck {
    /**
     * The selector that all form fields must use in order to work properly with
     * @see FormFieldAccessorDirective and @see FormFieldValidatorDirective
     */
    static selector: string;
    /**
     * Indicates that this requires a value
     */
    required: boolean;
    /**
     * Indicates that this requires a value
     */
    autofocus: boolean;
    /**
     * The placeholder for the internal form control
     */
    placeholder: string;
    /**
     * The label that identifies this control to the user
     */
    label: string;
    /**
     * The description of this field; A description for the user of the meaning and purpose of this field
     */
    description: string;
    /**
     * The instructions of this control; A built in description for the user of how this control works.
     * This is not intended to be @Input. It is a value provided by the control and applies to all instances of the control.
     */
    instructions: string;
    /**
     * Indicates that this form control is truly disabled
     * This will be true if the accessor (model), input, or ancestor is disabled
     * Its value is set only on DoCheck.
     */
    readonly disabled: boolean;
    /**
     * Placeholder for the bound input of the disabled property
     */
    disabledInput: boolean;
    /**
     * Placeholder for the combined disabled state
     */
    private internalDisabled;
    /**
     * The value of this field.
     * safe wrapper around this.accessor.value
     */
    value: TModel;
    /**
     * Aggregate property for the details for of this control (description merged with instructions)
     */
    details: string;
    /**
     * The current alert to display for this control
     */
    alert: ValidationAlert;
    /**
     * Indicates that immediate validation is enabled
     */
    immediateValidation: boolean;
    /**
     * Indicates the default value for immediateValidation.
     * This is meant to be overridden by derived classes
     */
    protected readonly defaultImmediateValidation: boolean;
    /**
     * Injected @see NgControl instance bound to this component.
     */
    protected ngModel: NgControl;
    /**
     * Injected @see FormFieldAccessorDirective instance bound to this component.
     */
    private accessor;
    /**
     * Injected @see FormFieldValidatorDirective instance bound to this component.
     */
    private validator;
    /**
     * Internal placeholder for the description of this field
     */
    private internalDescription;
    /**
     * Internal placeholder for the instructions of this control
     */
    private internalInstructions;
    /**
     * Constructs a new instance of @see FormFieldComponent
     * @param injector the angular injection service for the base classes @SmeInjectable Annotation.
     */
    constructor(injector: Injector);
    /**
     * Implementation of angular OnInit interface
     */
    ngOnInit(): void;
    /**
     * Implementation of angular DoCheck interface
     */
    ngDoCheck(): void;
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    protected validate(c: FormControl): ValidationAlerts;
    /**
     * Occurs any time value changed.
     */
    protected updateDetails(): void;
    /**
     * Gets the initial host classes to be applied to this element
     * When called in the @see BaseComponent super class initialization, These classes will be automatically assigned to the host element.
     */
    protected getInitialHostClasses(): string[];
    /**
     * Occurs every time the value of the control changes, in the UI or programmatically.
     * @param value the value of the form control
     */
    protected onValueChanged(value: TModel): void;
    /**
     * Occurs every time the validation status of the control has been re-calculated.
     * @param status the status object of the form control
     */
    protected onStatusChanged(status: any): void;
    /**
     * gets an alert object from a key and validation result
     * @param key
     * @param alert
     * @param customValidationHandler
     */
    protected getAlert(key: string, alert: ValidationResult): ValidationAlert;
    /**
     * Gets an alert object from known angular alert keys
     * @param key
     * @param alert
     */
    protected getKnownNgAlert(key: string, alert: any): ValidationAlert;
    /**
     * In some cases, we need a combined version of the label and description so that the screen read can read it approperetly.
     * Common cases for this are when using role="group" or role="radioGroup" because they does not support aria-describedby
     * we achieve the same effect by splitting the description and and label with a '.' (period)"
     * TODO: verify how this localizes or find a better way.
     */
    getMergedDescriptionLabel(): string;
}
/**
 * Internal base component for SME for fields. It simply removes the need to supply the string type parameter to FormFieldComponent
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
export declare class SmeInternalFormFieldComponent<TModel> extends FormFieldComponent<Strings, TModel> {
}
