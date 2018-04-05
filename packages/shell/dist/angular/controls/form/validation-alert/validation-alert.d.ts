/**
 * The levels of severity of a validation alert.
 */
export declare enum ValidationAlertSeverity {
    Informational = 0,
    Warning = 1,
    Error = 2,
}
/**
 * Defines a Validation Alert object used for advanced form validation
 */
export interface ValidationAlert {
    valid?: boolean;
    message?: string;
    severity?: ValidationAlertSeverity;
}
export declare type ValidationResult = ValidationAlert | boolean | string;
/**
 * Defines a collection of validation alerts
 */
export interface ValidationAlerts extends MsftSme.StringMap<ValidationResult> {
}
