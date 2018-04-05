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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, HostListener, Injector, ViewChild } from '@angular/core';
import { Dom } from '../../../core';
import { CoreBaseComponent } from '../common/base.component';
import { SmeInject } from '../common/decorators/injection.decorators';
import { TooltipService } from './tooltip.service';
/**
 * Tooltip host component provides a host for tooltips.
 */
var TooltipHostComponent = /** @class */ (function (_super) {
    __extends(TooltipHostComponent, _super);
    /**
     * Initializes a new instance of the @see TooltipHostComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function TooltipHostComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.tooltipService.register(_this);
        _this.hostData = { ariaLabelId: _this.idBag.label, ariaDescriptionId: _this.idBag.description };
        return _this;
    }
    Object.defineProperty(TooltipHostComponent.prototype, "isFocused", {
        /**
         * indicates that the tooltip has focus
         */
        get: function () {
            return this.options && this.isShown(this.options.targetid) && this.focused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipHostComponent.prototype, "isHovered", {
        /**
         * indicates that the tooltip is hovered
         */
        get: function () {
            return this.options && this.isShown(this.options.targetid) && this.hovered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipHostComponent.prototype, "ariaRole", {
        /**
         * Gets the role that this tooltip is playing. If the tooltip is text only,
         * then it is treated as a dialog.
         * otherwise it is treated as a tooltip
         */
        get: function () {
            if (this.options && this.options.template) {
                return 'alertdialog';
            }
            return 'tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipHostComponent.prototype, "ariaModal", {
        /**
         * Gets the aria modal attribute value
         */
        get: function () {
            if (this.options && this.options.template) {
                return true;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    TooltipHostComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.tooltipService.unregister(this);
    };
    /**
     * Occurs when the tooltip container is focused or unfocused
     * @param event the focusin or focusout event
     */
    TooltipHostComponent.prototype.onFocusChanged = function (event) {
        this.focused = this.options && (event.type === 'focusin' || (this.focused && event.type !== 'focusout'));
        if (this.options) {
            this.options.onStateChanged();
        }
    };
    /**
     * Occurs when the tooltip container is hovered or un-hovered
     * @param event the mouseenter or mouseleave event
     */
    TooltipHostComponent.prototype.onHoverChanged = function (event) {
        this.hovered = this.options && (event.type === 'mouseenter' || (this.hovered && event.type !== 'mouseleave'));
        if (this.options) {
            this.options.onStateChanged();
        }
    };
    /**
     * Window resize listener
     */
    TooltipHostComponent.prototype.onWindowResized = function (event) {
        if (this.options) {
            this.hide(this.options.targetid);
        }
    };
    /**
     * Escape key listener
     */
    TooltipHostComponent.prototype.onEscape = function () {
        if (this.options) {
            this.hide(this.options.targetid);
        }
    };
    /**
     * Show a tooltip with the given options
     * @param options
     */
    TooltipHostComponent.prototype.show = function (options) {
        var _this = this;
        if (this.options) {
            this.hide(this.options.targetid);
        }
        this.options = options;
        this.reposition();
        setTimeout(function () {
            var next = Dom.getNextFocusableElement(_this.hostElement.nativeElement);
            if (next) {
                next.focus();
            }
        });
    };
    /**
     * Updates the active tooltip with new options
     * @param id the tooltip id
     */
    TooltipHostComponent.prototype.update = function (options) {
        if (this.isShown(options.targetid)) {
            this.options.contentId = options.contentId;
            this.options.context = options.context;
            this.options.template = options.template;
            this.options.title = options.title;
            this.options.element = options.element;
            this.options.placement = options.placement;
        }
        this.reposition();
    };
    /**
     * Hides the tooltip with the given id
     * @param id the tooltip id
     */
    TooltipHostComponent.prototype.isShown = function (id) {
        return this.options && this.options.targetid === id;
    };
    /**
     * Hides the tooltip with the given id
     * @param id the tooltip id
     */
    TooltipHostComponent.prototype.hide = function (id) {
        if (this.isShown(id)) {
            this.hovered = false;
            this.focused = false;
            // if we opened a template, restore focus to the original element when we close the tooltip
            if (this.options.template) {
                this.options.element.nativeElement.focus();
            }
            this.options = null;
        }
    };
    /**
     * Repositions the tooltip
     */
    TooltipHostComponent.prototype.reposition = function () {
        if (this.options) {
            var target = this.options.element.nativeElement;
            var host = this.hostElement.nativeElement;
            var pointer = this.tooltipPointer.nativeElement;
            var targetRect = target.getBoundingClientRect();
            var hostRect = host.getBoundingClientRect();
            var pointerRect = pointer.getBoundingClientRect();
            var left = targetRect.left - hostRect.left;
            var top_1 = (targetRect.top - hostRect.top) + targetRect.height;
            var pointerLeft = ((targetRect.width - pointerRect.width) / 2);
            this.renderer.setStyle(this.tooltipContainer.nativeElement, 'top', top_1 + "px");
            this.renderer.setStyle(this.tooltipContainer.nativeElement, 'left', left + "px");
            this.renderer.setStyle(pointer, 'left', pointerLeft + "px");
            // TODO: Handle placement.
            // TODO: pointer position is slightly off
            // TODO: Handle height/width exceeding page boundaries
        }
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    TooltipHostComponent.prototype.createIdBag = function () {
        return {
            label: '',
            description: ''
        };
    };
    /**
     * Gets the initial host classes to be applied to this element
     */
    TooltipHostComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-tooltip-host',
            'sme-layout-absolute',
            'sme-position-inset-none',
            'sme-focus-zone'
        ]);
    };
    TooltipHostComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-tooltip-host',
                    template: "\n      <div #tooltipContainer class=\"sme-tooltip sme-tooltip-position-bottom sme-layer-tooltip sme-shadow-tooltip\" [class.sme-layout-none]=\"!options\" (focusin)=\"onFocusChanged($event)\" (focusout)=\"onFocusChanged($event)\" (mouseenter)=\"onHoverChanged($event)\"\n          (mouseleave)=\"onHoverChanged($event)\">\n          <div #tooltipPointer class=\"sme-tooltip-pointer\"></div>\n          <div class=\"sme-tooltip-pointer-cover\"></div>\n          <div class=\"sme-tooltip-content sme-focus-trap\" *ngIf=\"!!options\" [attr.role]=\"ariaRole\" [attr.aria-modal]=\"ariaModal\" [id]=\"options.contentId\" [attr.aria-labelledby]=\"idBag.label\" [attr.aria-describedby]=\"idBag.description\">\n              <ng-container *ngIf=\"!!options.template\">\n                  <ng-container smeTemplateOutlet [template]=\"options.template\" [data]=\"options.context\" [hostData]=\"hostData\"></ng-container>\n              </ng-container>\n              <p class=\"sme-font-label\" *ngIf=\"options.title\" [id]=\"idBag.label\">\n                  <span>{{options.title}}</span>\n              </p>\n          </div>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    TooltipHostComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    TooltipHostComponent.propDecorators = {
        'tooltipContainer': [{ type: ViewChild, args: ['tooltipContainer',] },],
        'tooltipPointer': [{ type: ViewChild, args: ['tooltipPointer',] },],
        'onWindowResized': [{ type: HostListener, args: ['window:resize', ['$event'],] }, { type: HostListener, args: ['window:blur', ['$event'],] },],
        'onEscape': [{ type: HostListener, args: ['window:keyup.escape',] },],
    };
    __decorate([
        SmeInject(TooltipService),
        __metadata("design:type", TooltipService)
    ], TooltipHostComponent.prototype, "tooltipService", void 0);
    return TooltipHostComponent;
}(CoreBaseComponent));
export { TooltipHostComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvdG9vbHRpcC90b29sdGlwLWhvc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUF1QixZQUFBLEVBQWMsUUFBQSxFQUFrQyxTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBRWpILE9BQU8sRUFBRSxHQUFBLEVBQUksTUFBTyxlQUFBLENBQWdCO0FBQ3BDLE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLDBCQUFBLENBQTJCO0FBQzdELE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTywyQ0FBQSxDQUE0QztBQUl0RSxPQUFPLEVBQUUsY0FBQSxFQUFlLE1BQU8sbUJBQUEsQ0FBb0I7QUFFbkQ7O0dBRUc7QUFFSDtJQUEwQyx3Q0FBaUI7SUEyRXZEOzs7T0FHRztJQUNILDhCQUFZLFFBQWtCO1FBQTlCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBR2xCO1FBRkcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLENBQUM7UUFDbkMsS0FBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLFdBQVcsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDOztJQUNqRyxDQUFDO0lBL0NELHNCQUFXLDJDQUFTO1FBSHBCOztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMvRSxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLDJDQUFTO1FBSHBCOztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FB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QixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLGdCQUFnQixFQUFHLEVBQUUsRUFBRTtRQUNwRSxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFHLEVBQUUsRUFBRTtRQUMvSSxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUcsRUFBRSxFQUFFO0tBQ3JFLENBQUM7SUFsTUU7UUFEQyxTQUFTLENBQUMsY0FBYyxDQUFDO2tDQUNGLGNBQWM7Z0VBQUM7SUFtTTNDLDJCQUFDO0NBNVFELEFBNFFDLENBNVF5QyxpQkFBaUIsR0E0UTFEO1NBNVFZLG9CQUFvQiIsImZpbGUiOiJ0b29sdGlwLWhvc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==