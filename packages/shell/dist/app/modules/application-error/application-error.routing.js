import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationErrorComponent } from './application-error.component';
import { ForbiddenErrorComponent } from './forbidden-error/forbidden-error.component';
import { GenericErrorComponent } from './generic-error/generic-error.component';
import { UnsupportedBrowserComponent } from './unsupported-browser/unsupported-browser.component';
var routes = [
    {
        path: '',
        component: ApplicationErrorComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: GenericErrorComponent
            },
            {
                path: 'unsupported-browser',
                component: UnsupportedBrowserComponent
            },
            {
                path: 'forbidden',
                component: ForbiddenErrorComponent
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    }
];
var ApplicationErrorRoutingModule = /** @class */ (function () {
    function ApplicationErrorRoutingModule() {
    }
    ApplicationErrorRoutingModule.decorators = [
        { type: NgModule, args: [{
                    imports: [RouterModule.forChild(routes)],
                    exports: [RouterModule]
                },] },
    ];
    /** @nocollapse */
    ApplicationErrorRoutingModule.ctorParameters = function () { return []; };
    return ApplicationErrorRoutingModule;
}());
export { ApplicationErrorRoutingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcGxpY2F0aW9uLWVycm9yL2FwcGxpY2F0aW9uLWVycm9yLnJvdXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFDekMsT0FBTyxFQUFFLFlBQUEsRUFBcUIsTUFBTyxpQkFBQSxDQUFrQjtBQUN2RCxPQUFPLEVBQUUseUJBQUEsRUFBMEIsTUFBTywrQkFBQSxDQUFnQztBQUMxRSxPQUFPLEVBQUUsdUJBQUEsRUFBd0IsTUFBTyw2Q0FBQSxDQUE4QztBQUN0RixPQUFPLEVBQUUscUJBQUEsRUFBc0IsTUFBTyx5Q0FBQSxDQUEwQztBQUNoRixPQUFPLEVBQUUsMkJBQUEsRUFBNEIsTUFBTyxxREFBQSxDQUFzRDtBQUVsRyxJQUFNLE1BQUEsR0FBaUI7SUFDbkI7UUFDSSxJQUFJLEVBQUUsRUFBQTtRQUNOLFNBQVMsRUFBRSx5QkFBQTtRQUNYLFFBQVEsRUFBRTtZQUNOO2dCQUNJLElBQUksRUFBRSxFQUFBO2dCQUNOLFNBQVMsRUFBRSxNQUFBO2dCQUNYLFNBQVMsRUFBRSxxQkFBQTthQUNkO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLHFCQUFBO2dCQUNOLFNBQVMsRUFBRSwyQkFBQTthQUNkO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLFdBQUE7Z0JBQ04sU0FBUyxFQUFFLHVCQUFBO2FBQ2Q7WUFDRDtnQkFDSSxJQUFJLEVBQUUsSUFBQTtnQkFDTixVQUFVLEVBQUUsRUFBQTthQUNmO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFHRjtJQUFBO0lBU0EsQ0FBQztJQVRtRCx3Q0FBVSxHQUEwQjtRQUN4RixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDMUIsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDRDQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0Ysb0NBQUM7Q0FURCxBQVNDLElBQUE7U0FUWSw2QkFBNkIiLCJmaWxlIjoiYXBwbGljYXRpb24tZXJyb3Iucm91dGluZy5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=