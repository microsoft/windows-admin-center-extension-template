import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizerModule } from '../resizer';
import { SplitViewComponent, SplitViewContentComponent, SplitViewPaneComponent } from './split-view.component';
var SplitViewModule = /** @class */ (function () {
    function SplitViewModule() {
    }
    SplitViewModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        SplitViewComponent,
                        SplitViewContentComponent,
                        SplitViewPaneComponent
                    ],
                    exports: [
                        SplitViewComponent,
                        SplitViewContentComponent,
                        SplitViewPaneComponent
                    ],
                    imports: [
                        CommonModule,
                        ResizerModule
                    ]
                },] },
    ];
    /** @nocollapse */
    SplitViewModule.ctorParameters = function () { return []; };
    return SplitViewModule;
}());
export { SplitViewModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvc3BsaXQtdmlldy9zcGxpdC12aWV3Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8saUJBQUEsQ0FBa0I7QUFDL0MsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFFekMsT0FBTyxFQUFFLGFBQUEsRUFBYyxNQUFPLFlBQUEsQ0FBYTtBQUMzQyxPQUFPLEVBQUUsa0JBQUEsRUFBb0IseUJBQUEsRUFBMkIsc0JBQUEsRUFBdUIsTUFBTyx3QkFBQSxDQUF5QjtBQUcvRztJQUFBO0lBcUJBLENBQUM7SUFyQnFDLDBCQUFVLEdBQTBCO1FBQzFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDckIsWUFBWSxFQUFFO3dCQUNWLGtCQUFrQjt3QkFDbEIseUJBQXlCO3dCQUN6QixzQkFBc0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxrQkFBa0I7d0JBQ2xCLHlCQUF5Qjt3QkFDekIsc0JBQXNCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixhQUFhO3FCQUNoQjtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsOEJBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDRixzQkFBQztDQXJCRCxBQXFCQyxJQUFBO1NBckJZLGVBQWUiLCJmaWxlIjoic3BsaXQtdmlldy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9