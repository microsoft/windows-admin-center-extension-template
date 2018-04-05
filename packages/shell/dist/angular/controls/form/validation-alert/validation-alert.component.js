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
import { Component, HostBinding, Input } from '@angular/core';
import { BaseComponent } from '../../common/base.component';
import { ValidationAlertSeverity } from './validation-alert';
/**
 * Component for displaying a form validation alert.
 * Alerts are not nessecarily errors, they can display other types of
 * information that the user should know about a value they entered into a form field
 */
var ValidationAlertComponent = /** @class */ (function (_super) {
    __extends(ValidationAlertComponent, _super);
    function ValidationAlertComponent() {
        /**
         * Optionally show background color for the alert.
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.showBackground = false;
        return _this;
    }
    Object.defineProperty(ValidationAlertComponent.prototype, "hasAlert", {
        /**
         * Indicates that there is an alert to display
         */
        get: function () {
            return !MsftSme.isNullOrUndefined(this.alert);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "valid", {
        /**
         * Indicates that the current alert is valid
         */
        get: function () {
            return this.hasAlert && this.alert.valid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "message", {
        /**
         * Indicates that the current alert is valid
         */
        get: function () {
            return this.hasAlert ? this.alert.message : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "hasSeverity", {
        /**
         * Indicates that the current alert has a severity defined
         */
        get: function () {
            return this.hasAlert && !MsftSme.isNullOrUndefined(ValidationAlertSeverity[this.alert.severity]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "isError", {
        /**
         * Indicates that the current alert is an error alert
         * Errors are always invalid with either no severity or error severity
         */
        get: function () {
            return this.hasAlert && !this.valid && (!this.hasSeverity || this.alert.severity === ValidationAlertSeverity.Error);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "isWarning", {
        /**
         * Indicates that the current alert is an warning alert
         * Warnings may be valid or invalid (usually valid) with warning severity
         */
        get: function () {
            return this.hasAlert && this.alert.severity === ValidationAlertSeverity.Warning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "isInformational", {
        /**
         * Indicates that the current alert is an informational alert
         * Informational alerts may be valid or invalid (usually valid) with informational severity
         */
        get: function () {
            return this.hasAlert && this.alert.severity === ValidationAlertSeverity.Informational;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "isSuccess", {
        /**
         * Indicates that the current alert is an success alert
         * Success alerts are always valid with no severity severity
         */
        get: function () {
            return this.valid && !this.hasSeverity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAlertComponent.prototype, "alertType", {
        /**
         * Indicates that the current alert is an success alert
         */
        get: function () {
            var alertTypes = this.strings.MsftSmeShell.Angular.Common.Form.Validation.AlertTypes;
            if (this.isSuccess) {
                return alertTypes.success;
            }
            else if (this.isWarning) {
                return alertTypes.warn;
            }
            else if (this.isInformational) {
                return alertTypes.info;
            }
            else if (this.isError) {
                return alertTypes.error;
            }
            else {
                return '';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnInit interface
     */
    ValidationAlertComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setAttribute('role', 'alert');
        this.setAttribute('aria-live', 'assertive');
    };
    /**
     * Gets the initial host classes to be applied to this element
     * When called in the @see BaseComponent super class initialization, These classes will be automatically assigned to the host element.
     */
    ValidationAlertComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-alert',
            'sme-icon',
            'sme-icon-size-sm'
        ]);
    };
    ValidationAlertComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-validation-alert, sme-alert',
                    template: '<span class="sme-screen-reader">{{alertType}}</span><span>{{message}}</span>'
                },] },
    ];
    /** @nocollapse */
    ValidationAlertComponent.ctorParameters = function () { return []; };
    ValidationAlertComponent.propDecorators = {
        'showBackground': [{ type: HostBinding, args: ['class.sme-alert-background',] }, { type: Input },],
        'alert': [{ type: Input },],
        'isError': [{ type: HostBinding, args: ['class.sme-alert-error',] }, { type: HostBinding, args: ['class.sme-icon-error',] },],
        'isWarning': [{ type: HostBinding, args: ['class.sme-alert-warning',] }, { type: HostBinding, args: ['class.sme-icon-warning',] },],
        'isInformational': [{ type: HostBinding, args: ['class.sme-alert-informational',] }, { type: HostBinding, args: ['class.sme-icon-info',] },],
        'isSuccess': [{ type: HostBinding, args: ['class.sme-alert-success',] }, { type: HostBinding, args: ['class.sme-icon-accept',] },],
    };
    return ValidationAlertComponent;
}(BaseComponent));
export { ValidationAlertComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS92YWxpZGF0aW9uLWFsZXJ0L3ZhbGlkYXRpb24tYWxlcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLFdBQUEsRUFBdUIsS0FBQSxFQUFjLE1BQU8sZUFBQSxDQUFnQjtBQUVoRixPQUFPLEVBQUUsYUFBQSxFQUFjLE1BQU8sNkJBQUEsQ0FBOEI7QUFDNUQsT0FBTyxFQUFxQyx1QkFBQSxFQUEwQyxNQUFPLG9CQUFBLENBQXFCO0FBRWxIOzs7O0dBSUc7QUFFSDtJQUE4Qyw0Q0FBc0I7SUFBcEU7UUFDSTs7V0FFRztRQUhQLHFFQTBJQztRQXBJVSxvQkFBYyxHQUFHLEtBQUssQ0FBQzs7SUFvSWxDLENBQUM7SUF6SEcsc0JBQVcsOENBQVE7UUFIbkI7O1dBRUc7YUFDSDtZQUNJLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEQsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVywyQ0FBSztRQUhoQjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDN0MsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyw2Q0FBTztRQUhsQjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkQsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxpREFBVztRQUh0Qjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLENBQUM7OztPQUFBO0lBUUQsc0JBQVcsNkNBQU87UUFObEI7OztXQUdHO2FBR0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEgsQ0FBQzs7O09BQUE7SUFRRCxzQkFBVywrQ0FBUztRQU5wQjs7O1dBR0c7YUFHSDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztRQUNwRixDQUFDOzs7T0FBQTtJQVFELHNCQUFXLHFEQUFlO1FBTjFCOzs7V0FHRzthQUdIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssdUJBQXVCLENBQUMsYUFBYSxDQUFDO1FBQzFGLENBQUM7OztPQUFBO0lBUUQsc0JBQVcsK0NBQVM7UUFOcEI7OztXQUdHO2FBR0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDM0MsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVywrQ0FBUztRQUhwQjs7V0FFRzthQUNIO1lBQ0ksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUNyRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDNUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDZCxDQUFDO1FBQ0wsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNJLDJDQUFRLEdBQWY7UUFDSSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sd0RBQXFCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLGlCQUFNLHFCQUFxQixXQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hDLFdBQVc7WUFDWCxVQUFVO1lBQ1Ysa0JBQWtCO1NBQ3JCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRSxtQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxpQ0FBaUM7b0JBQzNDLFFBQVEsRUFBRSw4RUFBOEU7aUJBQzNGLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx1Q0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLHVDQUFjLEdBQTJDO1FBQ2hFLGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLDRCQUE0QixFQUFHLEVBQUUsRUFBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNsRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMzQixTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsdUJBQXVCLEVBQUcsRUFBRSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRyxFQUFFLEVBQUU7UUFDOUgsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLHlCQUF5QixFQUFHLEVBQUUsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsd0JBQXdCLEVBQUcsRUFBRSxFQUFFO1FBQ3BJLGlCQUFpQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLCtCQUErQixFQUFHLEVBQUUsRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUcsRUFBRSxFQUFFO1FBQzdJLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRyxFQUFFLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLHVCQUF1QixFQUFHLEVBQUUsRUFBRTtLQUNsSSxDQUFDO0lBQ0YsK0JBQUM7Q0ExSUQsQUEwSUMsQ0ExSTZDLGFBQWEsR0EwSTFEO1NBMUlZLHdCQUF3QiIsImZpbGUiOiJ2YWxpZGF0aW9uLWFsZXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=