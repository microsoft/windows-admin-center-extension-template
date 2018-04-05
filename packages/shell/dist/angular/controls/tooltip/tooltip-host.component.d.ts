import { ElementRef, Injector, OnDestroy } from '@angular/core';
import { CoreBaseComponent } from '../common/base.component';
import { TooltipHost } from './models/tooltip-host';
import { TooltipOptions } from './models/tooltip-options';
/**
 * Tooltip host component provides a host for tooltips.
 */
export declare class TooltipHostComponent extends CoreBaseComponent implements OnDestroy, TooltipHost {
    /**
     * The element that contains and positions the tooltip
     */
    tooltipContainer: ElementRef;
    /**
     * The element that is used to point to the target of the tooltip
     */
    tooltipPointer: ElementRef;
    /**
     * The current tooltip options
     */
    options: TooltipOptions;
    /**
     * Internal placeholder for the current focused state
     */
    private focused;
    /**
     * Internal placeholder for the current hovered state
     */
    private hovered;
    /**
     * container for host specific data being passed to the tooltip template context
     */
    private hostData;
    /**
     * indicates that the tooltip has focus
     */
    readonly isFocused: boolean;
    /**
     * indicates that the tooltip is hovered
     */
    readonly isHovered: boolean;
    /**
     * Gets the role that this tooltip is playing. If the tooltip is text only,
     * then it is treated as a dialog.
     * otherwise it is treated as a tooltip
     */
    readonly ariaRole: string;
    /**
     * Gets the aria modal attribute value
     */
    readonly ariaModal: boolean;
    /**
     * The tooltip service
     */
    private tooltipService;
    /**
     * Initializes a new instance of the @see TooltipHostComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    constructor(injector: Injector);
    ngOnDestroy(): void;
    /**
     * Occurs when the tooltip container is focused or unfocused
     * @param event the focusin or focusout event
     */
    onFocusChanged(event: Event): void;
    /**
     * Occurs when the tooltip container is hovered or un-hovered
     * @param event the mouseenter or mouseleave event
     */
    onHoverChanged(event: Event): void;
    /**
     * Window resize listener
     */
    onWindowResized(event: Event): void;
    /**
     * Escape key listener
     */
    onEscape(): void;
    /**
     * Show a tooltip with the given options
     * @param options
     */
    show(options: TooltipOptions): void;
    /**
     * Updates the active tooltip with new options
     * @param id the tooltip id
     */
    update(options: TooltipOptions): void;
    /**
     * Hides the tooltip with the given id
     * @param id the tooltip id
     */
    isShown(id: string): boolean;
    /**
     * Hides the tooltip with the given id
     * @param id the tooltip id
     */
    hide(id: string): void;
    /**
     * Repositions the tooltip
     */
    private reposition();
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
    /**
     * Gets the initial host classes to be applied to this element
     */
    protected getInitialHostClasses(): string[];
}
