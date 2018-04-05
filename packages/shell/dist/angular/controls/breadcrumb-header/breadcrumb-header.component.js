import { Component, Input } from '@angular/core';
var BreadcrumbHeaderComponent = /** @class */ (function () {
    function BreadcrumbHeaderComponent() {
        /**
         * List of items to be shown on the breadcrumb.
         */
        this.breadcrumbItems = [];
    }
    BreadcrumbHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-breadcrumb-header',
                    template: "\n      <div class=\"tool-header-box\">\n          <h3 class=\"sme-position-flex-none\">\n              <span *ngFor=\"let item of breadcrumbItems; let last = last\">\n                  <a tabindex=\"0\" *ngIf=\"item.clickable\" (click)=\"item.command($event)\" [class.sme-font-family-normal]=\"!item.bold\">{{item.label}}</a>\n                  <span *ngIf=\"!item.clickable\" [class.sme-font-family-normal]=\"!item.bold\">{{item.label}}</span>\n\n              <!-- separator -->\n              <span *ngIf=\"!last\" [ngSwitch]=breadcrumbSeparator class=\"sme-font-family-normal\">\n                      <span *ngSwitchCase=\"0\">&nbsp;\\&nbsp;</span>\n              <span *ngSwitchCase=\"1\">&nbsp;/&nbsp;</span>\n              <span *ngSwitchCase=\"2\" class=\"sme-icon sme-icon-chevronRight sme-icon-size-sm\"></span>\n              </span>\n              </span>\n          </h3>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    BreadcrumbHeaderComponent.ctorParameters = function () { return []; };
    BreadcrumbHeaderComponent.propDecorators = {
        'breadcrumbItems': [{ type: Input },],
        'breadcrumbSeparator': [{ type: Input },],
    };
    return BreadcrumbHeaderComponent;
}());
export { BreadcrumbHeaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYnJlYWRjcnVtYi1oZWFkZXIvYnJlYWRjcnVtYi1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsS0FBQSxFQUFNLE1BQU8sZUFBQSxDQUFnQjtBQUlqRDtJQUFBO1FBRUk7O1dBRUc7UUFDSyxvQkFBZSxHQUFxQixFQUFFLENBQUM7SUFtQ25ELENBQUM7SUE3Qk0sb0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxRQUFRLEVBQUUsNDRCQWdCVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsd0NBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDSyx3Q0FBYyxHQUEyQztRQUNoRSxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3JDLHFCQUFxQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7S0FDeEMsQ0FBQztJQUNGLGdDQUFDO0NBeENELEFBd0NDLElBQUE7U0F4Q1kseUJBQXlCIiwiZmlsZSI6ImJyZWFkY3J1bWItaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=