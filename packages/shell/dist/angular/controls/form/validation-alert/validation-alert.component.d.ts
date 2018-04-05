import { OnInit } from '@angular/core';
import { Strings } from '../../../../generated/strings';
import { BaseComponent } from '../../common/base.component';
import { ValidationAlert } from './validation-alert';
/**
 * Component for displaying a form validation alert.
 * Alerts are not nessecarily errors, they can display other types of
 * information that the user should know about a value they entered into a form field
 */
export declare class ValidationAlertComponent extends BaseComponent<Strings> implements OnInit {
    /**
     * Optionally show background color for the alert.
     */
    showBackground: boolean;
    /**
     * The alert Validation alert we need to display.
     */
    alert: ValidationAlert;
    /**
     * Indicates that there is an alert to display
     */
    readonly hasAlert: boolean;
    /**
     * Indicates that the current alert is valid
     */
    readonly valid: boolean;
    /**
     * Indicates that the current alert is valid
     */
    readonly message: string;
    /**
     * Indicates that the current alert has a severity defined
     */
    readonly hasSeverity: boolean;
    /**
     * Indicates that the current alert is an error alert
     * Errors are always invalid with either no severity or error severity
     */
    readonly isError: boolean;
    /**
     * Indicates that the current alert is an warning alert
     * Warnings may be valid or invalid (usually valid) with warning severity
     */
    readonly isWarning: boolean;
    /**
     * Indicates that the current alert is an informational alert
     * Informational alerts may be valid or invalid (usually valid) with informational severity
     */
    readonly isInformational: boolean;
    /**
     * Indicates that the current alert is an success alert
     * Success alerts are always valid with no severity severity
     */
    readonly isSuccess: boolean;
    /**
     * Indicates that the current alert is an success alert
     */
    readonly alertType: string;
    /**
     * Implementation of angular OnInit interface
     */
    ngOnInit(): void;
    /**
     * Gets the initial host classes to be applied to this element
     * When called in the @see BaseComponent super class initialization, These classes will be automatically assigned to the host element.
     */
    protected getInitialHostClasses(): string[];
}
