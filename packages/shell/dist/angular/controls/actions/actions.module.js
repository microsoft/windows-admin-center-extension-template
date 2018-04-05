import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DisabledModule } from '../../directives/disabled/disabled.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DropdownModule } from '../dropdown/dropdown.module';
import { ActionBarComponent } from './containers/action-bar/action-bar.component';
import { ActionMenuComponent } from './containers/action-menu/action-menu.component';
import { ActionButtonComponent, ActionButtonRendererComponent } from './items/action-button/action-button.component';
import { DynamicActionItemComponent } from './items/dynamic-action-item.component';
var ActionsModule = /** @class */ (function () {
    function ActionsModule() {
    }
    ActionsModule.decorators = [
        { type: NgModule, args: [{
                    exports: [
                        ActionBarComponent,
                        ActionButtonComponent,
                        ActionButtonRendererComponent,
                        DynamicActionItemComponent
                    ],
                    declarations: [
                        ActionBarComponent,
                        ActionMenuComponent,
                        ActionButtonComponent,
                        ActionButtonRendererComponent,
                        DynamicActionItemComponent
                    ],
                    imports: [
                        CommonModule,
                        PipesModule,
                        DropdownModule,
                        DisabledModule
                    ],
                    entryComponents: [
                        ActionButtonRendererComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    ActionsModule.ctorParameters = function () { return []; };
    return ActionsModule;
}());
export { ActionsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYWN0aW9ucy9hY3Rpb25zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFFekMsT0FBTyxFQUFFLGNBQUEsRUFBZSxNQUFPLDJDQUFBLENBQTRDO0FBQzNFLE9BQU8sRUFBRSxXQUFBLEVBQVksTUFBTywwQkFBQSxDQUEyQjtBQUN2RCxPQUFPLEVBQUUsY0FBQSxFQUFlLE1BQU8sNkJBQUEsQ0FBOEI7QUFFN0QsT0FBTyxFQUFFLGtCQUFBLEVBQW1CLE1BQU8sOENBQUEsQ0FBK0M7QUFDbEYsT0FBTyxFQUFFLG1CQUFBLEVBQW9CLE1BQU8sZ0RBQUEsQ0FBaUQ7QUFFckYsT0FBTyxFQUFFLHFCQUFBLEVBQXVCLDZCQUFBLEVBQThCLE1BQU8sK0NBQUEsQ0FBZ0Q7QUFDckgsT0FBTyxFQUFFLDBCQUFBLEVBQTJCLE1BQU8sdUNBQUEsQ0FBd0M7QUFHbkY7SUFBQTtJQTZCQSxDQUFDO0lBN0JtQyx3QkFBVSxHQUEwQjtRQUN4RSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sRUFBRTt3QkFDTCxrQkFBa0I7d0JBQ2xCLHFCQUFxQjt3QkFDckIsNkJBQTZCO3dCQUM3QiwwQkFBMEI7cUJBQzdCO29CQUNELFlBQVksRUFBRTt3QkFDVixrQkFBa0I7d0JBQ2xCLG1CQUFtQjt3QkFDbkIscUJBQXFCO3dCQUNyQiw2QkFBNkI7d0JBQzdCLDBCQUEwQjtxQkFDN0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxjQUFjO3dCQUNkLGNBQWM7cUJBQ2pCO29CQUNELGVBQWUsRUFBRTt3QkFDYiw2QkFBNkI7cUJBQ2hDO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCw0QkFBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNGLG9CQUFDO0NBN0JELEFBNkJDLElBQUE7U0E3QlksYUFBYSIsImZpbGUiOiJhY3Rpb25zLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=