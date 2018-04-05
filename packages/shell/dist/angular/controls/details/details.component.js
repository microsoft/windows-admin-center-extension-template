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
import { Component, EventEmitter, HostBinding, Inject, Injector, Input, Optional, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseComponent } from '../common/base.component';
var DetailsComponent = /** @class */ (function (_super) {
    __extends(DetailsComponent, _super);
    function DetailsComponent(injector, layout) {
        var _this = _super.call(this, injector) || this;
        _this.layout = layout;
        _this.minExpanderHeight = '50px';
        _this.isExpandedChange = new EventEmitter();
        _this.hasExpanedLayoutOccured = false;
        _this.initialHeightPercentage = 30;
        var resizeObservable = _this.layout ? _this.layout.layoutChanged : Observable.fromEvent(window, 'resize');
        _this.subscriptions.push(resizeObservable.subscribe(function () { return _this.onLayoutChanged(); }));
        return _this;
    }
    Object.defineProperty(DetailsComponent.prototype, "ariaExpanded", {
        get: function () {
            return (!!this.isExpanded).toString();
        },
        enumerable: true,
        configurable: true
    });
    DetailsComponent.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
        if (changes.isExpanded) {
            this.onLayoutChanged();
        }
    };
    DetailsComponent.prototype.toggleExpansion = function () {
        this.isExpanded = !this.isExpanded;
        this.isExpandedChange.emit(this.isExpanded);
        this.onLayoutChanged();
    };
    DetailsComponent.prototype.onLayoutChanged = function () {
        var expanderClientHeight = MsftSme.getValue(this.expander, 'nativeElement.clientHeight') || 0;
        var expanderHeight = expanderClientHeight > 0 ? "{0}px".format(expanderClientHeight) : this.minExpanderHeight;
        if (!this.isExpanded) {
            this.hostElement.nativeElement.style.height = expanderHeight;
            return;
        }
        if (this.hostElement) {
            var potentialHeight = MsftSme.getValue(this.hostElement, 'nativeElement.offsetParent.offsetHeight') || 0;
            if (!this.hasExpanedLayoutOccured) {
                this.hasExpanedLayoutOccured = true;
                // we only enforce a max height when setting the default height.
                var maxHeight = 600;
                var minHeight = 200;
                // Set initial expanded height to 30vh.
                var totalHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                var oneVh = totalHeight / 100;
                potentialHeight = oneVh * this.initialHeightPercentage;
                // dont let the initial size exceed maxheight
                potentialHeight = Math.min(potentialHeight, maxHeight);
                potentialHeight = Math.max(potentialHeight, minHeight);
            }
            this.hostElement.nativeElement.style.height = "{0}px".format(potentialHeight);
            return;
        }
    };
    DetailsComponent.prototype.getInitialHostClasses = function () {
        return _super.prototype.getInitialHostClasses.call(this).concat([
            'sme-arrange-stack-v'
        ]);
    };
    DetailsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-details',
                    template: "\n      <div #expander class=\"sme-button sme-button-trigger sme-button-auto-width sme-position-flex-none sme-padding-squish-v-lg sme-position-stretch-h sme-position-left-inline sme-arrange-stack-h\" role=\"button\" tabindex=\"0\" (click)=\"toggleExpansion()\" [style.min-height]=\"minExpanderHeight\"\n          [title]=\"isExpanded ? strings.MsftSmeShell.Angular.Common.collapse : strings.MsftSmeShell.Angular.Common.expand\">\n          <h3 class=\"sme-position-flex-auto sme-arrange-ellipsis\">{{title}}</h3>\n          <span class=\"sme-icon sme-position-flex-none\" [ngClass]=\"{'sme-icon-chevronUpMed': !isExpanded, 'sme-icon-chevronDownMed': isExpanded}\"></span>\n      </div>\n\n      <div class=\"sme-position-flex-auto sme-layout-relative\">\n          <div class=\"sme-layout-absolute sme-position-inset-none sme-padding-bottom-sm sme-arrange-overflow-auto\" [class.sme-layout-none]=\"!isExpanded\">\n              <ng-content></ng-content>\n          </div>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    DetailsComponent.ctorParameters = function () { return [
        { type: Injector, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['layout',] },] },
    ]; };
    DetailsComponent.propDecorators = {
        'expander': [{ type: ViewChild, args: ['expander',] },],
        'ariaExpanded': [{ type: HostBinding, args: ['attr.aria-expanded',] },],
        'initialHeightPercentage': [{ type: Input },],
        'title': [{ type: Input },],
        'isExpanded': [{ type: Input },],
        'isExpandedChange': [{ type: Output },],
    };
    return DetailsComponent;
}(BaseComponent));
export { DetailsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGV0YWlscy9kZXRhaWxzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUNILFNBQVMsRUFBYyxZQUFBLEVBQ3ZCLFdBQVcsRUFBRSxNQUFBLEVBQVEsUUFBQSxFQUFVLEtBQUEsRUFBa0IsUUFBQSxFQUFVLE1BQUEsRUFBdUIsU0FBQSxFQUNyRixNQUFNLGVBQUEsQ0FBZ0I7QUFDdkIsT0FBTyxFQUFFLFVBQUEsRUFBeUIsTUFBTyxNQUFBLENBQU87QUFFaEQsT0FBTyxFQUFFLGFBQUEsRUFBYyxNQUFPLDBCQUFBLENBQTJCO0FBSXpEO0lBQXNDLG9DQUFzQjtJQTBCeEQsMEJBQVksUUFBa0IsRUFBWSxNQUFjO1FBQXhELFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBSWxCO1FBTHlDLFlBQU0sR0FBTixNQUFNLENBQVE7UUF4QmpELHVCQUFpQixHQUFHLE1BQU0sQ0FBQztRQW9CM0Isc0JBQWdCLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFFckUsNkJBQXVCLEdBQUcsS0FBSyxDQUFDO1FBSXBDLEtBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxnQkFBZ0IsR0FBb0IsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pILEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGVBQWUsRUFBRSxFQUF0QixDQUFzQixDQUFDLENBQUMsQ0FBQTs7SUFDckYsQ0FBQztJQXZCRCxzQkFBVywwQ0FBWTthQUF2QjtZQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENB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QkFBa0I7SUFDWCwrQkFBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsUUFBUSxHQUFHO1FBQ2xCLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFHLEVBQUUsRUFBRyxFQUFDO0tBQzFGLEVBSDZGLENBRzdGLENBQUM7SUFDSywrQkFBYyxHQUEyQztRQUNoRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFHLEVBQUUsRUFBRTtRQUN4RCxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsb0JBQW9CLEVBQUcsRUFBRSxFQUFFO1FBQ3hFLHlCQUF5QixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDN0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDM0IsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtLQUN0QyxDQUFDO0lBQ0YsdUJBQUM7Q0E5R0QsQUE4R0MsQ0E5R3FDLGFBQWEsR0E4R2xEO1NBOUdZLGdCQUFnQiIsImZpbGUiOiJkZXRhaWxzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=