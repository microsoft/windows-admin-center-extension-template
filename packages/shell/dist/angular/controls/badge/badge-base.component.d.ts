import { Injector, TemplateRef } from '@angular/core';
import { Strings } from '../../../generated/strings';
import { BaseComponent } from '../common/base.component';
/**
 * The levels of severity of a badge.
 */
export declare enum BadgeSeverity {
    Informational = 0,
    Warning = 1,
    Critical = 2,
}
/**
 * Defines a base component for badges
 */
export declare class BadgeBaseComponent<TStrings> extends BaseComponent<TStrings> {
    /**
     * The label of the badge
     */
    label: string;
    /**
     * The label of the badge
     */
    description: string;
    /**
     * The tooltip of the badge
     */
    tooltip: TemplateRef<any>;
    /**
     * The learn more link of the badge (applies to built in tooltips)
     */
    learnMoreLink: string;
    /**
     * The severity of the badge, defaults to informational
     */
    severity: BadgeSeverity;
    /**
     * The title that we actually bind to
     */
    readonly ariaLabel: string;
    /**
     * The title that we actually bind to
     */
    readonly icon: string;
    /**
     * The title that we actually bind to
     */
    readonly resolvedTitle: string;
    /**
     * The title that we actually bind to
     */
    readonly resolvedTooltip: TemplateRef<any>;
    /**
     * The default tooltip template
     */
    defaultTooltip: TemplateRef<any>;
    /**
     * Initializes a new instance of the @see BadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
/**
 * Internal base component for SME Core controls. It simply removes the need to supply the string type parameter
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
export declare class CoreBadgeBaseComponent extends BadgeBaseComponent<Strings> {
}
