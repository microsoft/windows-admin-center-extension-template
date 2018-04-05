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
 * Defines the critical badge.
 */
var CriticalBadgeComponent = /** @class */ (function (_super) {
    __extends(CriticalBadgeComponent, _super);
    /**
     * Initializes a new instance of the @see CriticalBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function CriticalBadgeComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.severity = BadgeSeverity.Critical;
        return _this;
    }
    /**
     * Gets the initial host classes to be applied to this element
     */
    CriticalBadgeComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge-critical'
        ]);
    };
    CriticalBadgeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-badge[type="critical"]',
                    template: "\n      <p tabindex=\"0\" [smeTooltip]=\"resolvedTooltip\" [title]=\"resolvedTitle\" [attr.aria-label]=\"resolvedTitle ? ariaLabel : null\">\n          <span aria-hidden=\"true\">{{label}}</span>\n          <span aria-hidden=\"true\" [ngClass]=\"['sme-icon', icon]\"></span>\n      </p>\n      <ng-template #defaultTooltip let-hostData=\"hostData\">\n          <h3 [id]=\"hostData.ariaLabelId\" class=\"sme-screen-reader\">{{ariaLabel}}</h3>\n          <p [id]=\"hostData.ariaDescriptionId\" class=\"sme-margin-bottom-xs sme-font-label\">{{description}}</p>\n          <a *ngIf=\"!!learnMoreLink\" target=\"about:blank\" [href]=\"learnMoreLink\" class=\"sme-link\">{{strings.MsftSmeShell.Angular.Badges.Common.learnMore}}</a>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    CriticalBadgeComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return CriticalBadgeComponent;
}(CoreBadgeBaseComponent));
export { CriticalBadgeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2UvY3JpdGljYWwtYmFkZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFFBQUEsRUFBNkIsTUFBTyxlQUFBLENBQWdCO0FBQ3hFLE9BQU8sRUFBRSxhQUFBLEVBQWUsc0JBQUEsRUFBdUIsTUFBTyx3QkFBQSxDQUF5QjtBQUUvRTs7R0FFRztBQUVIO0lBQTRDLDBDQUFzQjtJQUM5RDs7O09BR0c7SUFDSCxnQ0FBWSxRQUFrQjtRQUE5QixZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQUVsQjtRQURHLEtBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQzs7SUFDM0MsQ0FBQztJQUVEOztPQUVHO0lBQ08sc0RBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLG9CQUFvQjtTQUN2QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UsaUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUUsbXZCQVVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxxQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDRiw2QkFBQztDQXRDRCxBQXNDQyxDQXRDMkMsc0JBQXNCLEdBc0NqRTtTQXRDWSxzQkFBc0IiLCJmaWxlIjoiY3JpdGljYWwtYmFkZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==