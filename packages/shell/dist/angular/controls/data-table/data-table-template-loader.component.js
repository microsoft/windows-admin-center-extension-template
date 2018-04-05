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
import { Component, Input, ViewContainerRef } from '@angular/core';
import { TemplateLoaderBaseComponent } from '../common/template-loader-base.component';
var DataTableTemplateLoaderComponent = /** @class */ (function (_super) {
    __extends(DataTableTemplateLoaderComponent, _super);
    /**
     * Instantiates a new instance of DataTableTemplateLoaderComponent
     * @param viewContainer the reference to this elements view container
     */
    function DataTableTemplateLoaderComponent(viewContainer) {
        return _super.call(this, viewContainer) || this;
    }
    /**
     * Creates the context for our embeded view
     */
    DataTableTemplateLoaderComponent.prototype.createContext = function () {
        return {
            $implicit: this.data,
            rowIndex: this.rowIndex
        };
    };
    DataTableTemplateLoaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-data-table-template-loader',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    DataTableTemplateLoaderComponent.ctorParameters = function () { return [
        { type: ViewContainerRef, },
    ]; };
    DataTableTemplateLoaderComponent.propDecorators = {
        'rowIndex': [{ type: Input },],
    };
    return DataTableTemplateLoaderComponent;
}(TemplateLoaderBaseComponent));
export { DataTableTemplateLoaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGF0YS10YWJsZS9kYXRhLXRhYmxlLXRlbXBsYXRlLWxvYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUtMLGdCQUFnQixFQUNuQixNQUFNLGVBQUEsQ0FBZ0I7QUFHdkIsT0FBTyxFQUFtQiwyQkFBQSxFQUE0QixNQUFPLDBDQUFBLENBQTJDO0FBVXhHO0lBQ1ksb0RBQXdFO0lBU2hGOzs7T0FHRztJQUNILDBDQUFZLGFBQStCO2VBQ3ZDLGtCQUFNLGFBQWEsQ0FBQztJQUN4QixDQUFDO0lBRUQ7O09BRUc7SUFDTyx3REFBYSxHQUF2QjtRQUNJLE1BQU0sQ0FBQztZQUNILFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDMUIsQ0FBQztJQUNOLENBQUM7SUFDRSwyQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLFFBQVEsRUFBRSxFQUFFO2lCQUNmLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwrQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEdBQUc7S0FDekIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNLLCtDQUFjLEdBQTJDO1FBQ2hFLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0tBQzdCLENBQUM7SUFDRix1Q0FBQztDQXhDRCxBQXdDQyxDQXZDVywyQkFBMkIsR0F1Q3RDO1NBeENZLGdDQUFnQyIsImZpbGUiOiJkYXRhLXRhYmxlLXRlbXBsYXRlLWxvYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9