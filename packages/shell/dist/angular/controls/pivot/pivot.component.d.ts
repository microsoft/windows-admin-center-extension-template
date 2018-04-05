import { Injector, QueryList } from '@angular/core';
import { CoreBaseComponent } from '../common/base.component';
import { PivotTabType } from './pivot-tab-type';
import { PivotTabComponent } from './pivot-tab.component';
export declare class PivotComponent extends CoreBaseComponent {
    /**
     * The selected tab
     */
    selection: PivotTabComponent;
    /**
     * The Tabs of the Pivot
     */
    tabs: QueryList<PivotTabComponent>;
    /**
     * Bindable property for tab types
     */
    pivotTabType: typeof PivotTabType;
    /**
     * Indicates that routed tabs have been provided
     */
    readonly hasRoutedTabs: boolean;
    /**
     * Indicates that static tabs have been provided
     */
    readonly hasStaticTabs: boolean;
    /**
     * Indicates that static tabs have been provided
     */
    readonly selectionIsRouted: boolean;
    /**
     * Initializes a new instance of the @see PivotComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Indicates of a given tab is selected
     * @param tab The tab to compare with
     */
    isSelected(tab: PivotTabComponent): boolean;
    /**
     * Selects a tab
     * @param tab The tab to select
     */
    select(tab: PivotTabComponent): void;
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned by the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
