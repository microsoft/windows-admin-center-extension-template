import { Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Logging, LogLevel } from '../../../core';
/**
 * The component definition of the split view content.
 */
var SplitViewContentComponent = /** @class */ (function () {
    function SplitViewContentComponent() {
    }
    SplitViewContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-split-view-content',
                    template: '<ng-content></ng-content>'
                },] },
    ];
    /** @nocollapse */
    SplitViewContentComponent.ctorParameters = function () { return []; };
    return SplitViewContentComponent;
}());
export { SplitViewContentComponent };
/**
 * The component definition of the split view pane.
 */
var SplitViewPaneComponent = /** @class */ (function () {
    function SplitViewPaneComponent() {
    }
    SplitViewPaneComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-split-view-pane',
                    template: '<ng-content></ng-content>'
                },] },
    ];
    /** @nocollapse */
    SplitViewPaneComponent.ctorParameters = function () { return []; };
    return SplitViewPaneComponent;
}());
export { SplitViewPaneComponent };
/**
 * The component definition of the split view.
 */
var SplitViewComponent = /** @class */ (function () {
    function SplitViewComponent(elementReference) {
        this.elementReference = elementReference;
        this.internalIsExpanded = false;
        this.isComponentInitialized = false;
        /**
         * It implements the ILayout interface. It's triggered when the layout is changed.
         * It's used to tell the child components to coordate with the layout change.
         */
        this.layoutChanged = new EventEmitter();
        /**
         * It indicates whether to show the scrollbar when it's needed.
         */
        this.showScrollbar = false;
        /**
         * It indicates whether to show the border for the splitter.
         */
        this.showSplitterBorder = true;
        /**
         * It indicates the min value of the pane size.
         */
        this.resizeLowerMargin = 100;
        /**
         * It indicates the min value of the content size.
         */
        this.resizeUpperMargin = 100;
        /**
         * The orientation of the pane.
         */
        this.orientation = 'bottom';
        /**
         * The event fired when the pane's expanded state is being toggled.
         */
        this.paneToggling = new EventEmitter();
        /**
         * The event fired when the pane's expanded state has been toggled.
         */
        this.paneToggled = new EventEmitter();
    }
    Object.defineProperty(SplitViewComponent.prototype, "hostClass", {
        /**
         * Gets the CSS classes of the component.
         *
         * TODO: setting the class this way prevent any custom class from being applied.
         * Change to setting class in the constructor using Renderer2 and ElementRef
         */
        get: function () {
            return 'sme-layout-absolute sme-position-inset-none sme-arrange-stack-v sme-arrange-overflow-hide';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitViewComponent.prototype, "flexDirection", {
        /**
         * Gets the flex direction of the component.
         */
        get: function () {
            switch (this.orientation) {
                case 'left':
                    return 'row';
                case 'top':
                    return 'column';
                case 'right':
                    return 'row';
                case 'bottom':
                default:
                    return 'column';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitViewComponent.prototype, "isExpanded", {
        /**
         * Whether the pane is expanded.
         */
        get: function () {
            return this.internalIsExpanded;
        },
        set: function (value) {
            var _this = this;
            this.internalIsExpanded = value;
            this.paneToggling.emit({
                isExpanded: this.internalIsExpanded
            });
            setTimeout(function () {
                _this.paneToggled.emit({
                    isExpanded: _this.internalIsExpanded
                });
                _this.layoutChanged.emit();
            });
            this.refreshUI();
        },
        enumerable: true,
        configurable: true
    });
    SplitViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isComponentInitialized = true;
        setTimeout(function () {
            _this.refreshUI();
        });
    };
    /**
     * The method called after content is initialized.
     */
    SplitViewComponent.prototype.ngAfterContentInit = function () {
        if (this.content == null) {
            Logging.log({
                level: LogLevel.Error,
                message: "The value of 'content' is either null or undefined.",
                params: {
                    content: this.content
                },
                source: 'SplitViewComponent.ngAfterContentInit'
            });
        }
        if (this.pane == null) {
            Logging.log({
                level: LogLevel.Error,
                message: "The value of 'pane' is either null or undefined.",
                params: {
                    pane: this.pane
                },
                source: 'SplitViewComponent.ngAfterContentInit'
            });
        }
    };
    SplitViewComponent.prototype.onWindowResized = function () {
        if (this.orientation === 'bottom') {
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetHeight - this.resizeUpperMargin);
            this.paneDistance = Math.max(this.paneDistance, this.resizeLowerMargin);
            this.paneContainerElement.nativeElement.style.height = this.isExpanded ? (this.paneDistance + 'px') : '';
        }
        else if (this.orientation === 'top') {
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetHeight - this.resizeUpperMargin);
            this.paneDistance = Math.max(this.paneDistance, this.resizeLowerMargin);
            this.paneContainerElement.nativeElement.style.height = this.isExpanded ? (this.paneDistance + 'px') : '';
        }
        else if (this.orientation === 'left') {
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetWidth - this.resizeUpperMargin);
            this.paneDistance = Math.max(this.paneDistance, this.resizeLowerMargin);
            this.paneContainerElement.nativeElement.style.width = this.isExpanded ? (this.paneDistance + 'px') : '';
        }
        else if (this.orientation === 'right') {
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetWidth - this.resizeUpperMargin);
            this.paneDistance = Math.max(this.paneDistance, this.resizeLowerMargin);
            this.paneContainerElement.nativeElement.style.width = this.isExpanded ? (this.paneDistance + 'px') : '';
        }
        this.layoutChanged.emit();
    };
    /**
     * Toggles the expanded state of the pane.
     */
    SplitViewComponent.prototype.togglePane = function () {
        this.isExpanded = !this.isExpanded;
    };
    SplitViewComponent.prototype.onResized = function ($event) {
        if (this.orientation === 'bottom') {
            this.paneDistance = Math.max(this.paneContainerElement.nativeElement.offsetHeight - $event.y, this.resizeLowerMargin);
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetHeight - this.resizeUpperMargin);
            this.paneContainerElement.nativeElement.style.height = this.paneDistance + 'px';
        }
        else if (this.orientation === 'top') {
            this.paneDistance = Math.max(this.paneContainerElement.nativeElement.offsetHeight + $event.y, this.resizeLowerMargin);
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetHeight - this.resizeUpperMargin);
            this.paneContainerElement.nativeElement.style.height = this.paneDistance + 'px';
        }
        else if (this.orientation === 'left') {
            this.paneDistance = Math.max(this.paneContainerElement.nativeElement.offsetWidth + $event.x, this.resizeLowerMargin);
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetWidth - this.resizeUpperMargin);
            this.paneContainerElement.nativeElement.style.width = this.paneDistance + 'px';
        }
        else if (this.orientation === 'right') {
            this.paneDistance = Math.max(this.paneContainerElement.nativeElement.offsetWidth - $event.x, this.resizeLowerMargin);
            this.paneDistance = Math.min(this.paneDistance, this.elementReference.nativeElement.offsetWidth - this.resizeUpperMargin);
            this.paneContainerElement.nativeElement.style.width = this.paneDistance + 'px';
        }
        this.layoutChanged.emit();
    };
    SplitViewComponent.prototype.getAriaValueNow = function () {
        return this.isExpanded ? Math.round(this.paneDistance) : null;
    };
    SplitViewComponent.prototype.refreshUI = function () {
        var _this = this;
        if (this.isComponentInitialized && this.paneContainerElement && this.paneContainerElement.nativeElement) {
            if (this.internalIsExpanded) {
                if (this.paneDistance) {
                    if (this.orientation === 'top' || this.orientation === 'bottom') {
                        this.paneContainerElement.nativeElement.style.height = this.paneDistance + 'px';
                    }
                    else if (this.orientation === 'left' || this.orientation === 'right') {
                        this.paneContainerElement.nativeElement.style.width = this.paneDistance + 'px';
                    }
                }
            }
            else {
                if (this.orientation === 'top' || this.orientation === 'bottom') {
                    this.paneContainerElement.nativeElement.style.height = '';
                }
                else if (this.orientation === 'left' || this.orientation === 'right') {
                    this.paneContainerElement.nativeElement.style.width = '';
                }
            }
            setTimeout(function () {
                if (_this.paneContainerElement && _this.paneContainerElement.nativeElement) {
                    if (_this.orientation === 'top' || _this.orientation === 'bottom') {
                        if (_this.internalIsExpanded) {
                            _this.paneDistance = _this.paneContainerElement.nativeElement.offsetHeight;
                        }
                    }
                    else if (_this.orientation === 'left' || _this.orientation === 'right') {
                        if (_this.internalIsExpanded) {
                            _this.paneDistance = _this.paneContainerElement.nativeElement.offsetWidth;
                        }
                    }
                }
            });
        }
    };
    SplitViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-split-view',
                    template: "\n      <ng-container *ngIf=\"orientation==='bottom' || orientation==='right'\">\n          <section class=\"sme-layout-relative sme-position-flex-auto sme-background-color-base\" [class.sme-arrange-overflow-auto]=\"showScrollbar\">\n              <ng-container *ngTemplateOutlet=\"content\"></ng-container>\n          </section>\n          <section #paneContainer class=\"sme-layout-relative sme-position-flex-none sme-border-color-base-80 sme-background-color-base\"\n              [class.sme-border-left-sm]=\"showSplitterBorder && orientation === 'right'\" [class.sme-border-top-sm]=\"showSplitterBorder && orientation === 'bottom'\"\n              [class.sme-arrange-overflow-auto]=\"showScrollbar\">\n              <sme-resizer *ngIf=\"isExpanded\" [tabindex]=\"[isExpanded?0:null]\" [class.sme-focus-zone]=\"isExpanded\" resizerHostSelector=\"sme-split-view\" (resized)=\"onResized($event)\"\n                  [orientation]=\"orientation\">\n              </sme-resizer>\n              <ng-container *ngTemplateOutlet=\"pane\"></ng-container>\n          </section>\n      </ng-container>\n      <ng-container *ngIf=\"orientation==='top' || orientation==='left'\">\n          <section #paneContainer class=\"sme-layout-relative sme-position-flex-none sme-border-color-base-80 sme-background-color-base\"\n              [class.sme-border-right-sm]=\"showSplitterBorder && orientation === 'left'\" [class.sme-border-bottom-sm]=\"showSplitterBorder && orientation === 'top'\"\n              [class.sme-arrange-overflow-auto]=\"showScrollbar\">\n              <ng-container *ngTemplateOutlet=\"pane\"></ng-container>\n              <sme-resizer *ngIf=\"isExpanded\" [tabindex]=\"[isExpanded?0:null]\" [class.sme-focus-zone]=\"isExpanded\" resizerHostSelector=\"sme-split-view\" (resized)=\"onResized($event)\"\n                  [orientation]=\"orientation\" [attr.aria-valuenow]=\"getAriaValueNow()\">\n              </sme-resizer>\n          </section>\n          <section class=\"sme-layout-relative sme-position-flex-auto sme-background-color-base\" [class.sme-arrange-overflow-auto]=\"showScrollbar\">\n              <ng-container *ngTemplateOutlet=\"content\"></ng-container>\n          </section>\n      </ng-container>\n      <ng-template #content>\n          <ng-content select=\"sme-split-view-content\"></ng-content>\n      </ng-template>\n      <ng-template #pane>\n          <ng-content select=\"sme-split-view-pane\"></ng-content>\n      </ng-template>\n      <!-- The reason to use ng-tempalte to wrap the ng-content element instead of directly to use ng-content in both two ng-containers above is:\n      If we use ng-content elements directly in both 2 ng-containers, there will be 2 ng-content elements with the same selector. But Angular will only \n      resolve the first ng-content in multiple ng-content elements with same selector even the first one is in a ngIf false block.\n      So when the orientation is \"top\" or \"left\", no ng-content element will be resolved then nothing would render.\n      In order to solve this problem, we have to use ng-template to wrap the ng-content to make sure one selector maps to one ng-content.\n      Then we use ng-container and ngTemplateOutlet to call the ng-template. \n      Thx for reading till here...... -->\n    ",
                    providers: [
                        { provide: 'layout', useExisting: forwardRef(function () { return SplitViewComponent; }) }
                    ]
                },] },
    ];
    /** @nocollapse */
    SplitViewComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    SplitViewComponent.propDecorators = {
        'content': [{ type: ContentChild, args: [SplitViewContentComponent,] },],
        'pane': [{ type: ContentChild, args: [SplitViewPaneComponent,] },],
        'paneContainerElement': [{ type: ViewChild, args: ['paneContainer',] },],
        'showScrollbar': [{ type: Input },],
        'showSplitterBorder': [{ type: Input },],
        'paneDistance': [{ type: Input },],
        'resizeLowerMargin': [{ type: Input },],
        'resizeUpperMargin': [{ type: Input },],
        'orientation': [{ type: Input },],
        'paneToggling': [{ type: Output },],
        'paneToggled': [{ type: Output },],
        'hostClass': [{ type: HostBinding, args: ['class',] },],
        'flexDirection': [{ type: HostBinding, args: ['style.flex-direction',] },],
        'isExpanded': [{ type: Input },],
        'onWindowResized': [{ type: HostListener, args: ['window:resize',] },],
    };
    return SplitViewComponent;
}());
export { SplitViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvc3BsaXQtdmlldy9zcGxpdC12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ2UsU0FBQSxFQUFXLFlBQUEsRUFBYyxVQUFBLEVBQVksWUFBQSxFQUN2RCxVQUFVLEVBQUUsV0FBQSxFQUFhLFlBQUEsRUFBYyxLQUFBLEVBQWUsTUFBQSxFQUFRLFNBQUEsRUFDakUsTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBRSxPQUFBLEVBQVMsUUFBQSxFQUFTLE1BQU8sZUFBQSxDQUFnQjtBQVFsRDs7R0FFRztBQUVIO0lBQUE7SUFTQSxDQUFDO0lBVCtDLG9DQUFVLEdBQTBCO1FBQ3BGLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLDJCQUEyQjtpQkFDeEMsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHdDQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0YsZ0NBQUM7Q0FURCxBQVNDLElBQUE7U0FUWSx5QkFBeUI7QUFXdEM7O0dBRUc7QUFFSDtJQUFBO0lBU0EsQ0FBQztJQVQ0QyxpQ0FBVSxHQUEwQjtRQUNqRixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3hDLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxxQ0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNGLDZCQUFDO0NBVEQsQUFTQyxJQUFBO1NBVFksc0JBQXNCO0FBV25DOztHQUVHO0FBRUg7SUF5RUksNEJBQW9CLGdCQUE0QjtRQUE1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVk7UUF4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LFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFlLEVBQUcsRUFBRSxFQUFFO1FBQ3pFLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25DLG9CQUFvQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDeEMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDbEMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN2QyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3ZDLGFBQWEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2pDLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLGFBQWEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ2xDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUcsRUFBRSxFQUFFO1FBQ3hELGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRyxFQUFFLEVBQUU7UUFDM0UsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBZSxFQUFHLEVBQUUsRUFBRTtLQUN0RSxDQUFDO0lBQ0YseUJBQUM7Q0FuVkQsQUFtVkMsSUFBQTtTQW5WWSxrQkFBa0IiLCJmaWxlIjoic3BsaXQtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9