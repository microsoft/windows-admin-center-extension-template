import { LocalizationManager } from './localization-manager';
/**
 * Class for asset manager
 */
export declare class AssetManager {
    private localizationManager;
    constructor(localizationManager: LocalizationManager<void>);
    /**
     * Injects dynamic assets (css, js, etc..) from the shell
     * This is only meant to be called once during an extensions lifecycle (during init)
     * @param theme the current theme name
     * @param assets the assets to process
     */
    loadAssets(theme: string, assets: MsftSme.MsftSmeAssets): void;
    /**
     * Ensures Resources are Initialized
     */
    private ensureResourcesInitialized();
}
