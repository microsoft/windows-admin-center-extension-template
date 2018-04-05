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
import { Component, Injector } from '@angular/core';
import { CoreBadgeBaseComponent } from './badge-base.component';
/**
 * Defines a 'new' badge
 */
var NewBadgeComponent = /** @class */ (function (_super) {
    __extends(NewBadgeComponent, _super);
    /**
     * Initializes a new instance of the @see NewBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function NewBadgeComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.label = _this.strings.MsftSmeShell.Angular.Badges.New.label;
        _this.description = _this.strings.MsftSmeShell.Angular.Badges.New.tooltip;
        return _this;
    }
    /**
     * Gets the initial host classes to be applied to this element
     */
    NewBadgeComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge-new'
        ]);
    };
    NewBadgeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-badge[type="new"]',
                    template: "\n      <p tabindex=\"0\" [smeTooltip]=\"resolvedTooltip\" [title]=\"resolvedTitle\" [attr.aria-label]=\"resolvedTitle ? ariaLabel : null\">\n          <span aria-hidden=\"true\">{{label}}</span>\n          <span aria-hidden=\"true\" [ngClass]=\"['sme-icon', icon]\"></span>\n      </p>\n      <ng-template #defaultTooltip let-hostData=\"hostData\">\n          <h3 [id]=\"hostData.ariaLabelId\" class=\"sme-screen-reader\">{{ariaLabel}}</h3>\n          <p [id]=\"hostData.ariaDescriptionId\" class=\"sme-margin-bottom-xs sme-font-label\">{{description}}</p>\n          <a *ngIf=\"!!learnMoreLink\" target=\"about:blank\" [href]=\"learnMoreLink\" class=\"sme-link\">{{strings.MsftSmeShell.Angular.Badges.Common.learnMore}}</a>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    NewBadgeComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return NewBadgeComponent;
}(CoreBadgeBaseComponent));
export { NewBadgeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2UvbmV3LWJhZGdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxRQUFBLEVBQTZCLE1BQU8sZUFBQSxDQUFnQjtBQUN4RSxPQUFPLEVBQUUsc0JBQUEsRUFBdUIsTUFBTyx3QkFBQSxDQUF5QjtBQUVoRTs7R0FFRztBQUVIO0lBQXVDLHFDQUFzQjtJQUN6RDs7O09BR0c7SUFDSCwyQkFBWSxRQUFrQjtRQUE5QixZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQUdsQjtRQUZHLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ2hFLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDOztJQUM1RSxDQUFDO0lBRUQ7O09BRUc7SUFDTyxpREFBcUIsR0FBL0I7UUFDSSxNQUFNLENBQUMsaUJBQU0scUJBQXFCLFdBQUUsQ0FBQyxNQUFNLENBQUM7WUFDeEMsZUFBZTtTQUNsQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UsNEJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxRQUFRLEVBQUUsbXZCQVVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDRix3QkFBQztDQXZDRCxBQXVDQyxDQXZDc0Msc0JBQXNCLEdBdUM1RDtTQXZDWSxpQkFBaUIiLCJmaWxlIjoibmV3LWJhZGdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=