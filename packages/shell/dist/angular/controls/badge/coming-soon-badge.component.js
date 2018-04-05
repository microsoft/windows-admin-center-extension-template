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
 * Defines a coming soon badge
 */
var ComingSoonBadgeComponent = /** @class */ (function (_super) {
    __extends(ComingSoonBadgeComponent, _super);
    /**
     * Initializes a new instance of the @see ComingSoonBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function ComingSoonBadgeComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.label = _this.strings.MsftSmeShell.Angular.Badges.ComingSoon.label;
        _this.description = _this.strings.MsftSmeShell.Angular.Badges.ComingSoon.tooltip;
        return _this;
    }
    /**
     * Gets the initial host classes to be applied to this element
     */
    ComingSoonBadgeComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge-coming-soon'
        ]);
    };
    ComingSoonBadgeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-badge[type="comingSoon"]',
                    template: "\n      <p tabindex=\"0\" [smeTooltip]=\"resolvedTooltip\" [title]=\"resolvedTitle\" [attr.aria-label]=\"resolvedTitle ? ariaLabel : null\">\n          <span aria-hidden=\"true\">{{label}}</span>\n          <span aria-hidden=\"true\" [ngClass]=\"['sme-icon', icon]\"></span>\n      </p>\n      <ng-template #defaultTooltip let-hostData=\"hostData\">\n          <h3 [id]=\"hostData.ariaLabelId\" class=\"sme-screen-reader\">{{ariaLabel}}</h3>\n          <p [id]=\"hostData.ariaDescriptionId\" class=\"sme-margin-bottom-xs sme-font-label\">{{description}}</p>\n          <a *ngIf=\"!!learnMoreLink\" target=\"about:blank\" [href]=\"learnMoreLink\" class=\"sme-link\">{{strings.MsftSmeShell.Angular.Badges.Common.learnMore}}</a>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    ComingSoonBadgeComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return ComingSoonBadgeComponent;
}(CoreBadgeBaseComponent));
export { ComingSoonBadgeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2UvY29taW5nLXNvb24tYmFkZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFFBQUEsRUFBNkIsTUFBTyxlQUFBLENBQWdCO0FBQ3hFLE9BQU8sRUFBRSxzQkFBQSxFQUF1QixNQUFPLHdCQUFBLENBQXlCO0FBRWhFOztHQUVHO0FBRUg7SUFBOEMsNENBQXNCO0lBQ2hFOzs7T0FHRztJQUNILGtDQUFZLFFBQWtCO1FBQTlCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBR2xCO1FBRkcsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDdkUsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7O0lBQ25GLENBQUM7SUFFRDs7T0FFRztJQUNPLHdEQUFxQixHQUEvQjtRQUNJLE1BQU0sQ0FBQyxpQkFBTSxxQkFBcUIsV0FBRSxDQUFDLE1BQU0sQ0FBQztZQUN4Qyx1QkFBdUI7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNFLG1DQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLDhCQUE4QjtvQkFDeEMsUUFBUSxFQUFFLG12QkFVVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsdUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0YsK0JBQUM7Q0F2Q0QsQUF1Q0MsQ0F2QzZDLHNCQUFzQixHQXVDbkU7U0F2Q1ksd0JBQXdCIiwiZmlsZSI6ImNvbWluZy1zb29uLWJhZGdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=