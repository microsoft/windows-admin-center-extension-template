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
var AdminsSecurityGroupsComponent = /** @class */ (function (_super) {
    __extends(AdminsSecurityGroupsComponent, _super);
    function AdminsSecurityGroupsComponent(router, appContextService, accessService, dialogService, activatedRoute) {
        var _this = _super.call(this, router, appContextService, accessService, dialogService, activatedRoute) || this;
        _super.prototype.buildActions.call(_this, 'admins');
        return _this;
    }
    AdminsSecurityGroupsComponent.prototype.onActionEnded = function (event) {
        this.accessService.adminsQueryCache.refresh();
        if (event.item.actionType === ActionType.NewSecurityGroup) {
            this.onNewAction(event.result);
        }
        else if (event.item.actionType === ActionType.DeleteSecurityGroup) {
            this.onDeleteAction(event.result);
        }
    };
    AdminsSecurityGroupsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-admins-security-groups-list',
                    template: "\n      <div class=\"flex-layout vertical stretch-absolute\">\n          <sme-settings-content>\n              <sme-master-view class=\"fixed-flex-size\" [showFilter]=\"false\" [total]=\"securityGroups ? securityGroups.length : 0\"\n                  [(selection)]=\"selectedSecGroup\" (clearSelection)=\"securityGroups = null\" [showRefresh]=\"false\">\n                  <sme-action-bar #custom [actions]=\"actions\" [target]=\"selectedSecGroup\" (executed)=\"onActionEnded($event)\"></sme-action-bar>\n                  <input #search type=\"search\" pInputText [(ngModel)]=\"filter\" autofocus placeholder={{strings.App.SettingsDialog.access.search}}>\n                  <sme-loading-wheel *ngIf=\"loading\"></sme-loading-wheel>\n                  <sme-data-table #smeDataTable [(items)]=\"securityGroups\" [(selection)]=\"selectedSecGroup\" [globalFilter]=\"search\">\n                      <sme-data-table-column [field]=\"name\" [header]=\"strings.App.SettingsDialog.access.nameTitle\" [sortable]=\"true\"></sme-data-table-column>\n                      <sme-data-table-column [field]=\"type\" [header]=\"strings.App.SettingsDialog.access.typeTitle\" [sortable]=\"true\"></sme-data-table-column>\n                  </sme-data-table>\n              </sme-master-view>\n          </sme-settings-content>\n      </div>\n      <sme-access-add-security-group-dialog id=\"sme-access-add-security-group-dialog\"></sme-access-add-security-group-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    AdminsSecurityGroupsComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: AppContextService, },
        { type: AccessService, },
        { type: DialogService, },
        { type: ActivatedRoute, },
    ]; };
    return AdminsSecurityGroupsComponent;
}(SecurityGroupsBaseComponent));
export { AdminsSecurityGroupsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9zZWN1cml0eS1ncm91cHMvYWRtaW5zLXNlY3VyaXR5LWdyb3Vwcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBQzFDLE9BQU8sRUFBRSxjQUFBLEVBQWdCLE1BQUEsRUFBTyxNQUFPLGlCQUFBLENBQWtCO0FBQ3pELE9BQU8sRUFBRSxpQkFBQSxFQUFtQixhQUFBLEVBQWMsTUFBTywyQkFBQSxDQUE0QjtBQUM3RSxPQUFPLEVBQUUsYUFBQSxFQUFjLE1BQU8sbUJBQUEsQ0FBb0I7QUFDbEQsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLHVDQUFBLENBQXdDO0FBRW5FLE9BQU8sRUFBRSwyQkFBQSxFQUE0QixNQUFPLGtDQUFBLENBQW1DO0FBRy9FO0lBQW1ELGlEQUEyQjtJQUUxRSx1Q0FDSSxNQUFjLEVBQ2QsaUJBQW9DLEVBQ3BDLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLGNBQThCO1FBTGxDLFlBT0ksa0JBQU0sTUFBTSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDLFNBRWpGO1FBREcsaUJBQU0sWUFBWSxhQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUNqQyxDQUFDO0lBRU0scURBQWEsR0FBcEIsVUFBcUIsS0FBVTtRQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDO0lBQ0Usd0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsaUNBQWlDO29CQUMzQyxRQUFRLEVBQUUsbTdDQWdCVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsNENBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRztRQUNoQixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxhQUFhLEdBQUc7UUFDdkIsRUFBQyxJQUFJLEVBQUUsYUFBYSxHQUFHO1FBQ3ZCLEVBQUMsSUFBSSxFQUFFLGNBQWMsR0FBRztLQUN2QixFQU42RixDQU03RixDQUFDO0lBQ0Ysb0NBQUM7Q0FuREQsQUFtREMsQ0FuRGtELDJCQUEyQixHQW1EN0U7U0FuRFksNkJBQTZCIiwiZmlsZSI6ImFkbWlucy1zZWN1cml0eS1ncm91cHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==