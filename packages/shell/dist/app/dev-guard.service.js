import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHelpers } from './utility/route-helpers';
var DevGuardService = /** @class */ (function () {
    /**
     * Initializes a new instance of the DevGuardService class.
     * @param router the activated route.
     */
    function DevGuardService(router) {
        this.router = router;
    }
    /**
     * Guard against navigating until the app initialization is complete
     * @param route the current route snapshot
     * @param state the current router state snapshot
     */
    DevGuardService.prototype.canActivate = function (route, state) {
        if (isDevMode()) {
            return true;
        }
        RouteHelpers.navigateToHome(this.router);
        return false;
    };
    DevGuardService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DevGuardService.ctorParameters = function () { return [
        { type: Router, },
    ]; };
    return DevGuardService;
}());
export { DevGuardService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9kZXYtZ3VhcmQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBQSxFQUFZLFNBQUEsRUFBVSxNQUFPLGVBQUEsQ0FBZ0I7QUFDdEQsT0FBTyxFQUF1QyxNQUFBLEVBQTRCLE1BQU8saUJBQUEsQ0FBa0I7QUFJbkcsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLHlCQUFBLENBQTBCO0FBR3ZEO0lBRUk7OztPQUdHO0lBQ0gseUJBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUksQ0FBQztJQUV2Qzs7OztPQUlHO0lBQ0kscUNBQVcsR0FBbEIsVUFBbUIsS0FBNkIsRUFBRSxLQUEwQjtRQUN4RSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDRSwwQkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7S0FDbkIsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDhCQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxNQUFNLEdBQUc7S0FDZixFQUY2RixDQUU3RixDQUFDO0lBQ0Ysc0JBQUM7Q0EzQkQsQUEyQkMsSUFBQTtTQTNCWSxlQUFlIiwiZmlsZSI6ImRldi1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==