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
import { Directive, HostBinding, HostListener, Injector, Input } from '@angular/core';
import { Debounce } from '../../controls/common/decorators';
import { CoreBaseComponent } from '../common/base.component';
import { SmeInject } from '../common/decorators/injection.decorators';
import { TooltipPlacement } from './models/tooltip-placement';
import { TooltipService } from './tooltip.service';
/**
 * Directive to create tooltips in the tooltip host.
 */
var TooltipDirective = /** @class */ (function (_super) {
    __extends(TooltipDirective, _super);
    /**
     * Initializes a new instance of the @see PivotComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function TooltipDirective(injector) {
        return _super.call(this, injector) || this;
    }
    Object.defineProperty(TooltipDirective.prototype, "ariaDescribedBy", {
        /**
         * Gets the id of the tooltip that will describe this element
         */
        get: function () {
            if (!this.shown || !MsftSme.isNullOrUndefined(this.smeTooltip)) {
                return null;
            }
            return this.idBag && this.idBag.tooltip ? this.idBag.tooltip : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "placement", {
        /**
         * The actual placement of the tooltip
         */
        get: function () {
            return TooltipPlacement.fromString(this.smeTooltipPlacement);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "tooltipHost", {
        /**
         * The tooltip host
         */
        get: function () {
            return this.tooltipService.TooltipHost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "shown", {
        /**
         * Indicates that this tooltip is shown
         */
        get: function () {
            return this.tooltipHost.isShown(this.componentId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "shouldShow", {
        /**
         * Indicates that this tooltip should be shown
         */
        get: function () {
            // if we are hovered or our tooltip is hovered
            if (this.hovered || (this.shown && this.tooltipHost.isHovered)) {
                return true;
            }
            // if we show on focus and are focused or our tooltip has focus
            if (this.tooltipService.showOnfocus && (this.focused || (this.shown && this.tooltipHost.isFocused))) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnChanges interface
     * On any change we update the tooltip if it is shown
     */
    TooltipDirective.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
        if (this.shown) {
            this.tooltipHost.update(this.getTooltipOptions());
        }
    };
    /**
     * Implementation of angular OnDestroy interface
     */
    TooltipDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.showHideTooltip(false, false);
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    TooltipDirective.prototype.createIdBag = function () {
        return {
            tooltip: ''
        };
    };
    /**
     * Host listeners for tooltip focus events
     */
    TooltipDirective.prototype.onFocusEvent = function (event) {
        // on focus in/out change focused state
        var focused = event.type === 'focusin' || (this.focused && event.type !== 'focusout');
        this.showHideTooltip(this.hovered, focused);
    };
    /**
     * Host listeners for tooltip mouse events
     */
    TooltipDirective.prototype.onMouseEvent = function (event) {
        // on mouse enter/leave change hovered state
        var hovered = event.type === 'mouseenter' || (this.hovered && event.type !== 'mouseleave');
        this.showHideTooltip(hovered, this.focused);
    };
    /**
     * Shows or hides the tooltip if either the hover or focused states are true
     * @param hovered indicates the element is hovered
     * @param focused indicates the element is focused
     */
    TooltipDirective.prototype.showHideTooltip = function (hovered, focused) {
        if (hovered === void 0) { hovered = this.hovered; }
        if (focused === void 0) { focused = this.focused; }
        this.hovered = hovered;
        this.focused = focused;
        if (this.shouldShow && !this.shown) {
            this.show();
        }
        else if (!this.shouldShow && this.shown) {
            this.hide();
        }
    };
    /**
     * Shows the tooltip.
     */
    TooltipDirective.prototype.show = function () {
        if (this.shouldShow && !this.shown) {
            this.tooltipHost.show(this.getTooltipOptions());
        }
    };
    /**
     * Hides the tooltip.
     */
    TooltipDirective.prototype.hide = function () {
        if (!this.shouldShow && this.shown) {
            this.tooltipHost.hide(this.componentId);
        }
    };
    TooltipDirective.prototype.getTooltipOptions = function () {
        var _this = this;
        return {
            targetid: this.componentId,
            contentId: this.idBag.tooltip,
            title: this.title,
            template: this.smeTooltip,
            context: this.smeTooltipContext,
            element: this.hostElement,
            placement: this.placement,
            onStateChanged: function () { return _this.showHideTooltip(); }
        };
    };
    TooltipDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[smeTooltip],[title]'
                },] },
    ];
    /** @nocollapse */
    TooltipDirective.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    TooltipDirective.propDecorators = {
        'title': [{ type: Input },],
        'smeTooltip': [{ type: Input },],
        'smeTooltipContext': [{ type: Input },],
        'smeTooltipPlacement': [{ type: Input },],
        'ariaDescribedBy': [{ type: HostBinding, args: ['attr.aria-describedBy',] },],
        'onFocusEvent': [{ type: HostListener, args: ['focusin', ['$event'],] }, { type: HostListener, args: ['focusout', ['$event'],] },],
        'onMouseEvent': [{ type: HostListener, args: ['mouseenter', ['$event'],] }, { type: HostListener, args: ['mouseleave', ['$event'],] },],
    };
    __decorate([
        SmeInject(TooltipService),
        __metadata("design:type", TooltipService)
    ], TooltipDirective.prototype, "tooltipService", void 0);
    __decorate([
        Debounce(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TooltipDirective.prototype, "show", null);
    __decorate([
        Debounce(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TooltipDirective.prototype, "hide", null);
    return TooltipDirective;
}(CoreBaseComponent));
export { TooltipDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvdG9vbHRpcC90b29sdGlwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxXQUFBLEVBQWEsWUFBQSxFQUFjLFFBQUEsRUFBVSxLQUFBLEVBQXdELE1BQU8sZUFBQSxDQUFnQjtBQUd4SSxPQUFPLEVBQUUsUUFBQSxFQUFTLE1BQU8sa0NBQUEsQ0FBbUM7QUFDNUQsT0FBTyxFQUFFLGlCQUFBLEVBQWtCLE1BQU8sMEJBQUEsQ0FBMkI7QUFDN0QsT0FBTyxFQUFFLFNBQUEsRUFBVSxNQUFPLDJDQUFBLENBQTRDO0FBRXRFLE9BQU8sRUFBRSxnQkFBQSxFQUFpQixNQUFPLDRCQUFBLENBQTZCO0FBQzlELE9BQU8sRUFBRSxjQUFBLEVBQWUsTUFBTyxtQkFBQSxDQUFvQjtBQUVuRDs7R0FFRztBQUVIO0lBQXNDLG9DQUFpQjtJQTBGbkQ7OztPQUdHO0lBQ0gsMEJBQVksUUFBa0I7ZUFDMUIsa0JBQU0sUUFBUSxDQUFDO0lBQ25CLENBQUM7SUFsRUQsc0JBQVcsNkNBQWU7UUFKMUI7O1dBRUc7YUFFSDtZQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4RSxDQUFDOzs7T0FBQTtJQUtELHNCQUFZLHVDQUFTO1FBSHJCOztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxD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Y0FBYyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsZUFBZSxFQUFFLEVBQXRCLENBQXNCO1NBQy9DLENBQUM7SUFDTixDQUFDO0lBQ0UsMkJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsc0JBQXNCO2lCQUNuQyxFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsK0JBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0ssK0JBQWMsR0FBMkM7UUFDaEUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDM0IsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN2QyxxQkFBcUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3pDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLHVCQUF1QixFQUFHLEVBQUUsRUFBRTtRQUM5RSxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUcsRUFBRSxFQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7UUFDbkksY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFHLEVBQUUsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUcsRUFBRSxFQUFFO0tBQ3ZJLENBQUM7SUF0S0U7UUFEQyxTQUFTLENBQUMsY0FBYyxDQUFDO2tDQUNGLGNBQWM7NERBQUM7SUF5SHZDO1FBREMsUUFBUSxFQUFFOzs7O2dEQUtWO0lBTUQ7UUFEQyxRQUFRLEVBQUU7Ozs7Z0RBS1Y7SUFnQ0wsdUJBQUM7Q0F2TkQsQUF1TkMsQ0F2TnFDLGlCQUFpQixHQXVOdEQ7U0F2TlksZ0JBQWdCIiwiZmlsZSI6InRvb2x0aXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==