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
import { Directive, HostBinding, Injector, Input } from '@angular/core';
import { BaseComponent } from '../../common/base.component';
/**
 * Directive for applying standard classes and attributes to fieldsets to automatically apply aria attributes when enabled/disabled.
 * TODO: there is an angular bug where fieldsets do not correctly replicate there disabeld state to child ngmodels.
 * See if there is a way we can fix it.
 */
var FieldsetDirective = /** @class */ (function (_super) {
    __extends(FieldsetDirective, _super);
    /**
     * Constructs a new instance of @see FieldsetDirective
     * @param injector the angular injection service for the base classes @SmeInjectable Annotation.
     */
    function FieldsetDirective(injector) {
        return _super.call(this, injector) || this;
    }
    Object.defineProperty(FieldsetDirective.prototype, "disabled", {
        /**
         * Indicates that this fieldset is disabled
         */
        get: function () {
            return this.internalDisabled;
        },
        set: function (value) {
            // translate false to 'null'. Why: attr bindings will remove the attribute if it returns null, but false will result in 
            // [disabled="false"] in the case of disabled attr, we actually do want to remove them.
            // see thread: https://github.com/angular/angular/issues/2869
            this.internalDisabled = value || null;
        },
        enumerable: true,
        configurable: true
    });
    FieldsetDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector > Reason: This is a directive for all fieldsets.
                    selector: 'fieldset'
                },] },
    ];
    /** @nocollapse */
    FieldsetDirective.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    FieldsetDirective.propDecorators = {
        'disabled': [{ type: Input }, { type: HostBinding, args: ['class.sme-disabled',] }, { type: HostBinding, args: ['attr.disabled',] }, { type: HostBinding, args: ['attr.aria-disabled',] },],
    };
    return FieldsetDirective;
}(BaseComponent));
export { FieldsetDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9maWVsZHNldC9maWVsZHNldC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsV0FBVyxFQUFVLFFBQUEsRUFBVSxLQUFBLEVBQ2xDLE1BQU0sZUFBQSxDQUFnQjtBQUl2QixPQUFPLEVBQUUsYUFBQSxFQUFjLE1BQU8sNkJBQUEsQ0FBOEI7QUFFNUQ7Ozs7R0FJRztBQUVIO0lBQXVDLHFDQUFzQjtJQXdCekQ7OztPQUdHO0lBQ0gsMkJBQVksUUFBa0I7ZUFDMUIsa0JBQU0sUUFBUSxDQUFDO0lBQ25CLENBQUM7SUFyQkQsc0JBQVcsdUNBQVE7UUFQbkI7O1dBRUc7YUFLSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDakMsQ0FBQzthQUNELFVBQW9CLEtBQWM7WUFDOUIsd0hBQXdIO1lBQ3hILHVGQUF1RjtZQUN2Riw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssSUFBSSxJQUFJLENBQUM7UUFDMUMsQ0FBQzs7O09BTkE7SUFvQkUsNEJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QiwrRkFBK0Y7b0JBQy9GLFFBQVEsRUFBRSxVQUFVO2lCQUN2QixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsZ0NBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0ssZ0NBQWMsR0FBMkM7UUFDaEUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLG9CQUFvQixFQUFHLEVBQUUsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBZSxFQUFHLEVBQUUsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsb0JBQW9CLEVBQUcsRUFBRSxFQUFFO0tBQzFMLENBQUM7SUFDRix3QkFBQztDQTVDRCxBQTRDQyxDQTVDc0MsYUFBYSxHQTRDbkQ7U0E1Q1ksaUJBQWlCIiwiZmlsZSI6ImZpZWxkc2V0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=