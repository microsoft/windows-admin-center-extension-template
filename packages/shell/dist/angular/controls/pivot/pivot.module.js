import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmeRouterModule } from '../../directives/router/router.module';
import { PivotTabComponent } from './pivot-tab.component';
import { PivotComponent } from './pivot.component';
var PivotModule = /** @class */ (function () {
    function PivotModule() {
    }
    PivotModule.decorators = [
        { type: NgModule, args: [{
                    exports: [
                        PivotComponent,
                        PivotTabComponent
                    ],
                    declarations: [
                        PivotComponent,
                        PivotTabComponent
                    ],
                    imports: [
                        CommonModule,
                        SmeRouterModule,
                        RouterModule
                    ]
                },] },
    ];
    /** @nocollapse */
    PivotModule.ctorParameters = function () { return []; };
    return PivotModule;
}());
export { PivotModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvcGl2b3QvcGl2b3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFBLEVBQWEsTUFBTyxpQkFBQSxDQUFrQjtBQUMvQyxPQUFPLEVBQUUsUUFBQSxFQUFTLE1BQU8sZUFBQSxDQUFnQjtBQUN6QyxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFFL0MsT0FBTyxFQUFFLGVBQUEsRUFBZ0IsTUFBTyx1Q0FBQSxDQUF3QztBQUN4RSxPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyx1QkFBQSxDQUF3QjtBQUMxRCxPQUFPLEVBQUUsY0FBQSxFQUFlLE1BQU8sbUJBQUEsQ0FBb0I7QUFHbkQ7SUFBQTtJQW9CQSxDQUFDO0lBcEJpQyxzQkFBVSxHQUEwQjtRQUN0RSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sRUFBRTt3QkFDTCxjQUFjO3dCQUNkLGlCQUFpQjtxQkFDcEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNWLGNBQWM7d0JBQ2QsaUJBQWlCO3FCQUNwQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixlQUFlO3dCQUNmLFlBQVk7cUJBQ2Y7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDBCQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0Ysa0JBQUM7Q0FwQkQsQUFvQkMsSUFBQTtTQXBCWSxXQUFXIiwiZmlsZSI6InBpdm90Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=