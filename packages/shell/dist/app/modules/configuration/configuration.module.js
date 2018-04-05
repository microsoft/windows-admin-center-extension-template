import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule, GuidedPanelModule, IconModule, LoadingWheelModule, PipesModule, SettingsModule, SmeStylesModule, ToolHeaderModule } from '../../../angular';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { AccessModule } from './panels/access/access.module';
import { AzureModule } from './panels/azure/azure.module';
import { GeneralComponent } from './panels/general.component';
var ConfigurationModule = /** @class */ (function () {
    function ConfigurationModule() {
    }
    ConfigurationModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ConfigurationComponent,
                        GeneralComponent
                    ],
                    imports: [
                        AccessModule,
                        AzureModule,
                        CommonModule,
                        FormsModule,
                        ToolHeaderModule,
                        ReactiveFormsModule,
                        SmeStylesModule,
                        DialogModule,
                        IconModule,
                        LoadingWheelModule,
                        GuidedPanelModule,
                        PipesModule,
                        SettingsModule,
                        ConfigurationRoutingModule
                    ]
                },] },
    ];
    /** @nocollapse */
    ConfigurationModule.ctorParameters = function () { return []; };
    return ConfigurationModule;
}());
export { ConfigurationModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLGlCQUFBLENBQWtCO0FBQy9DLE9BQU8sRUFBZ0IsUUFBQSxFQUFTLE1BQU8sZUFBQSxDQUFnQjtBQUN2RCxPQUFPLEVBQUUsV0FBQSxFQUFhLG1CQUFBLEVBQW9CLE1BQU8sZ0JBQUEsQ0FBaUI7QUFFbEUsT0FBTyxFQUlILFlBQVksRUFDWixpQkFBaUIsRUFDakIsVUFBVSxFQUNWLGtCQUFrQixFQUdDLFdBQUEsRUFBOEIsY0FBQSxFQUNqRCxlQUFlLEVBQUUsZ0JBQUEsRUFDcEIsTUFBTSxrQkFBQSxDQUFtQjtBQUMxQixPQUFPLEVBQUUsMEJBQUEsRUFBMkIsTUFBTyxnQ0FBQSxDQUFpQztBQUM1RSxPQUFPLEVBQUUsc0JBQUEsRUFBdUIsTUFBTywyQkFBQSxDQUE0QjtBQUNuRSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8sK0JBQUEsQ0FBZ0M7QUFDN0QsT0FBTyxFQUFFLFdBQUEsRUFBWSxNQUFPLDZCQUFBLENBQThCO0FBQzFELE9BQU8sRUFBRSxnQkFBQSxFQUFpQixNQUFPLDRCQUFBLENBQTZCO0FBRzlEO0lBQUE7SUEyQkEsQ0FBQztJQTNCeUMsOEJBQVUsR0FBMEI7UUFDOUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUNyQixZQUFZLEVBQUU7d0JBQ1Ysc0JBQXNCO3dCQUN0QixnQkFBZ0I7cUJBQ25CO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGdCQUFnQjt3QkFDaEIsbUJBQW1CO3dCQUNuQixlQUFlO3dCQUNmLFlBQVk7d0JBQ1osVUFBVTt3QkFDVixrQkFBa0I7d0JBQ2xCLGlCQUFpQjt3QkFDakIsV0FBVzt3QkFDWCxjQUFjO3dCQUNkLDBCQUEwQjtxQkFDN0I7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLGtDQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0YsMEJBQUM7Q0EzQkQsQUEyQkMsSUFBQTtTQTNCWSxtQkFBbUIiLCJmaWxlIjoiY29uZmlndXJhdGlvbi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9