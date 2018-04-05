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
import { Component, ContentChildren, Injector, Input } from '@angular/core';
import { CoreBaseComponent } from '../common/base.component';
import { PivotTabType } from './pivot-tab-type';
import { PivotTabComponent } from './pivot-tab.component';
var PivotComponent = /** @class */ (function (_super) {
    __extends(PivotComponent, _super);
    /**
     * Initializes a new instance of the @see PivotComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     */
    function PivotComponent(injector) {
        var _this = _super.call(this, injector) || this;
        /**
         * Bindable property for tab types
         */
        _this.pivotTabType = PivotTabType;
        return _this;
    }
    Object.defineProperty(PivotComponent.prototype, "hasRoutedTabs", {
        /**
         * Indicates that routed tabs have been provided
         */
        get: function () {
            return this.tabs && this.tabs.some(function (t) { return t.type === PivotTabType.Routed; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PivotComponent.prototype, "hasStaticTabs", {
        /**
         * Indicates that static tabs have been provided
         */
        get: function () {
            return this.tabs && this.tabs.some(function (t) { return t.type === PivotTabType.Static; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PivotComponent.prototype, "selectionIsRouted", {
        /**
         * Indicates that static tabs have been provided
         */
        get: function () {
            return this.selection && this.selection.type === PivotTabType.Routed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Indicates of a given tab is selected
     * @param tab The tab to compare with
     */
    PivotComponent.prototype.isSelected = function (tab) {
        return this.selection && this.selection === tab;
    };
    /**
     * Selects a tab
     * @param tab The tab to select
     */
    PivotComponent.prototype.select = function (tab) {
        if (tab) {
            this.selection = tab;
        }
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned by the @see BaseComponent super class.
     */
    PivotComponent.prototype.createIdBag = function () {
        return {
            tabPanel: ''
        };
    };
    /**
     * Gets the initial host classes to be applied to this element
     */
    PivotComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-pivot'
        ]);
    };
    PivotComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-pivot',
                    template: "\n      <header role=\"tablist\">\n          <ng-container *ngFor=\"let tab of tabs; let tabIndex = index\">\n              <!-- Routed Tab item -->\n              <a *ngIf=\"tab.type === pivotTabType.Routed\" role=\"tab\" [routerLink]=\"tab.route\" [attr.aria-controls]=\"idBag.tabPanel\" [attr.aria-selected]=\"isSelected(tab)\" (smeRouterLinkActivated)=\"select(tab)\" [routerLinkActiveOptions]=\"tab.routerLinkActiveOptions\">{{tab.label}}</a>\n              <!-- Static Tab Item -->\n              <a *ngIf=\"tab.type === pivotTabType.Static\" tabindex=\"0\" role=\"tab\" [attr.aria-controls]=\"idBag.tabPanel + tabIndex\" [attr.aria-selected]=\"isSelected(tab)\" (click)=\"select(tab)\">{{tab.label}}</a>\n          </ng-container>\n      </header>\n\n      <!-- Routed Tab Content -->\n      <section *ngIf=\"hasRoutedTabs\" role=\"tabpanel\" [id]=\"idBag.tabPanel\" [class.sme-layout-none]=\"!selectionIsRouted\" [attr.aria-hidden]=\"!selectionIsRouted\">\n          <router-outlet></router-outlet>\n      </section>\n\n      <!-- Static Tab Content -->\n      <ng-container *ngIf=\"hasStaticTabs\">\n          <ng-container *ngFor=\"let tab of tabs; let tabIndex = index\">\n              <ng-container *ngIf=\"tab.type === pivotTabType.Static\">\n                  <section role=\"tabpanel\" [id]=\"idBag.tabPanel + tabIndex\" [class.sme-layout-none]=\"!isSelected(tab)\" [attr.aria-hidden]=\"!isSelected(tab)\">\n                      <ng-container *ngTemplateOutlet=\"tab.contentTemplate\"></ng-container>\n                  </section>\n              </ng-container>\n          </ng-container>\n      </ng-container>\n    "
                },] },
    ];
    /** @nocollapse */
    PivotComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    PivotComponent.propDecorators = {
        'selection': [{ type: Input },],
        'tabs': [{ type: ContentChildren, args: [PivotTabComponent,] },],
    };
    return PivotComponent;
}(CoreBaseComponent));
export { PivotComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvcGl2b3QvcGl2b3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLGVBQUEsRUFBNEMsUUFBQSxFQUFVLEtBQUEsRUFBeUIsTUFBTyxlQUFBLENBQWdCO0FBQzFILE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLDBCQUFBLENBQTJCO0FBQzdELE9BQU8sRUFBRSxZQUFBLEVBQWEsTUFBTyxrQkFBQSxDQUFtQjtBQUNoRCxPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyx1QkFBQSxDQUF3QjtBQUcxRDtJQUFvQyxrQ0FBaUI7SUF3Q2pEOzs7T0FHRztJQUNILHdCQUFZLFFBQWtCO1FBQTlCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBQ2xCO1FBaENEOztXQUVHO1FBQ0ksa0JBQVksR0FBRyxZQUFZLENBQUM7O0lBNkJuQyxDQUFDO0lBeEJELHNCQUFXLHlDQUFhO1FBSHhCOztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLE1BQU0sRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1FBQzVFLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcseUNBQWE7UUFIeEI7O1dBRUc7YUFDSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsTUFBTSxFQUE5QixDQUE4QixDQUFDLENBQUM7UUFDNUUsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyw2Q0FBaUI7UUFINUI7O1dBRUc7YUFDSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDekUsQ0FBQzs7O09BQUE7SUFVRDs7O09BR0c7SUFDSSxtQ0FBVSxHQUFqQixVQUFrQixHQUFzQjtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEdBQUcsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksK0JBQU0sR0FBYixVQUFjLEdBQXNCO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUN6QixDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNPLG9DQUFXLEdBQXJCO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLEVBQUU7U0FDZixDQUFBO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ08sOENBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLFdBQVc7U0FDZCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UseUJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLG9tREF5QlQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDZCQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxRQUFRLEdBQUc7S0FDakIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNLLDZCQUFjLEdBQTJDO1FBQ2hFLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9CLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRyxFQUFFLEVBQUU7S0FDaEUsQ0FBQztJQUNGLHFCQUFDO0NBM0hELEFBMkhDLENBM0htQyxpQkFBaUIsR0EySHBEO1NBM0hZLGNBQWMiLCJmaWxlIjoicGl2b3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==