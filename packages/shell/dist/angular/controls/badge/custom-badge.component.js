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
 * Defines a custom badge
 */
var CustomBadgeComponent = /** @class */ (function (_super) {
    __extends(CustomBadgeComponent, _super);
    /**
     * Initializes a new instance of the @see CustomBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function CustomBadgeComponent(injector) {
        return _super.call(this, injector) || this;
    }
    /**
     * Gets the initial host classes to be applied to this element
     */
    CustomBadgeComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge-custom'
        ]);
    };
    CustomBadgeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-badge[type="custom"]',
                    template: "\n      <p tabindex=\"0\" [smeTooltip]=\"resolvedTooltip\" [title]=\"resolvedTitle\" [attr.aria-label]=\"resolvedTitle ? ariaLabel : null\">\n          <span aria-hidden=\"true\">{{label}}</span>\n          <span aria-hidden=\"true\" [ngClass]=\"['sme-icon', icon]\"></span>\n      </p>\n      <ng-template #defaultTooltip let-hostData=\"hostData\">\n          <h3 [id]=\"hostData.ariaLabelId\" class=\"sme-screen-reader\">{{ariaLabel}}</h3>\n          <p [id]=\"hostData.ariaDescriptionId\" class=\"sme-margin-bottom-xs sme-font-label\">{{description}}</p>\n          <a *ngIf=\"!!learnMoreLink\" target=\"about:blank\" [href]=\"learnMoreLink\" class=\"sme-link\">{{strings.MsftSmeShell.Angular.Badges.Common.learnMore}}</a>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    CustomBadgeComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return CustomBadgeComponent;
}(CoreBadgeBaseComponent));
export { CustomBadgeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2UvY3VzdG9tLWJhZGdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxRQUFBLEVBQTZCLE1BQU8sZUFBQSxDQUFnQjtBQUN4RSxPQUFPLEVBQUUsc0JBQUEsRUFBdUIsTUFBTyx3QkFBQSxDQUF5QjtBQUVoRTs7R0FFRztBQUVIO0lBQTBDLHdDQUFzQjtJQUM1RDs7O09BR0c7SUFDSCw4QkFBWSxRQUFrQjtlQUMxQixrQkFBTSxRQUFRLENBQUM7SUFDbkIsQ0FBQztJQUVEOztPQUVHO0lBQ08sb0RBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLGtCQUFrQjtTQUNyQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UsK0JBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsMEJBQTBCO29CQUNwQyxRQUFRLEVBQUUsbXZCQVVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxtQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDRiwyQkFBQztDQXJDRCxBQXFDQyxDQXJDeUMsc0JBQXNCLEdBcUMvRDtTQXJDWSxvQkFBb0IiLCJmaWxlIjoiY3VzdG9tLWJhZGdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=