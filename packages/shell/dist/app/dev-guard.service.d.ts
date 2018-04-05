import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
export declare class DevGuardService implements CanActivate {
    private router;
    /**
     * Initializes a new instance of the DevGuardService class.
     * @param router the activated route.
     */
    constructor(router: Router);
    /**
     * Guard against navigating until the app initialization is complete
     * @param route the current route snapshot
     * @param state the current router state snapshot
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
}
