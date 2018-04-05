import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DialogService } from '../../../angular';
import { Dom, GatewayMode, KeyCode } from '../../../core';
import { NotificationsDialogComponent } from '../dialogs/notifications-dialog/notifications-dialog.component';
import { AppBarService } from './app-bar.service';
import { ShellService } from '../../shell.service';
var AppBarComponent = /** @class */ (function () {
    function AppBarComponent(titleService, appBarService, dialogService, shellService) {
        var _this = this;
        this.titleService = titleService;
        this.appBarService = appBarService;
        this.dialogService = dialogService;
        this.shellService = shellService;
        this.strings = MsftSme.resourcesStrings().MsftSmeShell.App;
        this.gatewayMode = GatewayMode;
        document.body.addEventListener('keydown', function (event) {
            var currentElement = event.target;
            if (event.keyCode === KeyCode.DownArrow) {
                if (currentElement.id === 'sme-notifications-button' && _this.activePane === dialogService.commonIds.notifications) {
                    _this.goToPane('sme-notifications');
                }
                else if (currentElement.id === 'sme-about-button' && _this.activePane === dialogService.commonIds.help) {
                    _this.goToPane('sme-about');
                }
            }
        });
    }
    Object.defineProperty(AppBarComponent.prototype, "isApplicationFaulted", {
        get: function () {
            return ShellService.isApplicationFaulted;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * focuses on the first element in the dialog
     * @param elementId the id of the dialog
     */
    AppBarComponent.prototype.goToPane = function (dialogId) {
        var pane = document.getElementById(dialogId);
        if (pane) {
            var descendentZone = Dom.getDescendentZone(pane);
            var focusOn = Dom.getNextFocusableElement(descendentZone);
            if (focusOn) {
                focusOn.focus();
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };
    AppBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.notifications = NotificationsDialogComponent;
        this.gatewaySubscription = this.shellService.inventoryCaches.gatewayCache.createObservable({})
            .subscribe(function (gateway) { return _this.gateway = gateway; });
        this.breadcrumbsSubscription = this.appBarService.getBreadcrumbs().subscribe(function (breadcrumbs) {
            // we are going to assume that the first item of the header is from the root component and hence will always be visible.
            _this.firstBreadcrumb = MsftSme.first(breadcrumbs);
            _this.secondBreadcrumb = breadcrumbs[1] || null;
            var title = breadcrumbs.reverse().map(function (b) { return b.label; }).join(' - ');
            _this.titleService.setTitle(title);
        });
    };
    AppBarComponent.prototype.ngOnDestroy = function () {
        this.breadcrumbsSubscription.unsubscribe();
        this.gatewaySubscription.unsubscribe();
    };
    /**
     * toggles notification pane
     */
    AppBarComponent.prototype.togglePane = function (paneId) {
        var _this = this;
        if (this.activePane === paneId) {
            // if the pane is already open, close it.
            this.dialogService.hide(paneId);
        }
        else {
            // if there is another pane open, close it.
            if (this.activePane) {
                this.dialogService.hide(this.activePane);
            }
            if (this.dialogService.activeDialogsStack.length === 0) {
                // open the pane
                this.activePane = paneId;
                this.dialogService.show(paneId, {}).subscribe(function () {
                    _this.activePane = null;
                });
            }
            else {
                this.dialogService.activeDialogsStack[0].hide();
            }
        }
    };
    AppBarComponent.prototype.closeActionPanes = function () {
        var _this = this;
        // close any active dialogs
        if (this.dialogService.activeDialogsStack) {
            this.dialogService.activeDialogsStack.forEach(function (activeDialog) { return _this.dialogService.hide(activeDialog.id); });
        }
    };
    AppBarComponent.prototype.getNotificationCount = function () {
        if (this.notifications.count > 99) {
            return 99;
        }
        return NotificationsDialogComponent.count;
    };
    AppBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-app-bar',
                    styles: ["\n      nav {\n          display: table;\n          width:100%;        \n          white-space: nowrap;\n      }\n\n      .app-bar-left {\n          display:table-cell;\n          width:45%;\n          padding-right:20px;\n      }\n\n      .app-bar-middle {\n          display:table-cell;\n          width:10%;\n          text-align: center;\n      }\n\n      .app-bar-right {\n          display:table-cell;\n          text-align:right;\n          width:45%;\n      }\n\n      .app-bar-right button {\n          height: 40px;\n      }\n    "],
                    template: "\n      <nav *ngIf=\"isApplicationFaulted\" class=\"sme-theme-dark sme-layout-app-bar sme-arrange-stack-h\">\n          <div class=\"sme-position-flex-auto sme-arrange-stack-h sme-arrange-stack-centered\">\n              <ng-container *ngTemplateOutlet=\"microsoftLogo\"></ng-container>\n          </div>\n      </nav>\n\n\n      <nav *ngIf=\"!isApplicationFaulted\" class=\"sme-theme-dark sme-layout-app-bar\" role=\"navigation\" [attr.aria-label]=\"strings.AppBar.Nav.Landmark.Primary.aria.label\">\n          <div *ngIf=\"gateway && gateway.mode === gatewayMode.App\" class=\"app-bar-left sme-arrange-stack-h\" (mouseup)=\"closeActionPanes()\">\n              <span *ngIf=\"firstBreadcrumb && secondBreadcrumb\">{{secondBreadcrumb.label}} {{strings.Shell.applicationTitleAppModeSuffix}}</span>\n          </div>\n          <div *ngIf=\"gateway && gateway.mode !== gatewayMode.App\" class=\"app-bar-left sme-focus-zone\" (mouseup)=\"closeActionPanes()\">\n            <div class=\"sme-arrange-stack-h\">\n              <a *ngIf=\"firstBreadcrumb\" role=\"button\" class=\"sme-button sme-button-trigger\" [routerLink]=\"firstBreadcrumb.url\" [queryParams]=\"firstBreadcrumb.params\">\n                {{ firstBreadcrumb.label }}\n              </a>\n              <sme-dropdown #dropdown>\n                  <button type=\"button\" [class.sme-toggled]=\"dropdown.isOpen\" [attr.aria-label]=\"strings.SolutionsList.solutionSelector\" [attr.aria-expanded]=\"dropdown.isOpen\" class=\"sme-layout-app-bar-item-height sme-button-trigger sme-button-auto-width sme-dropdown-toggle\">\n                  <span *ngIf=\"secondBreadcrumb\">{{secondBreadcrumb.label}}</span>\n                  <span class=\"sme-icon sme-icon-size-xxs sme-icon-chevronDown\" [class.sme-margin-left-xs]=\"secondBreadcrumb\"></span>\n                </button>\n                  <sme-solutions-list class=\"sme-dropdown-content\" role=\"menu\" aria-labelledby=\"dropdown-example\"></sme-solutions-list>\n              </sme-dropdown>\n            </div>\n          </div>\n          <div class=\"app-bar-middle sme-arrange-stack-h sme-arrange-stack-centered\">\n              <ng-container *ngTemplateOutlet=\"microsoftLogo\"></ng-container>\n          </div>\n\n          <div class=\"app-bar-right sme-focus-zone\">\n              <button type=\"button\" [attr.aria-label]=\"strings.AppBar.Buttons.Notifications.title\" [title]=\"strings.AppBar.Buttons.Notifications.title\" class=\"sme-button-trigger sme-button-auto-width\" id=\"sme-notifications-button\" [class.sme-toggled]=\"activePane === dialogService.commonIds.notifications\"\n                  [attr.aria-expanded]=\"activePane === dialogService.commonIds.notifications\" (click)=\"togglePane(dialogService.commonIds.notifications)\" aria-describedby=\"msft-sme-shell-app-bar-notificationsCount\">\n                <sme-layered-icon size=\"20px\">\n                    <sme-icon-layer size=\"16px\" height=\"16px\" width=\"16px\" class=\"sme-icon sme-icon-ringer\"></sme-icon-layer>\n                    <!-- The next to layers have very specific hard coded values that work on both edge and chrome. Do not change unless you know what your doing. -->\n                    <sme-icon-layer *ngIf=\"notifications.count\" size=\"13px\" top=\"-5.5px\" left=\"33%\" class=\"sme-icon sme-icon-statusCircleOuter sme-color-red\"></sme-icon-layer>\n                    <sme-icon-layer *ngIf=\"notifications.count\" size=\"9px\" top=\"-2px\" left=\"50%\" height=\"12px\" width=\"12px\" class=\"sme-color-white\">{{ getNotificationCount() }}</sme-icon-layer>\n                </sme-layered-icon>\n              </button>\n              <label id=\"msft-sme-shell-app-bar-notificationsCount\" class=\"sme-screen-reader\">\n                {{strings.AppBar.Buttons.Notifications.desc.format | smeFormat:getNotificationCount()}}\n              </label>\n\n              <button type=\"button\" [attr.aria-label]=\"strings.AppBar.Buttons.Settings.title\" [title]=\"strings.AppBar.Buttons.Settings.title\" class=\"sme-button-trigger sme-button-auto-width\" routerLink=\"/settings\" routerLinkActive=\"sme-toggled\">\n                <div class=\"sme-icon sme-icon-settings\"></div>\n              </button>\n\n              <button id=\"sme-about-button\" type=\"button\" [attr.aria-label]=\"strings.AppBar.Buttons.Help.title\" [title]=\"strings.AppBar.Buttons.Help.title\" class=\"sme-button-trigger sme-button-auto-width\" [class.sme-toggled]=\"activePane === dialogService.commonIds.help\"\n                  [attr.aria-expanded]=\"activePane === dialogService.commonIds.help\" (click)=\"togglePane(dialogService.commonIds.help)\">\n                <div class=\"sme-icon sme-icon-help\"></div>\n              </button>\n          </div>\n      </nav>\n\n      <ng-template #microsoftLogo>\n          <svg class=\"sme-height-md\" role=\"img\" aria-labelledby=\"msft-sme-shell-app-bar-microsoft-logo\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 337 72\">\n                <title id=\"msft-sme-shell-app-bar-microsoft-logo\">{{strings.AppBar.Logo.title}}</title>\n                <defs>\n                  <style>\n                    .cls-1 {\n                      fill: none;\n                    }\n\n                    .cls-2 {\n                      clip-path: url(#clip-path);\n                    }\n\n                    .cls-3 {\n                      fill: #fff;\n                    }\n\n                    .cls-4 {\n                      fill: #f25022;\n                    }\n\n                    .cls-5 {\n                      fill: #7fba00;\n                    }\n\n                    .cls-6 {\n                      fill: #00a4ef;\n                    }\n\n                    .cls-7 {\n                      fill: #ffb900;\n                    }\n                  </style>\n                  <clipPath id=\"clip-path\" transform=\"translate(-72 -72)\">\n                    <rect class=\"cls-1\" width=\"482\" height=\"216\" />\n                  </clipPath>\n                </defs>\n                <g id=\"Layer_2\" data-name=\"Layer 2\">\n                  <g id=\"Layer_1-2\" data-name=\"Layer 1\">\n                    <g class=\"cls-2\">\n                      <g class=\"cls-2\">\n                        <path class=\"cls-3\" d=\"M213,86v44h-8V96h.53L192,130h-5L173.09,96H173v34h-7V86h10.81l12.48,32h.18l13.17-32Zm5.62,3.68a4,4,0,0,1,1.31-3A4.42,4.42,0,0,1,223,85.43a4.36,4.36,0,0,1,3.19,1.25,4.07,4.07,0,0,1,1.27,3,3.91,3.91,0,0,1-1.3,3A4.47,4.47,0,0,1,223,93.86a4.39,4.39,0,0,1-3.15-1.22,4,4,0,0,1-1.28-3M227,130h-7V99h7Zm21.8-5.71a10.06,10.06,0,0,0,3.59-.75,15.06,15.06,0,0,0,3.61-2v6.78a14.6,14.6,0,0,1-4,1.51,21.56,21.56,0,0,1-4.87.51A14.73,14.73,0,0,1,231.78,115a17.66,17.66,0,0,1,4.37-12.31q4.37-4.84,12.38-4.83a17,17,0,0,1,4.14.53A13.87,13.87,0,0,1,256,99.59v7a14.91,14.91,0,0,0-3.45-1.91A10,10,0,0,0,249,104a9.14,9.14,0,0,0-7,2.8,10.55,10.55,0,0,0-2.65,7.56,10.07,10.07,0,0,0,2.55,7.32,9.19,9.19,0,0,0,6.91,2.62m28.46-26.18a9.24,9.24,0,0,1,1.57.12,6.56,6.56,0,0,1,1.17.3v7.29a6.55,6.55,0,0,0-1.71-.82,8.5,8.5,0,0,0-2.73-.39,5.8,5.8,0,0,0-4.65,2.32q-1.9,2.32-1.9,7.14V130h-7V99h7v5h-.13a8.54,8.54,0,0,1,3-4,8.17,8.17,0,0,1,4.85-1.43m3.14,16q0-7.68,4.34-12.17t12.05-4.49q7.26,0,11.34,4.32t4.08,11.67q0,7.53-4.34,12t-11.81,4.46q-7.2,0-11.43-4.23t-4.23-11.55m7.59-.24q0,4.85,2.2,7.41a7.84,7.84,0,0,0,6.3,2.56,7.34,7.34,0,0,0,6.05-2.56q2.08-2.56,2.08-7.59t-2.15-7.55a7.48,7.48,0,0,0-6-2.55,7.64,7.64,0,0,0-6.22,2.67q-2.21,2.67-2.21,7.61m34.93-7.57a3.13,3.13,0,0,0,1,2.46,17,17,0,0,0,4.4,2.25,14.94,14.94,0,0,1,6.14,3.94,8.16,8.16,0,0,1,1.76,5.29,8.51,8.51,0,0,1-3.36,7q-3.36,2.65-9.09,2.65a21.87,21.87,0,0,1-4.27-.47,19,19,0,0,1-4-1.19v-7.18a18,18,0,0,0,4.28,2.2,12.53,12.53,0,0,0,4.16.81,7.41,7.41,0,0,0,3.65-.69,2.48,2.48,0,0,0,1.18-2.32A3.22,3.22,0,0,0,327,119a18.08,18.08,0,0,0-4.63-2.4,14.3,14.3,0,0,1-5.73-3.8,8.32,8.32,0,0,1-1.69-5.37,8.48,8.48,0,0,1,3.33-6.89,13.3,13.3,0,0,1,8.64-2.7,20.88,20.88,0,0,1,3.65.36,16.17,16.17,0,0,1,3.38.94v6.94a15.59,15.59,0,0,0-3.38-1.66,11.27,11.27,0,0,0-3.83-.69,5.58,5.58,0,0,0-3.24.81,2.58,2.58,0,0,0-1.16,2.23m16.55,7.81q0-7.68,4.34-12.17t12-4.49q7.26,0,11.34,4.32t4.08,11.67q0,7.53-4.34,12t-11.81,4.46q-7.2,0-11.43-4.23t-4.23-11.55m7.59-.24q0,4.85,2.2,7.41a7.85,7.85,0,0,0,6.3,2.56,7.34,7.34,0,0,0,6.05-2.56q2.08-2.56,2.08-7.59T361,106.59a7.48,7.48,0,0,0-6-2.55,7.64,7.64,0,0,0-6.22,2.67q-2.21,2.67-2.21,7.61M395,105H384v25h-7V105h-5V99h5V94.69a10.9,10.9,0,0,1,3.08-8A10.62,10.62,0,0,1,388,83.58a17.07,17.07,0,0,1,2.28.14,8.84,8.84,0,0,1,1.75.41v6.3a7.43,7.43,0,0,0-1.25-.51,6.43,6.43,0,0,0-2.05-.3A4.32,4.32,0,0,0,385.22,91,6.37,6.37,0,0,0,384,95.26V99h11V92l7-2.23V99h7v6h-7v14.58a6.42,6.42,0,0,0,1,4.06,3.81,3.81,0,0,0,3.1,1.18,4.39,4.39,0,0,0,1.44-.3,6.64,6.64,0,0,0,1.47-.73v5.92a7.89,7.89,0,0,1-2.19.72,14.3,14.3,0,0,1-3,.33q-4.39,0-6.58-2.46t-2.19-7.4Z\"\n                          transform=\"translate(-72 -72)\" />\n                        <rect class=\"cls-4\" width=\"34\" height=\"34\" />\n                        <rect class=\"cls-5\" x=\"38\" width=\"34\" height=\"34\" />\n                        <rect class=\"cls-6\" y=\"38\" width=\"34\" height=\"34\" />\n                        <rect class=\"cls-7\" x=\"38\" y=\"38\" width=\"34\" height=\"34\" />\n                      </g>\n                    </g>\n                  </g>\n                </g>\n            </svg>\n      </ng-template>\n    "
                },] },
    ];
    /** @nocollapse */
    AppBarComponent.ctorParameters = function () { return [
        { type: Title, },
        { type: AppBarService, },
        { type: DialogService, },
        { type: ShellService, },
    ]; };
    AppBarComponent.propDecorators = {
        'solutionsDropdown': [{ type: ViewChild, args: ['solutionsDropdown',] },],
    };
    return AppBarComponent;
}());
export { AppBarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FwcC1iYXIvYXBwLWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBOEUsU0FBQSxFQUFVLE1BQU8sZUFBQSxDQUFnQjtBQUN4SCxPQUFPLEVBQUUsS0FBQSxFQUFNLE1BQU8sMkJBQUEsQ0FBNEI7QUFHbEQsT0FBTyxFQUFFLGFBQUEsRUFBYyxNQUFPLGtCQUFBLENBQW1CO0FBQ2pELE9BQU8sRUFBRSxHQUFBLEVBQXVCLFdBQUEsRUFBYSxPQUFBLEVBQVEsTUFBTyxlQUFBLENBQWdCO0FBQzVFLE9BQU8sRUFBRSw0QkFBQSxFQUE2QixNQUFPLGdFQUFBLENBQWlFO0FBQzlHLE9BQU8sRUFBRSxhQUFBLEVBQTBCLE1BQU8sbUJBQUEsQ0FBb0I7QUFHOUQsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLHFCQUFBLENBQXNCO0FBSW5EO0lBbUJJLHlCQUNZLFlBQW1CLEVBQ3BCLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLFlBQTBCO1FBSnJDLGlCQWVDO1FBZFcsaUJBQVksR0FBWixZQUFZLENBQU87UUFDcEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUF0QjlCLFlBQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO1FBTS9ELGdCQUFXLEdBQUcsV0FBVyxDQUFDO1FBaUI3QixRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQUs7WUFDNUMsSUFBTSxjQUFjLEdBQWdCLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDakQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLEVB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QyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLENBQUM7SUFDOUMsQ0FBQztJQUNFLDBCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLE1BQU0sRUFBRSxDQUFDLDhoQkE0QlIsQ0FBQztvQkFDRixRQUFRLEVBQUUsOHZTQTRHVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsOEJBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLEtBQUssR0FBRztRQUNmLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztRQUN2QixFQUFDLElBQUksRUFBRSxhQUFhLEdBQUc7UUFDdkIsRUFBQyxJQUFJLEVBQUUsWUFBWSxHQUFHO0tBQ3JCLEVBTDZGLENBSzdGLENBQUM7SUFDSyw4QkFBYyxHQUEyQztRQUNoRSxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxFQUFFLEVBQUU7S0FDekUsQ0FBQztJQUNGLHNCQUFDO0NBeFFELEFBd1FDLElBQUE7U0F4UVksZUFBZSIsImZpbGUiOiJhcHAtYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=