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
var ForbiddenErrorComponent = /** @class */ (function (_super) {
    __extends(ForbiddenErrorComponent, _super);
    /**
     * Instantiate a new instance of the ForbiddenErrorComponent
     * @param injector The angular injection service
     */
    function ForbiddenErrorComponent(injector) {
        return _super.call(this, injector) || this;
    }
    /**
     * Update the navigation title.
     *
     * @param appContextService the application context service.
     * @param snapshot the route snapshot.
     */
    ForbiddenErrorComponent.navigationTitle = function (appContextService, snapshot) {
        return MsftSme.resourcesStrings().MsftSmeShell.App.Errors.ForbiddenError.navigationTitle;
    };
    /**
     * Gets the initial host classes to be applied to this element
     */
    ForbiddenErrorComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-layout-absolute',
            'sme-position-center-h',
            'sme-position-top-sm',
            'sme-documentation'
        ]);
    };
    ForbiddenErrorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-errors-forbidden',
                    template: "\n      <h1>{{strings.MsftSmeShell.App.Errors.ForbiddenError.title}}</h1>\n      <p>{{strings.MsftSmeShell.App.Errors.ForbiddenError.message}}</p>\n      <!-- TODO: Give the user specific instructions based on the reason we got a 403. (if its aad give them a link to sign in again, if its windows auth, ask them to talk to their admin, etc...) -->\n\n      <!-- Feedback Link -->\n      <a class=\"sme-button sme-button-trigger sme-button-align-left\" [href]=\"strings.MsftSmeShell.App.Overview.feedback.link.href\" target=\"_blank\">\n          <span>{{strings.MsftSmeShell.App.Overview.feedback.link.text}}</span>\n          <span class=\"sme-icon sme-icon-openInNewWindow\"></span>\n      </a>\n    "
                },] },
    ];
    /** @nocollapse */
    ForbiddenErrorComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return ForbiddenErrorComponent;
}(BaseComponent));
export { ForbiddenErrorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcGxpY2F0aW9uLWVycm9yL2ZvcmJpZGRlbi1lcnJvci9mb3JiaWRkZW4tZXJyb3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFFBQUEsRUFBUyxNQUFPLGVBQUEsQ0FBZ0I7QUFFcEQsT0FBTyxFQUFxQixhQUFBLEVBQWMsTUFBTyxxQkFBQSxDQUFzQjtBQUt2RTtJQUE2QywyQ0FBc0I7SUFZL0Q7OztPQUdHO0lBQ0gsaUNBQVksUUFBa0I7ZUFDMUIsa0JBQU0sUUFBUSxDQUFDO0lBQ25CLENBQUM7SUFoQkQ7Ozs7O09BS0c7SUFDVyx1Q0FBZSxHQUE3QixVQUE4QixpQkFBb0MsRUFBRSxRQUFnQztRQUNoRyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQTtJQUNyRyxDQUFDO0lBVUQ7O09BRUc7SUFDTyx1REFBcUIsR0FBL0I7UUFDSSxNQUFNLENBQUMsaUJBQU0scUJBQXFCLFdBQUUsQ0FBQyxNQUFNLENBQUM7WUFDeEMscUJBQXFCO1lBQ3JCLHVCQUF1QjtZQUN2QixxQkFBcUI7WUFDckIsbUJBQW1CO1NBQ3RCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRSxrQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSxnc0JBVVQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHNDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxRQUFRLEdBQUc7S0FDakIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNGLDhCQUFDO0NBcERELEFBb0RDLENBcEQ0QyxhQUFhLEdBb0R6RDtTQXBEWSx1QkFBdUIiLCJmaWxlIjoiZm9yYmlkZGVuLWVycm9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=