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
import { ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, NgZone, Optional, Output, ViewChild } from '@angular/core';
import { CoreEnvironment, Dom, KeyCode } from '../../../core';
import { DataTableColumnComponent } from './data-table-column.component';
import { DataTableRenderedItemType, DataTableSortMode } from './data-table-contract';
/**
 * Data table component
 */
var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(changeDetector, ngZone, layout) {
        this.changeDetector = changeDetector;
        this.ngZone = ngZone;
        this.layout = layout;
        this.strings = MsftSme.resourcesStrings();
        this.maxActualScrollDataElementHeight = 500000;
        this.filterDebounceTimeout = 300;
        this.keyboardNavigationDebounceTimeout = 100;
        this.scrollCheckIntervalDuration = 300;
        this.navigationKeyboardDebouncing = false;
        this.bufferRowRate = 0.5;
        this.eventUnregistraterHandlers = [];
        this.internalRenderedItems = [];
        this.isLoading = true;
        this.internalSelection = [];
        this.currentStartIndexOfItemInViewPort = -1;
        this.internalGroupSortMode = DataTableSortMode.None;
        this.activeRenderedItemIndex = -1;
        this.renderedItemStartIndexOffset = 0;
        this.currentColumnIndexWithFocusedElement = -1;
        this.contentAreaHasFocus = false;
        this.cancelLastFocusableShadowElementFocusOnce = false;
        this.groupKeys = {};
        this.treeToggleStatus = {};
        /**
         * It emits the event when selection changing is happening.
         */
        this.selectionChange = new EventEmitter();
        this.onRowDblclick = new EventEmitter();
        this.onGroupToggleClicked = new EventEmitter();
        this.filteredItems = [];
        /**
         * It indicates rendered items are changed.
         */
        this.renderedItemsChange = new EventEmitter();
        /**
         * It indicates that a data lazy loading needs to happen and require the consumer to provide data for the lazy loading part.
         */
        this.lazyLoadingData = new EventEmitter();
        /**
         * It triggers when a tree node is expanded.
         */
        this.onNodeExpand = new EventEmitter();
        /**
         * It triggers when a tree node is selected.
         */
        this.onNodeSelect = new EventEmitter();
        /**
         * It exposes the enum type then in template we can directly refer to the enum value name instead of enum value number.
         */
        this.sortModeEnum = DataTableSortMode;
        /**
         * It exposes the enum type then in template we can directly refer to the enum value name instead of enum value number.
         */
        this.renderedItemTypeEnum = DataTableRenderedItemType;
        /**
         * It emits the event when filtering is happening.
         */
        this.onFilter = new EventEmitter();
        this.doCustomSort = new EventEmitter();
        /**
         * It emits the event when a row is selected.
         */
        this.onRowSelect = new EventEmitter();
        /**
         * It emits the event when a row is unselected and no row is selected.
         */
        this.onRowUnselect = new EventEmitter();
        /**
         * It indicates whether to show the header.
         */
        this.showHeader = true;
        /**
         * It indicates should the data table has the grid.
         */
        this.showGrid = true;
        /**
         * It indicates whether to show the "all item" checkbox.
         */
        this.showAllItemCheckbox = true;
        /**
         * It indicates whether to check the item and uncheck other items when the current item is checked.
         */
        this.selectAndCheck = true;
        /**
         * It indicates the row height for each item.
         */
        this.rowHeight = 30;
        /**
         * It indicates whether to link the selections of parent nodes and child nodes.
         * It only apply to tree table scenario.
         */
        this.linkParentChildrenSelections = true;
        /**
         * It indicates whether to select the item when navigating with the keyboard (e.g. arrow keys, home, end, page up, page down)
         */
        this.selectItemWhenNavigatingWithKeyboard = true;
        /**
         * It indicates whether to show the left margin in each row.
         */
        this.showLeftMargin = true;
        /**
         * It indicates whether the data table is scrollable.
         */
        this.scrollable = true;
        /**
         * It indicates whether the data table items are selectable
         */
        this.selectable = true;
        /**
         * It indicates the default status of the group toggle.
         */
        this.defaultGroupToggleExpanded = true;
        this.groupToggleStatus = {};
    }
    Object.defineProperty(DataTableComponent.prototype, "columns", {
        /**
         * It indicates the columns rendered on the UI.
         */
        get: function () {
            return this.internalColumns;
        },
        set: function (value) {
            this.internalColumns = value;
            this.processColumns();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "renderedItems", {
        /**
         * It indicates the item rendered on the UI (including the items in and outside of view port).
         */
        get: function () {
            return this.internalRenderedItems;
        },
        set: function (value) {
            this.internalRenderedItems = value || [];
            this.renderedItemsChange.emit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "globalFilter", {
        /**
         * It gets and sets the global filter value html element.
         */
        get: function () {
            return this.internalGlobalFilter;
        },
        set: function (globalFilter) {
            var _this = this;
            var eventHandler = (function (event) {
                clearTimeout(_this.filterDebounceTimer);
                _this.filterDebounceTimer = setTimeout(function () {
                    _this.filterKeyword = globalFilter['value'];
                    if (_this.filterKeyword !== _this.oldFilterKeyword) {
                        _this.clearSelection();
                        _this.onFilter.emit(_this.filterKeyword);
                        _this.renderItems(false, true);
                    }
                    _this.oldFilterKeyword = _this.filterKeyword;
                }, _this.filterDebounceTimeout);
            }).bind(this);
            this.internalGlobalFilter = globalFilter;
            if (globalFilter) {
                globalFilter.addEventListener('keyup', eventHandler);
                globalFilter.addEventListener('paste', eventHandler);
                this.eventUnregistraterHandlers.push(function () {
                    globalFilter.removeEventListener('keyup', eventHandler);
                    globalFilter.removeEventListener('paste', eventHandler);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "items", {
        /**
         * It gets and sets the data source of the data table.
         */
        get: function () {
            return this.internalItems;
        },
        set: function (value) {
            this.internalItems = value;
            this.isLoading = !value;
            this.renderItems(false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "selection", {
        /**
         * It gets and sets the selection of the data source.
         */
        get: function () {
            if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
                return this.internalSelection;
            }
            if (this.internalSelection.length > 0) {
                return this.internalSelection[0];
            }
            return null;
        },
        set: function (selection) {
            var _this = this;
            if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
                this.internalSelection = selection || [];
                if (this.showAsTree) {
                    this.filteredItems.forEach(function (item) {
                        _this.handleTreeNodeSelection(item, false, true, !_this.linkParentChildrenSelections, selection.map(function (selectionItem) { return selectionItem.data; }));
                    });
                }
            }
            else {
                this.internalSelection = selection ? [selection] : [];
            }
            this.updateActiveRenderedItemIndexBySelection();
            this.selectionChange.emit(selection);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "selectionMode", {
        get: function () {
            return this.internalSelectionMode;
        },
        set: function (value) {
            this.internalSelectionMode = value;
            // The following code is a temp code to solve the problem that:
            // when the data table is multiple selection mode and an initial array value is assigned to the selection property,
            // at that moment the selectionMode property is not set to multiple selection mode value, yet.
            // So we treat the initial array value as a member of the selection array instead of the selection array.
            // So we use the following code to fix this problem.
            // TODO: long term wise, we need to use seperated selection properties to maintain the selections of selection
            // selection and multiple selection.
            // This change will happen in the coming release.
            if (value === DataTableComponent.selectionModeMultipleOption) {
                if (Array.isArray(this.internalSelection) && this.internalSelection.length === 1 && Array.isArray(this.internalSelection[0])) {
                    this.internalSelection = this.internalSelection[0];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "groupColumn", {
        /**
         * It gets or sets the group column.
         */
        get: function () {
            return this.internalGroupColumn;
        },
        set: function (value) {
            this.internalGroupColumn = value;
            this.processColumns();
            this.renderItems(false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableComponent.prototype, "groupSortMode", {
        /**
         * It gets or sets the group sort mode.
         */
        get: function () {
            return this.internalGroupSortMode;
        },
        set: function (value) {
            this.internalGroupSortMode = value;
            this.renderItems(false, true);
        },
        enumerable: true,
        configurable: true
    });
    DataTableComponent.prototype.refreshData = function () {
        this.renderItems(true);
    };
    DataTableComponent.prototype.resetScroll = function () {
        // Set the scrollTop(distance from the element's top to its topmost visible content)
        // of Scroll container to 0.
        this.scrollContainerElement.nativeElement.scrollTop = 0;
        // No need to reset 'this.currentStartIndexOfItemInViewPort' to 0, as it will automatically get
        // adjusted to 0 in 'calculateItemInViewPort()'.
    };
    DataTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.windowResizeEventHandler = this.onLayoutChanged.bind(this);
        if (this.layout) {
            this.layoutChangeSubscriber = this.layout.layoutChanged.subscribe(function () {
                _this.onLayoutChanged();
            });
        }
        else {
            window.addEventListener('resize', this.windowResizeEventHandler);
        }
        if (this.defaultSortColumn && this.defaultSortMode) {
            this.sortColumn = this.defaultSortColumn;
            this.sortColumn.sortMode = this.defaultSortMode;
        }
        this.updateActiveRenderedItemIndexBySelection();
        this.unregisterOnElementFocusingEventHandler =
            CoreEnvironment.accessibilityManager.registerElementFocusingEvent(this.onElementFocusing.bind(this));
        setTimeout(function () {
            var nextElement = Dom.getNextFocusableElementInTrap(_this.scrollDataElement.nativeElement);
            _this.shouldUseLastFocusableShadowElement = !nextElement;
        });
    };
    DataTableComponent.prototype.onHeaderTablePressed = function (event) {
        var shouldPreventDefaultKeyboardAction = false;
        switch (event.keyCode) {
            case KeyCode.UpArrow:
                shouldPreventDefaultKeyboardAction = true;
                break;
            case KeyCode.DownArrow:
                shouldPreventDefaultKeyboardAction = true;
                this.moveToHeadOfRenderedItems();
                setTimeout(function () {
                    var currentElement = event.target;
                    var nextElement = Dom.getNextZoneElement(currentElement);
                    nextElement.focus();
                });
                break;
        }
        if (shouldPreventDefaultKeyboardAction) {
            event.stopPropagation();
            event.preventDefault();
        }
    };
    DataTableComponent.prototype.onContentTablePressed = function (event) {
        var _this = this;
        CoreEnvironment.accessibilityManager.changeAccessibilityMode(true);
        var targetElement = event.target;
        var currentRow = Dom.getSpecificAncestor(targetElement, function (element) { return element.tagName === 'TR'; });
        var shouldPreventDefaultKeyboardAction = false;
        var currentRenderedItem = this.renderedItems[this.getActiveRenderedItemIndex()];
        // Only the scrolling related navigation keyboard operations need debouncing.
        switch (event.keyCode) {
            case KeyCode.Home:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    this.moveToHeadOfRenderedItems();
                }
                break;
            case KeyCode.PageUp:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    this.moveToPreviousPageOfRenderedItems();
                }
                break;
            case KeyCode.UpArrow:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    if (this.getActiveRenderedItemIndex() > 0) {
                        this.moveToPreviousRenderedItem();
                    }
                    else {
                        setTimeout(function () {
                            var currentElement = event.target;
                            var previousElement = Dom.getPreviousZoneElement(currentElement);
                            previousElement.focus();
                        });
                    }
                }
                break;
            case KeyCode.DownArrow:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    this.moveToNextRenderedItem();
                }
                break;
            case KeyCode.PageDown:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    this.moveToNextPageOfRenderedItems();
                }
                break;
            case KeyCode.End:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    this.moveToEndOfRenderedItems();
                }
                break;
            case KeyCode.Enter:
                shouldPreventDefaultKeyboardAction = true;
                if (!this.navigationKeyboardDebouncing) {
                    this.doubleClickRow(event, currentRenderedItem);
                }
                break;
            case KeyCode.LeftArrow:
                shouldPreventDefaultKeyboardAction = true;
                if (currentRenderedItem.type === DataTableRenderedItemType.GroupHeader) {
                    if (this.groupToggleStatus[currentRenderedItem.data]) {
                        this.clickGroupToggle(currentRenderedItem, false);
                    }
                    else {
                        for (var i = this.activeRenderedItemIndex - 1; i >= 0; i--) {
                            if (this.renderedItems[i].type === DataTableRenderedItemType.GroupHeader) {
                                this.activateRenderedItemByIndex(i, true);
                                break;
                            }
                        }
                    }
                }
                else if (currentRenderedItem.type === DataTableRenderedItemType.GroupItem) {
                    for (var i = this.activeRenderedItemIndex - 1; i >= 0; i--) {
                        if (this.renderedItems[i].type === DataTableRenderedItemType.GroupHeader) {
                            this.activateRenderedItemByIndex(i, true);
                            break;
                        }
                    }
                }
                else if (currentRenderedItem.type === DataTableRenderedItemType.TreeNode) {
                    if (currentRenderedItem.node.expanded && !currentRenderedItem.node.isLeaf) {
                        this.clickTreeToggle(currentRenderedItem, false);
                    }
                    else {
                        var parentNode = this.renderedItems[this.activeRenderedItemIndex].node.parent;
                        for (var i = this.activeRenderedItemIndex - 1; i >= 0; i--) {
                            if (this.renderedItems[i].node === parentNode) {
                                this.activateRenderedItemByIndex(i, true);
                                break;
                            }
                        }
                    }
                }
                else {
                    var previousElement = Dom.getPreviousFocusableElement(targetElement);
                    var rowForPreviousElement = Dom.getSpecificAncestor(previousElement, function (element) { return element.tagName === 'TR'; });
                    var cellForPreviousElement = Dom.getSpecificAncestor(previousElement, function (element) { return element.tagName === 'TD'; });
                    if (cellForPreviousElement) {
                        this.currentColumnIndexWithFocusedElement = -1;
                        for (var i = 0; cellForPreviousElement && i < cellForPreviousElement.parentElement.children.length; i++) {
                            if (cellForPreviousElement.parentElement.children[i] === cellForPreviousElement) {
                                if (i === 0 && previousElement.tagName === 'INPUT'
                                    && previousElement.parentElement.classList.contains('datatable-checkbox')) {
                                    // If the previousElement is the checkbox is in the first column, then skip it, directly go to the row.
                                    previousElement = rowForPreviousElement;
                                }
                                else {
                                    this.currentColumnIndexWithFocusedElement = i;
                                }
                                break;
                            }
                        }
                    }
                    if (previousElement === currentRow || rowForPreviousElement !== currentRow) {
                        this.currentColumnIndexWithFocusedElement = -1;
                    }
                    if (rowForPreviousElement === currentRow) {
                        previousElement.focus();
                    }
                }
                break;
            case KeyCode.RightArrow:
                shouldPreventDefaultKeyboardAction = true;
                if (currentRenderedItem.type === DataTableRenderedItemType.GroupHeader) {
                    if (!this.groupToggleStatus[currentRenderedItem.data]) {
                        this.clickGroupToggle(currentRenderedItem, true);
                    }
                    else {
                        for (var i = this.activeRenderedItemIndex + 1; i < this.renderedItems.length; i++) {
                            if (this.renderedItems[i].type === DataTableRenderedItemType.GroupHeader) {
                                this.activateRenderedItemByIndex(i, true);
                                break;
                            }
                        }
                    }
                }
                else if (currentRenderedItem.type === DataTableRenderedItemType.GroupItem) {
                    for (var i = this.activeRenderedItemIndex + 1; i < this.renderedItems.length; i++) {
                        if (this.renderedItems[i].type === DataTableRenderedItemType.GroupHeader) {
                            this.activateRenderedItemByIndex(i, true);
                            break;
                        }
                    }
                }
                else if (currentRenderedItem.type === DataTableRenderedItemType.TreeNode && !currentRenderedItem.node.isLeaf) {
                    if (!currentRenderedItem.node.expanded) {
                        this.clickTreeToggle(currentRenderedItem, true);
                    }
                    else {
                        this.moveToNextRenderedItem();
                    }
                }
                else {
                    var nextElement = Dom.getNextFocusableElement(targetElement);
                    var rowForNextElement = Dom.getSpecificAncestor(nextElement, function (element) { return element.tagName === 'TR'; });
                    var cellForNextElement = Dom.getSpecificAncestor(nextElement, function (element) { return element.tagName === 'TD'; });
                    if (cellForNextElement) {
                        this.currentColumnIndexWithFocusedElement = -1;
                        for (var i = 0; cellForNextElement && i < cellForNextElement.parentElement.children.length; i++) {
                            if (cellForNextElement.parentElement.children[i] === cellForNextElement) {
                                if (i === 0 && nextElement.tagName === 'INPUT'
                                    && nextElement.parentElement.classList.contains('datatable-checkbox')) {
                                    // If the nextElement is the checkbox in first column, move on the next candidate.
                                    nextElement = Dom.getNextFocusableElement(nextElement);
                                    rowForNextElement = Dom.getSpecificAncestor(nextElement, function (element) { return element.tagName === 'TR'; });
                                    cellForNextElement = Dom.getSpecificAncestor(nextElement, function (element) { return element.tagName === 'TD'; });
                                }
                                else {
                                    this.currentColumnIndexWithFocusedElement = i;
                                    break;
                                }
                            }
                        }
                    }
                    if (this.currentColumnIndexWithFocusedElement !== -1
                        && currentRow === rowForNextElement) {
                        nextElement.focus();
                    }
                }
                break;
            case KeyCode.Space:
                if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
                    this.onItemCheckBoxClicked(currentRenderedItem);
                    shouldPreventDefaultKeyboardAction = true;
                }
                break;
        }
        if (shouldPreventDefaultKeyboardAction) {
            event.stopPropagation();
            event.preventDefault();
            this.navigationKeyboardDebouncing = true;
            this.changeDetector.detectChanges();
            setTimeout(function () {
                _this.navigationKeyboardDebouncing = false;
            }, this.keyboardNavigationDebounceTimeout);
        }
    };
    DataTableComponent.prototype.onContentItemFocused = function (event) {
        var _this = this;
        this.contentAreaHasFocus = true;
        setTimeout(function () {
            _this.scrollBodyElement.nativeElement.scrollTop = 0;
        });
    };
    DataTableComponent.prototype.onContentItemBlurred = function (event) {
        var _this = this;
        this.contentAreaHasFocus = false;
        setTimeout(function () {
            _this.scrollBodyElement.nativeElement.scrollTop = 0;
        });
    };
    DataTableComponent.prototype.onLastFocusableShadowElementFocused = function (event) {
        var _this = this;
        setTimeout(function () {
            if (!_this.cancelLastFocusableShadowElementFocusOnce) {
                _this.tryToFocusSelectedRow();
            }
            _this.cancelLastFocusableShadowElementFocusOnce = false;
        });
    };
    DataTableComponent.prototype.generateNGClassForRenderedItem = function (renderedItem) {
        return {
            selected: renderedItem.index === this.getActiveRenderedItemIndex(),
            'group-item': renderedItem.type === DataTableRenderedItemType.GroupItem,
            'group-header': renderedItem.type === DataTableRenderedItemType.GroupHeader,
            checked: this.isItemSelected(renderedItem)
        };
    };
    DataTableComponent.prototype.shouldAllItemCheckBoxChecked = function () {
        var result = false;
        if (!this.showAsTree) {
            result = this.selection && this.selection.length === this.filteredItems.length;
        }
        else {
            result = true;
            for (var i = 0; i < this.filteredItems.length; i++) {
                var treeNodeDataItem = this.filteredItems[i];
                if (!treeNodeDataItem || !treeNodeDataItem.selected) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    };
    /**
     * It implements the AfterViewInit interface.
     */
    DataTableComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.calculateScrollbarWidth();
        var scrollHandler = (function () {
            _this.isScrolledDown = _this.scrollContainerElement.nativeElement.scrollTop > 0;
            _this.isScrolling = true;
            if (!_this.isScrolledDown) {
                _this.renderedItemStartIndexOffset = 0;
            }
            if (_this.lazyLoad) {
                // If the lazy loading is enabled, reduce the freqency of handling scrolling
                // especially doing the data lazy loading
                _this.isScrollingEventHandlerSetup = false;
                clearInterval(_this.scrollCheckInterval);
            }
            if (!_this.isScrollingEventHandlerSetup) {
                _this.isScrollingEventHandlerSetup = true;
                _this.ngZone.runOutsideAngular(function () {
                    _this.scrollCheckInterval = setInterval(function () {
                        if (_this.isScrolling) {
                            _this.ngZone.run(function () {
                                _this.calculateItemInViewPort();
                            });
                        }
                    }, _this.scrollCheckIntervalDuration);
                });
            }
        });
        this.scrollContainerElement.nativeElement.addEventListener('scroll', scrollHandler);
        this.eventUnregistraterHandlers.push(function () {
            _this.scrollContainerElement.nativeElement.removeEventListener('scroll', scrollHandler);
        });
        this.initializeUI();
    };
    /**
     * It implements the OnDestroy interface.
     */
    DataTableComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.scrollCheckInterval);
        this.eventUnregistraterHandlers.forEach(function (item) {
            item();
        });
        this.unregisterOnElementFocusingEventHandler();
        window.removeEventListener('resize', this.windowResizeEventHandler);
        if (this.layoutChangeSubscriber) {
            this.layoutChangeSubscriber.unsubscribe();
        }
    };
    /**
     * It implements the AfterViewChecked interface.
     */
    DataTableComponent.prototype.ngAfterViewChecked = function () {
        this.alignContent();
        this.alignScrollBar();
    };
    /**
     * It handles the selection of the given data table item.
     */
    DataTableComponent.prototype.selectItem = function (event, item) {
        var _this = this;
        this.activeRenderedItemIndex = item.index;
        if (this.selectable) {
            if (item.type !== DataTableRenderedItemType.GroupHeader) {
                if (event && event.target['type'] === 'checkbox') {
                    return;
                }
                if (this.showAsTree) {
                    if (this.selectionMode !== DataTableComponent.selectionModeMultipleOption) {
                        this.selection = item.node;
                    }
                    else {
                        if (this.selectAndCheck) {
                            this.items.forEach(function (currentItem) {
                                _this.handleTreeNodeSelection(currentItem, false, true);
                            });
                            this.handleTreeNodeSelection(item.node, true, false, !this.linkParentChildrenSelections);
                            this.selectionChange.emit(this.internalSelection);
                        }
                    }
                    this.onNodeSelect.emit({ node: item.node });
                }
                else {
                    if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
                        if (this.selectAndCheck) {
                            this.selection = [item.data];
                        }
                    }
                    else {
                        this.selection = item.data;
                    }
                    this.onRowSelect.emit({ data: item.data });
                }
            }
            if (event && !Dom.isFocusable(event.target)) {
                this.tryToFocusSelectedRow();
            }
        }
    };
    /**
     * It returns the placeholder message when the actual data is not rendering.
     */
    DataTableComponent.prototype.getPlaceholderMessage = function () {
        return this.isLoading ? (this.loadingMessage || this.strings.MsftSmeShell.Angular.DataTable.Loading)
            : (this.noRecordMessage || this.strings.MsftSmeShell.Angular.DataTable.NoRecordsFound);
    };
    /**
     * It handles the behavior that when a group toggle is clicked.
     */
    DataTableComponent.prototype.clickGroupToggle = function (item, toggleStatusOverriddenValue) {
        this.activeRenderedItemIndex = item.index;
        this.groupToggleStatus[item.data] = toggleStatusOverriddenValue !== undefined ?
            toggleStatusOverriddenValue : !this.groupToggleStatus[item.data];
        this.onGroupToggleClicked.emit(item.data);
        this.renderItems(false, true);
    };
    /**
     * It handles the behavior that when a tree node toggle is clicked.
     */
    DataTableComponent.prototype.clickTreeToggle = function (item, toggleStatusOverriddenValue) {
        this.activeRenderedItemIndex = item.index;
        item.node.expanded = toggleStatusOverriddenValue !== undefined ? toggleStatusOverriddenValue : !item.node.expanded;
        if (item.node.expanded) {
            this.onNodeExpand.emit({ node: item.node });
        }
        var identity = this.getTreeNodeDataIdentity(item.node);
        this.treeToggleStatus[identity] = item.node.expanded;
        this.renderItems(false, true);
    };
    /**
     * It expands all the groups.
     */
    DataTableComponent.prototype.expandAllGroup = function () {
        for (var group in this.groupToggleStatus) {
            if (this.groupToggleStatus.hasOwnProperty(group)) {
                this.groupToggleStatus[group] = true;
            }
        }
        this.renderItems(false, true);
    };
    /**
     * It collapses all the groups.
     */
    DataTableComponent.prototype.collaseAllGroup = function () {
        for (var group in this.groupToggleStatus) {
            if (this.groupToggleStatus.hasOwnProperty(group)) {
                this.groupToggleStatus[group] = false;
            }
        }
        this.renderItems(false, true);
    };
    /**
     * It returns the boolean to indicate whether the given column is the first data column.
     * The returned value can be used to add some custom css for the first data column when grouping is enabled.
     */
    DataTableComponent.prototype.isFirstDataColumn = function (column) {
        var _this = this;
        var firstDataColumn = null;
        this.actualColumns.forEach(function (currentColumn) {
            if (currentColumn !== _this.groupColumn && !firstDataColumn) {
                firstDataColumn = currentColumn;
            }
        });
        return column === firstDataColumn;
    };
    DataTableComponent.prototype.onColumnResizing = function (event) {
        this.resizerIndicator.nativeElement.style.opacity = '0.5';
        this.resizerIndicator.nativeElement.classList.remove('sme-layout-none');
        this.resizerIndicator.nativeElement.style.left = event.x + 'px';
    };
    DataTableComponent.prototype.onColumnResized = function (columnIndex, event) {
        var _this = this;
        this.resizerIndicator.nativeElement.classList.add('sme-layout-none');
        var columnHeaderElements = this.headerTableElement.nativeElement.querySelectorAll('.data-column');
        var newColumnWidths = [];
        var totalWidth = 0;
        for (var i = 0; i < columnHeaderElements.length; i++) {
            newColumnWidths.push(columnHeaderElements[i].offsetWidth);
            totalWidth += columnHeaderElements[i].offsetWidth;
        }
        // The resizer is at the right border of the current column.
        // When the resizing happens, it means resizing the current column with delta amount 
        // and resizing the next column with -delta amount.
        var currentColumnHeaderElement = columnHeaderElements[columnIndex];
        var newWidthForCurrentColumn = currentColumnHeaderElement.offsetWidth + event.x;
        // If the nextColumnHeader is hidden, that means it's a group column header which should be hidden.
        // A hidden group header's width should not be counted.
        // Then set the nextColumnIndex to the next next column's index.
        var nextColumnIndex = columnIndex + (columnHeaderElements[columnIndex + 1].hasAttribute('hidden') ? 2 : 1);
        var nextColumnHeaderElement = columnHeaderElements[nextColumnIndex];
        var newWidthForNextColumn = nextColumnHeaderElement.offsetWidth - event.x;
        // If the newWidthForCurrentColumn is less then minColumnWidth, it means the user is trying to drag the resizer to very left
        // to make the next column very wide.
        // In this case, we will try to make sure the next column can be resized to as wide as the user wants.
        // The left side columns of the next column will be shrinked based on their own original percentage width.
        if (newWidthForCurrentColumn < DataTableComponent.minColumnWidth) {
            var consumedWidthRightSideColumns = 0;
            for (var i = nextColumnIndex + 1; i < columnHeaderElements.length; i++) {
                consumedWidthRightSideColumns += columnHeaderElements[i].offsetWidth;
            }
            var originalWidthForLeftSideColumns = totalWidth - consumedWidthRightSideColumns - nextColumnHeaderElement.offsetWidth;
            var availableWidthForLeftSideColumns = totalWidth - consumedWidthRightSideColumns - newWidthForNextColumn;
            var actualWidthForLeftSideColumns = 0;
            for (var i = 0; i <= columnIndex; i++) {
                var newColumnWidth = Math.max(availableWidthForLeftSideColumns * (columnHeaderElements[i].offsetWidth / originalWidthForLeftSideColumns), DataTableComponent.minColumnWidth);
                newColumnWidths[i] = newColumnWidth;
                actualWidthForLeftSideColumns += newColumnWidth;
            }
            newWidthForCurrentColumn = newColumnWidths[columnIndex];
            newWidthForNextColumn = totalWidth - consumedWidthRightSideColumns - actualWidthForLeftSideColumns;
        }
        // If the newWidthForNextColumn is less then minColumnWidth, it means the user is trying to drag the resizer to very right
        // to make the current column very wide.
        // In this case, we will try to make sure the current column can be resized to as wide as the user wants.
        // The right side columns of the current column will be shrinked based on their own original percentage width.
        if (newWidthForNextColumn < DataTableComponent.minColumnWidth) {
            var consumedWidthLeftSideColumns = 0;
            for (var i = 0; i < columnIndex - 1; i++) {
                consumedWidthLeftSideColumns += columnHeaderElements[i].offsetWidth;
            }
            var originalWidthForRightSideColumns = totalWidth - consumedWidthLeftSideColumns - currentColumnHeaderElement.offsetWidth;
            var availableWidthForRightSideColumns = totalWidth - consumedWidthLeftSideColumns - newWidthForCurrentColumn;
            var actualWidthForRightSideColumns = 0;
            for (var i = nextColumnIndex; i < columnHeaderElements.length; i++) {
                var newColumnWidth = Math.max(availableWidthForRightSideColumns * (columnHeaderElements[i].offsetWidth / originalWidthForRightSideColumns), DataTableComponent.minColumnWidth);
                newColumnWidths[i] = newColumnWidth;
                actualWidthForRightSideColumns += newColumnWidth;
            }
            newWidthForCurrentColumn = totalWidth - consumedWidthLeftSideColumns - actualWidthForRightSideColumns;
            newWidthForNextColumn = newColumnWidths[nextColumnIndex];
        }
        newColumnWidths[columnIndex] = newWidthForCurrentColumn;
        newColumnWidths[nextColumnIndex] = newWidthForNextColumn;
        // Updates the column widths based on the calculation results.
        var index = 0;
        this.actualColumns.forEach(function (column) {
            column.width = newColumnWidths[index] + 'px';
            index++;
        });
        // Update the column percentages based on the new column widths.
        setTimeout(function () {
            index = 0;
            _this.actualColumns.forEach(function (column) {
                column.widthPercentage = columnHeaderElements[index].offsetWidth / _this.scrollContainerElement.nativeElement.offsetWidth;
                index++;
            });
        });
        this.calculateColumnDomWidths();
    };
    /**
     * It handles the column clicking.
     */
    DataTableComponent.prototype.clickColumn = function (column) {
        var _this = this;
        this.actualColumns.forEach(function (item) {
            if (column.sortable && column.sortable !== 'false') {
                if (item === column) {
                    if (item.sortMode === DataTableSortMode.None) {
                        item.sortMode = DataTableSortMode.Ascend;
                    }
                    else if (item.sortMode === DataTableSortMode.Ascend) {
                        item.sortMode = DataTableSortMode.Descend;
                    }
                    else {
                        item.sortMode = DataTableSortMode.Ascend;
                    }
                    _this.previousSortColumn = _this.sortColumn;
                    _this.sortColumn = item;
                    _this.sortItems();
                    _this.calculateItemInViewPort(false, true);
                    var element_1 = _this.headerElement.nativeElement.querySelector('th[field="' + column.field + '"]');
                    if (element_1) {
                        _this.headerElement.nativeElement.querySelector('tr').focus();
                        setTimeout(function () {
                            element_1.focus();
                        }, 200);
                        // 200 is a very tricky number here. 
                        // If the number is too small, it won't trigger the narrator. 
                        // If it's too big, the narrator would firstly read the content of TR partially then the content of the TH.
                    }
                }
                else {
                    item.sortMode = DataTableSortMode.None;
                }
            }
        });
    };
    /**
     * It handles the row double clicking.
     */
    DataTableComponent.prototype.doubleClickRow = function (event, item) {
        if (this.showAsTree) {
            this.clickTreeToggle(item);
        }
        this.selectItem(event, item);
        this.onRowDblclick.emit({ data: item.data });
    };
    /**
     * It scrolls the selected item into the view and
     */
    DataTableComponent.prototype.scrollSelectedItemIntoView = function (tryToMoveToCenter) {
        var _this = this;
        if (this.selection && this.selectionMode !== DataTableComponent.selectionModeMultipleOption) {
            for (var i = 0; i < this.renderedItems.length; i++) {
                var found = false;
                if (this.renderedItems[i].data === this.selection) {
                    found = true;
                }
                if (this.showAsTree && this.renderedItems[i].data === this.selection.data) {
                    found = true;
                }
                if (found) {
                    this.activateRenderedItemByIndex(i, false);
                    if (tryToMoveToCenter) {
                        setTimeout(function () {
                            var scrollContainerElement = _this.scrollContainerElement.nativeElement;
                            var scrollDataElement = _this.scrollDataElement.nativeElement;
                            var selectedItemElement = scrollDataElement.querySelector('tr.selected');
                            if (selectedItemElement) {
                                var selectedItemTop = selectedItemElement.getBoundingClientRect().top
                                    - scrollDataElement.getBoundingClientRect().top;
                                scrollContainerElement.scrollTop = selectedItemTop + scrollDataElement.offsetTop
                                    - scrollContainerElement.offsetHeight / 2;
                            }
                        });
                    }
                    break;
                }
            }
        }
    };
    /**
     * It handles the clicking behavior of checkbox.
     * Multiple selection behavior is happening here.
     */
    DataTableComponent.prototype.onItemCheckBoxClicked = function (item) {
        var _this = this;
        if (item.type !== DataTableRenderedItemType.GroupHeader) {
            if (item.type === DataTableRenderedItemType.TreeNode) {
                this.handleTreeNodeSelection(item.node, !item.node.selected, false, !this.linkParentChildrenSelections);
                if (item.node.selected) {
                    this.onNodeSelect.emit({ node: item.node });
                }
            }
            else {
                var index = this.internalSelection.indexOf(item.data);
                if (index === -1) {
                    this.internalSelection.push(item.data);
                    this.onRowSelect.emit({ data: item.data });
                }
                else {
                    this.internalSelection.splice(index, 1);
                    this.onRowUnselect.emit({ data: item.data });
                }
            }
        }
        else {
            var selected = this.isItemSelected(item);
            var groupItems = this.filteredItems.filter(function (currentItem) {
                return _this.resolveObjectPath(currentItem, _this.groupColumn.field).toString() === item.data;
            });
            for (var i = 0; i < groupItems.length; i++) {
                var index = this.internalSelection.indexOf(groupItems[i]);
                if (selected) {
                    if (index !== -1) {
                        this.internalSelection.splice(index, 1);
                        this.onRowUnselect.emit({ data: groupItems[i] });
                    }
                }
                else {
                    if (index === -1) {
                        this.internalSelection.push(groupItems[i]);
                        this.onRowSelect.emit({ data: groupItems[i] });
                    }
                }
            }
        }
        // Need to recreate the "internalSelection" array otherwise the change detector won't detect the change
        // since the array's own reference is not changed.
        this.internalSelection = this.internalSelection.slice(0, this.internalSelection.length);
        this.selectionChange.emit(this.internalSelection);
    };
    /**
     * It handles the "check all" checkbox behavior.
     */
    DataTableComponent.prototype.onAllItemCheckBoxClicked = function () {
        var _this = this;
        if (!this.showAsTree) {
            if (this.internalSelection.length !== this.filteredItems.length) {
                this.selection = this.filteredItems.slice();
                this.filteredItems.forEach(function (item) {
                    _this.onRowSelect.emit({ data: item });
                });
            }
            else {
                this.selection.forEach(function (item) {
                    _this.onRowUnselect.emit({ data: item });
                });
                this.selection = [];
            }
        }
        else {
            var shouldSelect_1 = !this.shouldAllItemCheckBoxChecked();
            this.internalSelection = [];
            this.filteredItems.forEach(function (item) {
                _this.handleTreeNodeSelection(item, shouldSelect_1);
            });
            this.selectionChange.emit(this.internalSelection);
        }
    };
    /**
     * It indicates whether the given item is selected.
     */
    DataTableComponent.prototype.isItemSelected = function (item) {
        var _this = this;
        var selected = false;
        if (!this.showAsTree) {
            if (item.type !== DataTableRenderedItemType.GroupHeader) {
                selected = item.data && this.internalSelection.indexOf(item.data) !== -1;
            }
            else if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
                selected = true;
                var groupItems = this.filteredItems.filter(function (currentItem) {
                    var value = _this.resolveObjectPath(currentItem, _this.groupColumn.field);
                    return (value !== undefined && value !== null && value.toString() === item.data)
                        || (value === undefined && item.data === undefined);
                });
                if (groupItems.length === 0) {
                    selected = false;
                }
                else {
                    for (var i = 0; i < groupItems.length; i++) {
                        if (this.internalSelection.indexOf(groupItems[i]) === -1) {
                            selected = false;
                            break;
                        }
                    }
                }
            }
        }
        else {
            if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
                selected = item.node && item.node.selected;
            }
            else {
                selected = item.data && this.internalSelection.map(function (currentItem) { return currentItem.data; }).indexOf(item.data) !== -1;
            }
        }
        return selected;
    };
    /**
     * It indicates whether a group with the given name is expanded.
     */
    DataTableComponent.prototype.isGroupExpanded = function (group) {
        return this.groupToggleStatus[group];
    };
    Object.defineProperty(DataTableComponent.prototype, "virtualCount", {
        /**
         * It gets and sets the virtual count.
         * It only works when "lazyLoad" is true.
         */
        get: function () {
            return this.items && this.items.length || undefined;
        },
        set: function (value) {
            if (value) {
                this.items = Array(value);
                for (var i = 0; i < value; i++) {
                    this.items[i] = null;
                }
                this.isLoading = false;
                this.renderItems();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * It resolves the object properties based on the given path with multiple levels of properties.
     * An example of path is "location.zipCode".
     */
    DataTableComponent.prototype.resolveObjectPath = function (obj, path) {
        if (path) {
            var pathSegments = path.split('.');
            if (pathSegments.length === 1) {
                return obj[path];
            }
            var currentObj = obj;
            for (var i = 0; i < pathSegments.length; i++) {
                currentObj = currentObj[pathSegments[i]];
                if (currentObj === undefined || currentObj === null) {
                    break;
                }
            }
            return currentObj;
        }
        return null;
    };
    /**
     * It returns the active rendered item index.
     */
    DataTableComponent.prototype.getActiveRenderedItemIndex = function () {
        return this.activeRenderedItemIndex;
    };
    /**
     * Moves to head of the whole rendered item list.
     */
    DataTableComponent.prototype.moveToHeadOfRenderedItems = function () {
        this.activateRenderedItemByIndex(0, true);
    };
    /**
     * Moves to previous page of the rendered item list.
     */
    DataTableComponent.prototype.moveToPreviousPageOfRenderedItems = function () {
        var index = this.getActiveRenderedItemIndex();
        var newIndex = 0;
        if (index >= 0) {
            newIndex = index - Math.round(this.renderedItemLengthInViewPort);
        }
        this.activateRenderedItemByIndex(newIndex, true);
    };
    /**
     * Moves to previous item in the rendered item list.
     */
    DataTableComponent.prototype.moveToPreviousRenderedItem = function () {
        var index = this.getActiveRenderedItemIndex();
        var newIndex = 0;
        if (index >= 0) {
            newIndex = index - 1;
        }
        this.activateRenderedItemByIndex(newIndex, true);
    };
    /**
     * Moves to next item in the rendered item list.
     */
    DataTableComponent.prototype.moveToNextRenderedItem = function () {
        var index = this.getActiveRenderedItemIndex();
        var newIndex = 0;
        if (index >= 0) {
            newIndex = index + 1;
        }
        this.activateRenderedItemByIndex(newIndex, true);
    };
    /**
     * Moves to next page of the rendered item list.
     */
    DataTableComponent.prototype.moveToNextPageOfRenderedItems = function () {
        var index = this.getActiveRenderedItemIndex() || 0;
        var newIndex = 0;
        newIndex = index + Math.round(this.renderedItemLengthInViewPort);
        this.activateRenderedItemByIndex(newIndex, true);
    };
    /**
     * Moves to end of the whole rendered list.
     */
    DataTableComponent.prototype.moveToEndOfRenderedItems = function () {
        this.activateRenderedItemByIndex(this.renderedItems.length - 1, true);
    };
    /**
     * Activate the rendered item by condition.
     * Activate doesn't mean select. It just indicates which item is active to received more operations especially keyboard operations.
     */
    DataTableComponent.prototype.activateRenderedItemByCondition = function (condition, doSelection) {
        for (var i = 0; i < this.renderedItems.length; i++) {
            if (condition(this.renderedItems[i].data)) {
                this.activateRenderedItemByIndex(this.renderedItems[i].index, doSelection);
                break;
            }
        }
    };
    /**
     * Activate the rendered item by index.
     * Activate doesn't mean select. It just indicates which item is active to received more operations especially keyboard operations.
     */
    DataTableComponent.prototype.activateRenderedItemByIndex = function (index, doSelection) {
        if (index < 0) {
            index = 0;
        }
        if (index > this.renderedItems.length - 1) {
            index = this.renderedItems.length - 1;
        }
        this.activeRenderedItemIndex = index;
        if (this.selectionMode !== DataTableComponent.selectionModeMultipleOption && this.selectItemWhenNavigatingWithKeyboard) {
            this.selectItem(null, this.renderedItems[index]);
        }
        var scrollContainerElement = this.scrollContainerElement.nativeElement;
        var totalScrollableSpace = scrollContainerElement.scrollHeight - scrollContainerElement.offsetHeight;
        var totalScrollableItemLength = this.renderedItems.length - this.renderedItemLengthInViewPort;
        var currentRenderedItemStartIndex = totalScrollableItemLength * scrollContainerElement.scrollTop / totalScrollableSpace
            + this.renderedItemStartIndexOffset;
        var newRenderItemStartIndex = -1;
        if (index >= Math.floor(currentRenderedItemStartIndex + this.renderedItemLengthInViewPort - 1)) {
            newRenderItemStartIndex = index - this.renderedItemLengthInViewPort + 1;
        }
        if (index <= currentRenderedItemStartIndex) {
            newRenderItemStartIndex = index;
        }
        // If newRenderItemStartIndex >= 0, it means when the rendered item is activated, it triggers scrolling in the list.
        if (newRenderItemStartIndex >= 0) {
            // Figure out what's the new scrolltop based on new renderedItemStartIndex.
            var scrollTop = Math.floor(totalScrollableSpace * (newRenderItemStartIndex / totalScrollableItemLength));
            if (this.hasLongList) {
                // If it's a long list, which means one pixel of scrollbar movement causes more than one screen of the list scrolling,
                // Figure out the truncated rendered item start index.
                var truncatedStartIndex = Math.floor(scrollTop / totalScrollableSpace * totalScrollableItemLength);
                // Since the actual position of the activated rendered item list can be more than one screen below,
                // we need to figure out the offset between the newRenderItemStartIndex and truncatedStartIndex.
                // Then later when we render the data table items in the view port, we will use the offset to adjust
                // the item list to make sure the actual activated rendered item can show up in the view port.
                this.renderedItemStartIndexOffset = newRenderItemStartIndex - truncatedStartIndex;
                if (newRenderItemStartIndex + this.renderedItemStartIndexOffset + this.renderedItemLengthInViewPort
                    > this.renderedItems.length - 1) {
                    this.renderedItemStartIndexOffset = 0;
                }
            }
            else {
                this.renderedItemStartIndexOffset = 0;
            }
            // Set the scrolltop and re-calcuate the view port.
            this.scrollContainerElement.nativeElement.scrollTop = scrollTop;
            this.calculateItemInViewPort(false, true);
        }
        else if (doSelection) {
            this.tryToFocusSelectedRow();
        }
    };
    DataTableComponent.prototype.getAriaExpandedAttributeValue = function (renderedItem) {
        var result;
        if (renderedItem.type === DataTableRenderedItemType.GroupHeader) {
            var isGroupExpanded = this.isGroupExpanded(renderedItem.data);
            if (isGroupExpanded !== undefined) {
                result = isGroupExpanded.toString();
            }
        }
        else if (renderedItem.type === DataTableRenderedItemType.TreeNode && !renderedItem.node.isLeaf) {
            result = (!!(renderedItem.node && renderedItem.node.expanded)).toString();
        }
        return result;
    };
    DataTableComponent.prototype.getAdditionalScreenRecorderContent = function (renderedItem) {
        var result;
        switch (renderedItem.type) {
            case DataTableRenderedItemType.TreeNode:
                var subNodeCount = renderedItem.node.children ? renderedItem.node.children.length : 0;
                result = subNodeCount === 1 ? this.strings.MsftSmeShell.Angular.DataTable.aria.label.oneSubNodeInTreeNode
                    : this.strings.MsftSmeShell.Angular.DataTable.aria.label.nSubNodesInTreeNode.format(subNodeCount);
                break;
            case DataTableRenderedItemType.GroupHeader:
                var groupItemCount = this.groupKeys[renderedItem.data].length;
                result = groupItemCount === 1 ? this.strings.MsftSmeShell.Angular.DataTable.aria.label.oneItemInGroup
                    : this.strings.MsftSmeShell.Angular.DataTable.aria.label.nItemsInGroup.format(groupItemCount);
                break;
        }
        return result;
    };
    DataTableComponent.prototype.getRoleAttributeForTableRow = function (renderedItem) {
        var result;
        switch (renderedItem.type) {
            case DataTableRenderedItemType.TreeNode:
                result = 'treeitem';
                break;
            case DataTableRenderedItemType.GroupHeader:
                result = 'row';
                break;
            default:
                result = 'row';
                break;
        }
        return result;
    };
    DataTableComponent.prototype.getAriaSortAttributeValue = function (column) {
        var result = 'none';
        switch (column.sortMode) {
            case DataTableSortMode.Ascend:
                result = 'ascending';
                break;
            case DataTableSortMode.Descend:
                result = 'descending';
                break;
        }
        return result;
    };
    DataTableComponent.prototype.initializeUI = function () {
        var _this = this;
        this.tempRowElement.nativeElement.style.display = 'none';
        setTimeout(function () {
            _this.renderItems(false, true);
        });
    };
    DataTableComponent.prototype.sortItems = function () {
        var _this = this;
        if (this.renderedItems && this.sortColumn) {
            var compareFunction_1 = this.sortColumn.sortable === 'custom' ?
                this.sortColumn.compareFunction.bind(this) : this.defaultSortCompareFunction.bind(this);
            var sortDirection_1 = this.sortColumn.sortMode === DataTableSortMode.Ascend ? 1 : -1;
            if (!this.groupColumn) {
                var shouldFallBackToDefaultSort_1 = false;
                if (!this.showAsTree) {
                    if (this.lazyLoad) {
                        var alreadyLoadedAllData = true;
                        for (var i = 0; i < this.renderedItems.length; i++) {
                            if (!this.renderedItems[i].data) {
                                alreadyLoadedAllData = false;
                                break;
                            }
                        }
                        if (this.sortColumn === this.previousSortColumn) {
                            this.renderedItems = this.renderedItems.reverse();
                            return;
                        }
                        else {
                            if (!alreadyLoadedAllData) {
                                for (var i = 0; i < this.renderedItems.length; i++) {
                                    this.renderedItems[i] = { index: i, data: undefined, type: DataTableRenderedItemType.Normal };
                                }
                            }
                            else {
                                shouldFallBackToDefaultSort_1 = true;
                            }
                        }
                    }
                }
                this.doCustomSort.emit({
                    direction: sortDirection_1, field: this.sortColumn.field, fallBackToDefaultSort: function () {
                        shouldFallBackToDefaultSort_1 = true;
                    }
                });
                if (shouldFallBackToDefaultSort_1 || this.doCustomSort.observers.length === 0) {
                    if (!this.showAsTree) {
                        this.renderedItems = this.renderedItems.sort(function (a, b) {
                            return sortDirection_1 * compareFunction_1(a.data, b.data, _this.sortColumn.field);
                        });
                    }
                    else {
                        // The following code in "else" block handles the sort in the tree nodes.
                        // It sorts the tree nodes only in its own tree level.
                        // If there are any nodes have sub nodes and other nodes don't have sub nodes,
                        // always put the nodes with sub nodes in front of the nodes without sub nodes.
                        var stack_1 = [this.shadowTree];
                        this.renderedItems = [];
                        while (stack_1.length > 0) {
                            var currentNode = stack_1[stack_1.length - 1];
                            if (currentNode.data) {
                                this.renderedItems.push(currentNode.data);
                            }
                            stack_1.splice(stack_1.length - 1, 1);
                            var children = currentNode.children;
                            children = children.sort(function (a, b) {
                                // Note that the compare result about 1 or -1 is reversed.
                                // For example if a is greater than b, 1 will be returned instead of -1.
                                // It's because those nodes are went though in the stack with is FIFO,
                                // so the order is reversed.
                                if (_this.sortColumn === _this.actualColumns[0]) {
                                    if (a.data.hasChildren && !b.data.hasChildren) {
                                        return 1;
                                    }
                                    else if (!a.data.hasChildren && b.data.hasChildren) {
                                        return -1;
                                    }
                                }
                                else {
                                    var aValue = _this.resolveObjectPath(a.data.data, _this.sortColumn.field);
                                    var bValue = _this.resolveObjectPath(b.data.data, _this.sortColumn.field);
                                    if (aValue === undefined && bValue !== undefined) {
                                        return 1;
                                    }
                                    else if (aValue !== undefined && bValue === undefined) {
                                        return -1;
                                    }
                                }
                                return -sortDirection_1 * compareFunction_1(a.data.data, b.data.data, _this.sortColumn.field);
                            });
                            children.forEach(function (item) {
                                stack_1.push(item);
                            });
                        }
                    }
                }
            }
            else {
                // The following code handles the sorting when grouping is enabled.
                // It sorts the group items in each of the group.
                var sortedRenderedItems_1 = [];
                var groupedRenderedItems = void 0;
                for (var i = 0; i < this.renderedItems.length; i++) {
                    if (this.renderedItems[i].type === DataTableRenderedItemType.GroupHeader) {
                        if (groupedRenderedItems) {
                            groupedRenderedItems = groupedRenderedItems.sort(function (a, b) {
                                return sortDirection_1 * compareFunction_1(a.data, b.data, _this.sortColumn.field);
                            });
                            groupedRenderedItems.forEach(function (item) {
                                sortedRenderedItems_1.push(item);
                            });
                        }
                        sortedRenderedItems_1.push(this.renderedItems[i]);
                        groupedRenderedItems = [];
                    }
                    else {
                        groupedRenderedItems.push(this.renderedItems[i]);
                    }
                }
                if (groupedRenderedItems) {
                    groupedRenderedItems = groupedRenderedItems.sort(function (a, b) {
                        return sortDirection_1 * compareFunction_1(a.data, b.data, _this.sortColumn.field);
                    });
                    groupedRenderedItems.forEach(function (item) {
                        sortedRenderedItems_1.push(item);
                    });
                }
                this.renderedItems = sortedRenderedItems_1;
            }
            this.updateActiveRenderedItemIndexBySelection();
        }
    };
    DataTableComponent.prototype.defaultSortCompareFunction = function (a, b, field) {
        var result = 0;
        if (!a && !b) {
            result = 0;
        }
        else if (!a && b) {
            result = 1;
        }
        else if (a && !b) {
            result = -1;
        }
        else {
            var aValue = this.resolveObjectPath(a, field);
            var bValue = this.resolveObjectPath(b, field);
            var dataType = typeof aValue;
            if (dataType === 'number') {
                aValue = aValue === 0 ? aValue : (aValue || Number.MIN_VALUE);
                bValue = bValue === 0 ? bValue : (bValue || Number.MIN_VALUE);
            }
            else {
                aValue = aValue && aValue.toString && aValue.toString().toLocaleLowerCase() || '';
                bValue = bValue && aValue.toString && bValue.toString().toLocaleLowerCase() || '';
            }
            if (aValue > bValue) {
                result = 1;
            }
            else if (aValue < bValue) {
                result = -1;
            }
        }
        return result;
    };
    DataTableComponent.prototype.hasVerticalOverflow = function () {
        return this.scrollBodyElement.nativeElement.clientHeight > this.scrollContainerElement.nativeElement.clientHeight;
    };
    DataTableComponent.prototype.alignScrollBar = function () {
        var hasVerticalOverflow = this.hasVerticalOverflow();
        if (!this.calculatedScrollbarWidth) {
            this.calculateScrollbarWidth();
        }
        if (hasVerticalOverflow !== this.currentHasVerticalOverflow && this.headerTableElement) {
            if (hasVerticalOverflow) {
                this.headerTableElement.nativeElement.style.width = 'calc(100% - ' + this.calculatedScrollbarWidth + 'px)';
                this.scrollDataElement.nativeElement.style.right = this.calculatedScrollbarWidth + 'px';
            }
            else {
                this.headerTableElement.nativeElement.style.width = '100%';
                this.scrollDataElement.nativeElement.style.right = '0px';
            }
        }
        this.currentHasVerticalOverflow = hasVerticalOverflow;
    };
    DataTableComponent.prototype.calculateScrollbarWidth = function () {
        var scrollDiv = document.createElement('div');
        this.scrollContainerElement.nativeElement.appendChild(scrollDiv);
        scrollDiv.className = 'scrollbar-measure';
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.scrollContainerElement.nativeElement.removeChild(scrollDiv);
        this.calculatedScrollbarWidth = scrollbarWidth;
    };
    ;
    DataTableComponent.prototype.calculateItemInViewPort = function (preventScrolling, forceUpdate) {
        var _this = this;
        if (this.renderedItems) {
            // Scroll container is the div to render the view port of the data table and to provide the scroll bar.
            var scrollContainerElement = this.scrollContainerElement.nativeElement;
            // Scroll body is the div to represent the actual data container.
            // Its height is the height needed by all the data table items.
            // When the list is long, this div can be very high and triggers the scroll container to show the scroll bar.
            var scrollBodyElement = this.scrollBodyElement.nativeElement;
            // Scroll data element is the div to show the displayed list items in and below the view port.
            // When the scrolling is happening, we always adjust the top of this div to make sure it remains in the view port.
            var scrollDataElement = this.scrollDataElement.nativeElement;
            // "scroll above data" element is the div show the list items above the view port.
            // We need to render this "above" data seperately
            // then it's easy for us to find the "top" of the displayed list item in the view port.
            // Note: the "scroll below data" is rendered in Scroll data element because we don't need to calculate the "top" for it
            // since anyway it just follow the displayed list items in the view port.
            var scrollAboveDataElement = this.scrollAboveDataElement.nativeElement;
            // Calculates how many items can be rendered in the view port.
            this.renderedItemLengthInViewPort = this.scrollable
                ? Math.min(this.renderedItems.length, scrollContainerElement.offsetHeight / this.rowHeight)
                : this.renderedItems.length;
            var startIndex = 0;
            var isAtLastScreen = false;
            if (this.hasLongList && preventScrolling) {
                this.dataScrollTop = (scrollContainerElement.scrollHeight - scrollContainerElement.offsetHeight)
                    * this.currentStartIndexOfItemInViewPort / (this.renderedItems.length - this.renderedItemLengthInViewPort);
                startIndex = this.currentStartIndexOfItemInViewPort;
                this.renderedItemStartIndexOffset = 0;
                scrollContainerElement.scrollTop = this.dataScrollTop;
            }
            else {
                // Calculates the which item is the starting item in the view port.
                // The idea here is to calculate the percentage of how far the scrollbar moved.
                // The distance the scrollbar can move is the total height of the scrollbar minus the height of the viewport.
                if (Math.floor(this.dataScrollTop) !== scrollContainerElement.scrollTop) {
                    this.dataScrollTop = scrollContainerElement.scrollTop;
                }
                var accurateStartIndex = (this.renderedItems.length - this.renderedItemLengthInViewPort) * this.dataScrollTop
                    / (scrollContainerElement.scrollHeight - scrollContainerElement.offsetHeight);
                startIndex = Math.floor(accurateStartIndex + this.renderedItemStartIndexOffset);
                if (startIndex + this.renderedItemLengthInViewPort > this.renderedItems.length) {
                    startIndex = this.renderedItems.length - this.renderedItemLengthInViewPort;
                    isAtLastScreen = true;
                }
                this.currentStartIndexOfItemInViewPort = startIndex;
            }
            // If the list is short and no need to have scroll bar, just simply set the start index to 0.
            if (scrollContainerElement.scrollHeight <= scrollContainerElement.offsetHeight) {
                startIndex = 0;
            }
            var renderedItemStart = startIndex - this.renderedItemLengthInViewPort * this.bufferRowRate;
            var renderedItemEnd = Math.ceil(startIndex + this.renderedItemLengthInViewPort
                + this.renderedItemLengthInViewPort * this.bufferRowRate);
            var shouldLazyLoad = false;
            if (this.lazyLoad) {
                // The following logic calculates which part of data should be loaded with the lazy loading event.
                var lazyLoadStart = Math.max(0, Math.floor(renderedItemStart));
                var actualLazyLoadStart_1 = lazyLoadStart;
                var lazyLoadLength = Math.min(this.renderedItems.length, renderedItemEnd) - lazyLoadStart;
                var actualLazyLoadLength = lazyLoadLength;
                for (var i = lazyLoadStart; i < lazyLoadStart + lazyLoadLength; i++) {
                    if (!shouldLazyLoad && !this.renderedItems[i].data) {
                        shouldLazyLoad = true;
                        actualLazyLoadStart_1 = i;
                    }
                    if (shouldLazyLoad && this.renderedItems[i].data) {
                        break;
                    }
                    actualLazyLoadLength = i + 1 - actualLazyLoadStart_1;
                }
                if (actualLazyLoadLength === 0) {
                    shouldLazyLoad = false;
                }
                if (shouldLazyLoad) {
                    var sortOrder = 0;
                    if (this.sortColumn) {
                        switch (this.sortColumn.sortMode) {
                            case DataTableSortMode.Ascend:
                                sortOrder = 1;
                                break;
                            case DataTableSortMode.Descend:
                                sortOrder = -1;
                                break;
                            default:
                                sortOrder = 0;
                                break;
                        }
                    }
                    var lazyLoadEvent = {
                        start: actualLazyLoadStart_1,
                        length: actualLazyLoadLength,
                        finishLoadingData: function (items) {
                            if (items && items.length) {
                                for (var i = 0; i < items.length; i++) {
                                    _this.renderedItems[actualLazyLoadStart_1 + i] = {
                                        index: actualLazyLoadStart_1 + i, data: items[i], type: DataTableRenderedItemType.Normal
                                    };
                                }
                                _this.calculateItemInViewPort();
                            }
                        },
                        sortOrder: sortOrder,
                        sortField: this.sortColumn ? this.sortColumn.field : this.actualColumns[0].field
                    };
                    this.lazyLoadingData.emit(lazyLoadEvent);
                    if (actualLazyLoadLength >= this.renderedItemLengthInViewPort * this.bufferRowRate) {
                        this.isBusy = true;
                    }
                }
            }
            if (!shouldLazyLoad) {
                // When the displaying list item in the view port is moving due to scroll bar is moving,
                // we need to update the top of the scroll data element.
                // The first item of the scroll data element won't always aligh to the top of the view port.
                // So here we need to figure out the offset of the first item.
                var offset = scrollContainerElement.scrollTop % this.rowHeight;
                // Note: when the display item list is even longer than the scroll container height * row height,
                // it means when we move 1 pixel of the scroll bar, the data table will move by at least one item.
                // In this case, we won't need to handle offset since we don't have a chance to show "half data table item"
                // at the top border of the scroll container by moving the scroll bar very little.
                if (this.renderedItems.length > scrollContainerElement.offsetHeight * this.rowHeight) {
                    offset = 0;
                }
                this.displayItemsTop = scrollContainerElement.scrollTop - offset;
                var selectedItemIndex = this.getActiveRenderedItemIndex();
                if (selectedItemIndex > startIndex + this.renderedItemLengthInViewPort - 1
                    && selectedItemIndex < startIndex + this.renderedItemLengthInViewPort) {
                    this.displayItemsTop = scrollContainerElement.scrollTop
                        - (selectedItemIndex - startIndex - this.renderedItemLengthInViewPort + 1) * this.rowHeight;
                }
                // When the scroll bar is moved to very bottom, we just simply align the displayed data table items's bottom
                // to the bottom of the container to make sure the last data table item can be displayed completely.
                // Otherwise, when the list is super long (refer to how we calculate the top offset of the super long list),
                // the last item may not be rendered completely.
                if (this.renderedItems.length > scrollContainerElement.offsetHeight * this.rowHeight
                    && scrollContainerElement.scrollTop >=
                        scrollContainerElement.scrollHeight - scrollContainerElement.offsetHeight - this.rowHeight / 2
                    && isAtLastScreen) {
                    this.displayItemsTop = scrollContainerElement.scrollHeight
                        - Math.ceil(this.renderedItemLengthInViewPort) * this.rowHeight;
                }
                scrollDataElement.style.top = this.displayItemsTop + 'px';
                if (forceUpdate) {
                    this.scrollAboveDataElementHeight = 0;
                }
                this.handleScrollAboveDataElement(Math.round(startIndex - renderedItemStart));
                if ((!this.currentRenderedItemInViewPort || !this.renderedItems[startIndex]
                    || (this.renderedItems[startIndex].data !== this.currentRenderedItemInViewPort.data))
                    || forceUpdate || this.showAsTree) {
                    // Prepare the display data above the view port and display data in and below the view port.
                    // Note: when we push new item into the arrays, we create a new object to wrap the display item.
                    // Because we want to force the ngFor to re-render all the items instead of only re-render the updated ones.
                    // Otherwise, ngFor will try to adjust DOM order of those items which messes up the scroll bar position.
                    this.renderedItemsAboveViewPort = [];
                    this.renderedItemsInAndBelowViewPort = [];
                    this.shouldScroll = scrollContainerElement.scrollHeight > scrollContainerElement.offsetHeight;
                    if (this.shouldScroll) {
                        for (var i = renderedItemStart; i < startIndex; i++) {
                            var index = Math.round(i);
                            if (index < startIndex) {
                                if (index >= 0 && index < this.renderedItems.length) {
                                    var currentRenderedItem = this.renderedItems[index];
                                    this.renderedItemsAboveViewPort.push({
                                        type: currentRenderedItem.type,
                                        data: this.showAsTree ? currentRenderedItem.node.data : currentRenderedItem.data,
                                        depth: currentRenderedItem.depth,
                                        hasChildren: currentRenderedItem.hasChildren,
                                        node: currentRenderedItem.node,
                                        index: index,
                                        positionInSet: currentRenderedItem.positionInSet,
                                        setSize: currentRenderedItem.setSize
                                    });
                                }
                                else {
                                    this.renderedItemsAboveViewPort.push({ data: null, type: null, index: null });
                                }
                            }
                        }
                    }
                    for (var i = startIndex; i < renderedItemEnd; i++) {
                        var index = Math.round(i);
                        if (index >= 0 && index < this.renderedItems.length) {
                            var currentRenderedItem = this.renderedItems[index];
                            this.renderedItemsInAndBelowViewPort.push({
                                type: currentRenderedItem.type,
                                data: this.showAsTree ? currentRenderedItem.node.data : currentRenderedItem.data,
                                depth: currentRenderedItem.depth,
                                hasChildren: currentRenderedItem.hasChildren,
                                node: currentRenderedItem.node,
                                index: index,
                                positionInSet: currentRenderedItem.positionInSet,
                                setSize: currentRenderedItem.setSize
                            });
                        }
                        else if (this.scrollable && this.renderedItems.length > this.renderedItemLengthInViewPort) {
                            this.renderedItemsInAndBelowViewPort.push({ data: null, type: null, index: null });
                        }
                    }
                }
                this.currentRenderedItemInViewPort = this.renderedItems[startIndex];
                this.isScrolling = false;
                this.isBusy = false;
            }
            for (var i = 0; i < this.renderedItems.length; i++) {
                if (this.renderedItems[i]) {
                    this.renderedItems[i].index = i;
                }
            }
            if (this.contentAreaHasFocus) {
                this.tryToFocusSelectedRow();
            }
        }
    };
    DataTableComponent.prototype.filter = function () {
        var _this = this;
        if (this.items) {
            if (this.globalFilter) {
                this.filterKeyword = this.globalFilter['value'].toLocaleLowerCase();
            }
            if (!this.filterKeyword) {
                this.filteredItems = this.items.map(function (item) { return item; });
            }
            else if (this.items) {
                this.filteredItems = this.items.filter(function (item) {
                    var found = false;
                    _this.actualColumns.forEach(function (column) {
                        if (!found && column.searchable) {
                            var value = _this.resolveObjectPath(item, column.field);
                            if (value) {
                                if (!_this.caseSensitiveFilter) {
                                    value = value.toString().toLocaleLowerCase();
                                }
                                if (value.toString().indexOf(_this.filterKeyword) !== -1) {
                                    found = true;
                                }
                            }
                        }
                    });
                    return found;
                });
            }
        }
    };
    DataTableComponent.prototype.handleTreeNode = function (node, depth, parentShadowTreeNode, positionInSet, setSize) {
        var _this = this;
        node.isLeaf = !node.children || node.children.length === 0;
        if (this.rememberTreeNodeToggle) {
            var identity = this.getTreeNodeDataIdentity(node);
            if (this.treeToggleStatus.hasOwnProperty(identity)) {
                node.expanded = this.treeToggleStatus[identity];
            }
        }
        var renderedItem = {
            data: node.data,
            type: DataTableRenderedItemType.TreeNode,
            depth: depth,
            hasChildren: !node.isLeaf,
            node: node,
            index: this.renderedItems.length,
            positionInSet: positionInSet,
            setSize: setSize
        };
        this.renderedItems.push(renderedItem);
        var currentShadowTreeNode = {
            data: renderedItem,
            children: []
        };
        // We need to maintain a shadow tree to handle the "same level only" sorting. 
        parentShadowTreeNode.children.push(currentShadowTreeNode);
        if (renderedItem.node.expanded && node.children) {
            var currentPositionInSet_1 = 1;
            node.children.forEach(function (child) {
                child.parent = node;
                _this.handleTreeNode(child, depth + 1, currentShadowTreeNode, currentPositionInSet_1, node.children.length);
                currentPositionInSet_1++;
            });
        }
    };
    DataTableComponent.prototype.handleComplexContent = function () {
        var _this = this;
        if (this.groupColumn && this.groupColumn.field) {
            this.groupKeys = {};
            var groups_1 = [];
            if (this.groupSortMode !== DataTableSortMode.None) {
                var compareFunction_2 = this.groupColumn.sortable === 'custom' ?
                    this.groupColumn.compareFunction.bind(this) : this.defaultSortCompareFunction.bind(this);
                var sortDirection_2 = this.groupSortMode === DataTableSortMode.Ascend ? 1 : -1;
                this.filteredItems = this.filteredItems.sort(function (a, b) {
                    return sortDirection_2 * compareFunction_2(a, b, _this.groupColumn.field);
                });
            }
            this.filteredItems.forEach(function (item) {
                var groupData = _this.resolveObjectPath(item, _this.groupColumn.field);
                if (!_this.groupKeys[groupData]) {
                    var groupItems = [];
                    groups_1.push({ group: groupData, items: groupItems });
                    _this.groupKeys[groupData] = groupItems;
                }
                if (_this.groupToggleStatus[groupData] === undefined) {
                    _this.groupToggleStatus[groupData] = _this.defaultGroupToggleExpanded;
                }
                _this.groupKeys[groupData].push(item);
            });
            this.renderedItems = [];
            var _loop_1 = function (i) {
                this_1.renderedItems.push({
                    data: groups_1[i].group,
                    type: DataTableRenderedItemType.GroupHeader,
                    index: this_1.renderedItems.length,
                    positionInSet: i + 1,
                    setSize: groups_1.length
                });
                if (this_1.groupToggleStatus[groups_1[i].group]) {
                    var currentPositionInSet_2 = 1;
                    groups_1[i].items.forEach(function (item) {
                        _this.renderedItems.push({
                            data: item,
                            type: DataTableRenderedItemType.GroupItem,
                            index: _this.renderedItems.length,
                            positionInSet: currentPositionInSet_2,
                            setSize: groups_1[i].items.length
                        });
                        currentPositionInSet_2++;
                    });
                }
            };
            var this_1 = this;
            for (var i = 0; i < groups_1.length; i++) {
                _loop_1(i);
            }
        }
        else if (this.showAsTree) {
            this.renderedItems = [];
            this.shadowTree = { data: null, children: [] };
            if (this.items) {
                var currentPositionInSet_3 = 1;
                this.items.forEach(function (node) {
                    _this.handleTreeNode(node, 0, _this.shadowTree, currentPositionInSet_3, _this.items.length);
                    currentPositionInSet_3++;
                });
            }
        }
        else {
            var index_1 = 0;
            this.renderedItems = this.filteredItems.map(function (item) {
                return {
                    index: index_1++,
                    data: item,
                    type: DataTableRenderedItemType.Normal
                };
            });
        }
    };
    DataTableComponent.prototype.renderItems = function (preventScrolling, forceUpdate) {
        this.filter();
        this.handleComplexContent();
        // Calculates how high the scroll data div should be.
        if (this.renderedItems) {
            var height = this.renderedItems.length * this.rowHeight;
            // If the height is too much, we need to limited the height otherwise Microsoft Edge will crash.
            // It's ok if the scroll data div height doesn't equal to the actual total data table height
            // because anyway we use the ratio of scroll data div height to actual total list item height
            // to calculate the scrolling position of the actual data.
            this.hasLongList = false;
            if (height > this.maxActualScrollDataElementHeight) {
                // We need to find a height near the maxActualScrollDataElementHeight which can be divided exactly by the row height.
                // Otherwise when we calcuate the scrolling position of the actual data,
                // the floating part of the height will impact the accuracy of the calculation result.
                this.hasLongList = true;
                height = Math.floor(this.maxActualScrollDataElementHeight / this.rowHeight) * this.rowHeight;
            }
            this.scrollBodyElement.nativeElement.style.height = height + 'px';
        }
        this.sortItems();
        this.calculateItemInViewPort(preventScrolling, forceUpdate);
    };
    DataTableComponent.prototype.handleScrollAboveDataElement = function (renderedItemAboveViewPortLength) {
        var scrollAboveDataElement = this.scrollAboveDataElement.nativeElement;
        // Only display the scroll above data element when it's height is available.
        // Its height may not be ready when the data table is rendered first time and the scroll top is 0.
        if (!this.scrollAboveDataElementHeight && scrollAboveDataElement.offsetHeight) {
            this.scrollAboveDataElementHeight = scrollAboveDataElement.offsetHeight;
        }
        if (renderedItemAboveViewPortLength) {
            this.scrollAboveDataElementHeight = this.rowHeight * renderedItemAboveViewPortLength;
        }
        if (this.scrollAboveDataElementHeight) {
            scrollAboveDataElement.style.top = this.displayItemsTop - this.scrollAboveDataElementHeight + 'px';
            scrollAboveDataElement.style.visibility = 'visible';
        }
        else {
            scrollAboveDataElement.style.visibility = 'hidden';
        }
    };
    DataTableComponent.prototype.onLayoutChanged = function () {
        var _this = this;
        var scrollAboveDataElement = this.scrollAboveDataElement.nativeElement;
        this.calculateItemInViewPort(false, true);
        this.actualColumns.forEach(function (column) {
            if (column.widthPercentage) {
                column.width = _this.scrollContainerElement.nativeElement.offsetWidth * column.widthPercentage + 'px';
            }
        });
        // When layout is changed, the "display above view port" item list data source is updated
        // but the html is not updated yet. So the UI of the "display above view port" is not good.
        // So hide the UI for now and adjust it in setTimeout.
        scrollAboveDataElement.style.visibility = 'hidden';
        setTimeout(function () {
            _this.scrollAboveDataElementHeight = 0;
            _this.handleScrollAboveDataElement();
        });
        this.calculateColumnDomWidths();
    };
    DataTableComponent.prototype.handleTreeNodeSelection = function (node, selected, skipEvent, skipLinkSelection, itemsToSelect) {
        var _this = this;
        if (itemsToSelect) {
            selected = itemsToSelect.indexOf(node.data) !== -1;
        }
        if (this.selectionMode !== DataTableComponent.selectionModeMultipleOption || (skipLinkSelection || !node.children)) {
            var index = this.internalSelection.indexOf(node);
            if (selected) {
                if (index === -1) {
                    this.internalSelection.push(node);
                    if (!skipEvent) {
                        this.onRowSelect.emit({ data: node.data });
                    }
                }
            }
            else {
                if (index !== -1) {
                    this.internalSelection.splice(this.internalSelection.indexOf(node), 1);
                    if (!skipEvent) {
                        this.onRowUnselect.emit({ data: node.data });
                    }
                }
            }
        }
        node.selected = selected;
        if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
            if (!skipLinkSelection) {
                var currentNode = node.parent;
                while (currentNode) {
                    var shouldSelect = true;
                    for (var i = 0; i < currentNode.children.length; i++) {
                        if (!currentNode.children[i].selected) {
                            shouldSelect = false;
                            break;
                        }
                    }
                    currentNode.selected = shouldSelect;
                    currentNode = currentNode.parent;
                }
            }
            if ((!skipLinkSelection || itemsToSelect) && node.children) {
                node.children.forEach(function (childNode) {
                    if (!childNode.parent) {
                        childNode.parent = node;
                    }
                    _this.handleTreeNodeSelection(childNode, selected, skipEvent, skipLinkSelection, itemsToSelect);
                });
            }
        }
    };
    DataTableComponent.prototype.alignContent = function () {
        if (this.headerTableElement) {
            this.contentElement.nativeElement.style.marginTop = this.headerTableElement.nativeElement.offsetHeight + 'px';
        }
    };
    DataTableComponent.prototype.clearSelection = function () {
        if (this.selectionMode === DataTableComponent.selectionModeMultipleOption) {
            this.selection = [];
        }
        else {
            this.selection = null;
        }
    };
    DataTableComponent.prototype.tryToFocusSelectedRow = function () {
        var _this = this;
        clearInterval(this.tryToFocusSelectedRowTimer);
        this.tryToFocusSelectedRowTimer = setTimeout(function () {
            var row = _this.scrollDataElement.nativeElement.querySelector('tr.item.data.selected');
            var containerTop = 0;
            var containerBottom = Number.MAX_VALUE;
            var containerClientRect = _this.scrollContainerElement.nativeElement.getClientRects()[0];
            if (containerClientRect) {
                containerTop = containerClientRect.top;
                containerBottom = containerClientRect.bottom;
            }
            var isRowInViewPort = false;
            if (row) {
                var rowTop = 0;
                var rowClientRect = row.getClientRects()[0];
                if (rowClientRect) {
                    rowTop = rowClientRect.top;
                }
                isRowInViewPort = rowTop >= containerTop && rowTop < containerBottom;
            }
            if (!row || !isRowInViewPort) {
                // If the selected row is not in viewport, just focus the first visible row in the viewport.
                // Then data table will still be able to receive keyboard event.
                var backupRows = _this.scrollDataElement.nativeElement.querySelectorAll('tr.item.data');
                for (var i = 0; i < backupRows.length - 1; i++) {
                    var rowClientRect = backupRows[i].getClientRects()[0];
                    if (rowClientRect.top > containerTop) {
                        row = backupRows[i];
                        break;
                    }
                }
            }
            if (row) {
                if (_this.currentColumnIndexWithFocusedElement >= 0) {
                    var cell = row.children[_this.currentColumnIndexWithFocusedElement];
                    var focusableElement = Dom.getFirstFocusableDescendent(cell);
                    if (focusableElement) {
                        focusableElement.focus();
                    }
                    else {
                        row.focus();
                    }
                }
                else {
                    row.focus();
                }
                _this.scrollBodyElement.nativeElement.scrollTop = 0;
            }
        });
    };
    DataTableComponent.prototype.onElementFocusing = function (event) {
        if (event.targetZone === this.contentElement.nativeElement) {
            if (!this.contentAreaHasFocus) {
                event.preventDefaultFocusBehavior();
                event.preventDefaultEvent();
                this.activateRenderedItemByIndex(this.activeRenderedItemIndex, true);
                this.changeDetector.detectChanges();
            }
            this.tryToFocusSelectedRow();
        }
        else if (event.targetElement.classList.contains('last-focusable-shadow-element')
            && event.targetElement === this.lastFocusableShadowElement.nativeElement) {
            event.preventDefaultFocusBehavior();
            if (event.sourceZone === this.contentElement.nativeElement || event.sourceZone === this.headerElement.nativeElement) {
                var nextFocusableElement = Dom.getNextZoneElement(event.targetElement);
                if (!nextFocusableElement) {
                    event.targetElement.focus();
                    this.cancelLastFocusableShadowElementFocusOnce = true;
                }
                else {
                    event.preventDefaultEvent();
                    var actualTargetZone = Dom.getAncestorZone(nextFocusableElement);
                    CoreEnvironment.accessibilityManager.processElementFocusing(event.nativeEvent, nextFocusableElement, event.targetZone, actualTargetZone);
                }
            }
            else {
                event.preventDefaultEvent();
                this.activateRenderedItemByIndex(this.activeRenderedItemIndex, false);
                this.changeDetector.detectChanges();
                this.tryToFocusSelectedRow();
            }
        }
    };
    DataTableComponent.prototype.processColumns = function () {
        var _this = this;
        this.actualColumns = [];
        if (this.columns) {
            this.columns.forEach(function (sourceColumn) {
                if (sourceColumn !== _this.groupColumn) {
                    _this.actualColumns.push(sourceColumn);
                }
            });
        }
        this.calculateColumnDomWidths();
    };
    DataTableComponent.prototype.calculateColumnDomWidths = function () {
        var _this = this;
        if (this.headerElement) {
            setTimeout(function () {
                var thElements = _this.headerElement.nativeElement.querySelectorAll('th.data-column');
                for (var i = 0; i < _this.actualColumns.length; i++) {
                    _this.actualColumns[i].domWidth = thElements[i].offsetWidth;
                }
            });
        }
    };
    DataTableComponent.prototype.updateActiveRenderedItemIndexBySelection = function () {
        if (this.selectionMode !== DataTableComponent.selectionModeMultipleOption) {
            this.activeRenderedItemIndex = -1;
            for (var i = 0; i < this.renderedItems.length; i++) {
                if (this.showAsTree) {
                    if (this.renderedItems[i].node === this.selection) {
                        this.activeRenderedItemIndex = i;
                        break;
                    }
                }
                else {
                    if (this.renderedItems[i].data === this.selection) {
                        this.activeRenderedItemIndex = i;
                        break;
                    }
                }
            }
        }
    };
    DataTableComponent.prototype.getTreeNodeDataIdentity = function (node) {
        var currentNode = node;
        var result = '';
        if (this.getItemIdentityFunction) {
            while (currentNode) {
                result = this.getItemIdentityFunction(currentNode.data) + '\\' + result;
                currentNode = currentNode.parent;
            }
        }
        return result;
    };
    DataTableComponent.selectionModeMultipleOption = 'multiple';
    DataTableComponent.minColumnWidth = 50;
    DataTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-data-table',
                    styles: ["\n      :host {\n          width: 100%;\n          display: flex;\n          flex-wrap: nowrap;\n          flex-direction: column;\n          align-content: stretch;\n          align-items: stretch;\n          justify-content: flex-start;\n          overflow: hidden;\n      }\n\n\n      /* Dont override absolute positioning. This will become unecesary after removing css file. */\n\n      :host:not(.sme-layout-absolute) {\n          position: relative;\n      }\n\n      th {\n          position: relative;\n          padding: 0;\n      }\n\n      th .text{\n          line-height:27px;\n          vertical-align: middle;\n          padding: 0 8px;\n          width: calc(100% - 5px);\n          overflow: hidden;\n          text-overflow: ellipsis;\n          white-space: nowrap;\n      }\n\n      table th:last-of-type {\n          padding-left: 0;\n      }\n\n      .header.selectable th {\n          cursor: pointer;\n      }\n\n      .header.selectable th .text:hover,\n      .header.selectable.has-multiple-selection table thead tr th.first .datatable-checkbox:hover {\n          background: #f8f8f8;\n      }\n\n      th .sme-icon:before {\n          font-size: 11px;\n      }\n\n      .header table thead tr th.first:hover {\n          background: none;\n          cursor: default;\n      }\n\n      .header table thead tr th.first .datatable-checkbox {\n          display: none;\n      }\n\n      .header.has-multiple-selection.show-all-item-checkbox table thead tr th.first .datatable-checkbox {\n          display: block;\n      }\n\n      .header table thead tr th.first,\n      .content .item td.first,\n      .content .item.no-data .prefix {\n          width: 26px;\n      }\n\n      .content .item td.group-header-cell {\n          position: relative;\n      }\n\n      .content .item td.group-header-cell .sme-table-cell{\n          position: absolute;\n          top:0;\n          left:0;\n          width: 99999px;\n          /* Cannot use right:0 to right align the border of group header to the table row \n          because this element's parent is a relative TD element.\n          But since the group header is a full row div, so just make it super wide then visually it's still right align to the table row */\n      }\n\n      .header.has-multiple-selection table thead tr th.first,\n      .content.has-multiple-selection .item td.first,\n      .content.has-multiple-selection .item.no-data .prefix {\n          width: 26px;\n          padding-left: 0;\n      }\n\n      .header.has-multiple-selection.show-all-item-checkbox table thead tr th.first,\n      .content.has-multiple-selection.show-all-item-checkbox .item td.first,\n      .content.has-multiple-selection.show-all-item-checkbox .item.no-data .prefix {\n          width: 47px;    \n      }\n\n      .header.has-multiple-selection.show-all-item-checkbox table thead tr th.first {\n          padding-left: 29px;\n      }\n\n      .header table thead tr th.first,\n      .content .item td.first {\n          display: none;\n      }\n\n      .header.selectable.show-left-margin table thead tr th.first,\n      .content.selectable.show-left-margin .item td.first {\n          display: table-cell;\n      }\n\n\n      /* .header table thead tr th.first,\n      .item td.first .sme-table-cell {\n          padding: 0;\n      } */\n\n      .item td.first .datatable-checkbox, .item td.first .datatable-checkbox input {\n          display: none;\n      }\n\n      .tree .item td.first-data-column .datatable-checkbox {\n          visibility: hidden;\n      }\n\n      .tree .item.checked td.first-data-column .datatable-checkbox,\n      .tree .item td.first-data-column:hover .datatable-checkbox {\n          visibility: visible;\n      }\n\n      .content.has-multiple-selection .item.checked td.first .datatable-checkbox,\n      .content.has-multiple-selection .item.checked td.first .datatable-checkbox input,\n      .content.has-multiple-selection .item td.first:hover .datatable-checkbox,\n      .content.has-multiple-selection .item td.first:hover .datatable-checkbox input {\n          display: block;\n      }\n\n      .item.no-data .prefix {\n          float: left;\n      }\n\n      .item.no-data .sme-table-cell {\n          padding: 0 8px;\n      }\n\n      .item.group-header .sme-table-cell:first-of-type .sme-icon:before {\n          font-size: 10px;\n          line-height: 10px;\n          margin-top: -3px;\n          margin-right: 3px;\n      }\n\n      .item.group-item .first-data-column .sme-table-cell {\n          padding-left: 26px;\n      }\n\n      .header table.sme-table-virtualized th:first-of-type {\n          padding-left: 8px;\n          padding-right: 8px;\n      }\n\n      .header.has-multiple-selection table.sme-table-virtualized th:first-of-type,\n      .content.has-multiple-selection table.sme-table-virtualized td:first-of-type .sme-table-cell {\n          padding-left: 29px;\n          padding-right: 0px;\n      }\n\n      /* .header table thead tr th {\n          padding: 0 8px;\n      } */\n\n      .header {\n          flex: 0 0 auto;\n          /* border-bottom: solid 1px #ddd; */\n          /* background: white; */\n          position: absolute;\n          margin-top: -1px;\n          z-index: 1;\n      }\n\n      .header.is-scrolled {\n          box-shadow: 0px -1px 7px #999;\n      }\n\n      div.content {\n          flex: 1 1 auto;\n          position: relative;\n          margin-top: 27px;\n          margin-left: 0;\n      }\n\n      .content.no-header {\n          margin-top: 0;\n      }\n\n      .content .scroll-container.sme-layout-absolute.sme-position-inset-none .scroll-data {\n          position: absolute;\n          left: 0;\n          width: 100%;\n          overflow: hidden;\n          border-collapse: collapse;\n      }\n\n      .content .scroll-container {\n          overflow-x: hidden;\n          overflow-y: hidden;\n      }\n\n      .content .scroll-container.should-scroll{\n          overflow-y: auto;\n      }\n\n      .content .scroll-body {\n          position: relative;\n          overflow: hidden;\n          width: 100%;\n      }\n\n      .sme-table-cell {\n          height: 30px;\n          line-height: 30px;\n          font-size: 12px;\n          overflow: hidden;\n      }\n\n      table.sme-table-virtualized td .sme-table-cell,\n      table.sme-table-virtualized td .sme-table-expander-cell {\n          border-bottom: none;\n      }\n\n      .show-grid table.sme-table-virtualized td .sme-table-cell,\n      .show-grid table.sme-table-virtualized td .sme-table-expander-cell {\n          border-bottom: solid 1px #eee;\n      } \n\n      .content.selectable .item.data {\n          cursor: pointer;\n      }\n\n      .content.selectable .item.data:hover {\n          background: #f2fbfe;\n      }\n\n      .item.data.selected, .content.selectable .item.data.selected:hover {\n          background: #E6F7FE;\n      }\n\n      .item .sme-table-cell {\n          white-space: nowrap;\n          text-overflow: ellipsis;\n          overflow: hidden;\n          /* padding: 0 8px; */\n      }\n\n      :host>>>.scrollbar-measure {\n          width: 100px;\n          height: 100px;\n          overflow: scroll;\n          position: absolute;\n          top: -9999px;\n      }\n\n      .datatable-checkbox {\n          width: 100%;\n          position: relative;\n          height: 30px;\n      }\n\n      .tree .datatable-checkbox-container{\n          width: 24px;\n          display:block;\n          float: left;    \n          padding-left:4px;\n          padding-right:4px;\n      }\n\n      .tree .datatable-checkbox input {\n          visibility: hidden;    \n      }\n\n      .tree .datatable-checkbox:hover input{\n          visibility: visible;\n      }\n\n      .datatable-checkbox label {\n          width: 12px;\n          height: 12px;\n          cursor: pointer;\n          position: absolute;\n          top: 50%;\n          left: 50%;\n          transform: translate(-50%, -50%);\n          background: white;\n          border: solid 1px #686868;\n      }\n\n      .datatable-checkbox input[type=checkbox]:hover+label {\n          background: rgb(242, 251, 254);\n      }\n\n      .datatable-checkbox input[type=checkbox] {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 100%;\n          z-index: 1;\n          margin: 0;\n          opacity: 0;\n          cursor: pointer;\n      }\n\n      .datatable-checkbox input[type=checkbox]:checked+label {\n          background: none;\n          border: solid 1px transparent;\n      }\n\n      .datatable-checkbox input[type=checkbox]:focus+label {\n          outline: rgba(0, 0, 0, .8) dashed 1px;    \n      }\n\n      .datatable-checkbox input[type=checkbox]:checked+label:after {\n          content: '\\E8FB';\n          font-family: Server-MDL2;\n          position: absolute;\n          top: 0;\n          line-height: 12px;\n      }\n\n      .loading-indicator {\n          position: absolute;\n          left: 50%;\n          top: 50%;\n          transform: translate(-50%, -50%);\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell {\n          float: left;\n          height: 30px;    \n      }\n\n      .tree .scroll-data .first-data-column .sme-table-cell {\n          padding-left: 0;\n      }\n\n      :host>>>.tree .scroll-data .sme-table-cell .sme-icon:before {\n          margin-top: -4px;\n      }\n\n      :host>>>.tree .scroll-data .sme-table-cell .placeholder {\n          display: inline-block;\n          width: 16px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell .sme-icon {\n          visibility: hidden;    \n      }\n\n      .tree.has-multiple-selection .scroll-data .first-data-column .sme-table-expander-cell .sme-icon {\n          margin-left: 2px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell.has-children .sme-icon {\n          visibility: visible;\n          float:left;\n          width: 24px;\n          text-align: center;\n      }\n\n      .tree.has-multiple-selection .scroll-data .first-data-column .sme-table-expander-cell.has-children .sme-icon {\n          width: 10px;\n          margin-left: 5px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell .placeholder {\n          display: block;\n          width: 24px;\n      }\n\n      .tree.has-multiple-selection .scroll-data .first-data-column .sme-table-expander-cell .placeholder{\n          width: 10px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell.has-children .placeholder {\n          display: none;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell .sme-icon:before {\n          display: inline-block;\n          font-size: 10px;\n          line-height: 30px;\n          margin-right: 3px;\n          margin-top: 0;\n      }\n    "],
                    template: "\n      <div *ngIf=\"showHeader\" class=\"header sme-focus-zone\" #header [ngClass]=\"{'is-scrolled':isScrolledDown, 'has-multiple-selection':selectionMode==='multiple', 'selectable': selectable, 'show-left-margin':showLeftMargin, 'show-all-item-checkbox': selectionMode==='multiple' && showAllItemCheckbox}\">\n          <table #headerTable class=\"sme-table-virtualized\" [attr.aria-labelledby]=\"tableAriaLabelledBy\" [attr.aria-rowcount]=\"renderedItems.length\"\n              [attr.aria-colcount]=\"actualColumns.length\" [attr.role]=\"showAsTree?(showHeader?'treegrid':'tree'):undefined\">\n              <thead>\n                  <tr tabindex=\"0\" (keydown)=\"onHeaderTablePressed($event)\">\n                      <th class=\"first\">\n                          <div class=\"datatable-checkbox\" *ngIf=\"selectionMode==='multiple'\">\n                              <input type=\"checkbox\" [checked]=\"shouldAllItemCheckBoxChecked()\" (change)=\"onAllItemCheckBoxClicked()\" />\n                              <label></label>\n                          </div>\n                      </th>\n                      <th *ngFor=\"let column of actualColumns; let colIndex = index\" tabindex=\"0\" (click)=\"clickColumn(column)\" [attr.field]=\"column.field\"\n                          [ngStyle]=\"{'width':column.width}\" class=\"data-column {{column.styleClass}}\" [attr.aria-sort]=\"getAriaSortAttributeValue(column)\"\n                          [attr.aria-colindex]=\"colIndex\">\n                          <div class=\"text\">\n                              <span class=\"columnName\">{{column.header}}</span>\n                              <span class=\"sortIcon sme-icon\" [ngClass]=\"{'sme-icon-up':column.sortMode===sortModeEnum.Ascend,'sme-icon-down':column.sortMode===sortModeEnum.Descend}\"></span>\n                          </div>\n                          <sme-resizer *ngIf=\"colIndex!==actualColumns.length-1\" resizerHostSelector=\"div.header\" (resized)=\"onColumnResized(colIndex, $event)\"\n                              [visibleToScreenReader]=\"false\" [showResizerCover]=\"false\" orientation=\"left\" (resizing)=\"onColumnResizing($event)\"></sme-resizer>\n                      </th>\n                  </tr>\n              </thead>\n          </table>\n      </div>\n      <div class=\"content sme-focus-zone\" #content [ngClass]=\"{'is-busy':isBusy, 'has-multiple-selection':selectionMode==='multiple', 'selectable': selectable, 'no-header':!showHeader, 'show-left-margin':showLeftMargin, 'tree':showAsTree, 'show-grid':showGrid, 'show-all-item-checkbox': selectionMode==='multiple' && showAllItemCheckbox}\">\n          <div class=\"loading-indicator\" *ngIf=\"isBusy\">\n              <sme-loading-wheel></sme-loading-wheel>\n          </div>\n          <div class=\"scroll-container sme-layout-absolute sme-position-inset-none\" [ngClass]=\"{'sme-layout-absolute sme-position-inset-none': scrollable, 'should-scroll': shouldScroll}\"\n              #scrollContainer>\n              <div class=\"item no-data\" *ngIf=\"renderedItems.length===0 && !lazyLoad\">\n                  <div class=\"prefix sme-table-cell\">&nbsp;</div>\n                  <div class=\"sme-table-cell\">{{getPlaceholderMessage()}}</div>\n              </div>\n              <div class=\"scroll-body\" #scrollBody>\n                  <table class=\"scroll-data sme-table-virtualized\" #scrollAboveData>\n                      <tbody>\n                          <tr *ngFor=\"let renderedItem of renderedItemsAboveViewPort; let rowIndex = index\" class=\"item data\" [ngClass]=\"{selected: renderedItem.index === getActiveRenderedItemIndex(),'group-item': renderedItem.type === renderedItemTypeEnum.GroupItem,'group-header': renderedItem.type === renderedItemTypeEnum.GroupHeader,checked: isItemSelected(renderedItem)}\">\n                              <td class=\"first\">\n                                  <div class=\"sme-table-cell\">\n                                      <div *ngIf=\"!showAsTree\" class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                              </td>\n                              <td *ngFor=\"let column of actualColumns; let colIndex=index\"[ngClass]=\"{'first-data-column': isFirstDataColumn(column), 'group-header-cell': renderedItem.type===renderedItemTypeEnum.GroupHeader}\"\n                                  [ngStyle]=\"{'width':column.width}\" class=\"{{column.styleClass}}\">\n                                  <div class=\"sme-screen-reader\" *ngIf=\"isFirstDataColumn(column)\">{{getAdditionalScreenRecorderContent(renderedItem)}}</div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.GroupHeader && colIndex===0\" class=\"sme-table-cell\" (click)=\"clickGroupToggle(renderedItem)\">\n                                          <span *ngIf=\"useGroupToggle\" class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':isGroupExpanded(renderedItem.data), 'sme-icon-chevronRight':!isGroupExpanded(renderedItem.data)}\"></span>\n                                      <span *ngIf=\"!this.groupHeaderTemplate\">\n                                          {{renderedItem.data}}\n                                      </span>\n                                      <span *ngIf=\"this.groupHeaderTemplate\">\n                                          <sme-data-table-template-loader [template]=\"this.groupHeaderTemplate\" [data]=\"renderedItem.data\"></sme-data-table-template-loader>\n                                      </span>\n                                  </div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.TreeNode && colIndex===0\" class=\"sme-table-expander-cell\" [ngStyle]=\"{'padding-left':(renderedItem.depth*16+4)+'px'}\"\n                                      [ngClass]=\"{'has-children': renderedItem.hasChildren || !renderedItem.node.isLeaf}\">\n                                      <span class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':renderedItem.node.expanded, 'sme-icon-chevronRight':!renderedItem.node.expanded}\"\n                                          (click)=\"clickTreeToggle(renderedItem)\"></span>\n                                      <span class=\"placeholder\"></span>\n                                  </div>\n                                  <div *ngIf=\"showAsTree && selectionMode==='multiple' && renderedItem.type==renderedItemTypeEnum.TreeNode && colIndex==0\"\n                                      class=\"sme-table-cell datatable-checkbox-container\">\n                                      <div class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" (change)=\"onItemCheckBoxClicked(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                                  <div *ngIf=\"!column.bodyTemplate && renderedItem.type!=renderedItemTypeEnum.GroupHeader\" class=\"sme-table-cell\">\n                                      {{renderedItem.data?resolveObjectPath(renderedItem.data,column.field):'.'}}\n                                  </div>\n                                  <div *ngIf=\"renderedItem.type!=renderedItemTypeEnum.GroupHeader && renderedItem.data && column.bodyTemplate\" class=\"sme-table-cell\">\n                                      <sme-data-table-template-loader [template]=\"column.bodyTemplate\" [data]=\"renderedItem.data\" [rowIndex]=\"rowIndex\"></sme-data-table-template-loader>\n                                  </div>\n                              </td>\n                          </tr>\n                      </tbody>\n                  </table>\n                  <table class=\"scroll-data sme-table-virtualized\" #scrollData [attr.aria-rowcount]=\"renderedItems.length\" [attr.role]=\"showAsTree?(showHeader?'treegrid':'tree'):undefined\"\n                      [attr.aria-multiselectable]=\"showAsTree && selectionMode==='multiple'\">\n                      <tbody>\n                          <tr (keydown)=\"onContentTablePressed($event)\" *ngFor=\"let renderedItem of renderedItemsInAndBelowViewPort; let rowIndex = index\"\n                              (click)=\"selectItem($event, renderedItem)\" class=\"item data\" [ngClass]=\"{selected: renderedItem.index === getActiveRenderedItemIndex(),'group-item': renderedItem.type === renderedItemTypeEnum.GroupItem,'group-header': renderedItem.type === renderedItemTypeEnum.GroupHeader,checked: isItemSelected(renderedItem)}\"\n                              [attr.tabindex]=\"renderedItem.index >=0 ? 0 : undefined\" (dblclick)=\"doubleClickRow($event,renderedItem)\"\n                              (focus)=\"onContentItemFocused($event)\" (focusin)=\"onContentItemFocused($event)\" (focusout)=\"onContentItemBlurred($event)\"\n                              [attr.data-rendered-item-index]=\"renderedItem.index\" [attr.aria-rowindex]=\"renderedItem.index\" [attr.aria-selected]=\"isItemSelected(renderedItem)?'true':undefined\"\n                              [attr.role]=\"getRoleAttributeForTableRow(renderedItem)\" [attr.aria-expanded]=\"getAriaExpandedAttributeValue(renderedItem)\"\n                              [attr.aria-level]=\"showAsTree?(renderedItem.depth+1):undefined\" [attr.aria-setsize]=\"renderedItem.setSize!==undefined?renderedItem.setSize:undefined\"\n                              [attr.aria-posinset]=\"renderedItem.positionInSet!==undefined?renderedItem.positionInSet:undefined\">\n                              <td class=\"first\">\n                                  <div class=\"sme-table-cell\">\n                                      <div *ngIf=\"!showAsTree\" class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" (change)=\"onItemCheckBoxClicked(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                              </td>\n                              <td *ngFor=\"let column of actualColumns; let colIndex=index\"\n                                  [ngClass]=\"{'first-data-column': isFirstDataColumn(column), 'group-header-cell': renderedItem.type===renderedItemTypeEnum.GroupHeader}\"\n                                  [ngStyle]=\"{'width':column.width}\" class=\"{{column.styleClass}}\">\n                                  <div class=\"sme-screen-reader\" *ngIf=\"isFirstDataColumn(column)\">{{getAdditionalScreenRecorderContent(renderedItem)}}</div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.GroupHeader && colIndex===0\" class=\"sme-table-cell\" (click)=\"clickGroupToggle(renderedItem)\">\n                                      <span *ngIf=\"useGroupToggle\" class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':isGroupExpanded(renderedItem.data), 'sme-icon-chevronRight':!isGroupExpanded(renderedItem.data)}\"></span>\n                                      <span *ngIf=\"!this.groupHeaderTemplate\">\n                                          {{renderedItem.data}}\n                                      </span>\n                                      <span *ngIf=\"this.groupHeaderTemplate\">\n                                          <sme-data-table-template-loader [template]=\"this.groupHeaderTemplate\" [data]=\"renderedItem.data\"></sme-data-table-template-loader>\n                                      </span>\n                                  </div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.TreeNode && colIndex===0\" class=\"sme-table-expander-cell\" [ngStyle]=\"{'padding-left':(renderedItem.depth*16+4)+'px'}\"\n                                      [ngClass]=\"{'has-children': renderedItem.hasChildren || !renderedItem.node.isLeaf}\">\n                                      <span class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':renderedItem.node.expanded, 'sme-icon-chevronRight':!renderedItem.node.expanded}\"\n                                          (click)=\"clickTreeToggle(renderedItem)\"></span>\n                                      <span class=\"placeholder\"></span>\n                                  </div>\n                                  <div *ngIf=\"showAsTree && selectionMode==='multiple' && renderedItem.type==renderedItemTypeEnum.TreeNode && colIndex==0\"\n                                      class=\"sme-table-cell datatable-checkbox-container\">\n                                      <div class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" (change)=\"onItemCheckBoxClicked(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                                  <div *ngIf=\"!column.bodyTemplate && renderedItem.type!=renderedItemTypeEnum.GroupHeader\" class=\"sme-table-cell\">{{renderedItem.data?resolveObjectPath(renderedItem.data,column.field):'.'}}</div>\n                                  <div *ngIf=\"renderedItem.type!=renderedItemTypeEnum.GroupHeader && renderedItem.data && column.bodyTemplate\" class=\"sme-table-cell\">\n                                      <sme-data-table-template-loader [template]=\"column.bodyTemplate\" [data]=\"renderedItem.data\" [rowIndex]=\"rowIndex\"></sme-data-table-template-loader>\n                                  </div>\n                              </td>\n                          </tr>\n                          <tr class=\"item\" #tempRow>\n                              <td>\n                                  <div class=\"sme-table-cell\">&nbsp;</div>\n                              </td>\n                          </tr>\n                      </tbody>\n                  </table>\n              </div>\n              <div *ngIf=\"shouldUseLastFocusableShadowElement\" #lastFocusableShadowElement class=\"sme-focus-zone last-focusable-shadow-element\" (focus)=\"onLastFocusableShadowElementFocused($event)\"\n                  tabindex=\"0\"></div>\n          </div>\n      </div>\n      <div #resizerIndicator class=\"sme-width-xxs sme-layout-absolute sme-position-stretch-v sme-background-color-base-80 sme-layer-flyout sme-layout-none\"></div>\n    "
                },] },
    ];
    /** @nocollapse */
    DataTableComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: NgZone, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['layout',] },] },
    ]; };
    DataTableComponent.propDecorators = {
        'resizerIndicator': [{ type: ViewChild, args: ['resizerIndicator',] },],
        'headerElement': [{ type: ViewChild, args: ['header',] },],
        'headerTableElement': [{ type: ViewChild, args: ['headerTable',] },],
        'contentElement': [{ type: ViewChild, args: ['content',] },],
        'scrollContainerElement': [{ type: ViewChild, args: ['scrollContainer',] },],
        'tempRowElement': [{ type: ViewChild, args: ['tempRow',] },],
        'scrollBodyElement': [{ type: ViewChild, args: ['scrollBody',] },],
        'scrollAboveDataElement': [{ type: ViewChild, args: ['scrollAboveData',] },],
        'scrollDataElement': [{ type: ViewChild, args: ['scrollData',] },],
        'lastFocusableShadowElement': [{ type: ViewChild, args: ['lastFocusableShadowElement',] },],
        'groupHeaderTemplate': [{ type: ContentChild, args: ['group',] },],
        'selectionChange': [{ type: Output },],
        'onRowDblclick': [{ type: Output },],
        'onGroupToggleClicked': [{ type: Output },],
        'columns': [{ type: ContentChildren, args: [DataTableColumnComponent,] },],
        'renderedItemsChange': [{ type: Output },],
        'isBusy': [{ type: Input },],
        'loadingMessage': [{ type: Input },],
        'noRecordMessage': [{ type: Input },],
        'lazyLoadingData': [{ type: Output },],
        'onNodeExpand': [{ type: Output },],
        'onNodeSelect': [{ type: Output },],
        'lazyLoad': [{ type: Input },],
        'rememberTreeNodeToggle': [{ type: Input },],
        'getItemIdentityFunction': [{ type: Input },],
        'globalFilter': [{ type: Input },],
        'caseSensitiveFilter': [{ type: Input },],
        'showAsTree': [{ type: Input },],
        'items': [{ type: Input },],
        'selection': [{ type: Input },],
        'selectionMode': [{ type: Input },],
        'defaultSortColumn': [{ type: Input },],
        'defaultSortMode': [{ type: Input },],
        'onFilter': [{ type: Output },],
        'doCustomSort': [{ type: Output },],
        'onRowSelect': [{ type: Output },],
        'onRowUnselect': [{ type: Output },],
        'groupColumn': [{ type: Input },],
        'groupSortMode': [{ type: Input },],
        'useGroupToggle': [{ type: Input },],
        'showHeader': [{ type: Input },],
        'tableAriaLabelledBy': [{ type: Input },],
        'showGrid': [{ type: Input },],
        'showAllItemCheckbox': [{ type: Input },],
        'selectAndCheck': [{ type: Input },],
        'rowHeight': [{ type: Input },],
        'linkParentChildrenSelections': [{ type: Input },],
        'selectItemWhenNavigatingWithKeyboard': [{ type: Input },],
        'showLeftMargin': [{ type: Input },],
        'scrollable': [{ type: Input },],
        'selectable': [{ type: Input },],
        'defaultGroupToggleExpanded': [{ type: Input },],
        'virtualCount': [{ type: Input },],
    };
    return DataTableComponent;
}());
export { DataTableComponent };
var TreeTableComponent = /** @class */ (function (_super) {
    __extends(TreeTableComponent, _super);
    function TreeTableComponent(changeDetector, ngZone, layout) {
        var _this = _super.call(this, changeDetector, ngZone, layout) || this;
        _this.showAsTree = true;
        return _this;
    }
    TreeTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-tree-table',
                    styles: ["\n      :host {\n          width: 100%;\n          display: flex;\n          flex-wrap: nowrap;\n          flex-direction: column;\n          align-content: stretch;\n          align-items: stretch;\n          justify-content: flex-start;\n          overflow: hidden;\n      }\n\n\n      /* Dont override absolute positioning. This will become unecesary after removing css file. */\n\n      :host:not(.sme-layout-absolute) {\n          position: relative;\n      }\n\n      th {\n          position: relative;\n          padding: 0;\n      }\n\n      th .text{\n          line-height:27px;\n          vertical-align: middle;\n          padding: 0 8px;\n          width: calc(100% - 5px);\n          overflow: hidden;\n          text-overflow: ellipsis;\n          white-space: nowrap;\n      }\n\n      table th:last-of-type {\n          padding-left: 0;\n      }\n\n      .header.selectable th {\n          cursor: pointer;\n      }\n\n      .header.selectable th .text:hover,\n      .header.selectable.has-multiple-selection table thead tr th.first .datatable-checkbox:hover {\n          background: #f8f8f8;\n      }\n\n      th .sme-icon:before {\n          font-size: 11px;\n      }\n\n      .header table thead tr th.first:hover {\n          background: none;\n          cursor: default;\n      }\n\n      .header table thead tr th.first .datatable-checkbox {\n          display: none;\n      }\n\n      .header.has-multiple-selection.show-all-item-checkbox table thead tr th.first .datatable-checkbox {\n          display: block;\n      }\n\n      .header table thead tr th.first,\n      .content .item td.first,\n      .content .item.no-data .prefix {\n          width: 26px;\n      }\n\n      .content .item td.group-header-cell {\n          position: relative;\n      }\n\n      .content .item td.group-header-cell .sme-table-cell{\n          position: absolute;\n          top:0;\n          left:0;\n          width: 99999px;\n          /* Cannot use right:0 to right align the border of group header to the table row \n          because this element's parent is a relative TD element.\n          But since the group header is a full row div, so just make it super wide then visually it's still right align to the table row */\n      }\n\n      .header.has-multiple-selection table thead tr th.first,\n      .content.has-multiple-selection .item td.first,\n      .content.has-multiple-selection .item.no-data .prefix {\n          width: 26px;\n          padding-left: 0;\n      }\n\n      .header.has-multiple-selection.show-all-item-checkbox table thead tr th.first,\n      .content.has-multiple-selection.show-all-item-checkbox .item td.first,\n      .content.has-multiple-selection.show-all-item-checkbox .item.no-data .prefix {\n          width: 47px;    \n      }\n\n      .header.has-multiple-selection.show-all-item-checkbox table thead tr th.first {\n          padding-left: 29px;\n      }\n\n      .header table thead tr th.first,\n      .content .item td.first {\n          display: none;\n      }\n\n      .header.selectable.show-left-margin table thead tr th.first,\n      .content.selectable.show-left-margin .item td.first {\n          display: table-cell;\n      }\n\n\n      /* .header table thead tr th.first,\n      .item td.first .sme-table-cell {\n          padding: 0;\n      } */\n\n      .item td.first .datatable-checkbox, .item td.first .datatable-checkbox input {\n          display: none;\n      }\n\n      .tree .item td.first-data-column .datatable-checkbox {\n          visibility: hidden;\n      }\n\n      .tree .item.checked td.first-data-column .datatable-checkbox,\n      .tree .item td.first-data-column:hover .datatable-checkbox {\n          visibility: visible;\n      }\n\n      .content.has-multiple-selection .item.checked td.first .datatable-checkbox,\n      .content.has-multiple-selection .item.checked td.first .datatable-checkbox input,\n      .content.has-multiple-selection .item td.first:hover .datatable-checkbox,\n      .content.has-multiple-selection .item td.first:hover .datatable-checkbox input {\n          display: block;\n      }\n\n      .item.no-data .prefix {\n          float: left;\n      }\n\n      .item.no-data .sme-table-cell {\n          padding: 0 8px;\n      }\n\n      .item.group-header .sme-table-cell:first-of-type .sme-icon:before {\n          font-size: 10px;\n          line-height: 10px;\n          margin-top: -3px;\n          margin-right: 3px;\n      }\n\n      .item.group-item .first-data-column .sme-table-cell {\n          padding-left: 26px;\n      }\n\n      .header table.sme-table-virtualized th:first-of-type {\n          padding-left: 8px;\n          padding-right: 8px;\n      }\n\n      .header.has-multiple-selection table.sme-table-virtualized th:first-of-type,\n      .content.has-multiple-selection table.sme-table-virtualized td:first-of-type .sme-table-cell {\n          padding-left: 29px;\n          padding-right: 0px;\n      }\n\n      /* .header table thead tr th {\n          padding: 0 8px;\n      } */\n\n      .header {\n          flex: 0 0 auto;\n          /* border-bottom: solid 1px #ddd; */\n          /* background: white; */\n          position: absolute;\n          margin-top: -1px;\n          z-index: 1;\n      }\n\n      .header.is-scrolled {\n          box-shadow: 0px -1px 7px #999;\n      }\n\n      div.content {\n          flex: 1 1 auto;\n          position: relative;\n          margin-top: 27px;\n          margin-left: 0;\n      }\n\n      .content.no-header {\n          margin-top: 0;\n      }\n\n      .content .scroll-container.sme-layout-absolute.sme-position-inset-none .scroll-data {\n          position: absolute;\n          left: 0;\n          width: 100%;\n          overflow: hidden;\n          border-collapse: collapse;\n      }\n\n      .content .scroll-container {\n          overflow-x: hidden;\n          overflow-y: hidden;\n      }\n\n      .content .scroll-container.should-scroll{\n          overflow-y: auto;\n      }\n\n      .content .scroll-body {\n          position: relative;\n          overflow: hidden;\n          width: 100%;\n      }\n\n      .sme-table-cell {\n          height: 30px;\n          line-height: 30px;\n          font-size: 12px;\n          overflow: hidden;\n      }\n\n      table.sme-table-virtualized td .sme-table-cell,\n      table.sme-table-virtualized td .sme-table-expander-cell {\n          border-bottom: none;\n      }\n\n      .show-grid table.sme-table-virtualized td .sme-table-cell,\n      .show-grid table.sme-table-virtualized td .sme-table-expander-cell {\n          border-bottom: solid 1px #eee;\n      } \n\n      .content.selectable .item.data {\n          cursor: pointer;\n      }\n\n      .content.selectable .item.data:hover {\n          background: #f2fbfe;\n      }\n\n      .item.data.selected, .content.selectable .item.data.selected:hover {\n          background: #E6F7FE;\n      }\n\n      .item .sme-table-cell {\n          white-space: nowrap;\n          text-overflow: ellipsis;\n          overflow: hidden;\n          /* padding: 0 8px; */\n      }\n\n      :host>>>.scrollbar-measure {\n          width: 100px;\n          height: 100px;\n          overflow: scroll;\n          position: absolute;\n          top: -9999px;\n      }\n\n      .datatable-checkbox {\n          width: 100%;\n          position: relative;\n          height: 30px;\n      }\n\n      .tree .datatable-checkbox-container{\n          width: 24px;\n          display:block;\n          float: left;    \n          padding-left:4px;\n          padding-right:4px;\n      }\n\n      .tree .datatable-checkbox input {\n          visibility: hidden;    \n      }\n\n      .tree .datatable-checkbox:hover input{\n          visibility: visible;\n      }\n\n      .datatable-checkbox label {\n          width: 12px;\n          height: 12px;\n          cursor: pointer;\n          position: absolute;\n          top: 50%;\n          left: 50%;\n          transform: translate(-50%, -50%);\n          background: white;\n          border: solid 1px #686868;\n      }\n\n      .datatable-checkbox input[type=checkbox]:hover+label {\n          background: rgb(242, 251, 254);\n      }\n\n      .datatable-checkbox input[type=checkbox] {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 100%;\n          z-index: 1;\n          margin: 0;\n          opacity: 0;\n          cursor: pointer;\n      }\n\n      .datatable-checkbox input[type=checkbox]:checked+label {\n          background: none;\n          border: solid 1px transparent;\n      }\n\n      .datatable-checkbox input[type=checkbox]:focus+label {\n          outline: rgba(0, 0, 0, .8) dashed 1px;    \n      }\n\n      .datatable-checkbox input[type=checkbox]:checked+label:after {\n          content: '\\E8FB';\n          font-family: Server-MDL2;\n          position: absolute;\n          top: 0;\n          line-height: 12px;\n      }\n\n      .loading-indicator {\n          position: absolute;\n          left: 50%;\n          top: 50%;\n          transform: translate(-50%, -50%);\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell {\n          float: left;\n          height: 30px;    \n      }\n\n      .tree .scroll-data .first-data-column .sme-table-cell {\n          padding-left: 0;\n      }\n\n      :host>>>.tree .scroll-data .sme-table-cell .sme-icon:before {\n          margin-top: -4px;\n      }\n\n      :host>>>.tree .scroll-data .sme-table-cell .placeholder {\n          display: inline-block;\n          width: 16px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell .sme-icon {\n          visibility: hidden;    \n      }\n\n      .tree.has-multiple-selection .scroll-data .first-data-column .sme-table-expander-cell .sme-icon {\n          margin-left: 2px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell.has-children .sme-icon {\n          visibility: visible;\n          float:left;\n          width: 24px;\n          text-align: center;\n      }\n\n      .tree.has-multiple-selection .scroll-data .first-data-column .sme-table-expander-cell.has-children .sme-icon {\n          width: 10px;\n          margin-left: 5px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell .placeholder {\n          display: block;\n          width: 24px;\n      }\n\n      .tree.has-multiple-selection .scroll-data .first-data-column .sme-table-expander-cell .placeholder{\n          width: 10px;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell.has-children .placeholder {\n          display: none;\n      }\n\n      .tree .scroll-data .first-data-column .sme-table-expander-cell .sme-icon:before {\n          display: inline-block;\n          font-size: 10px;\n          line-height: 30px;\n          margin-right: 3px;\n          margin-top: 0;\n      }\n    "],
                    template: "\n      <div *ngIf=\"showHeader\" class=\"header sme-focus-zone\" #header [ngClass]=\"{'is-scrolled':isScrolledDown, 'has-multiple-selection':selectionMode==='multiple', 'selectable': selectable, 'show-left-margin':showLeftMargin, 'show-all-item-checkbox': selectionMode==='multiple' && showAllItemCheckbox}\">\n          <table #headerTable class=\"sme-table-virtualized\" [attr.aria-labelledby]=\"tableAriaLabelledBy\" [attr.aria-rowcount]=\"renderedItems.length\"\n              [attr.aria-colcount]=\"actualColumns.length\" [attr.role]=\"showAsTree?(showHeader?'treegrid':'tree'):undefined\">\n              <thead>\n                  <tr tabindex=\"0\" (keydown)=\"onHeaderTablePressed($event)\">\n                      <th class=\"first\">\n                          <div class=\"datatable-checkbox\" *ngIf=\"selectionMode==='multiple'\">\n                              <input type=\"checkbox\" [checked]=\"shouldAllItemCheckBoxChecked()\" (change)=\"onAllItemCheckBoxClicked()\" />\n                              <label></label>\n                          </div>\n                      </th>\n                      <th *ngFor=\"let column of actualColumns; let colIndex = index\" tabindex=\"0\" (click)=\"clickColumn(column)\" [attr.field]=\"column.field\"\n                          [ngStyle]=\"{'width':column.width}\" class=\"data-column {{column.styleClass}}\" [attr.aria-sort]=\"getAriaSortAttributeValue(column)\"\n                          [attr.aria-colindex]=\"colIndex\">\n                          <div class=\"text\">\n                              <span class=\"columnName\">{{column.header}}</span>\n                              <span class=\"sortIcon sme-icon\" [ngClass]=\"{'sme-icon-up':column.sortMode===sortModeEnum.Ascend,'sme-icon-down':column.sortMode===sortModeEnum.Descend}\"></span>\n                          </div>\n                          <sme-resizer *ngIf=\"colIndex!==actualColumns.length-1\" resizerHostSelector=\"div.header\" (resized)=\"onColumnResized(colIndex, $event)\"\n                              [visibleToScreenReader]=\"false\" [showResizerCover]=\"false\" orientation=\"left\" (resizing)=\"onColumnResizing($event)\"></sme-resizer>\n                      </th>\n                  </tr>\n              </thead>\n          </table>\n      </div>\n      <div class=\"content sme-focus-zone\" #content [ngClass]=\"{'is-busy':isBusy, 'has-multiple-selection':selectionMode==='multiple', 'selectable': selectable, 'no-header':!showHeader, 'show-left-margin':showLeftMargin, 'tree':showAsTree, 'show-grid':showGrid, 'show-all-item-checkbox': selectionMode==='multiple' && showAllItemCheckbox}\">\n          <div class=\"loading-indicator\" *ngIf=\"isBusy\">\n              <sme-loading-wheel></sme-loading-wheel>\n          </div>\n          <div class=\"scroll-container sme-layout-absolute sme-position-inset-none\" [ngClass]=\"{'sme-layout-absolute sme-position-inset-none': scrollable, 'should-scroll': shouldScroll}\"\n              #scrollContainer>\n              <div class=\"item no-data\" *ngIf=\"renderedItems.length===0 && !lazyLoad\">\n                  <div class=\"prefix sme-table-cell\">&nbsp;</div>\n                  <div class=\"sme-table-cell\">{{getPlaceholderMessage()}}</div>\n              </div>\n              <div class=\"scroll-body\" #scrollBody>\n                  <table class=\"scroll-data sme-table-virtualized\" #scrollAboveData>\n                      <tbody>\n                          <tr *ngFor=\"let renderedItem of renderedItemsAboveViewPort; let rowIndex = index\" class=\"item data\" [ngClass]=\"{selected: renderedItem.index === getActiveRenderedItemIndex(),'group-item': renderedItem.type === renderedItemTypeEnum.GroupItem,'group-header': renderedItem.type === renderedItemTypeEnum.GroupHeader,checked: isItemSelected(renderedItem)}\">\n                              <td class=\"first\">\n                                  <div class=\"sme-table-cell\">\n                                      <div *ngIf=\"!showAsTree\" class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                              </td>\n                              <td *ngFor=\"let column of actualColumns; let colIndex=index\"[ngClass]=\"{'first-data-column': isFirstDataColumn(column), 'group-header-cell': renderedItem.type===renderedItemTypeEnum.GroupHeader}\"\n                                  [ngStyle]=\"{'width':column.width}\" class=\"{{column.styleClass}}\">\n                                  <div class=\"sme-screen-reader\" *ngIf=\"isFirstDataColumn(column)\">{{getAdditionalScreenRecorderContent(renderedItem)}}</div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.GroupHeader && colIndex===0\" class=\"sme-table-cell\" (click)=\"clickGroupToggle(renderedItem)\">\n                                          <span *ngIf=\"useGroupToggle\" class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':isGroupExpanded(renderedItem.data), 'sme-icon-chevronRight':!isGroupExpanded(renderedItem.data)}\"></span>\n                                      <span *ngIf=\"!this.groupHeaderTemplate\">\n                                          {{renderedItem.data}}\n                                      </span>\n                                      <span *ngIf=\"this.groupHeaderTemplate\">\n                                          <sme-data-table-template-loader [template]=\"this.groupHeaderTemplate\" [data]=\"renderedItem.data\"></sme-data-table-template-loader>\n                                      </span>\n                                  </div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.TreeNode && colIndex===0\" class=\"sme-table-expander-cell\" [ngStyle]=\"{'padding-left':(renderedItem.depth*16+4)+'px'}\"\n                                      [ngClass]=\"{'has-children': renderedItem.hasChildren || !renderedItem.node.isLeaf}\">\n                                      <span class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':renderedItem.node.expanded, 'sme-icon-chevronRight':!renderedItem.node.expanded}\"\n                                          (click)=\"clickTreeToggle(renderedItem)\"></span>\n                                      <span class=\"placeholder\"></span>\n                                  </div>\n                                  <div *ngIf=\"showAsTree && selectionMode==='multiple' && renderedItem.type==renderedItemTypeEnum.TreeNode && colIndex==0\"\n                                      class=\"sme-table-cell datatable-checkbox-container\">\n                                      <div class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" (change)=\"onItemCheckBoxClicked(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                                  <div *ngIf=\"!column.bodyTemplate && renderedItem.type!=renderedItemTypeEnum.GroupHeader\" class=\"sme-table-cell\">\n                                      {{renderedItem.data?resolveObjectPath(renderedItem.data,column.field):'.'}}\n                                  </div>\n                                  <div *ngIf=\"renderedItem.type!=renderedItemTypeEnum.GroupHeader && renderedItem.data && column.bodyTemplate\" class=\"sme-table-cell\">\n                                      <sme-data-table-template-loader [template]=\"column.bodyTemplate\" [data]=\"renderedItem.data\" [rowIndex]=\"rowIndex\"></sme-data-table-template-loader>\n                                  </div>\n                              </td>\n                          </tr>\n                      </tbody>\n                  </table>\n                  <table class=\"scroll-data sme-table-virtualized\" #scrollData [attr.aria-rowcount]=\"renderedItems.length\" [attr.role]=\"showAsTree?(showHeader?'treegrid':'tree'):undefined\"\n                      [attr.aria-multiselectable]=\"showAsTree && selectionMode==='multiple'\">\n                      <tbody>\n                          <tr (keydown)=\"onContentTablePressed($event)\" *ngFor=\"let renderedItem of renderedItemsInAndBelowViewPort; let rowIndex = index\"\n                              (click)=\"selectItem($event, renderedItem)\" class=\"item data\" [ngClass]=\"{selected: renderedItem.index === getActiveRenderedItemIndex(),'group-item': renderedItem.type === renderedItemTypeEnum.GroupItem,'group-header': renderedItem.type === renderedItemTypeEnum.GroupHeader,checked: isItemSelected(renderedItem)}\"\n                              [attr.tabindex]=\"renderedItem.index >=0 ? 0 : undefined\" (dblclick)=\"doubleClickRow($event,renderedItem)\"\n                              (focus)=\"onContentItemFocused($event)\" (focusin)=\"onContentItemFocused($event)\" (focusout)=\"onContentItemBlurred($event)\"\n                              [attr.data-rendered-item-index]=\"renderedItem.index\" [attr.aria-rowindex]=\"renderedItem.index\" [attr.aria-selected]=\"isItemSelected(renderedItem)?'true':undefined\"\n                              [attr.role]=\"getRoleAttributeForTableRow(renderedItem)\" [attr.aria-expanded]=\"getAriaExpandedAttributeValue(renderedItem)\"\n                              [attr.aria-level]=\"showAsTree?(renderedItem.depth+1):undefined\" [attr.aria-setsize]=\"renderedItem.setSize!==undefined?renderedItem.setSize:undefined\"\n                              [attr.aria-posinset]=\"renderedItem.positionInSet!==undefined?renderedItem.positionInSet:undefined\">\n                              <td class=\"first\">\n                                  <div class=\"sme-table-cell\">\n                                      <div *ngIf=\"!showAsTree\" class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" (change)=\"onItemCheckBoxClicked(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                              </td>\n                              <td *ngFor=\"let column of actualColumns; let colIndex=index\"\n                                  [ngClass]=\"{'first-data-column': isFirstDataColumn(column), 'group-header-cell': renderedItem.type===renderedItemTypeEnum.GroupHeader}\"\n                                  [ngStyle]=\"{'width':column.width}\" class=\"{{column.styleClass}}\">\n                                  <div class=\"sme-screen-reader\" *ngIf=\"isFirstDataColumn(column)\">{{getAdditionalScreenRecorderContent(renderedItem)}}</div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.GroupHeader && colIndex===0\" class=\"sme-table-cell\" (click)=\"clickGroupToggle(renderedItem)\">\n                                      <span *ngIf=\"useGroupToggle\" class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':isGroupExpanded(renderedItem.data), 'sme-icon-chevronRight':!isGroupExpanded(renderedItem.data)}\"></span>\n                                      <span *ngIf=\"!this.groupHeaderTemplate\">\n                                          {{renderedItem.data}}\n                                      </span>\n                                      <span *ngIf=\"this.groupHeaderTemplate\">\n                                          <sme-data-table-template-loader [template]=\"this.groupHeaderTemplate\" [data]=\"renderedItem.data\"></sme-data-table-template-loader>\n                                      </span>\n                                  </div>\n                                  <div *ngIf=\"renderedItem.type===renderedItemTypeEnum.TreeNode && colIndex===0\" class=\"sme-table-expander-cell\" [ngStyle]=\"{'padding-left':(renderedItem.depth*16+4)+'px'}\"\n                                      [ngClass]=\"{'has-children': renderedItem.hasChildren || !renderedItem.node.isLeaf}\">\n                                      <span class=\"sme-icon\" [ngClass]=\"{'sme-icon-chevronDown':renderedItem.node.expanded, 'sme-icon-chevronRight':!renderedItem.node.expanded}\"\n                                          (click)=\"clickTreeToggle(renderedItem)\"></span>\n                                      <span class=\"placeholder\"></span>\n                                  </div>\n                                  <div *ngIf=\"showAsTree && selectionMode==='multiple' && renderedItem.type==renderedItemTypeEnum.TreeNode && colIndex==0\"\n                                      class=\"sme-table-cell datatable-checkbox-container\">\n                                      <div class=\"datatable-checkbox\">\n                                          <input type=\"checkbox\" [checked]=\"isItemSelected(renderedItem)\" (change)=\"onItemCheckBoxClicked(renderedItem)\" />\n                                          <label></label>\n                                      </div>\n                                  </div>\n                                  <div *ngIf=\"!column.bodyTemplate && renderedItem.type!=renderedItemTypeEnum.GroupHeader\" class=\"sme-table-cell\">{{renderedItem.data?resolveObjectPath(renderedItem.data,column.field):'.'}}</div>\n                                  <div *ngIf=\"renderedItem.type!=renderedItemTypeEnum.GroupHeader && renderedItem.data && column.bodyTemplate\" class=\"sme-table-cell\">\n                                      <sme-data-table-template-loader [template]=\"column.bodyTemplate\" [data]=\"renderedItem.data\" [rowIndex]=\"rowIndex\"></sme-data-table-template-loader>\n                                  </div>\n                              </td>\n                          </tr>\n                          <tr class=\"item\" #tempRow>\n                              <td>\n                                  <div class=\"sme-table-cell\">&nbsp;</div>\n                              </td>\n                          </tr>\n                      </tbody>\n                  </table>\n              </div>\n              <div *ngIf=\"shouldUseLastFocusableShadowElement\" #lastFocusableShadowElement class=\"sme-focus-zone last-focusable-shadow-element\" (focus)=\"onLastFocusableShadowElementFocused($event)\"\n                  tabindex=\"0\"></div>\n          </div>\n      </div>\n      <div #resizerIndicator class=\"sme-width-xxs sme-layout-absolute sme-position-stretch-v sme-background-color-base-80 sme-layer-flyout sme-layout-none\"></div>\n    "
                },] },
    ];
    /** @nocollapse */
    TreeTableComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: NgZone, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['layout',] },] },
    ]; };
    return TreeTableComponent;
}(DataTableComponent));
export { TreeTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGF0YS10YWJsZS9kYXRhLXRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUdILGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBSU4sUUFBUSxFQUNSLE1BQU0sRUFHTixTQUFTLEVBQ1osTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBRSxlQUFBLEVBQWlCLEdBQUEsRUFBMkIsT0FBQSxFQUFRLE1BQU8sZUFBQSxDQUFnQjtBQUdwRixPQUFPLEVBQUUsd0JBQUEsRUFBeUIsTUFBTywrQkFBQSxDQUFnQztBQUN6RSxPQUFPLEVBS0gseUJBQXlCLEVBQ3pCLGlCQUFpQixFQUVwQixNQUFNLHVCQUFBLENBQXdCO0FBRy9COztHQUVHO0FBRUg7SUF1ZUksNEJBQ1ksY0FBaUMsRUFDakMsTUFBYyxFQUNaLE1BQWM7UUFGaEIsbUJBQWMsR0FBZCxjQUFjLENBQW1CO1FBQ2pDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDWixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBdGVwQixZQUFPLEdBQVksT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUM7UUFDdkQscUNBQWdDLEdBQUcsTUFBTSxDQUFDO1FBQzFDLDBCQUFxQixHQUFHLEdBQUcsQ0FBQztRQUM1QixzQ0FBaUMsR0FBRyxHQUFHLENBQUM7UUFDeEMsZ0NBQTJCLEdBQUcsR0FBRyxDQUFDO1FBRWxDLGlDQUE0QixHQUFHLEtBQUssQ0FBQztRQUNyQyxrQkFBYSxHQUFHLEdBQUcsQ0FBQztRQUNwQiwrQkFBMEIsR0FBbUIsRUFBRSxDQUFDO1FBZ0JoRCwwQkFBcUIsR0FBNEIsRUFBRSxDQUFDO1FBQ3BELGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsc0JBQWlCLEdBQXdCLEVBQUUsQ0FBQztRQUU1QyxzQ0FBaUMsR0FB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QixxQkFBcUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3pDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDcEMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDL0IsOEJBQThCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNsRCxzQ0FBc0MsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzFELGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDcEMsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsNEJBQTRCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNoRCxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUNqQyxDQUFDO0lBQ0YseUJBQUM7Q0E1OEZELEFBNDhGQyxJQUFBO1NBNThGWSxrQkFBa0I7QUErOEYvQjtJQUF3QyxzQ0FBa0I7SUFDdEQsNEJBQVksY0FBaUMsRUFBRSxNQUFjLEVBQUksTUFBYztRQUEvRSxZQUNJLGtCQUFNLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBRXhDO1FBREcsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0lBQzNCLENBQUM7SUFDRSw2QkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLE1BQU0sRUFBRSxDQUFDLHNyVkEwWVIsQ0FBQztvQkFDRixRQUFRLEVBQUUsbTVjQW1KVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsaUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHO1FBQzNCLEVBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRztRQUNoQixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRyxFQUFFLEVBQUcsRUFBQztLQUMxRixFQUo2RixDQUk3RixDQUFDO0lBQ0YseUJBQUM7Q0EvaUJELEFBK2lCQyxDQS9pQnVDLGtCQUFrQixHQStpQnpEO1NBL2lCWSxrQkFBa0IiLCJmaWxlIjoiZGF0YS10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9