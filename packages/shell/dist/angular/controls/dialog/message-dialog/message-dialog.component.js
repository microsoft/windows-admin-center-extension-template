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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Deprecated } from '../../common';
import { BaseDialogComponent } from '../base-dialog.component';
import { DialogService } from '../dialog.service';
var MessageDialogComponent = /** @class */ (function (_super) {
    __extends(MessageDialogComponent, _super);
    /**
     * Initializes a new instance of the MessageDialogComponent class.
     */
    function MessageDialogComponent(dialogService) {
        return _super.call(this, dialogService) || this;
    }
    /**
     * Shows the dialog.
     *
     * @param options The options for the dialog.
     * @return The dialog result subject.
     */
    MessageDialogComponent.prototype.show = function (options) {
        if (!options) {
            throw new Error('MessageDialogComponent.show: Options are required to show the dialog.');
        }
        var result = _super.prototype.show.call(this, options);
        this.checkboxResult = false;
        this.buttonText = options.buttonText;
        this.checkboxText = options.checkboxText;
        this.message = options.message;
        this.title = options.title;
        this.externalLink = options.externalLink;
        this.loading = !!options['loading'];
        this.dialogMode = options['dialogMode'] || 'centered';
        return result;
    };
    /**
     * The method to call when the dialog button is clicked.
     */
    MessageDialogComponent.prototype.onClick = function () {
        this.hide({
            checkboxResult: this.checkboxResult
        });
    };
    MessageDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-message-dialog',
                    template: "\n      <sme-dialog #dialog [dialogMode]=\"dialogMode\">\n          <sme-dialog-header>\n              <h2 id=\"sme-dialog-title\">{{title}}</h2>\n          </sme-dialog-header>\n          <sme-dialog-content>\n              <sme-loading-wheel *ngIf=\"loading\" size=\"medium\"></sme-loading-wheel>\n              <p id=\"sme-dialog-desc\">{{message}}</p>\n              <a *ngIf=\"externalLink\" class=\"sme-link\" href=\"{{externalLink.url}}\" target=\"_blank\">{{externalLink.title}}</a>\n              <div class=\"checkbox\" *ngIf=\"checkboxText\">\n                  <label>\n                      <input type=\"checkbox\" [(ngModel)]=\"checkboxResult\" />\n                      <span>{{checkboxText}}</span>\n                  </label>\n              </div>\n          </sme-dialog-content>\n          <sme-dialog-footer>\n              <button type=\"button\" class=\"sme-button-primary\" (click)=\"onClick()\">{{buttonText}}</button>\n          </sme-dialog-footer>\n      </sme-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    MessageDialogComponent.ctorParameters = function () { return [
        { type: DialogService, },
    ]; };
    MessageDialogComponent = __decorate([
        Deprecated({
            deprecatedSince: '02/20/18',
            alternateSignature: 'AppContextService.frame.showDialogMessage',
            suppressForShell: true
        }),
        __metadata("design:paramtypes", [DialogService])
    ], MessageDialogComponent);
    return MessageDialogComponent;
}(BaseDialogComponent));
export { MessageDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGlhbG9nL21lc3NhZ2UtZGlhbG9nL21lc3NhZ2UtZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBaUIsTUFBTyxlQUFBLENBQWdCO0FBR2pELE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxjQUFBLENBQWU7QUFDMUMsT0FBTyxFQUFFLG1CQUFBLEVBQWlELE1BQU8sMEJBQUEsQ0FBMkI7QUFDNUYsT0FBTyxFQUFFLGFBQUEsRUFBYyxNQUFPLG1CQUFBLENBQW9CO0FBZ0VsRDtJQUE0QywwQ0FBOEQ7SUFpQ3RHOztPQUVHO0lBQ0gsZ0NBQVksYUFBNEI7ZUFDcEMsa0JBQU0sYUFBYSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLHFDQUFJLEdBQVgsVUFBWSxPQUE2QjtRQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7UUFDN0YsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLGlCQUFNLElBQUksWUFBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxVQUFVLENBQUM7UUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7O09BRUc7SUFDSSx3Q0FBTyxHQUFkO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQztZQUNOLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztTQUN0QyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0UsaUNBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsNCtCQW9CVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gscUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztLQUN0QixFQUY2RixDQUU3RixDQUFDO0lBcEdXLHNCQUFzQjtRQUxsQyxVQUFVLENBQUM7WUFDUixlQUFlLEVBQUUsVUFBVTtZQUMzQixrQkFBa0IsRUFBRSwyQ0FBMkM7WUFDL0QsZ0JBQWdCLEVBQUUsSUFBSTtTQUN6QixDQUFDO3lDQXFDNkIsYUFBYTtPQXBDL0Isc0JBQXNCLENBcUdsQztJQUFELDZCQUFDO0NBckdELEFBcUdDLENBckcyQyxtQkFBbUIsR0FxRzlEO1NBckdZLHNCQUFzQiIsImZpbGUiOiJtZXNzYWdlLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9