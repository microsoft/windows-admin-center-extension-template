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
import { BaseDialogComponent } from '../base-dialog.component';
import { DialogService } from '../dialog.service';
var ConfirmationListDialogComponent = /** @class */ (function (_super) {
    __extends(ConfirmationListDialogComponent, _super);
    function ConfirmationListDialogComponent(dialogService) {
        return _super.call(this, dialogService) || this;
    }
    ConfirmationListDialogComponent.prototype.closeRequested = function (reason) {
        this.onCancel();
    };
    ConfirmationListDialogComponent.prototype.show = function (options) {
        var _this = this;
        if (!options) {
            throw new Error('ConfirmationListDialogComponent.show: Options are required to show the dialog.');
        }
        var result = _super.prototype.show.call(this, options);
        this.cancelButtonText = options.cancelButtonText;
        this.checkboxText = options.checkboxText;
        this.checked = false;
        this.confirmButtonText = options.confirmButtonText;
        this.listFooterText = options.listFooterText;
        this.listData = [];
        this.radioSelectionResult = null;
        this.listType = options.listType;
        this.listHeaderText = options.listHeaderText;
        this.title = options.title;
        this.loading = true;
        this.dataSourceSubscription = options.listDataSource.subscribe(function (strings) {
            _this.loading = false;
            _this.listData = strings;
            _this.radioSelectionResult = _this.listData ? _this.listData[0] : '';
        }, function (error) {
            _this.hide({
                confirmed: false,
                observableError: error
            });
        });
        return result;
    };
    ConfirmationListDialogComponent.prototype.hide = function (result) {
        this.dataSourceSubscription.unsubscribe();
        _super.prototype.hide.call(this, result);
    };
    ConfirmationListDialogComponent.prototype.onConfirm = function () {
        this.hide({
            confirmed: true,
            checkboxResult: (this.checkboxText) ? this.checked : null,
            radioSelectionResult: this.radioSelectionResult
        });
    };
    ConfirmationListDialogComponent.prototype.onCancel = function () {
        this.hide({
            confirmed: false
        });
    };
    ConfirmationListDialogComponent.decorators = [
        { type: Component, args: [{
                    template: "\n      <sme-dialog #dialog dialogMode=\"centered\" [clickBackdrop]='false'>\n        <sme-dialog-header>\n          <h2 id=\"sme-dialog-title\">{{ title }}</h2>\n        </sme-dialog-header>\n        <sme-dialog-content>\n          <sme-loading-wheel *ngIf=\"loading\" size=\"medium\"></sme-loading-wheel>\n          <p>{{ listHeaderText }}</p>\n\n          <ul *ngIf=\"!listType || listType === 'list'\" class=\"sme-list sme-position-flex-auto sme-margin-top-xxs\">\n            <li *ngFor=\"let item of listData\" [title]=\"item?.title || ''\">\n              {{ item?.value || item }}\n            </li>\n          </ul>\n\n          <div *ngIf=\"listType === 'radio'\">\n            <div *ngFor=\"let item of listData; let i = index\" class=\"sme-radio sme-position-flex-auto sme-margin-top-xxs\">\n              <label class=\"sme-font-body\" [title]=\"item?.title || ''\">\n                <input type=\"radio\" name=\"selection\" [value]=\"item\"  [(ngModel)]=\"radioSelectionResult\" >\n                <span aria-hidden=\"true\">{{ item?.value || item }}</span>\n              </label>\n            </div>\n          </div>\n\n          <div class=\"sme-checkbox sme-position-flex-none sme-margin-top-xxs\" *ngIf=\"checkboxText\">\n            <label class=\"sme-font-body\">\n              <input type=\"checkbox\" [(ngModel)]=\"checked\" />\n              <span>{{checkboxText}}</span>\n            </label>\n          </div>\n        </sme-dialog-content>\n        <sme-dialog-footer>\n          <button type=\"button\" class=\"sme-button-primary\" [disabled]=\"loading\" (click)=\"onConfirm()\">{{ confirmButtonText }}</button>\n          <button type=\"button\" (click)=\"onCancel()\">{{ cancelButtonText }}</button>\n        </sme-dialog-footer>\n      </sme-dialog>\n    ",
                    selector: 'sme-confirmation-list-dialog'
                },] },
    ];
    /** @nocollapse */
    ConfirmationListDialogComponent.ctorParameters = function () { return [
        { type: DialogService, },
    ]; };
    return ConfirmationListDialogComponent;
}(BaseDialogComponent));
export { ConfirmationListDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGlhbG9nL2NvbmZpcm1hdGlvbi1saXN0LWRpYWxvZy9jb25maXJtYXRpb24tbGlzdC1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFVLE1BQU8sZUFBQSxDQUFnQjtBQUcxQyxPQUFPLEVBQUUsbUJBQUEsRUFBaUQsTUFBTywwQkFBQSxDQUEyQjtBQUU1RixPQUFPLEVBQUUsYUFBQSxFQUFjLE1BQU8sbUJBQUEsQ0FBb0I7QUE2RWxEO0lBQ1ksbURBQWdGO0lBZXhGLHlDQUFZLGFBQTRCO2VBQ3BDLGtCQUFNLGFBQWEsQ0FBQztJQUN4QixDQUFDO0lBRU0sd0RBQWMsR0FBckIsVUFBc0IsTUFBeUI7UUFDM0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSw4Q0FBSSxHQUFYLFVBQVksT0FBc0M7UUFBbEQsaUJBK0JDO1FBOUJHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztRQUN0RyxDQUFDO1FBRUQsSUFBSSxNQUFNLEdBQUcsaUJBQU0sSUFBSSxZQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDakQsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7UUFDbkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUMxRCxVQUFBLE9BQU87WUFDSCxLQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixLQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixLQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RFLENBQUMsRUFDRCxVQUFDLEtBQUs7WUFDRixLQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNOLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixlQUFlLEVBQUUsS0FBSzthQUN6QixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVQLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLDhDQUFJLEdBQVgsVUFBWSxNQUFxQztRQUM3QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUMsaUJBQU0sSUFBSSxZQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxtREFBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDTixTQUFTLEVBQUUsSUFBSTtZQUNmLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUN6RCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CO1NBQ2xELENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxrREFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQztZQUNOLFNBQVMsRUFBRSxLQUFLO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRSwwQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSw4dkRBb0NUO29CQUNELFFBQVEsRUFBRSw4QkFBOEI7aUJBQzNDLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCw4Q0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsYUFBYSxHQUFHO0tBQ3RCLEVBRjZGLENBRTdGLENBQUM7SUFDRixzQ0FBQztDQTFIRCxBQTBIQyxDQXpIVyxtQkFBbUIsR0F5SDlCO1NBMUhZLCtCQUErQiIsImZpbGUiOiJjb25maXJtYXRpb24tbGlzdC1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==