import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingWheelModule } from '../loading-wheel/loading-wheel.module';
import { ResizerModule } from '../resizer';
import { DataTableColumnComponent } from './data-table-column.component';
import { DataTableTemplateLoaderComponent } from './data-table-template-loader.component';
import { DataTableComponent, TreeTableComponent } from './data-table.component';
var DataTableModule = /** @class */ (function () {
    function DataTableModule() {
    }
    DataTableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [DataTableComponent, DataTableColumnComponent, DataTableTemplateLoaderComponent, TreeTableComponent],
                    exports: [DataTableComponent, DataTableColumnComponent, TreeTableComponent],
                    imports: [CommonModule, ResizerModule, LoadingWheelModule]
                },] },
    ];
    /** @nocollapse */
    DataTableModule.ctorParameters = function () { return []; };
    return DataTableModule;
}());
export { DataTableModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGF0YS10YWJsZS9kYXRhLXRhYmxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFDekMsT0FBTyxFQUFFLGtCQUFBLEVBQW1CLE1BQU8sdUNBQUEsQ0FBd0M7QUFDM0UsT0FBTyxFQUFFLGFBQUEsRUFBYyxNQUFPLFlBQUEsQ0FBYTtBQUMzQyxPQUFPLEVBQUUsd0JBQUEsRUFBeUIsTUFBTywrQkFBQSxDQUFnQztBQUN6RSxPQUFPLEVBQUUsZ0NBQUEsRUFBaUMsTUFBTyx3Q0FBQSxDQUF5QztBQUMxRixPQUFPLEVBQUUsa0JBQUEsRUFBb0Isa0JBQUEsRUFBbUIsTUFBTyx3QkFBQSxDQUF5QjtBQUdoRjtJQUFBO0lBVUEsQ0FBQztJQVZvQywwQkFBVSxHQUEwQjtRQUN6RSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3JCLFlBQVksRUFBRSxDQUFDLGtCQUFrQixFQUFFLHdCQUF3QixFQUFFLGdDQUFnQyxFQUFFLGtCQUFrQixDQUFDO29CQUNsSCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSx3QkFBd0IsRUFBRSxrQkFBa0IsQ0FBQztvQkFDM0UsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQztpQkFDN0QsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDhCQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0Ysc0JBQUM7Q0FWRCxBQVVDLElBQUE7U0FWWSxlQUFlIiwiZmlsZSI6ImRhdGEtdGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==