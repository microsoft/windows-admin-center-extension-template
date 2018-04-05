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
import { BaseComponent } from '../../../../angular';
var GenericErrorComponent = /** @class */ (function (_super) {
    __extends(GenericErrorComponent, _super);
    /**
     * Instantiate a new instance of the UnsupportedBrowserComponent
     * @param injector The angular injection service
     */
    function GenericErrorComponent(injector) {
        return _super.call(this, injector) || this;
    }
    /**
     * Update the navigation title.
     *
     * @param appContextService the application context service.
     * @param snapshot the route snapshot.
     */
    GenericErrorComponent.navigationTitle = function (appContextService, snapshot) {
        return MsftSme.resourcesStrings().MsftSmeShell.App.Errors.GenericError.navigationTitle;
    };
    /**
     * Refreshes the application to a clean state
     */
    GenericErrorComponent.prototype.refresh = function () {
        // clear storage just in case some bad state occurred
        sessionStorage.clear();
        localStorage.clear();
        // go back to the main page
        window.location.href = window.location.origin;
    };
    /**
     * Gets the initial host classes to be applied to this element
     */
    GenericErrorComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-layout-absolute',
            'sme-position-center-h',
            'sme-position-top-sm',
            'sme-documentation'
        ]);
    };
    GenericErrorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-errors-generic',
                    template: "\n      <h1>{{strings.MsftSmeShell.App.Errors.GenericError.title}}</h1>\n      <p>{{strings.MsftSmeShell.App.Errors.GenericError.message}}</p>\n      <section class=\"sme-arrange-stack-v\">\n          <!-- Refresh Button -->\n          <a class=\"sme-button sme-button-trigger sme-button-align-left\" role=\"button\" tabindex=\"0\" (click)=\"refresh()\">{{strings.MsftSmeShell.App.Errors.GenericError.refreshText}}</a>\n          <!-- Feedback Link -->\n          <a class=\"sme-button sme-button-trigger sme-button-align-left\" [href]=\"strings.MsftSmeShell.App.Overview.feedback.link.href\" target=\"_blank\">\n              <span>{{strings.MsftSmeShell.App.Overview.feedback.link.text}}</span>\n              <span class=\"sme-icon sme-icon-openInNewWindow\"></span>\n          </a>\n\n      </section>\n      <!-- TODO: Instead of asking the user to give us the console information, print it here for them. -->\n      <p class=\"sme-margin-top-sm sme-font-label\">{{strings.MsftSmeShell.App.Errors.GenericError.feedbackInstructions}}</p>\n    "
                },] },
    ];
    /** @nocollapse */
    GenericErrorComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return GenericErrorComponent;
}(BaseComponent));
export { GenericErrorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcGxpY2F0aW9uLWVycm9yL2dlbmVyaWMtZXJyb3IvZ2VuZXJpYy1lcnJvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsUUFBQSxFQUFTLE1BQU8sZUFBQSxDQUFnQjtBQUVwRCxPQUFPLEVBQXFCLGFBQUEsRUFBYyxNQUFPLHFCQUFBLENBQXNCO0FBS3ZFO0lBQTJDLHlDQUFzQjtJQVk3RDs7O09BR0c7SUFDSCwrQkFBWSxRQUFrQjtlQUMxQixrQkFBTSxRQUFRLENBQUM7SUFDbkIsQ0FBQztJQWhCRDs7Ozs7T0FLRztJQUNXLHFDQUFlLEdBQTdCLFVBQThCLGlCQUFvQyxFQUFFLFFBQWdDO1FBQ2hHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFBO0lBQ25HLENBQUM7SUFVRDs7T0FFRztJQUNJLHVDQUFPLEdBQWQ7UUFDSSxxREFBcUQ7UUFDckQsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVyQiwyQkFBMkI7UUFDM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUE7SUFDakQsQ0FBQztJQUVEOztPQUVHO0lBQ08scURBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLHFCQUFxQjtZQUNyQix1QkFBdUI7WUFDdkIscUJBQXFCO1lBQ3JCLG1CQUFtQjtTQUN0QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUUsZ0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUseWhDQWVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxvQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDRiw0QkFBQztDQXJFRCxBQXFFQyxDQXJFMEMsYUFBYSxHQXFFdkQ7U0FyRVkscUJBQXFCIiwiZmlsZSI6ImdlbmVyaWMtZXJyb3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==