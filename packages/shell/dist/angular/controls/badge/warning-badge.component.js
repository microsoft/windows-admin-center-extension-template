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
import { BadgeSeverity, CoreBadgeBaseComponent } from './badge-base.component';
/**
 * Defines the rbac badge.
 */
var WarningBadgeComponent = /** @class */ (function (_super) {
    __extends(WarningBadgeComponent, _super);
    /**
     * Initializes a new instance of the @see WarningBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function WarningBadgeComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.severity = BadgeSeverity.Warning;
        return _this;
    }
    /**
     * Gets the initial host classes to be applied to this element
     */
    WarningBadgeComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge-warning'
        ]);
    };
    WarningBadgeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-badge[type="warning"]',
                    template: "\n      <p tabindex=\"0\" [smeTooltip]=\"resolvedTooltip\" [title]=\"resolvedTitle\" [attr.aria-label]=\"resolvedTitle ? ariaLabel : null\">\n          <span aria-hidden=\"true\">{{label}}</span>\n          <span aria-hidden=\"true\" [ngClass]=\"['sme-icon', icon]\"></span>\n      </p>\n      <ng-template #defaultTooltip let-hostData=\"hostData\">\n          <h3 [id]=\"hostData.ariaLabelId\" class=\"sme-screen-reader\">{{ariaLabel}}</h3>\n          <p [id]=\"hostData.ariaDescriptionId\" class=\"sme-margin-bottom-xs sme-font-label\">{{description}}</p>\n          <a *ngIf=\"!!learnMoreLink\" target=\"about:blank\" [href]=\"learnMoreLink\" class=\"sme-link\">{{strings.MsftSmeShell.Angular.Badges.Common.learnMore}}</a>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    WarningBadgeComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return WarningBadgeComponent;
}(CoreBadgeBaseComponent));
export { WarningBadgeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2Uvd2FybmluZy1iYWRnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsUUFBQSxFQUE2QixNQUFPLGVBQUEsQ0FBZ0I7QUFDeEUsT0FBTyxFQUFFLGFBQUEsRUFBZSxzQkFBQSxFQUF1QixNQUFPLHdCQUFBLENBQXlCO0FBRS9FOztHQUVHO0FBRUg7SUFBMkMseUNBQXNCO0lBQzdEOzs7T0FHRztJQUNILCtCQUFZLFFBQWtCO1FBQTlCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBRWxCO1FBREcsS0FBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDOztJQUMxQyxDQUFDO0lBRUQ7O09BRUc7SUFDTyxxREFBcUIsR0FBL0I7UUFDSSxNQUFNLENBQUMsaUJBQU0scUJBQXFCLFdBQUUsQ0FBQyxNQUFNLENBQUM7WUFDeEMsbUJBQW1CO1NBQ3RCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRSxnQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFFBQVEsRUFBRSxtdkJBVVQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLG9DQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxRQUFRLEdBQUc7S0FDakIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNGLDRCQUFDO0NBdENELEFBc0NDLENBdEMwQyxzQkFBc0IsR0FzQ2hFO1NBdENZLHFCQUFxQiIsImZpbGUiOiJ3YXJuaW5nLWJhZGdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=