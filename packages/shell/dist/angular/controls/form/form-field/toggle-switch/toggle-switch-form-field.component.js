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
import { Component, HostBinding, Injector, Input } from '@angular/core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
var ToggleSwitchFormFieldComponent = /** @class */ (function (_super) {
    __extends(ToggleSwitchFormFieldComponent, _super);
    /**
     * Initializes a new instance of the ToggleSwitchFormFieldComponent
     */
    function ToggleSwitchFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.labelOn = _this.strings.MsftSmeShell.Angular.Common.on;
        _this.labelOff = _this.strings.MsftSmeShell.Angular.Common.off;
        return _this;
    }
    Object.defineProperty(ToggleSwitchFormFieldComponent.prototype, "defaultImmediateValidation", {
        /**
         * Indicates the default value for immediateValidation.
         * This is meant to be overridden by derived classes
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToggleSwitchFormFieldComponent.prototype, "ariaLabel", {
        /**
         * The aria label for this instance
         */
        get: function () {
            return this.getMergedDescriptionLabel();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnInit interface
     */
    ToggleSwitchFormFieldComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setAttribute('role', 'group');
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    ToggleSwitchFormFieldComponent.prototype.createIdBag = function () {
        return {
            stateLabelSpan: '',
            detailsSpan: ''
        };
    };
    ToggleSwitchFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="toggle-switch"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" \n              *ngIf=\"details\" \n              [title]=\"details\">\n          </span>\n      </label>\n      <div class=\"sme-toggle-switch\">\n          <label class=\"sme-arrange-stack-h\">\n              <input type=\"checkbox\" \n                  [attr.aria-labeledby]=\"idBag.stateLabelSpan\" \n                  [attr.aria-describedby]=\"idBag.detailsSpan\" \n                  [attr.aria-checked]=\"value\" \n                  [disabled]=\"disabled\" \n                  [(ngModel)]=\"value\">\n              <span class=\"sme-position-flex-auto\" [id]=\"idBag.stateLabelSpan\">{{value ? labelOn : labelOff}}</span>\n          </label>\n          <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      </div>\n\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    ToggleSwitchFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    ToggleSwitchFormFieldComponent.propDecorators = {
        'labelOn': [{ type: Input },],
        'labelOff': [{ type: Input },],
        'ariaLabel': [{ type: HostBinding, args: ['attr.aria-label',] },],
    };
    return ToggleSwitchFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { ToggleSwitchFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3RvZ2dsZS1zd2l0Y2gvdG9nZ2xlLXN3aXRjaC1mb3JtLWZpZWxkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxXQUFBLEVBQWEsUUFBQSxFQUFVLEtBQUEsRUFBYyxNQUFPLGVBQUEsQ0FBZ0I7QUFDaEYsT0FBTyxFQUFFLDZCQUFBLEVBQThCLE1BQU8seUJBQUEsQ0FBMEI7QUFHeEU7SUFBb0Qsa0RBQXNDO0lBOEJ0Rjs7T0FFRztJQUNILHdDQUNJLFFBQWtCO1FBRHRCLFlBR0ksa0JBQU0sUUFBUSxDQUFDLFNBR2xCO1FBRkcsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQTtRQUMxRCxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztJQUNqRSxDQUFDO0lBakNELHNCQUFjLHNFQUEwQjtRQUp4Qzs7O1dBR0c7YUFDSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFrQkQsc0JBQVcscURBQVM7UUFKcEI7O1dBRUc7YUFFSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUM1QyxDQUFDOzs7T0FBQTtJQWFEOztPQUVHO0lBQ0ksaURBQVEsR0FBZjtRQUNJLGlCQUFNLFFBQVEsV0FBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7O09BR0c7SUFDTyxvREFBVyxHQUFyQjtRQUNJLE1BQU0sQ0FBQztZQUNILGNBQWMsRUFBRSxFQUFFO1lBQ2xCLFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7SUFDTCxDQUFDO0lBQ0UseUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsc0NBQXNDO29CQUNoRCxRQUFRLEVBQUUsbWlDQXNCVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsNkNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0ssNkNBQWMsR0FBMkM7UUFDaEUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDN0IsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDOUIsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLGlCQUFpQixFQUFHLEVBQUUsRUFBRTtLQUNqRSxDQUFDO0lBQ0YscUNBQUM7Q0FoR0QsQUFnR0MsQ0FoR21ELDZCQUE2QixHQWdHaEY7U0FoR1ksOEJBQThCIiwiZmlsZSI6InRvZ2dsZS1zd2l0Y2gtZm9ybS1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9