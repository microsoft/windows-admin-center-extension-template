import { Observable } from 'rxjs';
import { AppContextService } from '../angular';
import { InventoryQueryCaches } from '../core';
import { ShellUserSettings } from './modules/user-profile/models/shell-user-settings';
import { UserProfileService } from './modules/user-profile/user-profile.service';
export declare class ShellService {
    private appContextService;
    private userProfileService;
    /**
     * Indicates that the application is in an error state
     */
    static isApplicationFaulted: boolean;
    /**
     * Placeholder for the application ready state
     */
    private static applicationReady;
    /**
     * Consolidate all inventory query into inventory query caches.
     */
    inventoryCaches: InventoryQueryCaches;
    /**
     * Cache server and gateway data forever.
     */
    private rootSubscription;
    /**
     * Called when the application is ready to be interacted with.
     * @param faulted indicates that the application is starting in a faulty state
     */
    static setApplicationReady(faulted: boolean): void;
    /**
     * Initializes a new instance of the ShellService class.
     *
     * @param appContextService the AppContextService class instance.
     * @param userProfileService the UserProfileService class instance.
     */
    constructor(appContextService: AppContextService, userProfileService: UserProfileService);
    /**
     * Get the extension user settings for the shell
     */
    getShellUserSettings(): Observable<ShellUserSettings>;
    /**
     * Message handler for user profile rpc requests
     * @param request the rpc request
     */
    private handleRpcSettingsRequest(request);
    /**
     * Gets a formatted representation of an enum value for handler errors.
     * @param value the enum value
     * @param valueName the enum value name
     * @param enumTypeName  the enum type name
     */
    private formatHandlerErrorEnumName(value, valueName, enumTypeName);
    /**
     * Compares two software versions, assuming that a valid version is a 4 part dot separated number.
     *
     * @param currentVersion The current software version.
     * @param targetVersion The version that is available for download.
     *
     * @returns 0 if versions are the same; 1 if a newer version is available for download; -1 for a current version that is downlevel.
     */
    compareVersions(currentVersion: string, targetVersion: string): number;
}
