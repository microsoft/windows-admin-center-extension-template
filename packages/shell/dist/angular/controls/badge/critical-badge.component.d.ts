import { Injector } from '@angular/core';
import { CoreBadgeBaseComponent } from './badge-base.component';
/**
 * Defines the critical badge.
 */
export declare class CriticalBadgeComponent extends CoreBadgeBaseComponent {
    /**
     * Initializes a new instance of the @see CriticalBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
