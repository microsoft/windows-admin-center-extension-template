var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HostBinding, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Dom } from '../../../../core';
import { SmeInject } from '../../common';
import { BaseComponent } from '../../common/base.component';
import { ValidationAlertSeverity } from '../validation-alert/validation-alert';
import { FormFieldAccessorDirective } from './form-field-accessor.directive';
import { FormFieldValidatorDirective } from './form-field-validator.directive';
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
var FormFieldComponent = /** @class */ (function (_super) {
    __extends(FormFieldComponent, _super);
    /**
     * Constructs a new instance of @see FormFieldComponent
     * @param injector the angular injection service for the base classes @SmeInjectable Annotation.
     */
    function FormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.required = false;
        _this.placeholder = '';
        _this.autofocus = null;
        _this.immediateValidation = _this.defaultImmediateValidation;
        return _this;
        // TODO: validate selector to be in the 'sme-input[type="{type}"]' format
    }
    Object.defineProperty(FormFieldComponent.prototype, "description", {
        /**
         * The description of this field; A description for the user of the meaning and purpose of this field
         */
        get: function () {
            return this.internalDescription;
        },
        set: function (value) {
            this.internalDescription = value;
            this.updateDetails();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldComponent.prototype, "instructions", {
        /**
         * The instructions of this control; A built in description for the user of how this control works.
         * This is not intended to be @Input. It is a value provided by the control and applies to all instances of the control.
         */
        get: function () {
            return this.internalInstructions;
        },
        set: function (value) {
            this.internalInstructions = value;
            this.updateDetails();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldComponent.prototype, "disabled", {
        /**
         * Indicates that this form control is truly disabled
         * This will be true if the accessor (model), input, or ancestor is disabled
         * Its value is set only on DoCheck.
         */
        get: function () {
            // return true if we are disabled, our model is disabled or an ancestor is disabled
            return this.internalDisabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldComponent.prototype, "value", {
        /**
         * The value of this field.
         * safe wrapper around this.accessor.value
         */
        get: function () {
            return this.accessor.getValue();
        },
        set: function (value) {
            this.accessor.writeValue(value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldComponent.prototype, "defaultImmediateValidation", {
        /**
         * Indicates the default value for immediateValidation.
         * This is meant to be overridden by derived classes
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnInit interface
     */
    FormFieldComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        // subscribe to our validators customValidate event.
        this.subscriptions.push(this.validator.customValidate.subscribe(
        // Merge our alerts with the alerts object given in the event args
        function (args) { MsftSme.deepAssign(args.alerts, _this.validate(args.formControl)); }));
        // if we have a ngControl, then subscribe to its status changes.
        if (this.ngModel) {
            this.ngModel.control.markAsPristine();
            this.subscriptions.push(this.ngModel.statusChanges.subscribe(function (status) { return _this.onStatusChanged(status); }));
            this.subscriptions.push(this.ngModel.valueChanges.subscribe(function (value) { return _this.onValueChanged(value); }));
            // a bit hacky, but this works to trigger validation immediatly when the form loads.         
            if (this.immediateValidation) {
                this.value = this.value;
                this.ngModel.control.markAsPristine();
            }
        }
    };
    /**
     * Implementation of angular DoCheck interface
     */
    FormFieldComponent.prototype.ngDoCheck = function () {
        _super.prototype.ngDoCheck.call(this);
        // reflect our true combined disabled state by checking our own state > our accessors state > ancestor state
        this.internalDisabled = this.disabledInput || this.accessor.disabled || !!Dom.getAncestorDisabled(this.hostElement.nativeElement);
    };
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    FormFieldComponent.prototype.validate = function (c) {
        // To be implemented optionally by derived components.
        return {};
    };
    /**
     * Occurs any time value changed.
     */
    FormFieldComponent.prototype.updateDetails = function () {
        var details = [];
        if (!MsftSme.isNullOrWhiteSpace(this.description)) {
            details.push(this.description);
        }
        if (!MsftSme.isNullOrWhiteSpace(this.instructions)) {
            details.push(this.instructions);
        }
        // separate details and instructions with double line breaks.
        this.details = details.length > 0 ? details.join('\n\n') : null;
    };
    /**
     * Gets the initial host classes to be applied to this element
     * When called in the @see BaseComponent super class initialization, These classes will be automatically assigned to the host element.
     */
    FormFieldComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-form-field'
        ]);
    };
    /**
     * Occurs every time the value of the control changes, in the UI or programmatically.
     * @param value the value of the form control
     */
    FormFieldComponent.prototype.onValueChanged = function (value) {
        // This is a placeholder for derived classes at this time.
    };
    /**
     * Occurs every time the validation status of the control has been re-calculated.
     * @param status the status object of the form control
     */
    FormFieldComponent.prototype.onStatusChanged = function (status) {
        // when status changes, recalculate the current alert to show.
        var alerts = this.ngModel.control.errors;
        // clear active alert if there are no alerts, or the form is in a state the user didnt cause or cant control
        if (MsftSme.isNullOrUndefined(alerts)
            || Object.keys(alerts).length === 0
            || this.ngModel.pristine) {
            this.alert = null;
            return;
        }
        // get the first alert
        var key = Object.keys(alerts)[0];
        var firstAlert = alerts[key];
        // process the first alert to be the actiev alert that we display
        var alert = this.getAlert(key, firstAlert);
        if (alert.severity !== ValidationAlertSeverity.Error || !this.ngModel.pristine) {
            this.alert = alert;
        }
    };
    /**
     * gets an alert object from a key and validation result
     * @param key
     * @param alert
     * @param customValidationHandler
     */
    FormFieldComponent.prototype.getAlert = function (key, alert) {
        // if the alert is false, null, or valid with no message, then its not really an alert that needs to be shown and should be ignored
        if (alert === false
            || MsftSme.isNullOrUndefined(alert)
            || (alert.valid === true) && MsftSme.isNullOrWhiteSpace(alert.message)) {
            return null;
        }
        var processedAlert;
        // if the alert is a string, show it as an error
        if (typeof alert === 'string') {
            processedAlert = {
                valid: false,
                severity: ValidationAlertSeverity.Error,
                message: alert
            };
        }
        else {
            processedAlert = this.getKnownNgAlert(key, alert);
            if (!processedAlert) {
                // if alert is a simple true, we dont really know how to deal with it, so just create an empty validation object
                processedAlert = alert === true ? {} : __assign({}, alert);
                // if valid is not set, then set it explicitly to false
                if (MsftSme.isNullOrUndefined(processedAlert.valid)) {
                    processedAlert.valid = false;
                }
                // if there is no message, create a default one
                if (MsftSme.isNullOrWhiteSpace(processedAlert.message)) {
                    processedAlert.message = "Validation failed: " + key;
                }
                // if severity is not set correctly and the field is not valid, then set it to error
                if (!processedAlert.valid && MsftSme.isNullOrUndefined(ValidationAlertSeverity[processedAlert.severity])) {
                    processedAlert.severity = ValidationAlertSeverity.Error;
                }
            }
        }
        return processedAlert;
    };
    /**
     * Gets an alert object from known angular alert keys
     * @param key
     * @param alert
     */
    FormFieldComponent.prototype.getKnownNgAlert = function (key, alert) {
        var vStrings = MsftSme.self().Resources.strings.MsftSmeShell.Angular.Common.Form.Validation;
        var name = this.label || (this.ngModel ? this.ngModel.name : vStrings.UnknownFieldName);
        var message;
        // first check for known angular 'built-in' validations
        switch (key) {
            case 'min': {
                message = vStrings.Min.format.format(name, alert.min);
                break;
            }
            case 'max': {
                message = vStrings.Max.format.format(name, alert.max);
                break;
            }
            case 'required': {
                message = vStrings.Required.format.format(name);
                break;
            }
            case 'email': {
                message = vStrings.Email.format.format(name);
                break;
            }
            case 'minLength': {
                message = vStrings.MinLength.format.format(name, alert.requiredLength);
                break;
            }
            case 'maxLength': {
                message = vStrings.MaxLength.format.format(name, alert.actualLength);
                break;
            }
            case 'pattern': {
                message = vStrings.Pattern.format.format(name, alert.requiredPattern);
                break;
            }
            default: {
                break;
            }
        }
        if (MsftSme.isNullOrWhiteSpace(message)) {
            return null;
        }
        return {
            valid: false,
            severity: ValidationAlertSeverity.Error,
            message: message
        };
    };
    /**
     * In some cases, we need a combined version of the label and description so that the screen read can read it approperetly.
     * Common cases for this are when using role="group" or role="radioGroup" because they does not support aria-describedby
     * we achieve the same effect by splitting the description and and label with a '.' (period)"
     * TODO: verify how this localizes or find a better way.
     */
    FormFieldComponent.prototype.getMergedDescriptionLabel = function () {
        return (this.label || '') + ". " + (this.description || '');
    };
    /**
     * The selector that all form fields must use in order to work properly with
     * @see FormFieldAccessorDirective and @see FormFieldValidatorDirective
     */
    FormFieldComponent.selector = 'sme-form-field';
    FormFieldComponent.propDecorators = {
        'required': [{ type: Input },],
        'autofocus': [{ type: Input },],
        'placeholder': [{ type: Input },],
        'label': [{ type: Input },],
        'description': [{ type: Input },],
        'disabled': [{ type: HostBinding, args: ['class.sme-disabled',] }, { type: HostBinding, args: ['attr.disabled',] }, { type: HostBinding, args: ['attr.aria-disabled',] },],
        'disabledInput': [{ type: Input, args: ['disabled',] },],
        'immediateValidation': [{ type: Input },],
    };
    __decorate([
        SmeInject(NgControl, true),
        __metadata("design:type", NgControl)
    ], FormFieldComponent.prototype, "ngModel", void 0);
    __decorate([
        SmeInject(FormFieldAccessorDirective),
        __metadata("design:type", FormFieldAccessorDirective)
    ], FormFieldComponent.prototype, "accessor", void 0);
    __decorate([
        SmeInject(FormFieldValidatorDirective),
        __metadata("design:type", FormFieldValidatorDirective)
    ], FormFieldComponent.prototype, "validator", void 0);
    return FormFieldComponent;
}(BaseComponent));
export { FormFieldComponent };
/**
 * Internal base component for SME for fields. It simply removes the need to supply the string type parameter to FormFieldComponent
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
var SmeInternalFormFieldComponent = /** @class */ (function (_super) {
    __extends(SmeInternalFormFieldComponent, _super);
    function SmeInternalFormFieldComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SmeInternalFormFieldComponent;
}(FormFieldComponent));
export { SmeInternalFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBeUIsV0FBQSxFQUF1QixLQUFBLEVBQXNCLE1BQU8sZUFBQSxDQUFnQjtBQUNwRyxPQUFPLEVBQWUsU0FBQSxFQUF1QyxNQUFPLGdCQUFBLENBQWlCO0FBQ3JGLE9BQU8sRUFBRSxHQUFBLEVBQUksTUFBTyxrQkFBQSxDQUFtQjtBQUV2QyxPQUFPLEVBQUUsU0FBQSxFQUFVLE1BQU8sY0FBQSxDQUFlO0FBQ3pDLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyw2QkFBQSxDQUE4QjtBQUM1RCxPQUFPLEVBQXFDLHVCQUFBLEVBQTBDLE1BQU8sc0NBQUEsQ0FBdUM7QUFDcEksT0FBTyxFQUFFLDBCQUFBLEVBQTJCLE1BQU8saUNBQUEsQ0FBa0M7QUFDN0UsT0FBTyxFQUE0QiwyQkFBQSxFQUE0QixNQUFPLGtDQUFBLENBQW1DO0FBRXpHOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSDtJQUEwRCxzQ0FBdUI7SUFnSjdFOzs7T0FHRztJQUNILDRCQUFZLFFBQWtCO1FBQTlCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBTWxCO1FBTEcsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsS0FBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsS0FBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUksQ0FBQywwQkFBMEIsQ0FBQzs7UUFDM0QseUVBQXlFO0lBQzdFLENBQUM7SUF2SEQsc0JBQVcsMkNBQVc7UUFKdEI7O1dBRUc7YUFFSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFDcEMsQ0FBQzthQUNELFVBQXVCLEtBQWE7WUFDaEMsSUFBSSxDQUFDLG1C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