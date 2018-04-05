var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component, EventEmitter, HostBinding, HostListener, Injector, Input, Output } from '@angular/core';
import { KeyCode, LogLevel } from '../../../core';
import { BaseComponent } from '../common/base.component';
/**
 * Resizer component
 */
var ResizerComponent = /** @class */ (function (_super) {
    __extends(ResizerComponent, _super);
    /**
     * Initializes a new instance of the @see ResizerComponent class.
     * @param {Injector} injector The angular injection service. required by @see SmeInjectable decorator in the @see BaseComponent class
     */
    function ResizerComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.isResizing = false;
        /**
         * It indicates whether to show the half transparent cover ont he resizer host.
         * In some case (like Data Table column resizer), the cover is not needed since data table would handle the UI of resizing by itself.
         */
        _this.showResizerCover = true;
        /**
         * It indicates whether to let the screen reader to read this resizer control.
         * In some case (like Data Table column resizer), we don't want the screen reader to read it as part of the column header.
         */
        _this.visibleToScreenReader = true;
        /**
         * It defines the orientation of the element which holds the resizer in the resizing layout.
         */
        _this.orientation = 'bottom';
        /**
         * It's fired then the resizing is finished.
         */
        _this.resized = new EventEmitter();
        /**
         * It's fired then the resizing is happening.
         */
        _this.resizing = new EventEmitter();
        return _this;
    }
    Object.defineProperty(ResizerComponent.prototype, "alignTop", {
        /**
         * Indicates that the resizer should be aligned to the top
         */
        get: function () {
            return this.isOriented('bottom', 'left', 'right');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "alignBottom", {
        /**
         * Indicates that the resizer should be aligned to the bottom
         */
        get: function () {
            return this.isOriented('top', 'left', 'right');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "alignLeft", {
        /**
         * Indicates that the resizer should be aligned to the left
         */
        get: function () {
            return this.isOriented('top', 'bottom', 'right');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "alignRight", {
        /**
         * Indicates that the resizer should be aligned to the right
         */
        get: function () {
            return this.isOriented('top', 'bottom', 'left');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "isVertical", {
        /**
         * Indicates that the resizer moves vertically
         */
        get: function () {
            return this.isOriented('top', 'bottom');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "isHorizontal", {
        /**
         * Indicates that the resizer moves horizontally
         */
        get: function () {
            return this.isOriented('left', 'right');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "ariaOrientation", {
        /**
         * Describes the orientation for aria users.
         */
        get: function () {
            return this.isVertical ? 'vertical' : 'horizontal';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizerComponent.prototype, "cursor", {
        /**
         * Defines the cursor style the resizer should have
         */
        get: function () {
            switch (this.orientation) {
                case 'top':
                    return 'n-resize';
                case 'bottom':
                    return 's-resize';
                case 'left':
                    return 'e-resize';
                case 'right':
                    return 'w-resize';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Angular lifecyle hook.
     */
    ResizerComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        // This is a special implementation for Microsoft Edge.
        // In Microsoft Edge, if the resizer div is transparent and it's overlay on the scrollbar,
        // the mouse events will be messed up.
        // So we need to apply a very transparent but not 100% transparent color to it.
        // It won't impact the look and feel, when the browser renders this special color, 
        // basically no color will be actually rendered.
        this.hostElement.nativeElement.style.background = 'rgba(255,255,255,0.003)';
        if (this.visibleToScreenReader) {
            this.setAttribute('role', 'separator');
            this.setAttribute('aria-label', this.strings.MsftSmeShell.Angular.Resizer.Splitter);
        }
        if (!this.resizerHostSelector) {
            this.log('resizerHostSelector is not set.', LogLevel.Warning);
        }
        else {
            var currentParentElement = this.hostElement.nativeElement.parentElement;
            while (!this.resizerHostElement && currentParentElement) {
                this.resizerHostElement = currentParentElement.querySelector(this.resizerHostSelector);
                currentParentElement = currentParentElement.parentElement;
            }
            this.resizerHostBodyElement = document.createElement('DIV');
            this.resizerHostBodyElement.classList.add('resizer-host-body');
            this.resizerHostBodyElement.classList.add('sme-layout-absolute');
            this.resizerHostBodyElement.classList.add('sme-position-inset-none');
            this.resizerHostBodyElement.classList.add('sme-layer-above');
            this.resizerHostBodyElement.classList.add('sme-layout-none');
            this.resizerIndicatorElement = document.createElement('DIV');
            this.resizerIndicatorElement.classList.add('resizer-indicator');
            this.resizerIndicatorElement.classList.add('sme-layout-none');
            this.resizerIndicatorElement.classList.add('sme-layout-absolute');
            this.resizerIndicatorElement.classList.add('sme-layer-over');
            if (this.showResizerCover) {
                this.resizerHostBodyElement.classList.add('sme-background-color-base');
                this.resizerHostBodyElement.style.opacity = '0.5';
                this.resizerIndicatorElement.classList.add('sme-background-color-base-80');
            }
            switch (this.orientation) {
                case 'top':
                    this.resizerHostBodyElement.style.cursor = 'n-resize';
                    this.resizerIndicatorElement.classList.add('sme-position-stretch-h');
                    this.resizerIndicatorElement.classList.add('sme-height-xxs');
                    break;
                case 'bottom':
                    this.resizerHostBodyElement.style.cursor = 's-resize';
                    this.resizerIndicatorElement.classList.add('sme-position-stretch-h');
                    this.resizerIndicatorElement.classList.add('sme-height-xxs');
                    break;
                case 'left':
                    this.resizerHostBodyElement.style.cursor = 'e-resize';
                    this.resizerIndicatorElement.classList.add('sme-width-xxs');
                    this.resizerIndicatorElement.classList.add('sme-position-stretch-v');
                    break;
                case 'right':
                    this.resizerHostBodyElement.style.cursor = 'w-resize';
                    this.resizerIndicatorElement.classList.add('sme-width-xxs');
                    this.resizerIndicatorElement.classList.add('sme-position-stretch-v');
                    break;
            }
            var foundExistingResizerHostBody = false;
            for (var i = 0; i < this.resizerHostElement.children.length; i++) {
                if (this.resizerHostElement.children[i].classList.contains('resizer-host-body')) {
                    foundExistingResizerHostBody = true;
                    this.resizerHostBodyElement = this.resizerHostElement.children[i];
                    this.resizerIndicatorElement = this.resizerHostBodyElement.querySelector('.resizer-indicator');
                    break;
                }
            }
            if (!foundExistingResizerHostBody) {
                this.resizerHostElement.appendChild(this.resizerHostBodyElement);
                this.resizerHostBodyElement.appendChild(this.resizerIndicatorElement);
            }
            this.onStartingResizeEventHandler = this.onStartingResizing.bind(this);
            this.onResizingEventHandler = this.onResizing.bind(this);
            this.onFinishingResizeEventHandler = this.onFinishingResizing.bind(this);
        }
    };
    /**
     * It handles the event when mouse down happens on the resizer.
     */
    ResizerComponent.prototype.onResizeElementMouseDown = function ($event) {
        this.isResizing = true;
        document.body.addEventListener('mousedown', this.onStartingResizeEventHandler);
        document.body.addEventListener('mousemove', this.onResizingEventHandler);
        document.body.addEventListener('mouseup', this.onFinishingResizeEventHandler);
    };
    ResizerComponent.prototype.onResizeElementKeyDown = function ($event) {
        if (this.isHorizontal) {
            switch ($event.keyCode) {
                case KeyCode.LeftArrow:
                    this.resized.emit({
                        x: -ResizerComponent.keyboardDelta,
                        y: 0
                    });
                    break;
                case KeyCode.RightArrow:
                    this.resized.emit({
                        x: ResizerComponent.keyboardDelta,
                        y: 0
                    });
                    break;
            }
        }
        else if (this.isVertical) {
            switch ($event.keyCode) {
                case KeyCode.UpArrow:
                    this.resized.emit({
                        x: 0,
                        y: -ResizerComponent.keyboardDelta
                    });
                    break;
                case KeyCode.DownArrow:
                    this.resized.emit({
                        x: 0,
                        y: ResizerComponent.keyboardDelta
                    });
                    break;
            }
        }
    };
    ResizerComponent.prototype.startResize = function (offsetX, offsetY) {
        this.isResizing = true;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        document.body.style.userSelect = 'none';
        this.resizerHostBodyElement.classList.remove('sme-layout-none');
        this.resizerIndicatorElement.classList.remove('sme-layout-none');
        var resizerHostRect = this.resizerHostBodyElement.getBoundingClientRect();
        var resizerElementRect = this.hostElement.nativeElement.getBoundingClientRect();
        this.originalX = resizerElementRect.left - resizerHostRect.left;
        this.originalY = resizerElementRect.top - resizerHostRect.top;
    };
    ResizerComponent.prototype.onStartingResizing = function (event) {
        if (this.isResizing) {
            this.startResize(event.clientX, event.clientY);
            this.onResizing(event);
            event.preventDefault();
        }
    };
    ResizerComponent.prototype.onResizing = function (event) {
        if (this.isResizing) {
            var resizerHostRect = this.resizerHostBodyElement.getBoundingClientRect();
            var resizerElementRect = this.hostElement.nativeElement.getBoundingClientRect();
            var indicatorX = void 0;
            var indicatorY = void 0;
            var newX = void 0;
            var newY = void 0;
            switch (this.orientation) {
                case 'top':
                    newY = this.hostElement.nativeElement.offsetTop + event.clientY - this.offsetY;
                    this.offsetY = event.clientY;
                    this.hostElement.nativeElement.style.top = newY + 'px';
                    indicatorY = this.hostElement.nativeElement.parentElement.getBoundingClientRect().top
                        - resizerHostRect.top + newY;
                    this.resizerIndicatorElement.style.top = indicatorY + 'px';
                    break;
                case 'bottom':
                    newY = this.hostElement.nativeElement.offsetTop + event.clientY - this.offsetY;
                    this.offsetY = event.clientY;
                    this.hostElement.nativeElement.style.top = newY + 'px';
                    indicatorY = this.originalY + newY;
                    this.resizerIndicatorElement.style.top = indicatorY + 'px';
                    break;
                case 'left':
                    newX = this.hostElement.nativeElement.offsetLeft + event.clientX - this.offsetX;
                    this.offsetX = event.clientX;
                    this.hostElement.nativeElement.style.left = newX + 'px';
                    indicatorX = this.hostElement.nativeElement.parentElement.getBoundingClientRect().left
                        - resizerHostRect.left + newX;
                    this.resizerIndicatorElement.style.left = indicatorX + 'px';
                    break;
                case 'right':
                    newX = this.hostElement.nativeElement.offsetLeft + event.clientX - this.offsetX;
                    this.offsetX = event.clientX;
                    this.hostElement.nativeElement.style.left = newX + 'px';
                    indicatorX = this.originalX + newX;
                    this.resizerIndicatorElement.style.left = indicatorX + 'px';
                    break;
            }
            this.resizing.emit({ x: indicatorX, y: indicatorY });
        }
    };
    ResizerComponent.prototype.onFinishingResizing = function () {
        if (this.isResizing) {
            document.body.removeEventListener('mousedown', this.onStartingResizeEventHandler);
            document.body.removeEventListener('mousemove', this.onResizingEventHandler);
            document.body.removeEventListener('mouseup', this.onFinishingResizeEventHandler);
            this.isResizing = false;
            var deltaX = void 0;
            var deltaY = void 0;
            var resizerHostRect = this.resizerHostBodyElement.getBoundingClientRect();
            var resizerElementRect = this.hostElement.nativeElement.getBoundingClientRect();
            var newX = resizerElementRect.left - resizerHostRect.left;
            var newY = resizerElementRect.top - resizerHostRect.top;
            switch (this.orientation) {
                case 'left':
                    deltaX = newX - this.originalX;
                    deltaY = 0;
                    break;
                case 'right':
                    deltaX = newX - this.originalX;
                    deltaY = 0;
                    break;
                case 'top':
                    deltaX = 0;
                    deltaY = newY - this.originalY;
                    break;
                case 'bottom':
                    deltaX = 0;
                    deltaY = newY - this.originalY;
                    break;
            }
            this.resized.emit({
                x: deltaX,
                y: deltaY
            });
            this.resizerHostBodyElement.classList.add('sme-layout-none');
            document.body.style.userSelect = 'auto';
            this.resizerHostBodyElement.classList.add('sme-layout-none');
            this.resizerIndicatorElement.classList.add('sme-layout-none');
            this.hostElement.nativeElement.style.left = '';
            this.hostElement.nativeElement.style.top = '';
        }
    };
    ResizerComponent.prototype.isOriented = function () {
        var _this = this;
        var orientations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            orientations[_i] = arguments[_i];
        }
        return orientations.some(function (o) { return o === _this.orientation; });
    };
    ResizerComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this)
            .concat([
            'sme-layout-absolute',
            'sme-layer-over'
        ]);
    };
    ResizerComponent.keyboardDelta = 20;
    ResizerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-resizer',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    ResizerComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    ResizerComponent.propDecorators = {
        'resizerHostSelector': [{ type: Input },],
        'showResizerCover': [{ type: Input },],
        'visibleToScreenReader': [{ type: Input },],
        'orientation': [{ type: Input },],
        'resized': [{ type: Output },],
        'resizing': [{ type: Output },],
        'alignTop': [{ type: HostBinding, args: ['class.sme-position-top-none',] },],
        'alignBottom': [{ type: HostBinding, args: ['class.sme-position-bottom-none',] },],
        'alignLeft': [{ type: HostBinding, args: ['class.sme-position-left-none',] },],
        'alignRight': [{ type: HostBinding, args: ['class.sme-position-right-none',] },],
        'isVertical': [{ type: HostBinding, args: ['class.sme-height-xxs',] },],
        'isHorizontal': [{ type: HostBinding, args: ['class.sme-width-xxs',] },],
        'ariaOrientation': [{ type: HostBinding, args: ['attr.aria-orientation',] },],
        'cursor': [{ type: HostBinding, args: ['style.cursor',] },],
        'onResizeElementMouseDown': [{ type: HostListener, args: ['mousedown', ['$event'],] },],
        'onResizeElementKeyDown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    };
    return ResizerComponent;
}(BaseComponent));
export { ResizerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvcmVzaXplci9yZXNpemVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxZQUFBLEVBQWMsV0FBQSxFQUFhLFlBQUEsRUFBYyxRQUFBLEVBQVUsS0FBQSxFQUEwQixNQUFBLEVBQU8sTUFBTyxlQUFBLENBQWdCO0FBQy9ILE9BQU8sRUFBeUMsT0FBQSxFQUFrQixRQUFBLEVBQVMsTUFBTyxlQUFBLENBQWdCO0FBR2xHLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTywwQkFBQSxDQUEyQjtBQUd6RDs7R0FFRztBQUVIO0lBQXNDLG9DQUFzQjtJQStIeEQ7OztPQUdHO0lBQ0gsMEJBQVksUUFBa0I7UUFBOUIsWUFDSSxrQkFBTSxRQUFRLENBQUMsU0FDbEI7UUFsSU8sZ0JBQVUsR0FBRyxLQUFLLENBQUM7UUFtQjNCOzs7V0FHRztRQUVJLHNCQUFnQixHQUFHLElBQUksQ0FBQztRQUUvQjs7O1dBR0c7UUFFSSwyQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFFcEM7O1dBRUc7UUFFSSxpQkFBVyxHQUFHLFFBQVEsQ0FBQztRQUU5Qjs7V0FFRztRQUVJLGFBQU8sR0FBRyxJQUFJLFlBQVksRUFBNEIsQ0FBQztRQUU5RDs7V0FFRztRQUVJLGNBQVEsR0FBRyxJQUFJLFlBQVksRUFBNEIsQ0FBQzs7SUFpRi9ELENBQUM7SUEzRUQsc0JBQVcsc0NBQVE7UUFKbkI7O1dBRUc7YUFFSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEQsQ0FBQzs7O09BQUE7SUFNRCxzQkFBVyx5Q0FBVztRQUp0Qjs7V0FFRzthQUVIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxDQUFDOzs7T0FBQTtJ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QXFCLEVBQUcsRUFBRSxFQUFFO1FBQ3pFLGlCQUFpQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLHVCQUF1QixFQUFHLEVBQUUsRUFBRTtRQUM5RSxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFHLEVBQUUsRUFBRTtRQUM1RCwwQkFBMEIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7UUFDeEYsd0JBQXdCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUcsRUFBRSxFQUFFO0tBQ25GLENBQUM7SUFDRix1QkFBQztDQTlhRCxBQThhQyxDQTlhcUMsYUFBYSxHQThhbEQ7U0E5YVksZ0JBQWdCIiwiZmlsZSI6InJlc2l6ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==