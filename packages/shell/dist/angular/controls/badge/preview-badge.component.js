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
 * Defines a preview badge
 */
var PreviewBadgeComponent = /** @class */ (function (_super) {
    __extends(PreviewBadgeComponent, _super);
    /**
     * Initializes a new instance of the @see PreviewBadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function PreviewBadgeComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.label = _this.strings.MsftSmeShell.Angular.Badges.Preview.label;
        _this.description = _this.strings.MsftSmeShell.Angular.Badges.Preview.tooltip;
        return _this;
    }
    /**
     * Gets the initial host classes to be applied to this element
     */
    PreviewBadgeComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge-preview'
        ]);
    };
    PreviewBadgeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-badge[type="preview"]',
                    template: "\n      <p tabindex=\"0\" [smeTooltip]=\"resolvedTooltip\" [title]=\"resolvedTitle\" [attr.aria-label]=\"resolvedTitle ? ariaLabel : null\">\n          <span aria-hidden=\"true\">{{label}}</span>\n          <span aria-hidden=\"true\" [ngClass]=\"['sme-icon', icon]\"></span>\n      </p>\n      <ng-template #defaultTooltip let-hostData=\"hostData\">\n          <h3 [id]=\"hostData.ariaLabelId\" class=\"sme-screen-reader\">{{ariaLabel}}</h3>\n          <p [id]=\"hostData.ariaDescriptionId\" class=\"sme-margin-bottom-xs sme-font-label\">{{description}}</p>\n          <a *ngIf=\"!!learnMoreLink\" target=\"about:blank\" [href]=\"learnMoreLink\" class=\"sme-link\">{{strings.MsftSmeShell.Angular.Badges.Common.learnMore}}</a>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    PreviewBadgeComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return PreviewBadgeComponent;
}(CoreBadgeBaseComponent));
export { PreviewBadgeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2UvcHJldmlldy1iYWRnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsUUFBQSxFQUE2QixNQUFPLGVBQUEsQ0FBZ0I7QUFDeEUsT0FBTyxFQUFFLHNCQUFBLEVBQXVCLE1BQU8sd0JBQUEsQ0FBeUI7QUFFaEU7O0dBRUc7QUFFSDtJQUEyQyx5Q0FBc0I7SUFDN0Q7OztPQUdHO0lBQ0gsK0JBQVksUUFBa0I7UUFBOUIsWUFDSSxrQkFBTSxRQUFRLENBQUMsU0FHbEI7UUFGRyxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNwRSxLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzs7SUFDaEYsQ0FBQztJQUVEOztPQUVHO0lBQ08scURBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLG1CQUFtQjtTQUN0QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UsZ0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsbXZCQVVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxvQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDRiw0QkFBQztDQXZDRCxBQXVDQyxDQXZDMEMsc0JBQXNCLEdBdUNoRTtTQXZDWSxxQkFBcUIiLCJmaWxlIjoicHJldmlldy1iYWRnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9