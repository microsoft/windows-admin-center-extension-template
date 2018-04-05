/**
 * Class for asset manager
 */
var AssetManager = /** @class */ (function () {
    function AssetManager(localizationManager) {
        this.localizationManager = localizationManager;
        // initialize resources
        this.ensureResourcesInitialized();
    }
    /**
     * Injects dynamic assets (css, js, etc..) from the shell
     * This is only meant to be called once during an extensions lifecycle (during init)
     * @param theme the current theme name
     * @param assets the assets to process
     */
    AssetManager.prototype.loadAssets = function (theme, assets) {
        this.ensureResourcesInitialized();
        var self = MsftSme.self();
        self.Resources.theme = theme;
        self.Resources.assets = assets;
        // apply the theme class to the body of the document
        document.body.classList.add("sme-theme-" + theme);
        if (!assets) {
            return;
        }
        // get the page header
        var head = document.getElementsByTagName('head')[0];
        // inject css tags into header
        if (assets.css) {
            assets.css.forEach(function (href) {
                var link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', href);
                head.appendChild(link);
            });
        }
        /**
         * The js injection mechanism below is subject to the following attack:
         *
         * 1. User visits malicious website (MW) from their workstation
         * 2. MW randomly or sequentially opens hidden iframes to localhost on various ports.
         * 3. once each iframe loads it send rpc init and inpersonates the shell side of the communication channel
         * 4. The iframe will respond because it trusts * domains for onMessage requests. (this is a basic requirement of our infastructure)
         * 5. The MW can then inject any javascript it wants into the module and presumably knows the gateway is running on the same port.
         * 6. Because we use windows authentication, the MW can execute powershell requests on any servers the user has access to.
         * 7. The MW has now compromised the server acting as the user.
         *
         * How to fix:
         * In order for this to work, we need an ironclad way of validating that our parent is the shell.
         * some possibilities are:
         *
         * 1. Three way handshake with gateway to discover the only acceptable shell origin.
         *      a. this could be done with javascript or it could be a static file that the module always reads at startup
         * 2. certificate based authentication before rpc communication
         * 3. other methods?
         *
         * Disabling until we have a more solid use case and we know the most secure way to achieve this functionality.
         */
        // // inject js tags into header
        // if (assets.js) {
        //     assets.js.forEach(href => {
        //         let script = document.createElement('script');
        //         script.setAttribute('type', 'text/javascript');
        //         script.setAttribute('src', href);
        //         head.appendChild(script);
        //     });
        // }
    };
    /**
     * Ensures Resources are Initialized
     */
    AssetManager.prototype.ensureResourcesInitialized = function () {
        var self = MsftSme.self();
        if (!self.Resources) {
            var locale = this.localizationManager.getLocaleId();
            self.Resources = { strings: {}, localeId: locale };
        }
    };
    return AssetManager;
}());
export { AssetManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9hc3NldC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBOztHQUVHO0FBQ0g7SUFDSSxzQkFBb0IsbUJBQThDO1FBQTlDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBMkI7UUFDOUQsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNJLGlDQUFVLEdBQWpCLFVBQWtCLEtBQWEsRUFBRSxNQUE2QjtRQUMxRCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQTtRQUVqQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUMvQixvREFBb0Q7UUFDcEQsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWEsS0FBTyxDQUFDLENBQUM7UUFFbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELHNCQUFzQjtRQUN0QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEQsOEJBQThCO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNuQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FxQkc7UUFFSCxnQ0FBZ0M7UUFDaEMsbUJBQW1CO1FBQ25CLGtDQUFrQztRQUNsQyx5REFBeUQ7UUFDekQsMERBQTBEO1FBQzFELDRDQUE0QztRQUM1QyxvQ0FBb0M7UUFDcEMsVUFBVTtRQUNWLElBQUk7SUFDUixDQUFDO0lBRUQ7O09BRUc7SUFDSyxpREFBMEIsR0FBbEM7UUFDSSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBNkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUNqRixDQUFDO0lBQ0wsQ0FBQztJQUVMLG1CQUFDO0FBQUQsQ0FsRkEsQUFrRkMsSUFBQSIsImZpbGUiOiJhc3NldC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==