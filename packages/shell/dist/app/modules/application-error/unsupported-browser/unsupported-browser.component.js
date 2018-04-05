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
var UnsupportedBrowserComponent = /** @class */ (function (_super) {
    __extends(UnsupportedBrowserComponent, _super);
    /**
     * Instantiate a new instance of the UnsupportedBrowserComponent
     * @param injector The angular injection service
     */
    function UnsupportedBrowserComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.bodyMessage = _this.strings.MsftSmeShell.App.Errors.UnsupportedBrowserBody.message.format(window.location.origin);
        return _this;
    }
    /**
     * Update the navigation title.
     *
     * @param appContextService the application context service.
     * @param snapshot the route snapshot.
     */
    UnsupportedBrowserComponent.navigationTitle = function (appContextService, snapshot) {
        return MsftSme.resourcesStrings().MsftSmeShell.App.Errors.UnsupportedBrowser.title;
    };
    /**
     * Gets the initial host classes to be applied to this element
     */
    UnsupportedBrowserComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-layout-absolute',
            'sme-position-center-h',
            'sme-position-center-h-inline',
            'sme-position-top-sm',
            'sme-documentation'
        ]);
    };
    UnsupportedBrowserComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-errors-unsupported-browser',
                    template: "\n      <h2>{{strings.MsftSmeShell.App.Errors.UnsupportedBrowserCommon.message}}</h2>\n      <p>{{bodyMessage}}</p>\n      <p>\n          <span>{{strings.MsftSmeShell.App.Errors.UnsupportedBrowserFootBegin.message}}</span>\n          <br/>\n          <a class=\"sme-link\" href=\"{{strings.MsftSmeShell.App.Overview.feedback.link.href}}\">{{strings.MsftSmeShell.App.Overview.feedback.link.text}}    </a>\n          <span>{{strings.MsftSmeShell.App.Errors.UnsupportedBrowserFootEnd.message}}</span>\n      </p>\n    "
                },] },
    ];
    /** @nocollapse */
    UnsupportedBrowserComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return UnsupportedBrowserComponent;
}(BaseComponent));
export { UnsupportedBrowserComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcGxpY2F0aW9uLWVycm9yL3Vuc3VwcG9ydGVkLWJyb3dzZXIvdW5zdXBwb3J0ZWQtYnJvd3Nlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsUUFBQSxFQUFTLE1BQU8sZUFBQSxDQUFnQjtBQUVwRCxPQUFPLEVBQXFCLGFBQUEsRUFBYyxNQUFPLHFCQUFBLENBQXNCO0FBSXZFO0lBQWlELCtDQUFzQjtJQWlCbkU7OztPQUdHO0lBQ0gscUNBQVksUUFBa0I7UUFBOUIsWUFDSSxrQkFBTSxRQUFRLENBQUMsU0FFbEI7UUFERyxLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUMxSCxDQUFDO0lBakJEOzs7OztPQUtHO0lBQ1csMkNBQWUsR0FBN0IsVUFBOEIsaUJBQW9DLEVBQUUsUUFBZ0M7UUFDaEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztJQUNoRyxDQUFDO0lBV0Q7O09BRUc7SUFDTywyREFBcUIsR0FBL0I7UUFDSSxNQUFNLENBQUMsaUJBQU0scUJBQXFCLFdBQUUsQ0FBQyxNQUFNLENBQUM7WUFDeEMscUJBQXFCO1lBQ3JCLHVCQUF1QjtZQUN2Qiw4QkFBOEI7WUFDOUIscUJBQXFCO1lBQ3JCLG1CQUFtQjtTQUN0QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUUsc0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsZ0NBQWdDO29CQUMxQyxRQUFRLEVBQUUscWdCQVNUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwwQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDRixrQ0FBQztDQTFERCxBQTBEQyxDQTFEZ0QsYUFBYSxHQTBEN0Q7U0ExRFksMkJBQTJCIiwiZmlsZSI6InVuc3VwcG9ydGVkLWJyb3dzZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==