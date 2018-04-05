import { Component } from '@angular/core';
var DevGuideComponent = /** @class */ (function () {
    function DevGuideComponent() {
    }
    DevGuideComponent.navigationTitle = function (appContextService, snapshot) {
        return 'Dev Guide';
    };
    DevGuideComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-dev-guide',
                    template: "\n      <div class=\"sme-layout-absolute sme-position-inset-none sme-arrange-stack-v\">\n          <h1 class=\"sme-position-flex-none sme-padding-squish-v-md\">Development Guide</h1>\n          <sme-pivot class=\"sme-position-flex-auto\" headerClass=\"sme-padding-horizontal-md\">\n              <sme-pivot-tab label=\"Landing\" route=\"/dev/landing\"></sme-pivot-tab>\n              <sme-pivot-tab label=\"Controls\" route=\"/dev/controls\"></sme-pivot-tab>\n              <sme-pivot-tab label=\"Pipes\" route=\"/dev/pipes\"></sme-pivot-tab>\n              <sme-pivot-tab label=\"Styles\" route=\"/dev/styles\"></sme-pivot-tab>\n          </sme-pivot>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    DevGuideComponent.ctorParameters = function () { return []; };
    return DevGuideComponent;
}());
export { DevGuideComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9kZXYtZ3VpZGUvZGV2LWd1aWRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBQSxFQUE2QixNQUFPLGVBQUEsQ0FBZ0I7QUFLN0Q7SUFBQTtJQXVCQSxDQUFDO0lBdEJpQixpQ0FBZSxHQUE3QixVQUE4QixpQkFBb0MsRUFBRSxRQUFnQztRQUNoRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFDRSw0QkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsa3FCQVVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNGLHdCQUFDO0NBdkJELEFBdUJDLElBQUE7U0F2QlksaUJBQWlCIiwiZmlsZSI6ImRldi1ndWlkZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9