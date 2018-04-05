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
import { Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../common/base.component';
/**
 * The levels of severity of a badge.
 */
export var BadgeSeverity;
(function (BadgeSeverity) {
    BadgeSeverity[BadgeSeverity["Informational"] = 0] = "Informational";
    BadgeSeverity[BadgeSeverity["Warning"] = 1] = "Warning";
    BadgeSeverity[BadgeSeverity["Critical"] = 2] = "Critical";
})(BadgeSeverity || (BadgeSeverity = {}));
/**
 * Defines a base component for badges
 */
var BadgeBaseComponent = /** @class */ (function (_super) {
    __extends(BadgeBaseComponent, _super);
    /**
     * Initializes a new instance of the @see BadgeComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function BadgeBaseComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.severity = BadgeSeverity.Informational;
        return _this;
    }
    Object.defineProperty(BadgeBaseComponent.prototype, "ariaLabel", {
        /**
         * The title that we actually bind to
         */
        get: function () {
            // we dont have proper typing for shell strings here, so we cast it to any then to strings.
            var badgeStrings = MsftSme.resourcesStrings().MsftSmeShell.Angular.Badges.Common;
            var severityLabel = '';
            switch (this.severity) {
                case BadgeSeverity.Warning: {
                    severityLabel = badgeStrings.Severities.warn;
                    break;
                }
                case BadgeSeverity.Critical: {
                    severityLabel = badgeStrings.Severities.critical;
                    break;
                }
                default: {
                    return this.label;
                }
            }
            return badgeStrings.Aria.labelFormat.format(severityLabel, this.label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BadgeBaseComponent.prototype, "icon", {
        /**
         * The title that we actually bind to
         */
        get: function () {
            switch (this.severity) {
                case BadgeSeverity.Warning: {
                    return 'sme-icon-warning';
                }
                case BadgeSeverity.Critical: {
                    return 'sme-icon-error';
                }
                default: {
                    return 'sme-icon-info';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BadgeBaseComponent.prototype, "resolvedTitle", {
        /**
         * The title that we actually bind to
         */
        get: function () {
            return this.resolvedTooltip ? null : this.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BadgeBaseComponent.prototype, "resolvedTooltip", {
        /**
         * The title that we actually bind to
         */
        get: function () {
            // if we have a custom tooltip, then use it
            if (this.tooltip) {
                return this.tooltip;
            }
            // if there is a learnMoreLink, then use the default tooltip
            if (this.learnMoreLink) {
                return this.defaultTooltip;
            }
            // otherwise its just a description. in which case we should use the title property instead
            return null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the initial host classes to be applied to this element
     */
    BadgeBaseComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-badge',
            'sme-focus-zone'
        ]);
    };
    BadgeBaseComponent.propDecorators = {
        'label': [{ type: Input },],
        'description': [{ type: Input },],
        'tooltip': [{ type: Input },],
        'learnMoreLink': [{ type: Input },],
        'severity': [{ type: Input },],
        'defaultTooltip': [{ type: ViewChild, args: ['defaultTooltip',] },],
    };
    return BadgeBaseComponent;
}(BaseComponent));
export { BadgeBaseComponent };
/**
 * Internal base component for SME Core controls. It simply removes the need to supply the string type parameter
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
var CoreBadgeBaseComponent = /** @class */ (function (_super) {
    __extends(CoreBadgeBaseComponent, _super);
    function CoreBadgeBaseComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreBadgeBaseComponent;
}(BadgeBaseComponent));
export { CoreBadgeBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFkZ2UvYmFkZ2UtYmFzZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBb0MsS0FBQSxFQUFvQixTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBRWhHLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTywwQkFBQSxDQUEyQjtBQUN6RDs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLGFBSVg7QUFKRCxXQUFZLGFBQUE7SUFDUixtRUFBZ0IsQ0FBQTtJQUNoQix1REFBVSxDQUFBO0lBQ1YseURBQVcsQ0FBQTtBQUNmLENBQUMsRUFKVyxhQUFBLEtBQUEsYUFBQSxRQUlYO0FBRUQ7O0dBRUc7QUFDSDtJQUFrRCxzQ0FBdUI7SUFzR3JFOzs7T0FHRztJQUNILDRCQUFZLFFBQWtCO1FBQTlCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBRWxCO1FBREcsS0FBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDOztJQUNoRCxDQUFDO0lBMUVELHNCQUFXLHlDQUFTO1FBSHBCOztXQUVHO2FBQ0g7WUFDSSwyRkFBMkY7WUFDM0YsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzFGLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN2QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsS0FBSyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3pCLGFBQWEsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDN0MsS0FBSyxDQUFDO2dCQUNWLENBQUM7Z0JBQ0QsS0FBSyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzFCLGFBQWEsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztvQkFDakQsS0FBSyxDQUFDO2dCQUNWLENBQUM7Z0JBQ0QsU0FBUyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN0QixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRSxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLG9DQUFJO1FBSGY7O1dBRUc7YUFDSDtZQUNJLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixLQUFLLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDekIsTUFBTSxDQUFDLGtCQUFrQixDQUFDO2dCQUM5QixDQUFDO2dCQUNELEtBQUssYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzVCLENBQUM7Z0JBQ0QsU0FBUyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxlQUFlLENBQUM7Z0JBQzNCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyw2Q0FBYTtRQUh4Qjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxRCxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLCtDQUFlO1FBSDFCOztXQUVHO2FBQ0g7WUFDSSwyQ0FBMkM7WUFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDeEIsQ0FBQztZQUNELDREQUE0RDtZQUM1RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDL0IsQ0FBQztZQUVELDJGQUEyRjtZQUMzRixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBaUJEOztPQUVHO0lBQ08sa0RBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLFdBQVc7WUFDWCxnQkFBZ0I7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNFLGlDQUFjLEdBQTJDO1FBQ2hFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNCLGFBQWEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2pDLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzdCLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25DLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzlCLGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLGdCQUFnQixFQUFHLEVBQUUsRUFBRTtLQUNuRSxDQUFDO0lBQ0YseUJBQUM7Q0FoSUQsQUFnSUMsQ0FoSWlELGFBQWEsR0FnSTlEO1NBaElZLGtCQUFrQjtBQWtJL0I7OztHQUdHO0FBQ0g7SUFBNEMsMENBQTJCO0lBQXZFOztJQUVBLENBQUM7SUFBRCw2QkFBQztBQUFELENBRkEsQUFFQyxDQUYyQyxrQkFBa0IsR0FFN0QiLCJmaWxlIjoiYmFkZ2UtYmFzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9