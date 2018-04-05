import { LogLevel } from '../diagnostics/log-level';
import { EnvironmentModule } from '../manifest/environment-modules';
import { ManifestLoader } from '../manifest/manifest-loader';
import { AccessibilityManager } from './accessibility-manager';
import { AssetManager } from './asset-manager';
import { LocalizationManager } from './localization-manager';
import { NativeQ } from './native-q';
import { PowerShell } from './powershell';
/**
 * The enum switch to use predefined endpoints.
 */
export var RuntimePowerShellEndpoint;
(function (RuntimePowerShellEndpoint) {
    /**
     * Not specify.
     */
    RuntimePowerShellEndpoint[RuntimePowerShellEndpoint["InlineScript"] = 0] = "InlineScript";
    /**
     * The default endpoint. Microsoft.PowerShell
     */
    RuntimePowerShellEndpoint[RuntimePowerShellEndpoint["Default"] = 1] = "Default";
    /**
     * The SME endpoint. Microsoft.SME.PowerShell
     */
    RuntimePowerShellEndpoint[RuntimePowerShellEndpoint["Sme"] = 2] = "Sme";
})(RuntimePowerShellEndpoint || (RuntimePowerShellEndpoint = {}));
/**
 * Class to initialize and the SME environment
 *  (Localized string cannot be used in this class due to initialization phase when the strings are not ready yet.)
 */
var CoreEnvironment = /** @class */ (function () {
    function CoreEnvironment() {
    }
    /**
     * Initializes the environment with manifest loading mode.
     *
     * @param manifestOptions the name of manifest loading options.
     * @param localizationOptions the options to initialize the Localization Manager
     * @param runtimeOptions the optional runtime options.
     */
    CoreEnvironment.initialize = function (manifestOptions, localizationOptions, runtimeOptions) {
        if (!manifestOptions || !manifestOptions.name) {
            // no localization.
            throw new Error('CoreEnvironment.initialize() - Argument error: manifestOptions.');
        }
        var sessionId = MsftSme.newGuid();
        var logLevel = MsftSme.consoleDebug() === null ? LogLevel.Warning : MsftSme.consoleDebug();
        var self = MsftSme.self();
        if (manifestOptions.name === EnvironmentModule.nameOfShell) {
            // shell manifest loading
            self.Init = {
                mode: 2 /* Load */,
                moduleName: manifestOptions.name,
                powerShellModuleName: manifestOptions.powerShellModuleName,
                isProduction: manifestOptions.isProduction,
                sessionId: sessionId,
                logLevel: logLevel
            };
        }
        else if (manifestOptions.isProduction) {
            // module on the production using the same site origin from location information
            // if not specified by manifestOptions.shellOrigin.
            self.Init = {
                mode: 1 /* LoadEmbedded */,
                moduleName: manifestOptions.name,
                powerShellModuleName: manifestOptions.powerShellModuleName,
                isProduction: manifestOptions.isProduction,
                shellOrigin: manifestOptions && manifestOptions.shellOrigin ? manifestOptions.shellOrigin : window.location.origin,
                sessionId: 'N/A',
                logLevel: logLevel
            };
        }
        else {
            // module side-loading manifest. non production environment accept any shell origin.
            self.Init = {
                mode: 1 /* LoadEmbedded */,
                moduleName: manifestOptions.name,
                powerShellModuleName: manifestOptions.powerShellModuleName,
                isProduction: manifestOptions.isProduction,
                shellOrigin: '*',
                sessionId: 'N/A',
                logLevel: logLevel
            };
        }
        // enable websocket stream query only if requested.
        if (runtimeOptions && runtimeOptions.websocket) {
            self.Init.websocket = true;
        }
        // enable websocket stream query only if requested.
        if (runtimeOptions && runtimeOptions.powerShellEndpoint) {
            if (typeof runtimeOptions.powerShellEndpoint === 'string') {
                self.Init.powerShellEndpoint = runtimeOptions.powerShellEndpoint;
            }
            else {
                var type = runtimeOptions.powerShellEndpoint;
                switch (type) {
                    case RuntimePowerShellEndpoint.Default:
                        self.Init.powerShellEndpoint = PowerShell.defaultPowerShellEndpoint;
                        break;
                    case RuntimePowerShellEndpoint.Sme:
                        self.Init.powerShellEndpoint = PowerShell.smePowerShellEndpoint;
                        break;
                }
            }
        }
        CoreEnvironment.localizationManager = new LocalizationManager(localizationOptions);
        if (!runtimeOptions || !runtimeOptions.disableStyleInjection) {
            CoreEnvironment.assetManager = new AssetManager(CoreEnvironment.localizationManager);
        }
        if (!runtimeOptions || !runtimeOptions.disableAccessibility) {
            CoreEnvironment.accessibilityManager = new AccessibilityManager();
        }
        return Promise.all([ManifestLoader.loadManifest(), CoreEnvironment.localization()]);
    };
    /**
     * Validate and load localized strings if the localeId doesn't match with current locale Id.
     * @param localeId the local ID to reload.
     */
    CoreEnvironment.moduleLoadLocale = function (localeId) {
        if (CoreEnvironment.localizationManager.localeId !== localeId) {
            CoreEnvironment.localizationManager.saveLocale(localeId);
            return CoreEnvironment.localization();
        }
        return NativeQ.resolved();
    };
    /**
     * Initialize and load localization data by option settings.
     */
    CoreEnvironment.localization = function () {
        var self = MsftSme.self();
        return CoreEnvironment.localizationManager.fetchLocalizedStrings()
            .toPromise()
            .then(function (strings) {
            self.Resources.strings = strings;
        });
    };
    return CoreEnvironment;
}());
export { CoreEnvironment };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9jb3JlLWVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBOEIsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUE0QjFDOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVkseUJBZVg7QUFmRCxXQUFZLHlCQUF5QjtJQUNqQzs7T0FFRztJQUNILHlGQUFnQixDQUFBO0lBRWhCOztPQUVHO0lBQ0gsK0VBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsdUVBQU8sQ0FBQTtBQUNYLENBQUMsRUFmVyx5QkFBeUIsS0FBekIseUJBQXlCLFFBZXBDO0FBMkJEOzs7R0FHRztBQUNIO0lBQUE7SUF5SEEsQ0FBQztJQWpIRzs7Ozs7O09BTUc7SUFDVywwQkFBVSxHQUF4QixVQUNJLGVBQXVDLEVBQ3ZDLG1CQUErQyxFQUMvQyxjQUErQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVDLG1CQUFtQjtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7UUFDdkYsQ0FBQztRQUVELElBQUksU0FBUyxHQUFXLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQyxJ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Q0wsQ0FBQztRQUNMLENBQUM7UUFFRCxlQUFlLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsQ0FBTSxtQkFBbUIsQ0FBQyxDQUFDO1FBRXhGLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUMzRCxlQUFlLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pGLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDMUQsZUFBZSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN0RSxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRUQ7OztPQUdHO0lBQ1csZ0NBQWdCLEdBQTlCLFVBQStCLFFBQWdCO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1RCxlQUFlLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUMsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFRLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHO0lBQ1ksNEJBQVksR0FBM0I7UUFDSSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsRUFBRTthQUM3RCxTQUFTLEVBQUU7YUFDWCxJQUFJLENBQUMsVUFBQSxPQUFPO1lBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F6SEEsQUF5SEMsSUFBQSIsImZpbGUiOiJjb3JlLWVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==