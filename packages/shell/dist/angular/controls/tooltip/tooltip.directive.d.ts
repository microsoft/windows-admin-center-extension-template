import { Injector, OnChanges, OnDestroy, SimpleChanges, TemplateRef } from '@angular/core';
import { CoreBaseComponent } from '../common/base.component';
/**
 * Directive to create tooltips in the tooltip host.
 */
export declare class TooltipDirective extends CoreBaseComponent implements OnDestroy, OnChanges {
    /**
     * The native tooltip property
     */
    title: string;
    /**
     * A template reference for a custom tooltip
     */
    smeTooltip: TemplateRef<any>;
    /**
     * A template reference for a custom tooltip
     */
    smeTooltipContext: any;
    /**
     * The input for the placement of the tooltip. Defaults to 'bottom'
     */
    smeTooltipPlacement: string;
    /**
     * Gets the id of the tooltip that will describe this element
     */
    readonly ariaDescribedBy: string;
    /**
     * The actual placement of the tooltip
     */
    private readonly placement;
    /**
     * The tooltip service
     */
    private tooltipService;
    /**
     * The tooltip host
     */
    private readonly tooltipHost;
    /**
     * Internal placeholder for the current focused state
     */
    private focused;
    /**
     * Internal placeholder for the current hovered state
     */
    private hovered;
    /**
     * Indicates that this tooltip is shown
     */
    private readonly shown;
    /**
     * Indicates that this tooltip should be shown
     */
    private readonly shouldShow;
    /**
     * Initializes a new instance of the @see PivotComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Implementation of angular OnChanges interface
     * On any change we update the tooltip if it is shown
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Implementation of angular OnDestroy interface
     */
    ngOnDestroy(): void;
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
    /**
     * Host listeners for tooltip focus events
     */
    private onFocusEvent(event);
    /**
     * Host listeners for tooltip mouse events
     */
    private onMouseEvent(event);
    /**
     * Shows or hides the tooltip if either the hover or focused states are true
     * @param hovered indicates the element is hovered
     * @param focused indicates the element is focused
     */
    private showHideTooltip(hovered?, focused?);
    /**
     * Shows the tooltip.
     */
    private show();
    /**
     * Hides the tooltip.
     */
    private hide();
    private getTooltipOptions();
}
