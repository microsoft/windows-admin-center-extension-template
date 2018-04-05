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
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppContextService, DialogService } from '../../../../../../angular';
import { AccessService } from '../access.service';
import { ActionType } from '../actions/security-group-action.base';
import { SecurityGroupsBaseComponent } from './security-groups-base.component';
var UsersSecurityGroupsComponent = /** @class */ (function (_super) {
    __extends(UsersSecurityGroupsComponent, _super);
    function UsersSecurityGroupsComponent(router, appContextService, accessService, dialogService, activatedRoute) {
        var _this = _super.call(this, router, appContextService, accessService, dialogService, activatedRoute) || this;
        _super.prototype.buildActions.call(_this, 'users');
        return _this;
    }
    UsersSecurityGroupsComponent.prototype.onActionEnded = function (event) {
        this.accessService.usersQueryCache.refresh();
        if (event.item.actionType === ActionType.NewSecurityGroup) {
            this.onNewAction(event.result);
        }
        else if (event.item.actionType === ActionType.DeleteSecurityGroup) {
            this.onDeleteAction(event.result);
        }
    };
    UsersSecurityGroupsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-users-security-groups-list',
                    template: "\n      <div class=\"flex-layout vertical stretch-absolute\">\n          <sme-settings-content>\n              <sme-master-view class=\"fixed-flex-size\" [showFilter]=\"false\" [total]=\"securityGroups ? securityGroups.length : 0\"\n                  [(selection)]=\"selectedSecGroup\" (clearSelection)=\"securityGroups = null\" [showRefresh]=\"false\">\n                  <sme-action-bar #custom [actions]=\"actions\" [target]=\"selectedSecGroup\" (executed)=\"onActionEnded($event)\"></sme-action-bar>\n                  <input #search type=\"search\" pInputText [(ngModel)]=\"filter\" autofocus placeholder={{strings.App.SettingsDialog.access.search}}>\n                  <sme-loading-wheel *ngIf=\"loading\"></sme-loading-wheel>\n                  <sme-data-table #smeDataTable [(items)]=\"securityGroups\" [(selection)]=\"selectedSecGroup\" [globalFilter]=\"search\">\n                      <sme-data-table-column [field]=\"name\" [header]=\"strings.App.SettingsDialog.access.nameTitle\" [sortable]=\"true\"></sme-data-table-column>\n                      <sme-data-table-column [field]=\"type\" [header]=\"strings.App.SettingsDialog.access.typeTitle\" [sortable]=\"true\"></sme-data-table-column>\n                  </sme-data-table>\n              </sme-master-view>\n          </sme-settings-content>\n      </div>\n      <sme-access-add-security-group-dialog id=\"sme-access-add-security-group-dialog\"></sme-access-add-security-group-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    UsersSecurityGroupsComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: AppContextService, },
        { type: AccessService, },
        { type: DialogService, },
        { type: ActivatedRoute, },
    ]; };
    return UsersSecurityGroupsComponent;
}(SecurityGroupsBaseComponent));
export { UsersSecurityGroupsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9zZWN1cml0eS1ncm91cHMvdXNlcnMtc2VjdXJpdHktZ3JvdXBzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVSxNQUFPLGVBQUEsQ0FBZ0I7QUFDMUMsT0FBTyxFQUFFLGNBQUEsRUFBZ0IsTUFBQSxFQUFPLE1BQU8saUJBQUEsQ0FBa0I7QUFDekQsT0FBTyxFQUFFLGlCQUFBLEVBQW1CLGFBQUEsRUFBYyxNQUFPLDJCQUFBLENBQTRCO0FBQzdFLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyxtQkFBQSxDQUFvQjtBQUNsRCxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sdUNBQUEsQ0FBd0M7QUFFbkUsT0FBTyxFQUFFLDJCQUFBLEVBQTRCLE1BQU8sa0NBQUEsQ0FBbUM7QUFHL0U7SUFBa0QsZ0RBQTJCO0lBRXpFLHNDQUNJLE1BQWMsRUFDZCxpQkFBb0MsRUFDcEMsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsY0FBOEI7UUFMbEMsWUFPSSxrQkFBTSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsU0FFakY7UUFERyxpQkFBTSxZQUFZLGFBQUMsT0FBTyxDQUFDLENBQUM7O0lBQ2hDLENBQUM7SUFFTSxvREFBYSxHQUFwQixVQUFxQixLQUFVO1FBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDO0lBQ0UsdUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsZ0NBQWdDO29CQUMxQyxRQUFRLEVBQUUsbTdDQWdCVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsMkNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRztRQUNoQixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxhQUFhLEdBQUc7UUFDdkIsRUFBQyxJQUFJLEVBQUUsYUFBYSxHQUFHO1FBQ3ZCLEVBQUMsSUFBSSxFQUFFLGNBQWMsR0FBRztLQUN2QixFQU42RixDQU03RixDQUFDO0lBQ0YsbUNBQUM7Q0FuREQsQUFtREMsQ0FuRGlELDJCQUEyQixHQW1ENUU7U0FuRFksNEJBQTRCIiwiZmlsZSI6InVzZXJzLXNlY3VyaXR5LWdyb3Vwcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9