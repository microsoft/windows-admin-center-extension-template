import { Injectable } from '@angular/core';
import { AppContextService } from '../angular';
import { InventoryQueryCaches, RpcInboundCommands, RpcSettingsOperationType, RpcSettingsProviderType, RpcSettingsScope } from '../core';
import { ShellUserSettings } from './modules/user-profile/models/shell-user-settings';
import { UserProfileService } from './modules/user-profile/user-profile.service';
var ShellService = /** @class */ (function () {
    /**
     * Initializes a new instance of the ShellService class.
     *
     * @param appContextService the AppContextService class instance.
     * @param userProfileService the UserProfileService class instance.
     */
    function ShellService(appContextService, userProfileService) {
        var _this = this;
        this.appContextService = appContextService;
        this.userProfileService = userProfileService;
        ShellService.isApplicationFaulted = false;
        var statusExpiration = 4 * 60 * 1000; // 4 min
        var versionExpiration = 4 * 60 * 60 * 1000; // 4 hrs
        this.inventoryCaches = new InventoryQueryCaches(this.appContextService, {
            serverCache: { expiration: statusExpiration },
            gatewayCache: { expiration: statusExpiration },
            gatewayCombinedCache: { expiration: versionExpiration },
            toolCache: { expiration: statusExpiration }
        });
        // clear cache when new service instance is created.
        this.inventoryCaches.clear();
        this.rootSubscription = this.inventoryCaches.serverCache.createObservable().subscribe();
        this.rootSubscription.add(this.inventoryCaches.gatewayCache.createObservable()
            .subscribe(function (gateway) { return _this.appContextService.authorizationManager.gatewayJwk = gateway.jwk; }));
        this.rootSubscription.add(this.inventoryCaches.gatewayCombinedCache.createObservable().subscribe());
        // listen for and handle rpc settings messages 
        this.appContextService.rpc.moduleSubjects(RpcInboundCommands.Settings)
            .subscribe(function (data) { return _this.handleRpcSettingsRequest(data); });
    }
    /**
     * Called when the application is ready to be interacted with.
     * @param faulted indicates that the application is starting in a faulty state
     */
    ShellService.setApplicationReady = function (faulted) {
        this.isApplicationFaulted = faulted;
        if (!ShellService.applicationReady) {
            ShellService.applicationReady = true;
            var appElement = document.body.querySelector('sme-root');
            appElement.removeAttribute('style');
        }
    };
    /**
     * Get the extension user settings for the shell
     */
    ShellService.prototype.getShellUserSettings = function () {
        var _this = this;
        var name = window.MsftSme.Environment.name;
        return this.userProfileService.getExtensionSettings(name).map(function (settings) {
            return new ShellUserSettings(settings, {
                save: function (object) { return _this.userProfileService.setExtensionSettings(name, object); }
            });
        });
    };
    /**
     * Message handler for user profile rpc requests
     * @param request the rpc request
     */
    ShellService.prototype.handleRpcSettingsRequest = function (request) {
        // if the request is invalid, then fail
        if (!request || !request.data) {
            var message = "Invalid RPC Settings Request.";
            request.deferred.reject(message);
            return;
        }
        // create placeholder for the actual operation handler
        var handler;
        // find the actual operation handler
        if (request.data.scope === RpcSettingsScope.User) {
            // User Scope
            if (request.data.operation === RpcSettingsOperationType.Get) {
                // Get Request
                if (request.data.provider === RpcSettingsProviderType.Common) {
                    // Common Provider
                    handler = this.userProfileService.getCommonSettings();
                }
                else if (request.data.provider === RpcSettingsProviderType.Extension) {
                    // Extension Provider
                    handler = this.userProfileService.getExtensionSettings(request.data.sourceName);
                }
            }
            else if (request.data.operation === RpcSettingsOperationType.Set) {
                // Set Request
                if (request.data.provider === RpcSettingsProviderType.Extension) {
                    // Extension Provider
                    handler = this.userProfileService.setExtensionSettings(request.data.sourceName, request.data.value);
                }
                // TODO: Evaluate if there is a need to set common settings from extensions or if they are readonly
            }
        }
        else if (request.data.scope === RpcSettingsScope.Application) {
            // Application Scope
            // TODO: implement RpcSettingsScope.Application Requests
        }
        // if no handler was found, then fail
        if (!handler) {
            var scopeName = this.formatHandlerErrorEnumName(request.data.scope, RpcSettingsOperationType[request.data.scope], 'Scope');
            var operationName = this.formatHandlerErrorEnumName(request.data.operation, RpcSettingsOperationType[request.data.operation], 'Operation');
            var providerName = this.formatHandlerErrorEnumName(request.data.provider, RpcSettingsProviderType[request.data.provider], 'Provider');
            var message = scopeName + " " + operationName + " operations are not allowed for " + providerName + " settings";
            request.deferred.reject(message);
            return;
        }
        // listen to handler and resolve or reject the request accordingly
        handler.take(1).subscribe(function (data) { request.deferred.resolve({ data: data }); }, function (error) { request.deferred.reject(error); });
    };
    /**
     * Gets a formatted representation of an enum value for handler errors.
     * @param value the enum value
     * @param valueName the enum value name
     * @param enumTypeName  the enum type name
     */
    ShellService.prototype.formatHandlerErrorEnumName = function (value, valueName, enumTypeName) {
        if (MsftSme.isNullOrUndefined(value)) {
            return "'Unknown " + enumTypeName + " (" + value + ")'";
        }
        return valueName;
    };
    /**
     * Compares two software versions, assuming that a valid version is a 4 part dot separated number.
     *
     * @param currentVersion The current software version.
     * @param targetVersion The version that is available for download.
     *
     * @returns 0 if versions are the same; 1 if a newer version is available for download; -1 for a current version that is downlevel.
     */
    ShellService.prototype.compareVersions = function (currentVersion, targetVersion) {
        if (MsftSme.isNull(currentVersion) || MsftSme.isNull(targetVersion)) {
            return 0;
        }
        var currentVersionParts = currentVersion.split('.').map(Number);
        // Target version is going to be hyphen separated as opposed to dot; due to limitations from aka.ms site.
        var targetVersionParts = targetVersion.split('-').map(Number);
        // We don't want to be too strict on the format; and allow ourselves room for
        // change in the future without breaking customers experience.
        if (currentVersionParts.length !== 4 || targetVersionParts.length !== 4) {
            return 0;
        }
        // Always assuming a 4 part number.
        for (var i = 0; i <= 3; i++) {
            if (targetVersionParts[i] === currentVersionParts[i]) {
                continue;
            }
            else if (targetVersionParts[i] > currentVersionParts[i]) {
                return 1;
            }
            else {
                return -1;
            }
        }
        return 0;
    };
    /**
     * Placeholder for the application ready state
     */
    ShellService.applicationReady = false;
    ShellService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ShellService.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: UserProfileService, },
    ]; };
    return ShellService;
}());
export { ShellService };
//# sourceMappingURL=data:application/json;base64,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LENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFyTEQ7O09BRUc7SUFDWSw2QkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFtTHJDLHVCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtLQUNuQixDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsMkJBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHO1FBQzNCLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixHQUFHO0tBQzNCLEVBSDZGLENBRzdGLENBQUM7SUFDRixtQkFBQztDQXBNRCxBQW9NQyxJQUFBO1NBcE1ZLFlBQVkiLCJmaWxlIjoic2hlbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=