import { Router } from '@angular/router';
import { AppContextService } from '../angular';
export declare class AppModule {
    private router;
    private appContextService;
    private navigateByUrlOriginal;
    /**
     * Initializes a new instance of the AppModule class.
     * @param router the router object.
     */
    constructor(router: Router, appContextService: AppContextService);
    private navigateByUrlOverride(url, extras?);
}
