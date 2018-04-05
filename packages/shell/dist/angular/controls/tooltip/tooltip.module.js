import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmeTemplateOutletModule } from '../../directives/template-outlet';
import { TooltipHostComponent } from './tooltip-host.component';
import { TooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';
var TooltipModule = /** @class */ (function () {
    function TooltipModule() {
    }
    /**
     * Angular convention for singleton services.
     * @see https://angular.io/guide/singleton-services
     */
    TooltipModule.forRoot = function () {
        return {
            ngModule: TooltipModule,
            providers: [
                TooltipService
            ]
        };
    };
    TooltipModule.decorators = [
        { type: NgModule, args: [{
                    exports: [
                        TooltipDirective,
                        TooltipHostComponent
                    ],
                    declarations: [
                        TooltipDirective,
                        TooltipHostComponent
                    ],
                    imports: [
                        CommonModule,
                        SmeTemplateOutletModule
                    ]
                },] },
    ];
    /** @nocollapse */
    TooltipModule.ctorParameters = function () { return []; };
    return TooltipModule;
}());
export { TooltipModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvdG9vbHRpcC90b29sdGlwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUF1QixRQUFBLEVBQVMsTUFBTyxlQUFBLENBQWdCO0FBRTlELE9BQU8sRUFBRSx1QkFBQSxFQUF3QixNQUFPLGtDQUFBLENBQW1DO0FBQzNFLE9BQU8sRUFBRSxvQkFBQSxFQUFxQixNQUFPLDBCQUFBLENBQTJCO0FBQ2hFLE9BQU8sRUFBRSxnQkFBQSxFQUFpQixNQUFPLHFCQUFBLENBQXNCO0FBQ3ZELE9BQU8sRUFBRSxjQUFBLEVBQWUsTUFBTyxtQkFBQSxDQUFvQjtBQUduRDtJQUFBO0lBaUNBLENBQUM7SUEvQkc7OztPQUdHO0lBQ1cscUJBQU8sR0FBckI7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1AsY0FBYzthQUNqQjtTQUNKLENBQUM7SUFDTixDQUFDO0lBQ0Usd0JBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUNyQixPQUFPLEVBQUU7d0JBQ0wsZ0JBQWdCO3dCQUNoQixvQkFBb0I7cUJBQ3ZCO29CQUNELFlBQVksRUFBRTt3QkFDVixnQkFBZ0I7d0JBQ2hCLG9CQUFvQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osdUJBQXVCO3FCQUMxQjtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsNEJBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDRixvQkFBQztDQWpDRCxBQWlDQyxJQUFBO1NBakNZLGFBQWEiLCJmaWxlIjoidG9vbHRpcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9