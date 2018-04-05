import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActionsModule, DataTableModule, DialogModule, LoadingWheelModule, MasterViewModule, SettingsModule, SmeStylesModule, ToolHeaderModule } from '../../../../../angular';
import { AccessComponent } from './access.component';
import { AccessService } from './access.service';
import { AddSecurityGroupDialogComponent } from './dialogs/add-security-group-dialog.component';
import { ChangeAccessControlDialogComponent } from './dialogs/change-access-control-dialog.component';
import { AdminsSecurityGroupsComponent } from './security-groups/admins-security-groups.component';
import { SecurityGroupsBaseComponent } from './security-groups/security-groups-base.component';
import { UsersSecurityGroupsComponent } from './security-groups/users-security-groups.component';
var AccessModule = /** @class */ (function () {
    function AccessModule() {
    }
    AccessModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AccessComponent,
                        ChangeAccessControlDialogComponent,
                        SecurityGroupsBaseComponent,
                        AddSecurityGroupDialogComponent,
                        UsersSecurityGroupsComponent,
                        AdminsSecurityGroupsComponent
                    ],
                    imports: [
                        CommonModule,
                        DialogModule,
                        SettingsModule,
                        ActionsModule,
                        DataTableModule,
                        LoadingWheelModule,
                        ToolHeaderModule,
                        FormsModule,
                        ReactiveFormsModule,
                        RouterModule,
                        SmeStylesModule,
                        MasterViewModule
                    ],
                    providers: [
                        AccessService
                    ],
                    exports: []
                },] },
    ];
    /** @nocollapse */
    AccessModule.ctorParameters = function () { return []; };
    return AccessModule;
}());
export { AccessModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9hY2Nlc3MubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxZQUFBLEVBQWEsTUFBTyxpQkFBQSxDQUFrQjtBQUMvQyxPQUFPLEVBQUUsUUFBQSxFQUFTLE1BQU8sZUFBQSxDQUFnQjtBQUN6QyxPQUFPLEVBQUUsV0FBQSxFQUFhLG1CQUFBLEVBQW9CLE1BQU8sZ0JBQUEsQ0FBaUI7QUFDbEUsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLGlCQUFBLENBQWtCO0FBQy9DLE9BQU8sRUFDSCxhQUFhLEVBQUUsZUFBQSxFQUFpQixZQUFBLEVBQWMsa0JBQUEsRUFBb0IsZ0JBQUEsRUFBa0IsY0FBQSxFQUFnQixlQUFBLEVBQWlCLGdCQUFBLEVBQ3hILE1BQU0sd0JBQUEsQ0FBeUI7QUFDaEMsT0FBTyxFQUFFLGVBQUEsRUFBZ0IsTUFBTyxvQkFBQSxDQUFxQjtBQUNyRCxPQUFPLEVBQUUsYUFBQSxFQUFjLE1BQU8sa0JBQUEsQ0FBbUI7QUFDakQsT0FBTyxFQUFFLCtCQUFBLEVBQWdDLE1BQU8sK0NBQUEsQ0FBZ0Q7QUFDaEcsT0FBTyxFQUFFLGtDQUFBLEVBQW1DLE1BQU8sa0RBQUEsQ0FBbUQ7QUFDdEcsT0FBTyxFQUFFLDZCQUFBLEVBQThCLE1BQU8sb0RBQUEsQ0FBcUQ7QUFDbkcsT0FBTyxFQUFFLDJCQUFBLEVBQTRCLE1BQU8sa0RBQUEsQ0FBbUQ7QUFDL0YsT0FBTyxFQUFFLDRCQUFBLEVBQTZCLE1BQU8sbURBQUEsQ0FBb0Q7QUFHakc7SUFBQTtJQWtDQSxDQUFDO0lBbENrQyx1QkFBVSxHQUEwQjtRQUN2RSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3JCLFlBQVksRUFBRTt3QkFDVixlQUFlO3dCQUNmLGtDQUFrQzt3QkFDbEMsMkJBQTJCO3dCQUMzQiwrQkFBK0I7d0JBQy9CLDRCQUE0Qjt3QkFDNUIsNkJBQTZCO3FCQUNoQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixZQUFZO3dCQUNaLGNBQWM7d0JBQ2QsYUFBYTt3QkFDYixlQUFlO3dCQUNmLGtCQUFrQjt3QkFDbEIsZ0JBQWdCO3dCQUNoQixXQUFXO3dCQUNYLG1CQUFtQjt3QkFDbkIsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGdCQUFnQjtxQkFDbkI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQLGFBQWE7cUJBQ2hCO29CQUNELE9BQU8sRUFBRSxFQUNSO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwyQkFBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNGLG1CQUFDO0NBbENELEFBa0NDLElBQUE7U0FsQ1ksWUFBWSIsImZpbGUiOiJhY2Nlc3MubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==