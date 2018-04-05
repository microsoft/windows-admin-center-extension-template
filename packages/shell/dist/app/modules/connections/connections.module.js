import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionsModule, BadgeModule, DataTableModule, LoadingWheelModule, MasterViewModule, PipesModule, ToolHeaderModule } from '../../../angular';
import { ConnectionGuardService } from './connection-guard.service';
import { ConnectionComponent } from './connection/connection.component';
import { ConnectionsListComponent } from './connections-list/connections-list.component';
import { ConnectionsNavigationComponent } from './connections-nav/connections-nav.component';
import { ConnectionsComponent } from './connections.component';
import { ConnectionsRoutingModule } from './connections.routing';
var ConnectionsModule = /** @class */ (function () {
    function ConnectionsModule() {
    }
    ConnectionsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ConnectionsComponent,
                        ConnectionComponent,
                        ConnectionsListComponent,
                        ConnectionsNavigationComponent
                    ],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        LoadingWheelModule,
                        FormsModule,
                        ToolHeaderModule,
                        ConnectionsRoutingModule,
                        ActionsModule,
                        DataTableModule,
                        PipesModule,
                        MasterViewModule,
                        BadgeModule
                    ],
                    providers: [
                        ConnectionGuardService
                    ],
                    exports: [ConnectionsComponent, ConnectionsListComponent]
                },] },
    ];
    /** @nocollapse */
    ConnectionsModule.ctorParameters = function () { return []; };
    return ConnectionsModule;
}());
export { ConnectionsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2Nvbm5lY3Rpb25zL2Nvbm5lY3Rpb25zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFDekMsT0FBTyxFQUFFLFdBQUEsRUFBYSxtQkFBQSxFQUFvQixNQUFPLGdCQUFBLENBQWlCO0FBQ2xFLE9BQU8sRUFDSCxhQUFhLEVBRWIsV0FBVyxFQUNYLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBQ2hCLFdBQVcsRUFDWCxnQkFBZ0IsRUFFbkIsTUFBTSxrQkFBQSxDQUFtQjtBQUMxQixPQUFPLEVBQUUsc0JBQUEsRUFBdUIsTUFBTyw0QkFBQSxDQUE2QjtBQUNwRSxPQUFPLEVBQUUsbUJBQUEsRUFBb0IsTUFBTyxtQ0FBQSxDQUFvQztBQUN4RSxPQUFPLEVBQUUsd0JBQUEsRUFBeUIsTUFBTywrQ0FBQSxDQUFnRDtBQUN6RixPQUFPLEVBQUUsOEJBQUEsRUFBK0IsTUFBTyw2Q0FBQSxDQUE4QztBQUM3RixPQUFPLEVBQUUsb0JBQUEsRUFBcUIsTUFBTyx5QkFBQSxDQUEwQjtBQUMvRCxPQUFPLEVBQUUsd0JBQUEsRUFBeUIsTUFBTyx1QkFBQSxDQUF3QjtBQUdqRTtJQUFBO0lBOEJBLENBQUM7SUE5QnVDLDRCQUFVLEdBQTBCO1FBQzVFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDckIsWUFBWSxFQUFFO3dCQUNWLG9CQUFvQjt3QkFDcEIsbUJBQW1CO3dCQUNuQix3QkFBd0I7d0JBQ3hCLDhCQUE4QjtxQkFDakM7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osbUJBQW1CO3dCQUNuQixrQkFBa0I7d0JBQ2xCLFdBQVc7d0JBQ1gsZ0JBQWdCO3dCQUNoQix3QkFBd0I7d0JBQ3hCLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixXQUFXO3dCQUNYLGdCQUFnQjt3QkFDaEIsV0FBVztxQkFDZDtvQkFDRCxTQUFTLEVBQUU7d0JBQ1Asc0JBQXNCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSx3QkFBd0IsQ0FBQztpQkFDNUQsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLGdDQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0Ysd0JBQUM7Q0E5QkQsQUE4QkMsSUFBQTtTQTlCWSxpQkFBaUIiLCJmaWxlIjoiY29ubmVjdGlvbnMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==