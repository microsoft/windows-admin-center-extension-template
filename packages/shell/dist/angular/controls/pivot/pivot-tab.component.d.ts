import { TemplateRef } from '@angular/core';
import { PivotTabType } from './pivot-tab-type';
/**
 * Defines a tab for @see PivotComponent
 */
export declare class PivotTabComponent {
    /**
     * The route of this tab
     */
    route: string;
    /**
     * Use the same input options as angular @see RouterLinkActive Directive
     */
    routerLinkActiveOptions: {
        exact: boolean;
    };
    /**
     * The label of this tab.
     */
    label: string;
    /**
     * The content template ref of the tab.
     */
    contentTemplate: TemplateRef<any>;
    /**
     * Indicates the type of this tab
     */
    readonly type: PivotTabType;
}
