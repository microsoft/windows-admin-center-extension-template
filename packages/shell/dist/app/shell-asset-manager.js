import { CoreEnvironment } from '../core';
var ShellAssetManager = /** @class */ (function () {
    function ShellAssetManager() {
    }
    Object.defineProperty(ShellAssetManager, "theme", {
        get: function () {
            var themeName = localStorage.getItem(ShellAssetManager.themeStorageKey);
            if (themeName == null || !ShellAssetManager.assets[themeName]) {
                themeName = ShellAssetManager.defaultTheme;
            }
            return themeName;
        },
        set: function (theme) {
            localStorage.setItem(ShellAssetManager.themeStorageKey, theme);
        },
        enumerable: true,
        configurable: true
    });
    ShellAssetManager.getAssetLocationPath = function (relativePath) {
        if (!ShellAssetManager.version) {
            throw new Error('AssetManager.getAssetLocationPath() called before AssetManager.initialize()');
        }
        return window.location.origin + "/assets/styles/" + relativePath + "?v=" + ShellAssetManager.version;
    };
    ShellAssetManager.initialize = function (production) {
        // in development mode, use the current time for the version. In production mode, use the current shell version.
        var self = MsftSme.self();
        ShellAssetManager.version = production && self.Environment.version ? self.Environment.version : Date.now().toString();
        // TODO: localize assets
        var locale = CoreEnvironment.localizationManager.getLocaleId();
        // initialize sme common assets. (shell loads these sooner from angular-cli.json)
        ShellAssetManager.assets = { css: [], js: [] };
        // load assets so far
        CoreEnvironment.assetManager.loadAssets(ShellAssetManager.theme, ShellAssetManager.assets);
        // store with module only assets so that moduleInit passes them along as well (currently empty)
        // this might be some javascript that should execute in modules, but not the shell.
        (_a = window.MsftSme.Resources.assets.css).push.apply(_a, [
            ShellAssetManager.getAssetLocationPath('main.css')
        ]);
        (_b = window.MsftSme.Resources.assets.js).push.apply(_b, []);
        var _a, _b;
    };
    ShellAssetManager.themeStorageKey = "msft.sme.shell-assetManager-theme";
    ShellAssetManager.defaultTheme = 'light';
    return ShellAssetManager;
}());
export { ShellAssetManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGVsbC1hc3NldC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQXFCLE1BQU0sU0FBUyxDQUFDO0FBRTdEO0lBQUE7SUE2Q0EsQ0FBQztJQXZDRyxzQkFBa0IsMEJBQUs7YUFBdkI7WUFDSSxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxTQUFTLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDO1lBQy9DLENBQUM7WUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3JCLENBQUM7YUFDRCxVQUF3QixLQUFhO1lBQ2pDLFlBQVksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25FLENBQUM7OztPQUhBO0lBS2Esc0NBQW9CLEdBQWxDLFVBQW1DLFlBQW9CO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDZFQUE2RSxDQUFDLENBQUM7UUFDbkcsQ0FBQztRQUNELE1BQU0sQ0FBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sdUJBQWtCLFlBQVksV0FBTSxpQkFBaUIsQ0FBQyxPQUFTLENBQUM7SUFDcEcsQ0FBQztJQUVhLDRCQUFVLEdBQXhCLFVBQXlCLFVBQW1CO1FBQ3hDLGdIQUFnSDtRQUNoSCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsaUJBQWlCLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV0SCx3QkFBd0I7UUFDeEIsSUFBSSxNQUFNLEdBQUcsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRS9ELGlGQUFpRjtRQUNqRixpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUUvQyxxQkFBcUI7UUFDckIsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNGLCtGQUErRjtRQUMvRixtRkFBbUY7UUFDbkYsQ0FBQSxLQUFvQixNQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFBLENBQUMsSUFBSSxXQUFJO1lBQzdELGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQztTQUNyRCxFQUFFO1FBQ0gsQ0FBQSxLQUFvQixNQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFBLENBQUMsSUFBSSxXQUFJLEVBQUUsRUFBRTs7SUFDeEUsQ0FBQztJQTFDYyxpQ0FBZSxHQUFHLG1DQUFtQyxDQUFDO0lBQ3RELDhCQUFZLEdBQUcsT0FBTyxDQUFDO0lBMEMxQyx3QkFBQztDQTdDRCxBQTZDQyxJQUFBO1NBN0NZLGlCQUFpQiIsImZpbGUiOiJzaGVsbC1hc3NldC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==