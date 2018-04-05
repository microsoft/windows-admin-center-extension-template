import { Injectable } from '@angular/core';
var TooltipService = /** @class */ (function () {
    function TooltipService() {
    }
    Object.defineProperty(TooltipService.prototype, "TooltipHost", {
        /**
         * public facing getter for the tooltip host
         */
        get: function () {
            if (!this.host) {
                throw new Error('TooltipService: Attempted to access TooltipHost before it was ready');
            }
            return this.host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipService.prototype, "showOnfocus", {
        /**
         * Indicates that tooltips should show on focus
         */
        get: function () {
            return !!MsftSme.self().Resources.accessibilityMode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Registers the tooltip host with the service.
     * @param component The tooltip host component.
     */
    TooltipService.prototype.register = function (host) {
        if (this.host) {
            throw new Error('TooltipService.register: Only one tooltip host may be registered at a time.');
        }
        this.host = host;
    };
    /**
     * Unregisters  the tooltip host with the service.
     * @param component The tooltip host component.
     */
    TooltipService.prototype.unregister = function (host) {
        if (this.host !== host) {
            throw new Error('TooltipService.unregister: Attempted to unregister a host that is not registered.');
        }
        this.host = null;
    };
    TooltipService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TooltipService.ctorParameters = function () { return []; };
    return TooltipService;
}());
export { TooltipService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvdG9vbHRpcC90b29sdGlwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLGVBQUEsQ0FBZ0I7QUFJM0M7SUFBQTtJQW9EQSxDQUFDO0lBL0NHLHNCQUFXLHVDQUFXO1FBSHRCOztXQUVHO2FBQ0g7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQztZQUMzRixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyx1Q0FBVztRQUh0Qjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFBO1FBQ3ZELENBQUM7OztPQUFBO0lBT0Q7OztPQUdHO0lBQ0ksaUNBQVEsR0FBZixVQUFnQixJQUFpQjtRQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQztRQUNuRyxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG1DQUFVLEdBQWpCLFVBQWtCLElBQWlCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLG1GQUFtRixDQUFDLENBQUM7UUFDekcsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRSx5QkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7S0FDbkIsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDZCQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0YscUJBQUM7Q0FwREQsQUFvREMsSUFBQTtTQXBEWSxjQUFjIiwiZmlsZSI6InRvb2x0aXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=