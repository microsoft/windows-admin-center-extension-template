import { AfterContentInit, ChangeDetectorRef, DoCheck, EventEmitter, Injector, QueryList } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { CoreBaseComponent } from '../../controls/common/base.component';
/**
 * Directive to provide notification or state changes for angulars @see RouterLink directive.
 * The design of this directive is identical to @see RouterLinkActive
 * and as such supports the same @see RouterLinkActiveOptions are supported.
 */
export declare class SmeRouterLinkDirective extends CoreBaseComponent implements DoCheck, AfterContentInit {
    private router;
    private changeDetectorRef;
    /**
     * The output for when the route is activated
     */
    smeRouterLinkActivated: EventEmitter<{}>;
    /**
     * The output for when the route is deactivated
     */
    smeRouterLinkDeactivated: EventEmitter<{}>;
    /**
     * Get all router links that are on our element or child elements.
     */
    links: QueryList<RouterLink>;
    /**
     * Get all router links on 'a' tags that are on our element or child elements.
     */
    linksWithHrefs: QueryList<RouterLinkWithHref>;
    /**
     * Use the same input options as angulars @see RouterLinkActive Directive
     */
    routerLinkActiveOptions: {
        exact: boolean;
    };
    /**
     * Placeholder for the current activation state
     */
    private isActive;
    /**
     * Initializes a new instance of the @see PivotComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     * @param {Router} router The angular router service
     */
    constructor(injector: Injector, router: Router, changeDetectorRef: ChangeDetectorRef);
    /**
     * Angulars AfterContentInit life cycle event
     */
    ngAfterContentInit(): void;
    /**
     * Angulars OnChanges life cycle event
     */
    ngDoCheck(): void;
    /**
     * Updates the isActive state and fires appropriete events if that state has changed.
     */
    private updateIsActive();
    /**
     * Indicates if a given link is active
     * @param link the link to check
     */
    private isLinkActive(link);
    /**
     * Indicates that at leased one link is active
     */
    private hasActiveLinks();
}
