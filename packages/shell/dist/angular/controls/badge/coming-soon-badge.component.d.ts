import { Injector } from '@angular/core';
import { CoreBadgeBaseComponent } from './badge-base.component';
/**
 * Defines a coming soon badge
 */
export declare class ComingSoonBadgeComponent extends CoreBadgeBaseComponent {
    /**
     * Initializes a new instance of the @see ComingSoonBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
