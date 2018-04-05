import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { PivotTabType } from './pivot-tab-type';
/**
 * Defines a tab for @see PivotComponent
 */
var PivotTabComponent = /** @class */ (function () {
    function PivotTabComponent() {
        /**
         * The route of this tab
         */
        /**
         * Use the same input options as angular @see RouterLinkActive Directive
         */
        this.routerLinkActiveOptions = { exact: false };
    }
    Object.defineProperty(PivotTabComponent.prototype, "type", {
        /**
         * Indicates the type of this tab
         */
        get: function () {
            return this.contentTemplate ? PivotTabType.Static : PivotTabType.Routed;
        },
        enumerable: true,
        configurable: true
    });
    PivotTabComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-pivot-tab',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    PivotTabComponent.ctorParameters = function () { return []; };
    PivotTabComponent.propDecorators = {
        'route': [{ type: Input },],
        'routerLinkActiveOptions': [{ type: Input },],
        'label': [{ type: Input },],
        'contentTemplate': [{ type: ContentChild, args: [TemplateRef,] },],
    };
    return PivotTabComponent;
}());
export { PivotTabComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvcGl2b3QvcGl2b3QtdGFiLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFlBQUEsRUFBYyxLQUFBLEVBQU8sV0FBQSxFQUFZLE1BQU8sZUFBQSxDQUFnQjtBQUM1RSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8sa0JBQUEsQ0FBbUI7QUFFaEQ7O0dBRUc7QUFFSDtJQUFBO1FBRUk7O1dBRUc7UUFJSDs7V0FFRztRQUVJLDRCQUF1QixHQUF1QixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztJQW9DMUUsQ0FBQztJQW5CRyxzQkFBVyxtQ0FBSTtRQUhmOztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUM1RSxDQUFDOzs7T0FBQTtJQUVFLDRCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSxFQUFFO2lCQUNmLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLGdDQUFjLEdBQTJDO1FBQ2hFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNCLHlCQUF5QixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDN0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDM0IsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFHLEVBQUUsRUFBRTtLQUNsRSxDQUFDO0lBQ0Ysd0JBQUM7Q0FoREQsQUFnREMsSUFBQTtTQWhEWSxpQkFBaUIiLCJmaWxlIjoicGl2b3QtdGFiLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=