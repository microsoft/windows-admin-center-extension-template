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
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContextService, BaseDialogComponent, DialogService } from '../../../../angular';
import { connectionTypeConstants, EnvironmentModule } from '../../../../core';
var AddConnectionDialogComponent = /** @class */ (function (_super) {
    __extends(AddConnectionDialogComponent, _super);
    /**
     * Initializes a new instance of the AddConnectionDialogComponent class.
     */
    function AddConnectionDialogComponent(appContextService, dialogService) {
        var _this = _super.call(this, dialogService) || this;
        _this.appContextService = appContextService;
        _this.strings = MsftSme.resourcesStrings().MsftSmeShell.App.Connections.dialogs.add;
        _this.connectionProviders = [];
        _this.tags = [];
        _this.tagSuggestions = [];
        _this.allConnectionProviders = [];
        _this.id = AddConnectionDialogComponent.dialogId;
        return _this;
    }
    AddConnectionDialogComponent.addConnection = function (dialogService, appContextService, options) {
        dialogService.show(AddConnectionDialogComponent.dialogId, options)
            .flatMap(function (result) {
            if (result && result.connections && result.connections.length > 0) {
                var observable = void 0;
                // get token if provided
                if (!result.credentials) {
                    observable = Observable.of(null);
                }
                else {
                    observable = appContextService.authorizationManager.createSecureToken(result.credentials);
                }
                return observable.flatMap(function (token) {
                    // add connections to connection manager
                    result.connections.forEach(function (connection) {
                        connection.name = connection.name.toLocaleLowerCase();
                        if (token) {
                            appContextService.authorizationManager.nodeTokens[connection.name] = token;
                        }
                        appContextService.connectionManager.addOrUpdateConnection(connection, false);
                    });
                    // save the connections to the gateway
                    if (result.tags && result.tags.length > 0) {
                        // if there are tags, then save the connections while tagging them.
                        return appContextService.connectionTagManager.addRemoveTags(result.connections, result.tags, []);
                    }
                    // otherwise, just save the connection normally.
                    return appContextService.connectionManager.saveConnections(result.connections);
                });
            }
            // if there was nothing to save, then we are done.
            return Observable.empty();
        })
            .subscribe();
    };
    AddConnectionDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var curatedConnectionList = [
            connectionTypeConstants.server,
            connectionTypeConstants.windowsClient,
            connectionTypeConstants.cluster,
            connectionTypeConstants.hyperConvergedCluster
        ];
        this.allConnectionProviders = EnvironmentModule.getEntryPointsByType(['connectionProvider'])
            .sort(function (left, right) {
            var leftCuratedIndex = curatedConnectionList.indexOf(left.connectionType);
            var rightCuratedIndex = curatedConnectionList.indexOf(right.connectionType);
            if (leftCuratedIndex >= 0) {
                return (!rightCuratedIndex || rightCuratedIndex < leftCuratedIndex)
                    ? 1
                    : (rightCuratedIndex > leftCuratedIndex ? -1 : 0);
            }
            if (rightCuratedIndex >= 0) {
                return 1;
            }
            return left.connectionTypeName.localeCompareIgnoreCase(right.connectionTypeName);
        });
        this.addConnectionFrame.emitResult.subscribe(function (data) {
            _this.addConnectionFrame.close();
            _this.hide({
                connections: data.results.connections,
                tags: _this.tags,
                credentials: data.results.credentials
            });
        });
    };
    /**
     * Shows the dialog.
     *
     * @param options The options for the dialog.
     * @return The dialog result subject.
     */
    AddConnectionDialogComponent.prototype.show = function (options) {
        var _this = this;
        this.panel.reset();
        var result = _super.prototype.show.call(this, options);
        this.tags = [];
        this.appContextService.connectionTagManager.getTagSuggestions()
            .take(1)
            .subscribe(function (suggestions) { return _this.tagSuggestions = suggestions; });
        // if a connection type filter was passed in, process it
        if (options.connectionTypes && options.connectionTypes.length > 0) {
            // filter out providers that dont match the filter
            this.connectionProviders = this.allConnectionProviders
                .filter(function (acp) { return options.connectionTypes.some(function (type) { return type === acp.connectionType; }); });
            // if there is only one, nevigate directly to it
            if (this.connectionProviders.length === 1) {
                this.openConnectionType(this.connectionProviders.first());
            }
        }
        else {
            // otherwise, show all providers
            this.connectionProviders = this.allConnectionProviders;
        }
        return result;
    };
    AddConnectionDialogComponent.prototype.openConnectionType = function (connectionProvider) {
        this.selectedProvider = connectionProvider;
        this.panel.activate('addConnectionFrame');
        this.addConnectionFrame.open(connectionProvider.connectionType);
    };
    AddConnectionDialogComponent.prototype.closeConnectionType = function () {
        this.addConnectionFrame.close();
        this.panel.back();
        this.selectedProvider = null;
    };
    AddConnectionDialogComponent.prototype.hide = function (result) {
        if (this.addConnectionFrame) {
            this.addConnectionFrame.close();
        }
        _super.prototype.hide.call(this, result);
    };
    /**
     * The method to call when the cancel button is clicked.
     */
    AddConnectionDialogComponent.prototype.onCancel = function () {
        // resolve wit no node name to add
        this.hide(null);
    };
    AddConnectionDialogComponent.dialogId = 'sme-add-connection-dialog';
    AddConnectionDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-add-connection-dialog',
                    template: "\n      <sme-dialog #dialog [actionPane]=\"true\" class=\"no-footer\">\n          <sme-dialog-content>\n              <sme-guided-panel #panel firstPaneId=\"root\" class=\"m-b-xs m-r-sm\">\n                  <sme-guided-pane #pane paneId=\"root\">\n                      <h3 id=\"sme-dialog-title\" class=\"sme-padding-spread-h-sm\">{{strings.title}}</h3>\n                      <div class=\"sme-position-flex-auto sme-arrange-overflow-hide-x sme-arrange-overflow-auto-y\">\n                          <div tabindex=\"0\" *ngFor=\"let provider of connectionProviders\" class=\"connection-type-list-item sme-arrange-stack-h sme-padding-vertical-xs sme-padding-horizontal-lg\" (click)=\"openConnectionType(provider)\" [class.sideloaded]=\"provider.parentModule && provider.parentModule.isSideLoaded\">\n                              <span class=\"sme-position-flex-auto\" [innerHtml]=\"strings.typeTitleFormat | smeFormat:[provider.connectionTypeName]\"></span>\n                              <span *ngIf=\"provider.parentModule && provider.parentModule.isSideLoaded\">{{strings.sideLoadWarning}}</span>\n                              <span class=\"sme-position-flex-none sme-icon sme-icon-chevronRight\"></span>\n                          </div>\n                      </div>\n                      <div class=\"sme-position-flex-none sme-padding-spread-h-sm\">\n                          <div class=\"pull-right\">\n                              <button type=\"button\" (click)=\"onCancel()\">{{strings.buttons.cancel}}</button>\n                          </div>\n                      </div>\n                  </sme-guided-pane>\n                  <sme-guided-pane #pane paneId=\"addConnectionFrame\">\n                      <h3 class=\"sme-position-flex-none sme-arrange-stack-h sme-padding-spread-h-sm\">\n                          <!--TODO: Reenable after 1705 release-->\n                          <!--<span class=\"back-button sme-position-flex-none sme-icon sme-icon-back\" (click)=\"closeConnectionType()\"></span>-->\n                          <span *ngIf=\"selectedProvider\" class=\"sme-position-flex-auto\" [innerHtml]=\"strings.typeTitleFormat | smeFormat:[selectedProvider.connectionTypeName]\"></span>\n                      </h3>\n                      <form class=\"sme-position-flex-none sme-margin-horizontal-lg sme-margin-bottom-lg\">\n                          <sme-form-field type=\"tags\" name=\"tagsInputControl\" [(ngModel)]=\"tags\" [suggestions]=\"tagSuggestions\" [label]=\"strings.tags.label\"></sme-form-field>\n                      </form>\n                      <div class=\"sme-layout-relative sme-position-flex-auto sme-margin-horizontal-lg sme-margin-bottom-sm\">\n                          <sme-loading-wheel *ngIf=\"!addConnectionFrame.ready\"></sme-loading-wheel>\n                          <sme-add-connection-frame #addConnectionFrame></sme-add-connection-frame>\n                      </div>\n                  </sme-guided-pane>\n              </sme-guided-panel>\n          </sme-dialog-content>\n      </sme-dialog>\n    ",
                    styles: ["\n      .connection-type-list-item {\n          cursor: pointer;\n      }\n\n      .connection-type-list-item:hover,\n      .connection-type-list-item:focus {\n          background: #e5f1fb;\n      }\n\n      .connection-type-list-item .sme-icon {\n          vertical-align: top\n      }\n\n      .back-button {\n          cursor: pointer;\n          padding: 0px 10px;\n      }\n\n      .back-button:hover,\n      .back-button:focus {\n          background: #e5f1fb;\n      }\n\n      .connection-type-list-item.sideloaded {\n          color: #f60;\n          font-weight: bold;\n      }\n    "]
                },] },
    ];
    /** @nocollapse */
    AddConnectionDialogComponent.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: DialogService, },
    ]; };
    AddConnectionDialogComponent.propDecorators = {
        'panel': [{ type: ViewChild, args: ['panel',] },],
        'addConnectionFrame': [{ type: ViewChild, args: ['addConnectionFrame',] },],
    };
    return AddConnectionDialogComponent;
}(BaseDialogComponent));
export { AddConnectionDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2RpYWxvZ3MvYWRkLWNvbm5lY3Rpb24tZGlhbG9nL2FkZC1jb25uZWN0aW9uLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQTBCLFNBQUEsRUFBVSxNQUFPLGVBQUEsQ0FBZ0I7QUFFcEUsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLGlCQUFBLENBQWtCO0FBRzdDLE9BQU8sRUFHSCxpQkFBaUIsRUFDakIsbUJBQW1CLEVBR25CLGFBQWEsRUFFaEIsTUFBTSxxQkFBQSxDQUFzQjtBQUM3QixPQUFPLEVBR0gsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUVwQixNQUFNLGtCQUFBLENBQW1CO0FBZ0MxQjtJQUNZLGdEQUEwRTtJQXlEbEY7O09BRUc7SUFDSCxzQ0FBb0IsaUJBQW9DLEVBQUUsYUFBNEI7UUFBdEYsWUFDSSxrQkFBTSxhQUFhLENBQUMsU0FFdkI7UUFIbUIsdUJBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQXpEakQsYUFBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDdkYseUJBQW1CLEdBQWtDLEVBQUUsQ0FBQztRQUV4RCxVQUFJLEdBQWEsRUFBRSxDQUFDO1FBQ3BCLG9CQUFjLEdBQWEsRUFBRSxDQUFDO1FBUTdCLDRCQUFzQixHQUFrQyxFQUFFLENBQUM7UUErQy9ELEtBQUksQ0FBQyxFQUFFLEdBQUcsNEJBQTRCLENBQUMsUUFBUSxDQUFDOztJQUNwRCxDQUFDO0lBOUNhLDBDQUFhLEdBQTNCLFVBQTRCLGFBQTRCLEVBQUUsaUJBQW9DLEVBQUUsT0FBbUM7UUFDL0gsYUFBYSxDQUFDLElBQUksQ0FBd0QsNEJBQTRCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQzthQUNwSCxPQUFPLENBQUMsVUFBQSxNQUFNO1lBQ1gsRUFB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