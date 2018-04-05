import { EventEmitter } from '@angular/core';
import { AuthorizationCredentials } from '../../../core';
import { Strings } from '../../../generated/strings';
import { AppContextService } from '../../service';
import { CheckValidationEventArgs } from '../form';
export declare class NodeCredentialsFormComponent {
    private appContextService;
    strings: Strings;
    hasPerNodeCredentials: boolean;
    globalUsername: string;
    /**
     * Gets or sets the Username
     */
    username: string;
    /**
     * Gets or sets the password
     */
    password: string;
    /**
     * Gets or sets a value indicating if these settings should be applied to all nodes
     */
    applyToAll: boolean;
    /**
     * Gets or sets a value indicating if LAPS should be used
     */
    useLaps: boolean;
    /**
     * Gets or sets the laps Local Admin Name
     */
    lapsLocalAdminName: string;
    /**
     * Gets or sets a value indicating if global auth should be used
     */
    useGlobalAuth: boolean;
    /**
     * Model to hold internal form field values;
     */
    private model;
    credentialsChanged: EventEmitter<AuthorizationCredentials>;
    showApplyToAll: boolean;
    isServiceMode: boolean;
    formId: string;
    /**
     * Initializes a new instance of the NodeCredentialsForm class.
     */
    constructor(appContextService: AppContextService);
    reset(nodeName: string): void;
    updateAuthorizationCredentials(): void;
    /**
     * Validate the auth type field
     * @param event the validation event
     */
    validateAuthType(event: CheckValidationEventArgs): void;
    /**
     * Validate the apply to all field
     * @param event the validation event
     */
    validateApplyToAll(event: CheckValidationEventArgs): void;
}
