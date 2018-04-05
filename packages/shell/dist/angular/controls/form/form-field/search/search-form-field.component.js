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
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable search field implementation of .sme-searchbox
 */
var SearchFormFieldComponent = /** @class */ (function (_super) {
    __extends(SearchFormFieldComponent, _super);
    /**
     * Initializes a new instance of the SearchFormFieldComponent
     */
    function SearchFormFieldComponent(injector) {
        return _super.call(this, injector) || this;
    }
    SearchFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="search"]',
                    template: "\n      <div class=\"searchbox\" role=\"search\">\n          <input type=\"search\" [placeholder]=\"placeholder\" [autofocus]=\"true\" />\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    SearchFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return SearchFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { SearchFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3NlYXJjaC9zZWFyY2gtZm9ybS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQXdCLFFBQUEsRUFBd0IsTUFBTyxlQUFBLENBQWdCO0FBQ2hGLE9BQU8sRUFBRSw2QkFBQSxFQUE4QixNQUFPLHlCQUFBLENBQTBCO0FBRXhFOztHQUVHO0FBRUg7SUFBOEMsNENBQWtDO0lBRTVFOztPQUVHO0lBQ0gsa0NBQ0ksUUFBa0I7ZUFFbEIsa0JBQU0sUUFBUSxDQUFDO0lBQ25CLENBQUM7SUFDRSxtQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLFFBQVEsRUFBRSwrSkFJVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsdUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0YsK0JBQUM7Q0F4QkQsQUF3QkMsQ0F4QjZDLDZCQUE2QixHQXdCMUU7U0F4Qlksd0JBQXdCIiwiZmlsZSI6InNlYXJjaC1mb3JtLWZpZWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=