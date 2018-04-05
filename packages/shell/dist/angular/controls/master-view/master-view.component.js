import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, NgZone, Optional, Output, Renderer2, ViewChild } from '@angular/core';
import { SplitViewComponent } from '../split-view';
var MasterViewComponent = /** @class */ (function () {
    function MasterViewComponent(ngZone, splitView, element, renderer) {
        // After the discussion, the plan is still have master view to coordinate with split view as well as tree table and data table.
        // It's a little tricky to let master view to talk to its parent which is the split view.
        // But we do need a component to implement the common behavior on the UI to avoid duplicate code in each tool.
        // At this moment, master view is the most proper component.
        // Long term wise, we will figure out a better component sitting in the top level of the UI to coordinate with other components
        // and implement common behaviors.
        this.ngZone = ngZone;
        this.splitView = splitView;
        this.element = element;
        this.renderer = renderer;
        this.strings = MsftSme.resourcesStrings().MsftSmeShell.Angular.MasterView;
        this.header = '';
        this.total = 0;
        this.showSelection = true;
        this.showRefresh = true;
        this.showFilter = true;
        this.filterActive = false;
        this.refresh = new EventEmitter();
        this.filter = new EventEmitter();
        this.clearSelection = new EventEmitter();
        this.searchable = true;
        this.selectedItemCount = 0;
        this.dataViewHeight = 0;
        this.isDataListScrolledTotop = true;
        // setup host classes
        renderer.addClass(element.nativeElement, 'sme-layout-absolute');
        renderer.addClass(element.nativeElement, 'sme-position-inset-none');
        renderer.addClass(element.nativeElement, 'sme-arrange-stack-v');
        renderer.addClass(element.nativeElement, 'sme-arrange-overflow-hide');
    }
    Object.defineProperty(MasterViewComponent.prototype, "smeDataTable", {
        get: function () {
            return this.internalSmeDataTable;
        },
        set: function (value) {
            this.internalSmeDataTable = value;
            if (this.internalSmeDataTable) {
                this.internalSmeDataTable.tableAriaLabelledBy = 'master-view-header';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MasterViewComponent.prototype, "selection", {
        set: function (selection) {
            var count = 0;
            if (Array.isArray(selection)) {
                count = selection.length;
            }
            else if (!!selection) {
                count = 1;
            }
            this.selectedItemCount = count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The method to run after the component view initialized
     */
    MasterViewComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            // The "ngAfterViewInit" is still in current check cycle so we should not update the following UI information immediately.
            // So we use setTimeout to defer the following operations to next check cycle.
            _this.searchable = !!_this.searchElement || !!_this.containerElement.nativeElement.querySelector('input[type="search"]');
            _this.updateLayout();
        });
        if (this.splitView) {
            this.splitViewPaneToggledSubscription = this.splitView.paneToggled.subscribe(function () {
                if (_this.dataView && _this.dataViewHeight !== _this.dataView.nativeElement.clientHeight) {
                    _this.updateLayout();
                }
            });
        }
        if (this.smeDataTable) {
            this.dataTableOnFilterSubscription = this.smeDataTable.onFilter.subscribe(function () {
                if (_this.smeDataTable.selection) {
                    var shouldClearSelection = true;
                    if (!_this.requireDataItemUniqueId) {
                        if (_this.smeDataTable.renderedItems.indexOf(_this.smeDataTable.selection) !== -1) {
                            shouldClearSelection = false;
                        }
                    }
                    else {
                        var selectedItemId = _this.requireDataItemUniqueId(_this.smeDataTable.selection);
                        for (var i = 0; i < _this.smeDataTable.renderedItems.length; i++) {
                            var item = _this.smeDataTable.renderedItems[i];
                            var itemId = _this.requireDataItemUniqueId(item);
                            if (itemId === selectedItemId) {
                                shouldClearSelection = false;
                                break;
                            }
                        }
                    }
                    if (shouldClearSelection) {
                        _this.clearSelection.emit();
                    }
                }
            });
        }
    };
    MasterViewComponent.prototype.ngOnDestroy = function () {
        if (this.splitViewPaneToggledSubscription) {
            this.splitViewPaneToggledSubscription.unsubscribe();
        }
        if (this.dataTableOnFilterSubscription) {
            this.dataTableOnFilterSubscription.unsubscribe();
        }
    };
    MasterViewComponent.prototype.updateLayout = function () {
        this.dataViewHeight = this.dataView.nativeElement.clientHeight;
        if (this.smeDataTable) {
            this.smeDataTable.scrollSelectedItemIntoView();
        }
    };
    MasterViewComponent.prototype.ngDoCheck = function () {
        if (this.smeDataTable) {
            this.handleDetailPaneExpanding(this.smeDataTable);
        }
        else if (this.smeTreeTable) {
            this.handleDetailPaneExpanding(this.smeTreeTable);
        }
    };
    MasterViewComponent.prototype.getItemCountText = function () {
        return this.total === 1 ? this.strings.oneItem : this.strings.items.format(this.total);
    };
    MasterViewComponent.prototype.getSelectedCountText = function () {
        return this.strings.selected.format(this.selectedItemCount);
    };
    MasterViewComponent.prototype.getSelectedCountAriaText = function () {
        return this.strings.selectedAria.format(this.selectedItemCount);
    };
    MasterViewComponent.prototype.handleDetailPaneExpanding = function (dataViewControl) {
        var _this = this;
        if (this.splitView) {
            var newDataSelection = null;
            newDataSelection = dataViewControl.renderedItems[dataViewControl.getActiveRenderedItemIndex()];
            var hasItemSelected = !!newDataSelection;
            if (hasItemSelected && newDataSelection !== this.currentDataSelection) {
                if (!this.currentDataSelection || this.currentDataSelection.length === 0) {
                    setTimeout(function () {
                        if (!_this.splitView.isExpanded) {
                            _this.splitView.togglePane();
                        }
                    });
                }
            }
            this.currentDataSelection = newDataSelection;
        }
    };
    MasterViewComponent.prototype.ensureDataItemIsInViewport = function (dataItemSelector, dataViewScrollableContainerSelector) {
        var _this = this;
        setTimeout(function () {
            var selectedItem = _this.dataView.nativeElement.querySelector(dataItemSelector);
            if (selectedItem) {
                var scrollableBody = _this.dataView.nativeElement.querySelector(dataViewScrollableContainerSelector);
                // This offsetTop is only counting from the top of the data view control and not considering the actual scroll top.
                var offsetTop = selectedItem.getBoundingClientRect().top - scrollableBody.getBoundingClientRect().top;
                // If the selected item is not in the view port, scroll it into view.
                if (!(offsetTop >= 0
                    && offsetTop <= scrollableBody.clientHeight - selectedItem.clientHeight)) {
                    selectedItem.scrollIntoView();
                }
            }
        });
    };
    MasterViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-master-view',
                    template: "\n      <h3 class=\"sme-position-flex-none sme-padding-squish-v-lg\" *ngIf=\"header\" id='master-view-header'>{{header}}</h3>\n      <div class=\"sme-position-flex-none sme-padding-horizontal-sm sme-arrange-stack-h sme-arrange-stack-reversed\" #container>\n          <!-- Actions -->\n          <ng-content select='sme-action-bar,.action-bar'></ng-content>\n\n          <div class=\"sme-position-flex-none sme-arrange-stack-h sme-padding-horizontal-sm\">\n              <!-- Counts -->\n              <div class=\"sme-focus-zone sme-position-flex-none sme-arrange-ws-nowrap sme-scheme-secondary-text\" [class.sme-margin-right-xs]=\"selectedItemCount === 0 || !showSelection\">\n                  <i class=\"sme-layout-action-bar-item\">{{getItemCountText()}}</i>\n                  <button type=\"button\" role=\"button\" class=\"sme-button-trigger sme-layout-action-bar-item-height sme-scheme-secondary-text sme-button-auto-width\" *ngIf=\"selectedItemCount > 0 && showSelection\" (click)=\"clearSelection.next()\">\n                    <i aria-hidden=\"true\">{{getSelectedCountText()}}</i>\n                    <i class=\"sme-screen-reader\">{{getSelectedCountAriaText()}}</i>\n                    <i aria-hidden class=\"sme-icon sme-icon-clear sme-margin-left-xs\" [title]=\"strings.selectedTitle\"></i>\n                  </button>\n              </div>\n              <!-- Common Actions -->\n              <div class=\"sme-focus-zone\">\n                  <button *ngIf=\"showRefresh\" (click)=\"refresh.next()\" type=\"button\" role=\"button\" [title]=\"strings.refresh.title\" [attr.aria-label]=\"strings.refresh.title\" class=\"sme-layout-action-bar-item-height sme-button-trigger sme-button-auto-width\">\n                    <span class=\"sme-icon sme-icon-refresh\"></span>\n                  </button>\n                  <button *ngIf=\"showFilter\" (click)=\"filter.next()\" type=\"button\" role=\"button\" [title]=\"strings.filter.title\" [attr.aria-label]=\"strings.filter.title\" class=\"sme-layout-action-bar-item-height sme-button-trigger sme-button-auto-width\" [class.sme-toggled]=\"filterActive\">\n                      <span class=\"sme-icon sme-icon-filter\"></span>\n                  </button>\n              </div>\n              <!-- Grouping -->\n              <div class=\"sme-focus-zone\">\n                  <div *ngIf=\"showCustomFilter\" class=\"sme-margin-right-sm\">\n                      <ng-content select='.sme-master-view-custom-filter'></ng-content>\n                  </div>\n              </div>\n              <!-- Search Box -->\n              <div class=\"sme-focus-zone\">\n                  <div *ngIf=\"searchable\" class=\"sme-position-flex-none searchbox sme-layout-action-bar-item sme-margin-right-xl\">\n                      <ng-content select='input[type=search]'></ng-content>\n                  </div>\n              </div>\n          </div>\n      </div>\n      <div #dataView class=\"sme-layout-relative sme-position-flex-auto sme-arrange-stack-h sme-arrange-overflow-hide\" [class.sme-shadow-scrolled-content]='!isDataListScrolledTotop'>\n          <ng-content></ng-content>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    MasterViewComponent.ctorParameters = function () { return [
        { type: NgZone, },
        { type: SplitViewComponent, decorators: [{ type: Optional },] },
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    MasterViewComponent.propDecorators = {
        'searchElement': [{ type: ContentChild, args: ['search',] },],
        'containerElement': [{ type: ViewChild, args: ['container',] },],
        'dataView': [{ type: ViewChild, args: ['dataView',] },],
        'smeDataTable': [{ type: ContentChild, args: ['smeDataTable',] },],
        'smeTreeTable': [{ type: ContentChild, args: ['smeTreeTable',] },],
        'header': [{ type: Input },],
        'total': [{ type: Input },],
        'showSelection': [{ type: Input },],
        'showRefresh': [{ type: Input },],
        'showFilter': [{ type: Input },],
        'filterActive': [{ type: Input },],
        'selection': [{ type: Input },],
        'requireDataItemUniqueId': [{ type: Input },],
        'showCustomFilter': [{ type: Input },],
        'refresh': [{ type: Output },],
        'filter': [{ type: Output },],
        'clearSelection': [{ type: Output },],
        'updateLayout': [{ type: HostListener, args: ['window:resize',] },],
    };
    return MasterViewComponent;
}());
export { MasterViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvbWFzdGVyLXZpZXcvbWFzdGVyLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLFVBQVUsRUFDVixZQUFZLEVBRVosWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNaLE1BQU0sZUFBQSxDQUFnQjtBQUl2QixPQUFPLEVBQUUsa0JBQUEsRUFBbUIsTUFBTyxlQUFBLENBQWdCO0FBR25EO0lBMkVJLDZCQUNZLE1BQWMsRUFDYixTQUE2QixFQUM5QixPQUFtQixFQUNuQixRQUFtQjtRQUUzQiwrSEFBK0g7UUFDL0gseUZBQXlGO1FBQ3pGLDhHQUE4RztRQUM5Ryw0REFBNEQ7UUFDNUQsK0hBQStIO1FBQy9ILGtDQUFrQztRQVYxQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2IsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBMUV4QixZQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUF5QjdFLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFFWixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRVYsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFFckIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsZUFBVSxHQUFHLElBQUksQ0FBQztRQUVsQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQW1CdEIsWUFBTyxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBR3ZELFdBQU0sR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUd0RCxtQkFBYyxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTlELGVBQVUsR0FBRyxJQUFJLENBQUM7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LEVBQUcsRUFBRSxFQUFFO1FBQzlELGtCQUFrQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRyxFQUFFLEVBQUU7UUFDakUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRyxFQUFFLEVBQUU7UUFDeEQsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLGNBQWMsRUFBRyxFQUFFLEVBQUU7UUFDbkUsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLGNBQWMsRUFBRyxFQUFFLEVBQUU7UUFDbkUsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDNUIsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDM0IsZUFBZSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDbkMsYUFBYSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDakMsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDbEMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDL0IseUJBQXlCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM3QyxrQkFBa0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3RDLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzlCLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzdCLGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLGVBQWUsRUFBRyxFQUFFLEVBQUU7S0FDbkUsQ0FBQztJQUNGLDBCQUFDO0NBclNELEFBcVNDLElBQUE7U0FyU1ksbUJBQW1CIiwiZmlsZSI6Im1hc3Rlci12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=