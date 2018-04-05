import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService, SplitViewComponent } from '../../../../angular';
import { Dom, EnvironmentModule, EnvironmentModuleToolState, Net, NotificationState } from '../../../../core';
import { RpcInboundCommands } from '../../../../core/rpc/rpc-base';
import { ShellService } from '../../../shell.service';
import { RouteHelpers } from '../../../utility/route-helpers';
var MultiToolComponent = /** @class */ (function () {
    function MultiToolComponent(appContext, shellService, route, router) {
        var _this = this;
        this.appContext = appContext;
        this.shellService = shellService;
        this.route = route;
        this.router = router;
        this.strings = MsftSme.resourcesStrings().MsftSmeShell.App.Sidebar;
        this.filter = '';
        this.keywordMatches = {};
        this.filteredTools = [];
        this.layers = [];
        this.shouldCollapseWhenSearchBoxBlured = false;
        this.tools = [];
        this.diffFilter = '';
        this.paramsChangedSubscription = this.router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .concatMap(function (event) { return _this.initializeToolsList(); })
            .subscribe();
        this.moduleSubscription = this.appContext.rpc.moduleSubjects(RpcInboundCommands.OverlayOpen)
            .subscribe(function (deferredData) {
            // overlay tools with one more layer or remove one from top
            if (deferredData.data.overlay) {
                _this.layers.push(deferredData.data.dialogId);
            }
            else if (_this.layers.length > 0) {
                _this.layers.pop();
            }
            else {
                throw new Error('Rpc OverlayClose: close request is called while layer is no longer available');
            }
            deferredData.deferred.resolve();
        });
    }
    MultiToolComponent.prototype.ngOnInit = function () {
        // this.initializeToolsList().subscribe();
    };
    MultiToolComponent.prototype.ngOnDestroy = function () {
        this.paramsChangedSubscription.unsubscribe();
        if (this.moduleSubscription) {
            this.moduleSubscription.unsubscribe();
            this.moduleSubscription = null;
        }
    };
    MultiToolComponent.prototype.ngDoCheck = function () {
        if (this.filter !== this.diffFilter) {
            this.diffFilter = this.filter;
            this.filteredTools = this.filterTools();
        }
    };
    MultiToolComponent.prototype.canDeactivateTool = function (currentRoute, currentState, nextState) {
        return Observable.of(true);
    };
    MultiToolComponent.prototype.expandToolsByClickSearchBox = function () {
        var _this = this;
        if (!this.splitView.isExpanded) {
            this.splitView.togglePane();
            setTimeout(function () { return _this.searchTextBox.nativeElement.focus(); });
        }
    };
    MultiToolComponent.prototype.onSearchBoxFocused = function () {
        if (!this.splitView.isExpanded) {
            this.splitView.togglePane();
            this.shouldCollapseWhenSearchBoxBlured = true;
        }
    };
    MultiToolComponent.prototype.onSearchBoxBlured = function () {
        var _this = this;
        if (this.shouldCollapseWhenSearchBoxBlured) {
            this.shouldCollapseWhenSearchBoxBlured = false;
            this.splitView.togglePane();
            setTimeout(function () { return _this.navigationContainer.nativeElement.scrollLeft = 0; });
        }
    };
    MultiToolComponent.prototype.onOverlayClick = function (id) {
        var _this = this;
        this.appContext.rpc.overlayClose({ overlay: false, dialogId: id }).subscribe(function (result) {
            if (!result.overlayClosed && _this.layers.length > 0) {
                _this.layers.pop();
            }
        }, function (error) {
            _this.appContext.notification.alert('', NotificationState.Error, Net.getErrorMessage(error));
            if (_this.layers.length > 0) {
                _this.layers.pop();
            }
            return Observable.empty();
        });
    };
    MultiToolComponent.prototype.initializeToolsList = function () {
        var _this = this;
        var shellParams = RouteHelpers.getFullShellRoutingParameters(this.route.snapshot);
        if (this.routingParams
            && this.routingParams.solutionId === shellParams.solutionId
            && this.routingParams.connectionType === shellParams.connectionType
            && this.routingParams.connectionName === shellParams.connectionName) {
            // if there is nothing to update, then just stop here
            return Observable.of(null);
        }
        this.routingParams = shellParams;
        var defaultTool = RouteHelpers.getDefaultToolForSolution(this.appContext, this.routingParams);
        var defaultToolId = defaultTool ? EnvironmentModule.createFormattedEntrypoint(defaultTool) : null;
        var baseUrl = RouteHelpers.getBaseToolsRoute(this.routingParams).join('/').substr(1); // remove first /
        return RouteHelpers.queryToolsListFromShellParameters(this.appContext, this.shellService.inventoryCaches, this.routingParams)
            .map(function (tools) {
            _this.tools = tools
                .filter(function (item) { return item.show; })
                .map(function (item) {
                var icon = _this.getIcon(item);
                return {
                    id: EnvironmentModule.createFormattedEntrypoint(item),
                    entryPoint: item,
                    fontIcon: icon.fontIcon,
                    urlIcon: icon.urlIcon,
                    link: _this.getToolRoute(item, baseUrl),
                    disabled: item.detail === EnvironmentModuleToolState.NotConfigured,
                    message: item.message
                };
            })
                .sort(function (left, right) {
                if (left.id === defaultToolId) {
                    return -1;
                }
                if (right.id === defaultToolId) {
                    return 1;
                }
                return left.entryPoint.displayName.localeCompareIgnoreCase(right.entryPoint.displayName);
            });
            _this.filteredTools = _this.filterTools();
            // Give the tools a chance to re-render then focus on the first tool in the list
            setTimeout(function () {
                var next = Dom.getNextFocusableElement(_this.navigation.nativeElement);
                if (next) {
                    next.focus();
                }
            }, 0);
            return null;
        });
    };
    MultiToolComponent.prototype.getIcon = function (item) {
        var fontIcon = null;
        var urlIcon = null;
        if (item.icon.startsWith('sme-icon:')) {
            fontIcon = item.icon.substr(9);
        }
        else {
            // URL/SVG icon.
            var path = void 0;
            if (item.parentModule.isSideLoaded) {
                // add origin for side loading.
                path = item.parentModule.origin;
            }
            else {
                // add target pass within the same gateway server.
                path = item.parentModule.target;
            }
            urlIcon = 'url(' + path + '/' + MsftSme.trimStart(item.icon, '/') + ')';
        }
        return { fontIcon: fontIcon, urlIcon: urlIcon };
    };
    MultiToolComponent.prototype.filterTools = function () {
        this.keywordMatches = {};
        if (!this.tools || this.tools.length === 0) {
            return this.tools;
        }
        var tools = this.tools;
        if (!this.filter) {
            return tools;
        }
        var filter = this.filter.toLocaleLowerCase();
        return tools.filter(function (tool) {
            if (tool.entryPoint.displayName.toLocaleLowerCase().indexOf(filter) > -1) {
                return true;
            }
            // Uncomment the following to enable keyword searching
            // let matches = tool.keywords.filter(keyword => keyword.toLocaleLowerCase().indexOf(filter) > -1);
            // if (matches.length > 0) {
            //     this.keywordMatches[tool.name] = matches.join(', ');
            //     return true;
            // }
            return false;
        });
    };
    MultiToolComponent.prototype.getToolRoute = function (entryPoint, baseUrl) {
        var id = EnvironmentModule.createFormattedEntrypoint(entryPoint);
        var segment = EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(id, entryPoint.entryPointType);
        return baseUrl + "/" + segment;
    };
    MultiToolComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-multi-tool-component',
                    template: "\n      <div class=\"sme-layout-absolute sme-position-inset-none sme-arrange-stack-h\">\n          <sme-split-view orientation=\"left\" [paneDistance]=\"300\" [isExpanded]=\"true\">\n              <sme-split-view-pane>\n                  <div #navigationContainer class=\"tools-nav sme-position-flex-none sme-arrange-stack-v\" [ngClass]=\"{ collapsed: !splitView.isExpanded }\" [attr.aria-expanded]=\"splitView.isExpanded\">\n                      <div class=\"tools-nav-title sme-position-flex-none sme-arrange-stack-h sme-focus-zone\">\n                          <span class=\"sme-position-flex-auto text\">{{strings.toolsTitle}}</span>\n                          <!-- TODO: support aria-expanded related accessiblity feature -->\n                          <button class=\"split-view-toggle sme-button-trigger sme-button-auto-width sme-position-flex-none\" (click)=\"splitView.togglePane()\" [title]=\"splitView.isExpanded?strings.collapse:strings.expand\">\n                              <span class=\"sme-icon\" [ngClass]=\"{ 'sme-icon-chevronLeft': splitView.isExpanded, 'sme-icon-chevronRight': !splitView.isExpanded }\"></span>\n                          </button>\n                      </div>\n                      <!-- TODO: considering support expanding the side bar when search box is focused, not only just when search box is clicked. -->\n                      <div class=\"searchbox searchbox-action-bar sme-position-flex-none sme-focus-zone\" role=\"search\" [title]=\"strings.searchPlaceholder\" (click)=\"expandToolsByClickSearchBox()\">\n                          <div class=\"tool sme-arrange-stack-h search-button\">\n                              <div class=\"tool-icon sme-icon sme-icon-search\"></div>\n                          </div>\n                          <input #searchTextBox type=\"search\" [(ngModel)]=\"filter\" [attr.placeholder]=\"splitView.isExpanded?strings.searchPlaceholder:''\" autofocus (focus)=\"onSearchBoxFocused()\" (blur)=\"onSearchBoxBlured()\">\n                      </div>\n                      <nav #navigation class=\"sme-position-flex-auto sme-arrange-overflow-hide-x sme-arrange-overflow-auto-y sme-padding-bottom-sm\" role=\"navigation\" [attr.aria-label]=\"strings.Nav.Landmark.Secondary.aria.label\">\n                          <a tabindex=0 *ngFor=\"let tool of filteredTools\" [routerLink]=\"tool.link\" class=\"tool sme-arrange-stack-h\" [class.active]=\"router.isActive(tool.link)\" [attr.title]=\"strings.launchTitle.format(tool.entryPoint.displayName)\" [class.sideloaded]=\"tool.entryPoint.parentModule && tool.entryPoint.parentModule.isSideLoaded\"\n                              role=\"button\">\n                              <div *ngIf=\"tool.fontIcon\" class=\"tool-icon sme-icon {{tool.fontIcon}}\"></div>\n                              <div *ngIf=\"tool.urlIcon\" class=\"tool-icon\" [style.background-image]=\"tool.urlIcon\"></div>\n                              <div class=\"tool-label\">\n                                  <div class=\"tool-title\">\n                                      <span class=\"sme-screen-reader\" *ngIf=\"router.isActive(tool.link)\">{{strings.Aria.selected}}</span>\n                                      <span class=\"sme-screen-reader\" *ngIf=\"!router.isActive(tool.link)\">{{strings.Aria.nonSelected}}</span>\n                                      <span [innerHtml]=\"tool.entryPoint.displayName | smeHighlight : filter\"></span>\n                                      <span *ngIf=\"tool.entryPoint.parentModule && tool.entryPoint.parentModule.isSideLoaded\">{{ strings.sideLoadWarning }}</span>\n                                  </div>\n                                  <!-- Uncomment the following to enable keyword searching -->\n                                  <!--<div class=\"keywords\" *ngIf=\"keywordMatches[tool.name]\" [innerHtml]=\"keywordMatches[tool.name] | smeHighlight : filter\"></div>-->\n                              </div>\n                          </a>\n                          <br/>\n                      </nav>\n                  </div>\n                  <div *ngFor=\"let layer of layers\" class=\"overlay sme-scheme-backdrop-opaque\" (click)=\"onOverlayClick(layer)\"></div>\n              </sme-split-view-pane>\n              <sme-split-view-content>\n                  <router-outlet></router-outlet>\n              </sme-split-view-content>\n          </sme-split-view>\n      </div>\n    ",
                    styles: ["\n      .tools-nav {\n          background: white;\n          color: #262626;\n          height: 100%;\n      }\n\n      .tools-nav.collapsed {\n          width: 55px;\n          min-width: initial;\n          overflow: hidden;\n      }\n\n      .tools-nav-title {\n          font-size: 20px;\n          font-weight: 600;\n          padding-left: 15px;\n          overflow: hidden;\n          height: 44px;\n          color: #333;\n      }\n\n      .tools-nav.collapsed .tools-nav-title {\n          padding-left: 0px;\n      }\n\n      .tools-nav-title .text {\n          line-height: 44px;\n      }\n\n      .tools-nav.collapsed .tools-nav-title .text {\n          display: none;\n      }\n\n      .tool.search-button {\n          height: 42px;\n          display: none;\n          cursor: pointer;\n      }\n\n      .tools-nav.collapsed .tool.search-button {\n          display: block;\n      }\n\n      :host>>>.searchbox-action-bar {\n          width: auto;\n      }\n\n      .searchbox {\n          margin: 6px 15px;\n          position: relative;\n      }\n\n      .tools-nav.collapsed .searchbox::after {\n          content: '';\n      }\n\n      .searchbox .tool-icon {\n          line-height: 44px;\n      }\n\n      .tools-nav.collapsed .searchbox {\n          border: none;\n          margin-left: 0;\n          margin-right: 0;\n          padding-left: 0;\n      }\n\n      .tools-nav.collapsed .searchbox input {\n          background: transparent;\n          height: 36px;\n          cursor: pointer;\n      }\n\n      .split-view-toggle {\n          background: transparent;\n          border: none;\n          width: 44px;\n          height: 44px;\n          font-size: 19px;\n          padding: 8px;\n      }\n\n      .tools-nav.collapsed .split-view-toggle {\n          margin: 0;\n          padding: 0;\n          width: 100%;\n      }\n\n      .tools-nav.collapsed nav {\n          margin-right: -50px;\n      }\n\n      .tool {\n          align-content: center;\n          align-items: center;\n          height: 36px;\n          width: 100%;\n          cursor: pointer;\n          white-space: nowrap;\n          font-size: 12px;\n          user-select: none;\n          padding: 0 15px 0 5px;\n          color: #262626;\n          border-left-width: 5px;\n          border-left-style: solid;\n          border-left-color: transparent;\n      }\n\n      .tool:hover,\n      .tool:focus,\n      .tool.active {\n          background: #F2FBFE;\n          color: black;\n      }\n\n      .tool:hover,\n      .tool:focus {\n          text-decoration: underline;\n      }\n\n      .tool:focus {\n          outline: black dashed 1px;\n          outline-offset: -1px;\n      }\n\n      .tool.active {\n          background: #E6F7FE;\n          border-left-color: #327cd4;\n      }\n\n      .tool.sideloaded {\n          color: #f60;\n          font-weight: bold;\n      }\n\n      .tool.sideloaded.active {\n          border-left-color: #f60;\n          color: #f60;\n      }\n\n      .tool-label {\n          display: inline-block;\n          font-size: 13px;\n          margin-right: 15px;\n          overflow: hidden;\n          white-space: nowrap;\n          text-overflow: ellipsis;\n      }\n\n      .tools-nav.collapsed .tool-label {\n          display: none;\n      }\n\n      .tool-title {\n          overflow: hidden;\n          text-overflow: ellipsis;\n      }\n\n      .tool-icon {\n          height: 36px;\n          width: 36px;\n          min-width: 36px;\n          box-sizing: content-box;\n          background-size: 18px;\n          background-position: center;\n          background-repeat: no-repeat;\n          display: inline-block;\n          font-size: 14px;\n          text-align: center;\n          line-height: 36px;\n          vertical-align: middle;\n      }\n\n      .keywords {\n          font-size: 10px;\n          font-style: italic;\n          font-weight: 300;\n      }\n\n      .overlay {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: calc(100% + 1px);\n          height: 100%;\n          z-index: 100000;\n      }\n    "]
                },] },
    ];
    /** @nocollapse */
    MultiToolComponent.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: ShellService, },
        { type: ActivatedRoute, },
        { type: Router, },
    ]; };
    MultiToolComponent.propDecorators = {
        'navigationContainer': [{ type: ViewChild, args: ['navigationContainer',] },],
        'navigation': [{ type: ViewChild, args: ['navigation',] },],
        'splitView': [{ type: ViewChild, args: [SplitViewComponent,] },],
        'searchTextBox': [{ type: ViewChild, args: ['searchTextBox',] },],
    };
    return MultiToolComponent;
}());
export { MultiToolComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL3Rvb2xzL211bHRpLXRvb2wvbXVsdGktdG9vbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBMEQsU0FBQSxFQUFVLE1BQU8sZUFBQSxDQUFnQjtBQUNwRyxPQUFPLEVBQUUsY0FBQSxFQUF3QyxhQUFBLEVBQWUsTUFBQSxFQUE0QixNQUFPLGlCQUFBLENBQWtCO0FBQ3JILE9BQU8sRUFBRSxVQUFBLEVBQXlCLE1BQU8sTUFBQSxDQUFPO0FBQ2hELE9BQU8sRUFBRSxpQkFBQSxFQUErQixrQkFBQSxFQUFtQixNQUFPLHFCQUFBLENBQXNCO0FBQ3hGLE9BQU8sRUFNSCxHQUFHLEVBQ0gsaUJBQWlCLEVBRWpCLDBCQUEwQixFQUMxQixHQUFHLEVBRUgsaUJBQWlCLEVBQ3BCLE1BQU0sa0JBQUEsQ0FBbUI7QUFDMUIsT0FBTyxFQUFFLGtCQUFBLEVBQW1CLE1BQU8sK0JBQUEsQ0FBZ0M7QUFHbkUsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLHdCQUFBLENBQXlCO0FBQ3RELE9BQU8sRUFBRSxZQUFBLEVBQXFDLE1BQU8sZ0NBQUEsQ0FBaUM7QUFXdEY7SUEwQkksNEJBQ1ksVUFBNkIsRUFDN0IsWUFBMEIsRUFDMUIsS0FBcUIsRUFDdEIsTUFBYztRQUp6QixpQkF1QkM7UUF0QlcsZUFBVSxHQUFWLFVBQVUsQ0FBbUI7UUFDN0IsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQTdCbEIsWUFBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3ZFLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFDWixtQkFBYyxHQUE4QixFQUFFLENBQUM7UUFDL0Msa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBRW5DLFdBQU0sR0FBYSxFQUFFLENB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