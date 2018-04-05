import { AccessibilityManager } from './accessibility-manager';
import { AssetManager } from './asset-manager';
import { LocalizationManager, LocalizationManagerOptions } from './localization-manager';
/**
 * Interface for manifest loading.
 */
export interface ManifestLoadingOptions {
    /**
     * Specify shell or module name.
     */
    name: string;
    /**
     * Specify the name of PowerShell module.
     */
    powerShellModuleName?: string;
    /**
     * Specify angular-cli production state used by the module loading only.
     */
    isProduction?: boolean;
    /**
     * Specify shell origin URL for sideloading debugging.
     */
    shellOrigin?: string;
}
/**
 * The enum switch to use predefined endpoints.
 */
export declare enum RuntimePowerShellEndpoint {
    /**
     * Not specify.
     */
    InlineScript = 0,
    /**
     * The default endpoint. Microsoft.PowerShell
     */
    Default = 1,
    /**
     * The SME endpoint. Microsoft.SME.PowerShell
     */
    Sme = 2,
}
/**
 * Interface for runtime options.
 */
export interface RuntimeOptions {
    /**
     * Enable websocket if true.
     */
    websocket?: boolean;
    /**
     * Force to use module functions instead of embedded script on PowerShell calls.
     */
    powerShellEndpoint?: RuntimePowerShellEndpoint | string;
    /**
     * Disable style injection if true.
     */
    disableStyleInjection?: boolean;
    /**
     * Disable accessibility if true.
     */
    disableAccessibility?: boolean;
}
/**
 * Class to initialize and the SME environment
 *  (Localized string cannot be used in this class due to initialization phase when the strings are not ready yet.)
 */
export declare class CoreEnvironment {
    /**
     * The localization manager once the environment has been initialized
     */
    static localizationManager: LocalizationManager<void>;
    static accessibilityManager: AccessibilityManager;
    static assetManager: AssetManager;
    /**
     * Initializes the environment with manifest loading mode.
     *
     * @param manifestOptions the name of manifest loading options.
     * @param localizationOptions the options to initialize the Localization Manager
     * @param runtimeOptions the optional runtime options.
     */
    static initialize(manifestOptions: ManifestLoadingOptions, localizationOptions: LocalizationManagerOptions, runtimeOptions?: RuntimeOptions): Promise<void[]>;
    /**
     * Validate and load localized strings if the localeId doesn't match with current locale Id.
     * @param localeId the local ID to reload.
     */
    static moduleLoadLocale(localeId: string): Promise<void>;
    /**
     * Initialize and load localization data by option settings.
     */
    private static localization();
}
