import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '../../../angular';
import { ApplicationErrorComponent } from './application-error.component';
import { ApplicationErrorRoutingModule } from './application-error.routing';
import { ForbiddenErrorComponent } from './forbidden-error/forbidden-error.component';
import { GenericErrorComponent } from './generic-error/generic-error.component';
import { UnsupportedBrowserComponent } from './unsupported-browser/unsupported-browser.component';
var ApplicationErrorModule = /** @class */ (function () {
    function ApplicationErrorModule() {
    }
    ApplicationErrorModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ApplicationErrorComponent,
                        ForbiddenErrorComponent,
                        GenericErrorComponent,
                        UnsupportedBrowserComponent
                    ],
                    imports: [
                        CommonModule,
                        PipesModule,
                        ApplicationErrorRoutingModule
                    ]
                },] },
    ];
    /** @nocollapse */
    ApplicationErrorModule.ctorParameters = function () { return []; };
    return ApplicationErrorModule;
}());
export { ApplicationErrorModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcGxpY2F0aW9uLWVycm9yL2FwcGxpY2F0aW9uLWVycm9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFDekMsT0FBTyxFQUFFLFdBQUEsRUFBWSxNQUFPLGtCQUFBLENBQW1CO0FBQy9DLE9BQU8sRUFBRSx5QkFBQSxFQUEwQixNQUFPLCtCQUFBLENBQWdDO0FBQzFFLE9BQU8sRUFBRSw2QkFBQSxFQUE4QixNQUFPLDZCQUFBLENBQThCO0FBQzVFLE9BQU8sRUFBRSx1QkFBQSxFQUF3QixNQUFPLDZDQUFBLENBQThDO0FBQ3RGLE9BQU8sRUFBRSxxQkFBQSxFQUFzQixNQUFPLHlDQUFBLENBQTBDO0FBQ2hGLE9BQU8sRUFBRSwyQkFBQSxFQUE0QixNQUFPLHFEQUFBLENBQXNEO0FBR2xHO0lBQUE7SUFtQkEsQ0FBQztJQWxCTSxpQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3JCLFlBQVksRUFBRTt3QkFDVix5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIscUJBQXFCO3dCQUNyQiwyQkFBMkI7cUJBQzlCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsNkJBQTZCO3FCQUNoQztpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gscUNBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDRiw2QkFBQztDQW5CRCxBQW1CQyxJQUFBO1NBbkJZLHNCQUFzQiIsImZpbGUiOiJhcHBsaWNhdGlvbi1lcnJvci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9