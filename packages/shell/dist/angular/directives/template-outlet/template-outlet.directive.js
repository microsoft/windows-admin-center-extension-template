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
import { Directive, Input, ViewContainerRef } from '@angular/core';
import { TemplateLoaderBaseComponent } from '../../controls/common/template-loader-base.component';
var TemplateOutletDirective = /** @class */ (function (_super) {
    __extends(TemplateOutletDirective, _super);
    /**
     * Instantiates a new instance of TooltipTemplateLoaderComponent
     * @param viewContainer the reference to this elements view container
     */
    function TemplateOutletDirective(viewContainer) {
        return _super.call(this, viewContainer) || this;
    }
    TemplateOutletDirective.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
        if (!this.view || !this.view.context) {
            return;
        }
        if (changes.hostDataName || changes.hostData) {
            this.applyHostData(this.view.context);
        }
    };
    /**
     * Creates the context for our embedded view
     */
    TemplateOutletDirective.prototype.createContext = function () {
        return this.applyHostData({ $implicit: this.data });
    };
    /**
     * Applies the hostData property to a given context object.
     */
    TemplateOutletDirective.prototype.applyHostData = function (context) {
        var hostDataName = this.hostDataName || 'hostData';
        context[hostDataName] = this.hostData;
        return context;
    };
    TemplateOutletDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[smeTemplateOutlet]'
                },] },
    ];
    /** @nocollapse */
    TemplateOutletDirective.ctorParameters = function () { return [
        { type: ViewContainerRef, },
    ]; };
    TemplateOutletDirective.propDecorators = {
        'hostData': [{ type: Input },],
        'hostDataName': [{ type: Input },],
    };
    return TemplateOutletDirective;
}(TemplateLoaderBaseComponent));
export { TemplateOutletDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvZGlyZWN0aXZlcy90ZW1wbGF0ZS1vdXRsZXQvdGVtcGxhdGUtb3V0bGV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFhLFNBQUEsRUFBVyxLQUFBLEVBQWlDLGdCQUFBLEVBQWlCLE1BQU8sZUFBQSxDQUFnQjtBQUN4RyxPQUFPLEVBQW1CLDJCQUFBLEVBQTRCLE1BQU8sc0RBQUEsQ0FBQTtBQUc3RDtJQUE2QywyQ0FBc0Q7SUFjL0Y7OztPQUdHO0lBQ0gsaUNBQVksYUFBK0I7ZUFDdkMsa0JBQU0sYUFBYSxDQUFDO0lBQ3hCLENBQUM7SUFFTSw2Q0FBVyxHQUFsQixVQUFtQixPQUFzQjtRQUNyQyxpQkFBTSxXQUFXLFlBQUMsT0FBTyxDQUFDLENBQUM7UUFFM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ08sK0NBQWEsR0FBdkI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSywrQ0FBYSxHQUFyQixVQUFzQixPQUFZO1FBQzlCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksVUFBVSxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxPQUFPLENBQUE7SUFDbEIsQ0FBQztJQUNFLGtDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLHFCQUFxQjtpQkFDbEMsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHNDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxnQkFBZ0IsR0FBRztLQUN6QixFQUY2RixDQUU3RixDQUFDO0lBQ0ssc0NBQWMsR0FBMkM7UUFDaEUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDOUIsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7S0FDakMsQ0FBQztJQUNGLDhCQUFDO0NBOURELEFBOERDLENBOUQ0QywyQkFBMkIsR0E4RHZFO1NBOURZLHVCQUF1QiIsImZpbGUiOiJ0ZW1wbGF0ZS1vdXRsZXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==