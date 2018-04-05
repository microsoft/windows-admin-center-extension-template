var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component, Injector } from '@angular/core';
import { BaseComponent } from '../../../angular';
import { ShellService } from '../../shell.service';
var ApplicationErrorComponent = /** @class */ (function (_super) {
    __extends(ApplicationErrorComponent, _super);
    /**
     * Instantiate a new instance of the UnsupportedBrowserComponent
     * @param injector The angular injection service
     */
    function ApplicationErrorComponent(injector) {
        var _this = _super.call(this, injector) || this;
        ShellService.setApplicationReady(true);
        return _this;
    }
    /**
     * Update the navigation title.
     *
     * @param appContextService the application context service.
     * @param snapshot the route snapshot.
     */
    ApplicationErrorComponent.navigationTitle = function (appContextService, snapshot) {
        return MsftSme.resourcesStrings().MsftSmeShell.App.Shell.applicationTitle;
    };
    /**
     * Gets the initial host classes to be applied to this element
     */
    ApplicationErrorComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-layout-absolute',
            'sme-position-inset-none'
        ]);
    };
    ApplicationErrorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-application-error',
                    template: '<router-outlet></router-outlet>'
                },] },
    ];
    /** @nocollapse */
    ApplicationErrorComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return ApplicationErrorComponent;
}(BaseComponent));
export { ApplicationErrorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcGxpY2F0aW9uLWVycm9yL2FwcGxpY2F0aW9uLWVycm9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxRQUFBLEVBQVMsTUFBTyxlQUFBLENBQWdCO0FBRXBELE9BQU8sRUFBcUIsYUFBQSxFQUFjLE1BQU8sa0JBQUEsQ0FBbUI7QUFFcEUsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLHFCQUFBLENBQXNCO0FBR25EO0lBQStDLDZDQUFzQjtJQVlqRTs7O09BR0c7SUFDSCxtQ0FBWSxRQUFrQjtRQUE5QixZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQUVsQjtRQURHLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFDM0MsQ0FBQztJQWpCRDs7Ozs7T0FLRztJQUNXLHlDQUFlLEdBQTdCLFVBQThCLGlCQUFvQyxFQUFFLFFBQWdDO1FBQ2hHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztJQUN2RixDQUFDO0lBV0Q7O09BRUc7SUFDTyx5REFBcUIsR0FBL0I7UUFDSSxNQUFNLENBQUMsaUJBQU0scUJBQXFCLFdBQUUsQ0FBQyxNQUFNLENBQUM7WUFDeEMscUJBQXFCO1lBQ3JCLHlCQUF5QjtTQUM1QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUUsb0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxRQUFRLEVBQUUsaUNBQWlDO2lCQUM5QyxFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsd0NBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0YsZ0NBQUM7Q0F6Q0QsQUF5Q0MsQ0F6QzhDLGFBQWEsR0F5QzNEO1NBekNZLHlCQUF5QiIsImZpbGUiOiJhcHBsaWNhdGlvbi1lcnJvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9