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
import { Component, Injector, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable range field implementation as a slider
 */
var SliderFormFieldComponent = /** @class */ (function (_super) {
    __extends(SliderFormFieldComponent, _super);
    /**
     * Initializes a new instance of the SliderFormFieldComponent
     */
    function SliderFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.step = 1;
        _this.min = 0;
        _this.max = 100;
        return _this;
    }
    Object.defineProperty(SliderFormFieldComponent.prototype, "defaultImmediateValidation", {
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
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    SliderFormFieldComponent.prototype.createIdBag = function () {
        return {
            detailsSpan: ''
        };
    };
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    SliderFormFieldComponent.prototype.validate = function (c) {
        // shouldent be possible by the user, but it could be a problem for 
        // angulars min and max validator only work via code. So we implement them here.
        if (!MsftSme.isNullOrUndefined(this.min) && this.value < this.min) {
            var errors = Validators.min(this.min)(c);
            if (errors) {
                return errors;
            }
        }
        if (!MsftSme.isNullOrUndefined(this.max) && this.value > this.max) {
            var errors = Validators.max(this.max)(c);
            if (errors) {
                return errors;
            }
        }
        return _super.prototype.validate.call(this, c);
    };
    SliderFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="slider"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <div class=\"sme-slider\">\n          <input type=\"range\" [attr.aria-label]=\"label\" [attr.aria-describedby]=\"idBag.detailsSpan\" [title]=\"value\" [disabled]=\"disabled\" [(ngModel)]=\"value\" [attr.aria-valuenow]=\"value\" [max]=\"max\" [attr.aria-valuemax]=\"max\" [min]=\"min\" [attr.aria-valuemin]=\"min\"\n              [step]=\"step\">\n      </div>\n      <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    SliderFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    SliderFormFieldComponent.propDecorators = {
        'step': [{ type: Input },],
        'min': [{ type: Input },],
        'max': [{ type: Input },],
    };
    return SliderFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { SliderFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3NsaWRlci9zbGlkZXItZm9ybS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQXdCLFFBQUEsRUFBVSxLQUFBLEVBQWMsTUFBTyxlQUFBLENBQWdCO0FBQ2hGLE9BQU8sRUFBZSxVQUFBLEVBQVcsTUFBTyxnQkFBQSxDQUFpQjtBQUN6RCxPQUFPLEVBQUUsNkJBQUEsRUFBOEIsTUFBTyx5QkFBQSxDQUEwQjtBQUV4RTs7R0FFRztBQUVIO0lBQThDLDRDQUFxQztJQTRCL0U7O09BRUc7SUFDSCxrQ0FDSSxRQUFrQjtRQUR0QixZQUdJLGtCQUFNLFFBQVEsQ0FBQyxTQUlsQjtRQUhHLEtBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsS0FBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDYixLQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7SUFDbkIsQ0FBQztJQWhDRCxzQkFBYyxnRUFBMEI7UUFKeEM7OztXQUdHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBZ0NEOzs7T0FHRztJQUNPLDhDQUFXLEdBQXJCO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsV0FBVyxFQUFFLEVBQUU7U0FDbEIsQ0FBQTtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDTywyQ0FBUSxHQUFsQixVQUFtQixDQUFjO1FBQzdCLG9FQUFvRTtRQUNwRSxnRkFBZ0Y7UUFDaEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsTUFBTSxDQUFDLGlCQUFNLFFBQVEsWUFBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0UsbUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsK0JBQStCO29CQUN6QyxRQUFRLEVBQUUsc3pCQVdUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx1Q0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO0tBQ2pCLEVBRjZGLENBRTdGLENBQUM7SUFDSyx1Q0FBYyxHQUEyQztRQUNoRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMxQixLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN6QixLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUN4QixDQUFDO0lBQ0YsK0JBQUM7Q0EvRkQsQUErRkMsQ0EvRjZDLDZCQUE2QixHQStGMUU7U0EvRlksd0JBQXdCIiwiZmlsZSI6InNsaWRlci1mb3JtLWZpZWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=