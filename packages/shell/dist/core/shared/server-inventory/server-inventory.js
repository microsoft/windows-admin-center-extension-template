import { MediaConversion, MediaConversionBase } from '../../data/units';
/**
 * Windows Operating Systems
 */
export var WindowsOperatingSystem;
(function (WindowsOperatingSystem) {
    WindowsOperatingSystem[WindowsOperatingSystem["Unknown"] = 0] = "Unknown";
    WindowsOperatingSystem[WindowsOperatingSystem["Legacy"] = 1] = "Legacy";
    WindowsOperatingSystem[WindowsOperatingSystem["WindowsVista"] = 2] = "WindowsVista";
    WindowsOperatingSystem[WindowsOperatingSystem["Windows7"] = 3] = "Windows7";
    WindowsOperatingSystem[WindowsOperatingSystem["WindowsServer2008"] = 4] = "WindowsServer2008";
    WindowsOperatingSystem[WindowsOperatingSystem["WindowsServer2008R2"] = 5] = "WindowsServer2008R2";
    WindowsOperatingSystem[WindowsOperatingSystem["Windows8"] = 6] = "Windows8";
    WindowsOperatingSystem[WindowsOperatingSystem["WindowsServer2012"] = 7] = "WindowsServer2012";
    WindowsOperatingSystem[WindowsOperatingSystem["Windows8Point1"] = 8] = "Windows8Point1";
    WindowsOperatingSystem[WindowsOperatingSystem["WindowsServer2012R2"] = 9] = "WindowsServer2012R2";
    WindowsOperatingSystem[WindowsOperatingSystem["Windows10"] = 10] = "Windows10";
    WindowsOperatingSystem[WindowsOperatingSystem["WindowsServer2016"] = 11] = "WindowsServer2016";
})(WindowsOperatingSystem || (WindowsOperatingSystem = {}));
/**
 * Windows Product Types
 */
export var WindowsProductType;
(function (WindowsProductType) {
    WindowsProductType[WindowsProductType["Workstation"] = 1] = "Workstation";
    WindowsProductType[WindowsProductType["DomainController"] = 2] = "DomainController";
    WindowsProductType[WindowsProductType["Server"] = 3] = "Server";
})(WindowsProductType || (WindowsProductType = {}));
/**
 * Server Inventory class.
 */
var ServerInventory = /** @class */ (function () {
    /**
     * Initializes a new instance of the ServerInventory Class.
     *
     * @param serverName the server name to query.
     * @param data the server inventory recovered data.
     */
    function ServerInventory(serverName, data) {
        this.serverName = serverName;
        if (data) {
            Object.assign(this, data);
        }
    }
    Object.defineProperty(ServerInventory.prototype, "isNano", {
        /**
         * Gets the sku number indicating whether the computer is Nano server.
         *
         * @return boolean true if nano
         */
        get: function () {
            // given sku number is in nanoServerSkus array?
            return ServerInventory.nanoServerSkus.indexOf(this.operatingSystemSKU) > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerInventory.prototype, "isServer", {
        /**
         * Gets a value indicating if this is a windows server
         *
         * @return boolean true if this is a server
         */
        get: function () {
            return this.productType === WindowsProductType.Server;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerInventory.prototype, "isClient", {
        /**
         * Gets a value indicating if this is a windows client
         *
         * @return boolean true if this is a client
         */
        get: function () {
            return this.productType === WindowsProductType.Workstation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerInventory.prototype, "isDomainController", {
        /**
         * Indicates whether the computer is domain controller or not.
         *
         * @return boolean true if domain controller
         */
        get: function () {
            // As per https://msdn.microsoft.com/en-us/library/windows/desktop/aa394102(v=vs.85)
            // domainRole of 4 or 5 means it's a domain controller.
            return (this.domainRole === 4 || this.domainRole === 5);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerInventory.prototype, "operatingSystemDisplayName", {
        /**
         * Gets the display name of operating system.
         */
        get: function () {
            return this.isNano ? ServerInventory.nanoDisplayFormat.format(this.operatingSystemName) : this.operatingSystemName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerInventory.prototype, "totalPhysicalMemoryDisplayName", {
        /**
         * Gets the display name of total physical memory.
         */
        get: function () {
            return MediaConversion.getConvertedValue(this.totalPhysicalMemory, MediaConversionBase.Binary);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerInventory.prototype, "operatingSystem", {
        /**
         * Gets the operating system enumb of the machine
         * see: https://msdn.microsoft.com/en-us/library/windows/desktop/ms724832(v=vs.85).aspx for operating system version mapping.
         */
        get: function () {
            if (!this.operatingSystemVersion) {
                return WindowsOperatingSystem.Unknown;
            }
            // windows 10 and server 2016
            // report anything newer as one of these options.
            if (this.operatingSystemVersion.indexOf('.') > 1) {
                // since . is more than 2 digits from the start of the screen we are going to assume its '10.', '11.', etc...
                return this.isServer
                    ? WindowsOperatingSystem.WindowsServer2016
                    : WindowsOperatingSystem.Windows10;
            }
            // windows 8.1 and server 2012r2
            if (this.operatingSystemVersion.startsWith('6.3')) {
                return this.isServer
                    ? WindowsOperatingSystem.WindowsServer2012R2
                    : WindowsOperatingSystem.Windows8Point1;
            }
            // windows 8 and server 2012
            if (this.operatingSystemVersion.startsWith('6.2')) {
                return this.isServer
                    ? WindowsOperatingSystem.WindowsServer2012
                    : WindowsOperatingSystem.Windows8;
            }
            // windows 7 and server 2008 R2
            if (this.operatingSystemVersion.startsWith('6.1')) {
                return this.isServer
                    ? WindowsOperatingSystem.WindowsServer2008R2
                    : WindowsOperatingSystem.Windows7;
            }
            // windows vista and server 2008
            if (this.operatingSystemVersion.startsWith('6.0')) {
                return this.isServer
                    ? WindowsOperatingSystem.WindowsServer2008
                    : WindowsOperatingSystem.WindowsVista;
            }
            // assume a legacy os that somehow was able to run powershell.(unlikely)
            return WindowsOperatingSystem.Legacy;
        },
        enumerable: true,
        configurable: true
    });
    ServerInventory.nanoDisplayFormat = '{0} Nano';
    /*
     * OperatingSystemSKU: from https://msdn.microsoft.com/en-us/library/aa394239(v=vs.85).aspx
     *    PRODUCT_DATACENTER_NANO_SERVER (143)
     *       Windows Server Datacenter Edition (Nano Server installation)
     *    PRODUCT_STANDARD_NANO_SERVER (144)
     *       Windows Server Standard Edition (Nano Server installation)
     */
    ServerInventory.nanoServerSkus = [143, 144];
    return ServerInventory;
}());
export { ServerInventory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL3NlcnZlci1pbnZlbnRvcnkvc2VydmVyLWludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFpQnhFOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksc0JBYVg7QUFiRCxXQUFZLHNCQUFzQjtJQUM5Qix5RUFBVyxDQUFBO0lBQ1gsdUVBQVUsQ0FBQTtJQUNWLG1GQUFnQixDQUFBO0lBQ2hCLDJFQUFZLENBQUE7SUFDWiw2RkFBcUIsQ0FBQTtJQUNyQixpR0FBdUIsQ0FBQTtJQUN2QiwyRUFBWSxDQUFBO0lBQ1osNkZBQXFCLENBQUE7SUFDckIsdUZBQWtCLENBQUE7SUFDbEIsaUdBQXVCLENBQUE7SUFDdkIsOEVBQWMsQ0FBQTtJQUNkLDhGQUFzQixDQUFBO0FBQzFCLENBQUMsRUFiVyxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBYWpDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxrQkFJWDtBQUpELFdBQVksa0JBQWtCO0lBQzFCLHlFQUFlLENBQUE7SUFDZixtRkFBb0IsQ0FBQTtJQUNwQiwrREFBVSxDQUFBO0FBQ2QsQ0FBQyxFQUpXLGtCQUFrQixLQUFsQixrQkFBa0IsUUFJN0I7QUFrRkQ7O0dBRUc7QUFDSDtJQTBISTs7Ozs7T0FLRztJQUNILHlCQUFtQixVQUFrQixFQUFFLElBQTBCO1FBQTlDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDO0lBT0Qsc0JBQVcsbUNBQU07UUFMakI7Ozs7V0FJRzthQUNIO1lBQ0ksK0NBQStDO1lBQy9DLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJ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LEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ2hCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUI7b0JBQzFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUE7WUFDN0MsQ0FBQztZQUVELHdFQUF3RTtZQUN4RSxNQUFNLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDO1FBQ3pDLENBQUM7OztPQUFBO0lBM09jLGlDQUFpQixHQUFHLFVBQVUsQ0FBQztJQUU5Qzs7Ozs7O09BTUc7SUFDWSw4QkFBYyxHQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBbU96RCxzQkFBQztDQTdPRCxBQTZPQyxJQUFBO1NBN09ZLGVBQWUiLCJmaWxlIjoic2VydmVyLWludmVudG9yeS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=