import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthorizationManager } from '../../../core';
import { AppContextService } from '../../service';
import { ValidationAlertSeverity } from '../form';
/**
 * Credentials Form Component:
 *
 * TODO:
 * 1. Convert to using angular form controls
 * 2. Convert to be a form control
 * 3. The authentication flow is expected to change drastically between now and GA.
 *    It doesn't make sense to put much effort into this control at this time
 */
var NodeCredentialsFormComponent = /** @class */ (function () {
    /**
     * Initializes a new instance of the NodeCredentialsForm class.
     */
    function NodeCredentialsFormComponent(appContextService) {
        this.appContextService = appContextService;
        this.strings = MsftSme.resourcesStrings();
        this.hasPerNodeCredentials = false;
        /**
         * Model to hold internal form field values;
         */
        this.model = {
            username: '',
            password: '',
            applyToAll: false,
            useLaps: false,
            lapsLocalAdminName: '',
            useGlobalAuth: false
        };
        this.credentialsChanged = new EventEmitter();
        this.showApplyToAll = true;
        this.isServiceMode = false;
    }
    Object.defineProperty(NodeCredentialsFormComponent.prototype, "username", {
        get: function () {
            return this.model.username;
        },
        /**
         * Gets or sets the Username
         */
        set: function (value) {
            this.model.username = value;
            this.updateAuthorizationCredentials();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeCredentialsFormComponent.prototype, "password", {
        get: function () {
            return this.model.password;
        },
        /**
         * Gets or sets the password
         */
        set: function (value) {
            this.model.password = value;
            this.updateAuthorizationCredentials();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeCredentialsFormComponent.prototype, "applyToAll", {
        get: function () {
            return this.model.applyToAll;
        },
        /**
         * Gets or sets a value indicating if these settings should be applied to all nodes
         */
        set: function (value) {
            this.model.applyToAll = value;
            this.updateAuthorizationCredentials();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeCredentialsFormComponent.prototype, "useLaps", {
        get: function () {
            return this.model.useLaps;
        },
        /**
         * Gets or sets a value indicating if LAPS should be used
         */
        set: function (value) {
            this.model.useLaps = value;
            this.updateAuthorizationCredentials();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeCredentialsFormComponent.prototype, "lapsLocalAdminName", {
        get: function () {
            return this.model.lapsLocalAdminName;
        },
        /**
         * Gets or sets the laps Local Admin Name
         */
        set: function (value) {
            this.model.lapsLocalAdminName = value;
            this.updateAuthorizationCredentials();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeCredentialsFormComponent.prototype, "useGlobalAuth", {
        get: function () {
            return this.model.useGlobalAuth;
        },
        /**
         * Gets or sets a value indicating if global auth should be used
         */
        set: function (value) {
            this.model.useGlobalAuth = value;
            this.updateAuthorizationCredentials();
        },
        enumerable: true,
        configurable: true
    });
    NodeCredentialsFormComponent.prototype.reset = function (nodeName) {
        // TODO: handle no nodeNames provided
        this.applyToAll = false;
        this.password = null;
        this.username = null;
        this.useLaps = false;
        this.lapsLocalAdminName = AuthorizationManager.defaultLapsLocalAdminName; // Show default value, users can change.
        this.useGlobalAuth = true;
        this.hasPerNodeCredentials = Object.keys(this.appContextService.authorizationManager.nodeTokens).length > 0;
        var nodeToken = this.appContextService.authorizationManager.nodeTokens[nodeName];
        var globalToken = this.appContextService.authorizationManager.manageAsToken;
        if (nodeToken) {
            this.useGlobalAuth = false;
            this.username = nodeToken.username;
        }
        if (globalToken) {
            this.globalUsername = globalToken.username;
        }
    };
    NodeCredentialsFormComponent.prototype.updateAuthorizationCredentials = function () {
        var authCreds = {
            username: this.username,
            password: this.password,
            applyToAllNodes: this.applyToAll,
            useLaps: false,
            lapsLocalAdminName: this.lapsLocalAdminName
        };
        if (this.useGlobalAuth) {
            authCreds.username = null;
            authCreds.password = null;
            authCreds.applyToAllNodes = false;
            authCreds.useLaps = this.useLaps;
            authCreds.lapsLocalAdminName = this.lapsLocalAdminName;
        }
        this.credentialsChanged.next(authCreds);
    };
    /**
     * Validate the auth type field
     * @param event the validation event
     */
    NodeCredentialsFormComponent.prototype.validateAuthType = function (event) {
        var alerts = {};
        if (!this.useGlobalAuth) {
            alerts['useGlobalAuth'] = {
                valid: true,
                message: this.strings.MsftSmeShell.Angular.NodeCredentialsForm.UseGlobalAuth.warning,
                severity: ValidationAlertSeverity.Warning
            };
        }
        else if (this.isServiceMode) {
            alerts['serviceMode'] = {
                valid: true,
                message: this.strings.MsftSmeShell.Angular.NodeCredentialsForm.deploymentGuideMessage,
                severity: ValidationAlertSeverity.Warning
            };
        }
        MsftSme.deepAssign(event.alerts, alerts);
    };
    /**
     * Validate the apply to all field
     * @param event the validation event
     */
    NodeCredentialsFormComponent.prototype.validateApplyToAll = function (event) {
        var alerts = {};
        if (!this.useGlobalAuth && this.hasPerNodeCredentials && this.applyToAll) {
            alerts['hasPerNodeCredentials'] = {
                valid: true,
                message: this.strings.MsftSmeShell.Angular.NodeCredentialsForm.ApplyToAll.warning,
                severity: ValidationAlertSeverity.Warning
            };
        }
        MsftSme.deepAssign(event.alerts, alerts);
    };
    NodeCredentialsFormComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-node-credentials-form',
                    template: "\n      <form name=\"manageAs\" [id]=\"formId\">\n          <sme-form-field type=\"radiogroup\" name=\"authType\" [(ngModel)]=\"useGlobalAuth\" (customValidate)=\"validateAuthType($event)\" [immediateValidation]=\"true\">\n              <sme-option [value]=\"true\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.UseGlobalAuth.labelFormat | smeFormat:(globalUsername || strings.MsftSmeShell.Angular.NodeCredentialsForm.UseGlobalAuth.myAccount)\">\n                  <ng-template>\n                      <sme-form-field *ngIf=\"!isServiceMode\" type=\"checkbox\" name=\"useLaps\" [(ngModel)]=\"useLaps\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.UseLaps.label\"></sme-form-field>\n                      <fieldset *ngIf=\"!isServiceMode\" [disabled]=\"!useLaps\">\n                          <sme-form-field type=\"text\" name=\"lapsLocalAdminName\" [(ngModel)]=\"lapsLocalAdminName\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.lapsLocalAdminName.label\" [placeholder]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.lapsLocalAdminName.placeholder\"></sme-form-field>\n                      </fieldset>\n                  </ng-template>\n              </sme-option>\n              <sme-option [value]=\"false\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.UsePerNodeAuth.label\">\n                  <ng-template>\n                      <sme-form-field type=\"text\" name=\"username\" [(ngModel)]=\"username\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.Username.label\" [placeholder]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.Username.placeholder\"></sme-form-field>\n                      <sme-form-field type=\"password\" name=\"password\" [(ngModel)]=\"password\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.Password.label\" [placeholder]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.Password.placeholder\"></sme-form-field>\n                      <sme-form-field *ngIf=\"showApplyToAll\" type=\"checkbox\" name=\"applyToAll\" [(ngModel)]=\"applyToAll\" [label]=\"strings.MsftSmeShell.Angular.NodeCredentialsForm.ApplyToAll.label\" (customValidate)=\"validateApplyToAll($event)\"></sme-form-field>\n                  </ng-template>\n              </sme-option>\n          </sme-form-field>\n      </form>\n    ",
                    styles: ["\n      .info-icon-div {\n        width: 20px;\n        text-align: center;\n        margin-right: 0px;\n        height: 20px;\n        padding-left: 0px;\n      }\n\n      .info-icon {\n        vertical-align: middle;\n        font-size: 20px;\n        height: 20px;\n        line-height: 20px;\n      }\n\n      .indent-list {\n        padding-left: 20px;\n        font-size: 13px;\n      }\n    "]
                },] },
    ];
    /** @nocollapse */
    NodeCredentialsFormComponent.ctorParameters = function () { return [
        { type: AppContextService, },
    ]; };
    NodeCredentialsFormComponent.propDecorators = {
        'credentialsChanged': [{ type: Output },],
        'showApplyToAll': [{ type: Input },],
        'isServiceMode': [{ type: Input },],
        'formId': [{ type: Input },],
    };
    return NodeCredentialsFormComponent;
}());
export { NodeCredentialsFormComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvbm9kZS1jcmVkZW50aWFscy1mb3JtL25vZGUtY3JlZGVudGlhbHMtZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxZQUFBLEVBQWMsS0FBQSxFQUEwQixNQUFBLEVBQU8sTUFBTyxlQUFBLENBQWdCO0FBRzFGLE9BQU8sRUFBNEIsb0JBQUEsRUFBeUQsTUFBTyxlQUFBLENBQWdCO0FBR25ILE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLGVBQUEsQ0FBZ0I7QUFFbEQsT0FBTyxFQUE4Qyx1QkFBQSxFQUF3QixNQUFPLFNBQUEsQ0FBVTtBQUc5Rjs7Ozs7Ozs7R0FRRztBQUNIO0lBK0ZJOztPQUVHO0lBQ0gsc0NBQW9CLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBakdqRCxZQUFPLEdBQVksT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUM7UUFDdkQsMEJBQXFCLEdBQUcsS0FBSyxDQUFDO1FBcUVyQzs7V0FFRztRQUNLLFVBQUssR0FBRztZQUNaLFFBQVEsRUFBRSxFQUFFO1lBQ1osUUFBUSxFQUFFLEVBQUU7WUFDWixVQUFVLEVBQUUsS0FBSztZQUNqQixPQUFPLEVBQUUsS0FBSztZQUNkLGtCQUFrQixFQUFFLEVBQUU7WUFDdEIsYUFBYSxFQUFFLEtBQUs7U0FDdkIsQ0FBQztRQUdLLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUE0QixDQUFDO1FBR2xFLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBR3RCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO0lBUStCLENBQUM7SUExRjdELHNCQUFXLGtEQUFRO2FBSW5CO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFURDs7V0FFRzthQUNILFVBQW9CLEtBQWE7WUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FB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LENBQUM7aUJBQ0wsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDJDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztLQUMxQixFQUY2RixDQUU3RixDQUFDO0lBQ0ssMkNBQWMsR0FBMkM7UUFDaEUsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN6QyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BDLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25DLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0tBQzNCLENBQUM7SUFDRixtQ0FBQztDQTlPRCxBQThPQyxJQUFBO1NBOU9ZLDRCQUE0QiIsImZpbGUiOiJub2RlLWNyZWRlbnRpYWxzLWZvcm0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==