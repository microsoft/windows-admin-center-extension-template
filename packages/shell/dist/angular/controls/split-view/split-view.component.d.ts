import { AfterContentInit, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Layout } from '../common/interfaces';
/**
 * The pane orientation of the split view.
 */
export declare type SplitViewOrientation = 'top' | 'left' | 'right' | 'bottom';
/**
 * The component definition of the split view content.
 */
export declare class SplitViewContentComponent {
}
/**
 * The component definition of the split view pane.
 */
export declare class SplitViewPaneComponent {
}
/**
 * The component definition of the split view.
 */
export declare class SplitViewComponent implements AfterContentInit, Layout, OnInit {
    private elementReference;
    private internalIsExpanded;
    private isComponentInitialized;
    /**
     * It implements the ILayout interface. It's triggered when the layout is changed.
     * It's used to tell the child components to coordate with the layout change.
     */
    layoutChanged: EventEmitter<void>;
    /**
     * The content of the component.
     */
    content: SplitViewContentComponent;
    /**
     * The pane of the component.
     */
    pane: SplitViewPaneComponent;
    paneContainerElement: ElementRef;
    /**
     * It indicates whether to show the scrollbar when it's needed.
     */
    showScrollbar: boolean;
    /**
     * It indicates whether to show the border for the splitter.
     */
    showSplitterBorder: boolean;
    /**
     * It indicates the distnace between the start and end of the pane.
     */
    paneDistance: number;
    /**
     * It indicates the min value of the pane size.
     */
    resizeLowerMargin: number;
    /**
     * It indicates the min value of the content size.
     */
    resizeUpperMargin: number;
    /**
     * The orientation of the pane.
     */
    orientation: SplitViewOrientation;
    /**
     * The event fired when the pane's expanded state is being toggled.
     */
    paneToggling: EventEmitter<{
        isExpanded: boolean;
    }>;
    /**
     * The event fired when the pane's expanded state has been toggled.
     */
    paneToggled: EventEmitter<{
        isExpanded: boolean;
    }>;
    constructor(elementReference: ElementRef);
    /**
     * Gets the CSS classes of the component.
     *
     * TODO: setting the class this way prevent any custom class from being applied.
     * Change to setting class in the constructor using Renderer2 and ElementRef
     */
    readonly hostClass: string;
    /**
     * Gets the flex direction of the component.
     */
    readonly flexDirection: string;
    /**
     * Whether the pane is expanded.
     */
    isExpanded: boolean;
    ngOnInit(): void;
    /**
     * The method called after content is initialized.
     */
    ngAfterContentInit(): void;
    onWindowResized(): void;
    /**
     * Toggles the expanded state of the pane.
     */
    togglePane(): void;
    onResized($event: any): void;
    getAriaValueNow(): number;
    private refreshUI();
}
