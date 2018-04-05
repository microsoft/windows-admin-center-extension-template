import { Component } from '@angular/core';
var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-root',
                    template: "\n      <sme-styles class=\"sme-layout-absolute sme-position-inset-none sme-arrange-stack-v\" role=\"application\">\n          <sme-tooltip-host></sme-tooltip-host>\n          <sme-app-bar class=\"sme-position-flex-none\"></sme-app-bar>\n          <div class=\"sme-layout-relative sme-position-flex-auto\">\n              <div class=\"sme-layout-absolute sme-position-inset-none\">\n                  <sme-alert-bar></sme-alert-bar>\n                  <sme-notifications-dialog></sme-notifications-dialog>\n                  <sme-manage-as-dialog></sme-manage-as-dialog>\n                  <sme-about-dialog></sme-about-dialog>\n                  <sme-common-dialogs></sme-common-dialogs>\n                  <sme-add-connection-dialog></sme-add-connection-dialog>\n                  <sme-message-dialog id=\"message-dialog\"></sme-message-dialog>\n                  <sme-edit-tags-dialog></sme-edit-tags-dialog>\n              </div>\n              <div class=\"sme-layout-absolute sme-position-inset-none\">\n                  <router-outlet></router-outlet>\n              </div>\n          </div>\n          <sme-day-zero-dialog></sme-day-zero-dialog>\n      </sme-styles>\n    "
                },] },
    ];
    /** @nocollapse */
    AppComponent.ctorParameters = function () { return []; };
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBRzFDO0lBQUE7SUE4QkEsQ0FBQztJQTlCa0MsdUJBQVUsR0FBMEI7UUFDdkUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsVUFBVTtvQkFDcEIsUUFBUSxFQUFFLCtwQ0FxQlQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDJCQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0YsbUJBQUM7Q0E5QkQsQUE4QkMsSUFBQTtTQTlCWSxZQUFZIiwiZmlsZSI6ImFwcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9