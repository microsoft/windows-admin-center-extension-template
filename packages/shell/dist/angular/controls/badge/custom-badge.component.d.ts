import { Injector } from '@angular/core';
import { CoreBadgeBaseComponent } from './badge-base.component';
/**
 * Defines a custom badge
 */
export declare class CustomBadgeComponent extends CoreBadgeBaseComponent {
    /**
     * Initializes a new instance of the @see CustomBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
