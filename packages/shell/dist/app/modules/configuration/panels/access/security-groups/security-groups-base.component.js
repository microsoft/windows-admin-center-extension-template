import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppContextService, DialogService } from '../../../../../../angular';
import { Net, NotificationState } from '../../../../../../core';
import { AccessService } from '../access.service';
import { AddSecurityGroupAction } from '../actions/add-security-group.action';
import { DeleteSecurityGroupAction } from '../actions/delete-security-group.action';
var SecurityGroupsBaseComponent = /** @class */ (function () {
    function SecurityGroupsBaseComponent(router, appContextService, accessService, dialogService, activatedRoute) {
        this.router = router;
        this.appContextService = appContextService;
        this.accessService = accessService;
        this.dialogService = dialogService;
        this.activatedRoute = activatedRoute;
        this.strings = MsftSme.resourcesStrings().MsftSmeShell;
        this.loading = true;
        this.actions = [];
        this.name = 'name';
        this.type = 'type';
    }
    SecurityGroupsBaseComponent.navigationTitle = function (appContextService, snapshot) {
        return MsftSme.resourcesStrings().MsftSmeShell.App.SettingsDialog.access.toolTitle;
    };
    SecurityGroupsBaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        var intervalInMilliSeconds;
        if (this.router.url.includes('users')) {
            this.accessService.usersQueryCache.createObservable({
                interval: intervalInMilliSeconds,
                params: {},
                delayClean: true
            }).subscribe(function (response) {
                _this.securityGroups = response || [];
                _this.loading = false;
            }, function (error) {
                _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
                _this.loading = false;
            });
        }
        else {
            this.accessService.adminsQueryCache.createObservable({
                interval: intervalInMilliSeconds,
                params: {},
                delayClean: true
            }).subscribe(function (response) {
                _this.securityGroups = response || [];
                _this.loading = false;
            }, function (error) {
                _this.showAlert(Net.getErrorMessage(error), NotificationState.Error);
                _this.loading = false;
            });
        }
    };
    SecurityGroupsBaseComponent.prototype.onActionEnded = function (event) {
        // Implemented in child components.
    };
    SecurityGroupsBaseComponent.prototype.onNewAction = function (result) {
        if (result.name && result.type) {
            this.securityGroups.push(result);
            this.selectedSecGroup = this.securityGroups.find(function (x) { return x.name === result.name; });
        }
    };
    SecurityGroupsBaseComponent.prototype.onDeleteAction = function (result) {
        if (result.confirmed === true) {
            var oldVar = this.securityGroups.find(function (x) { return x.name === result.name; });
            MsftSme.remove(this.securityGroups, oldVar);
            this.selectedSecGroup = null;
        }
    };
    SecurityGroupsBaseComponent.prototype.buildActions = function (section) {
        this.actions.push(new AddSecurityGroupAction(this.appContextService, this.accessService, this.dialogService, section));
        this.actions.push(new DeleteSecurityGroupAction(this.appContextService, this.accessService, this.dialogService, section));
    };
    SecurityGroupsBaseComponent.prototype.showAlert = function (message, state) {
        this.appContextService.notification.alert(this.appContextService.gateway.gatewayName, state, message);
    };
    SecurityGroupsBaseComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-security-group-base',
                    template: "\n      <div class=\"flex-layout vertical stretch-absolute\">\n          <sme-settings-content>\n              <sme-master-view class=\"fixed-flex-size\" [showFilter]=\"false\" [total]=\"securityGroups ? securityGroups.length : 0\"\n                  [(selection)]=\"selectedSecGroup\" (clearSelection)=\"securityGroups = null\" [showRefresh]=\"false\">\n                  <sme-action-bar #custom [actions]=\"actions\" [target]=\"selectedSecGroup\" (executed)=\"onActionEnded($event)\"></sme-action-bar>\n                  <input #search type=\"search\" pInputText [(ngModel)]=\"filter\" autofocus placeholder={{strings.App.SettingsDialog.access.search}}>\n                  <sme-loading-wheel *ngIf=\"loading\"></sme-loading-wheel>\n                  <sme-data-table #smeDataTable [(items)]=\"securityGroups\" [(selection)]=\"selectedSecGroup\" [globalFilter]=\"search\">\n                      <sme-data-table-column [field]=\"name\" [header]=\"strings.App.SettingsDialog.access.nameTitle\" [sortable]=\"true\"></sme-data-table-column>\n                      <sme-data-table-column [field]=\"type\" [header]=\"strings.App.SettingsDialog.access.typeTitle\" [sortable]=\"true\"></sme-data-table-column>\n                  </sme-data-table>\n              </sme-master-view>\n          </sme-settings-content>\n      </div>\n      <sme-access-add-security-group-dialog id=\"sme-access-add-security-group-dialog\"></sme-access-add-security-group-dialog>\n    ",
                    providers: [AccessService]
                },] },
    ];
    /** @nocollapse */
    SecurityGroupsBaseComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: AppContextService, },
        { type: AccessService, },
        { type: DialogService, },
        { type: ActivatedRoute, },
    ]; };
    return SecurityGroupsBaseComponent;
}());
export { SecurityGroupsBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9zZWN1cml0eS1ncm91cHMvc2VjdXJpdHktZ3JvdXBzLWJhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQWtCLE1BQU8sZUFBQSxDQUFnQjtBQUNsRCxPQUFPLEVBQUUsY0FBQSxFQUF3QyxNQUFBLEVBQU8sTUFBTyxpQkFBQSxDQUFrQjtBQUVqRixPQUFPLEVBQWMsaUJBQUEsRUFBbUIsYUFBQSxFQUFjLE1BQU8sMkJBQUEsQ0FBNEI7QUFDekYsT0FBTyxFQUFFLEdBQUEsRUFBSyxpQkFBQSxFQUFrQixNQUFPLHdCQUFBLENBQXlCO0FBRWhFLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyxtQkFBQSxDQUFvQjtBQUNsRCxPQUFPLEVBQUUsc0JBQUEsRUFBdUIsTUFBTyxzQ0FBQSxDQUF1QztBQUM5RSxPQUFPLEVBQUUseUJBQUEsRUFBMEIsTUFBTyx5Q0FBQSxDQUEwQztBQUtwRjtJQWdCSSxxQ0FDWSxNQUFjLEVBQ2QsaUJBQW9DLEVBQ3JDLGFBQTRCLEVBQzNCLGFBQTRCLEVBQzVCLGNBQThCO1FBSjlCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3JDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzNCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQXBCbkMsWUFBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQztRQUMzRCxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBR2YsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFHM0IsU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxNQUFNLENBQUM7SUFhckIsQ0FBQztJQVZhLDJDQUFlLEdBQTdCLFVBQThCLGlCQUFvQyxFQUFFLFFBQWdDO1FB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