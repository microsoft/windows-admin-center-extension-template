import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppContextService, BaseComponent } from '../../../../angular';
import { Strings } from '../../../../generated/strings';
export declare class GenericErrorComponent extends BaseComponent<Strings> {
    /**
     * Update the navigation title.
     *
     * @param appContextService the application context service.
     * @param snapshot the route snapshot.
     */
    static navigationTitle(appContextService: AppContextService, snapshot: ActivatedRouteSnapshot): string;
    /**
     * Instantiate a new instance of the UnsupportedBrowserComponent
     * @param injector The angular injection service
     */
    constructor(injector: Injector);
    /**
     * Refreshes the application to a clean state
     */
    refresh(): void;
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
