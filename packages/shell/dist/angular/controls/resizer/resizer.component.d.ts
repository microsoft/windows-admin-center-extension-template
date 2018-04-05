import { EventEmitter, Injector, OnInit } from '@angular/core';
import { Strings } from '../../../generated/strings';
import { BaseComponent } from '../common/base.component';
/**
 * Resizer component
 */
export declare class ResizerComponent extends BaseComponent<Strings> implements OnInit {
    private static keyboardDelta;
    private isResizing;
    private resizerHostElement;
    private resizerHostBodyElement;
    private resizerIndicatorElement;
    private offsetX;
    private offsetY;
    private originalX;
    private originalY;
    private onStartingResizeEventHandler;
    private onResizingEventHandler;
    private onFinishingResizeEventHandler;
    /**
     * It's used to localte the resizing host which defines the area where the resizer can move around.
     */
    resizerHostSelector: string;
    /**
     * It indicates whether to show the half transparent cover ont he resizer host.
     * In some case (like Data Table column resizer), the cover is not needed since data table would handle the UI of resizing by itself.
     */
    showResizerCover: boolean;
    /**
     * It indicates whether to let the screen reader to read this resizer control.
     * In some case (like Data Table column resizer), we don't want the screen reader to read it as part of the column header.
     */
    visibleToScreenReader: boolean;
    /**
     * It defines the orientation of the element which holds the resizer in the resizing layout.
     */
    orientation: string;
    /**
     * It's fired then the resizing is finished.
     */
    resized: EventEmitter<{
        x: number;
        y: number;
    }>;
    /**
     * It's fired then the resizing is happening.
     */
    resizing: EventEmitter<{
        x: number;
        y: number;
    }>;
    /**
     * Indicates that the resizer should be aligned to the top
     */
    readonly alignTop: boolean;
    /**
     * Indicates that the resizer should be aligned to the bottom
     */
    readonly alignBottom: boolean;
    /**
     * Indicates that the resizer should be aligned to the left
     */
    readonly alignLeft: boolean;
    /**
     * Indicates that the resizer should be aligned to the right
     */
    readonly alignRight: boolean;
    /**
     * Indicates that the resizer moves vertically
     */
    readonly isVertical: boolean;
    /**
     * Indicates that the resizer moves horizontally
     */
    readonly isHorizontal: boolean;
    /**
     * Describes the orientation for aria users.
     */
    readonly ariaOrientation: string;
    /**
     * Defines the cursor style the resizer should have
     */
    readonly cursor: string;
    /**
     * Initializes a new instance of the @see ResizerComponent class.
     * @param {Injector} injector The angular injection service. required by @see SmeInjectable decorator in the @see BaseComponent class
     */
    constructor(injector: Injector);
    /**
     * Angular lifecyle hook.
     */
    ngOnInit(): void;
    /**
     * It handles the event when mouse down happens on the resizer.
     */
    onResizeElementMouseDown($event: any): void;
    onResizeElementKeyDown($event: any): void;
    private startResize(offsetX, offsetY);
    private onStartingResizing(event);
    private onResizing(event);
    private onFinishingResizing();
    private isOriented(...orientations);
    protected getInitialHostClasses(): string[];
}
