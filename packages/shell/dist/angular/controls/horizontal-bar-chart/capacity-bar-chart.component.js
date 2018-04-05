var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'chart.js';
// todo: remove when removing @Deprecated  methods
import { Deprecated } from '../common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * This component will create a horizontal bar chart two segments.
 *  The first segment represents the amount of total currently used, and the other repressing the free amount left out of  the total.
 *  They will completely fill the width of the chart.
 */
var CapacityBarChartComponent = /** @class */ (function () {
    function CapacityBarChartComponent() {
        this.onTooltipToggle = new EventEmitter();
        this.strings = MsftSme.resourcesStrings();
    }
    CapacityBarChartComponent.prototype.getColor = function (yellowThreshold, redThreshold) {
        if (yellowThreshold === void 0) { yellowThreshold = 0.8; }
        if (redThreshold === void 0) { redThreshold = 0.9; }
        var redColor = '#f64747';
        var yellowColor = '#fbbc05';
        var greenColor = '#02a28c';
        if (yellowThreshold === 'disabled' || redThreshold === 'disabled') {
            return greenColor;
        }
        // determine the color for the bar chart based on capacity used
        if (this.percentCapacity >= redThreshold) {
            return redColor;
        }
        if (this.percentCapacity >= yellowThreshold) {
            return yellowColor;
        }
        return greenColor;
    };
    CapacityBarChartComponent.prototype.updateChart = function () {
        this.freeCapacity = this.totalCapacity - this.capacityUsed;
        this.percentCapacity = this.totalCapacity > 0 ? this.capacityUsed / this.totalCapacity : 0;
        this.displayPercentCapacity = '{0}%'.format(Math.round(this.percentCapacity * 100));
        // update the chart used and free labels if it has them already
        this.usedLabel = this.usedLabel ? this.usedLabel : '';
        this.freeLabel = this.freeLabel ? this.freeLabel : '';
        this.totalLabel = this.totalLabel ? this.totalLabel : '';
        this.totalMessage = this.strings.MsftSmeShell.Angular.CapacityBarChart.totalFormat.format(this.totalLabel);
        this.usedMessage = this.strings.MsftSmeShell.Angular.CapacityBarChart.usedFormat.format(this.usedLabel, this.displayPercentCapacity);
        this.freeMessage = this.strings.MsftSmeShell.Angular.CapacityBarChart.freeFormat.format(this.freeLabel);
        this.usedBarColor = this.getColor(this.warningAt, this.criticalAt);
    };
    CapacityBarChartComponent.prototype.ngOnChanges = function () {
        this.updateChart();
    };
    CapacityBarChartComponent.prototype.toggleLabelTooltip = function () {
        this.onTooltipToggle.emit();
    };
    CapacityBarChartComponent.prototype.ngOnInit = function () {
        this.height = this.height ? this.height : 36; // set default height
        this.animationTime = this.animationTime ? this.animationTime : 0; // set no animation as default
        this.widthTransitionStyle = 'width {0}ms'.format(this.animationTime);
        this.heightStyle = '{0}px'.format(this.height);
    };
    CapacityBarChartComponent.prototype.update = function (pData) {
        this.prepareInputDataForUX(pData);
    };
    // todo: remove this function when removing the @Deprecated  update method.
    CapacityBarChartComponent.prototype.prepareInputDataForUX = function (pData) {
        this.freeCapacity = pData.totalCapacity - pData.capacityUsed;
        this.percentCapacity = pData.totalCapacity > 0 ? pData.capacityUsed / pData.totalCapacity : 0;
        this.displayPercentCapacity = '{0}%'.format(Math.round(this.percentCapacity * 100));
        // update the chart used and free labels if it has them already
        this.usedLabel = this.usedLabel ? pData.usedLabel : '';
        this.freeLabel = this.freeLabel ? pData.freeLabel : '';
        this.totalLabel = this.totalLabel ? pData.totalLabel : '';
        this.totalMessage = this.strings.MsftSmeShell.Angular.CapacityBarChart.totalFormat.format(this.totalLabel);
        this.usedMessage = this.strings.MsftSmeShell.Angular.CapacityBarChart.usedFormat.format(this.usedLabel, this.displayPercentCapacity);
        this.freeMessage = this.strings.MsftSmeShell.Angular.CapacityBarChart.freeFormat.format(this.freeLabel);
        this.usedBarColor = this.getColor(this.warningAt, this.criticalAt);
    };
    CapacityBarChartComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-capacity-bar-chart',
                    template: "\n      <div *ngIf=\"chartTitle\" class=\"pull-left stat-title\">{{ chartTitle }}</div>\n      <div *ngIf=\"totalLabel\" class=\"pull-right\">\n          {{ totalMessage }}   \n          <span *ngIf=\"labelTooltip\" class=\"sme-icon sme-icon-unknown button-icon\" (mouseover)=\"toggleLabelTooltip()\" (mouseleave)=\"toggleLabelTooltip()\"></span>              \n      </div>\n\n      <div class=\"divchart\" [style.height]=\"heightStyle\">\n          <div class=\"divchart-bar\" [style.transition]=\"widthTransitionStyle\" [style.width]=\"displayPercentCapacity\" [style.background-color]=\"usedBarColor\" ></div>\n      </div>\n\n      <div *ngIf=\"usedLabel\" class=\"pull-left\">{{ usedMessage }}</div>\n      <div *ngIf=\"freeLabel\" class=\"pull-right\">{{ freeMessage }}</div>\n    ",
                    styles: ["\n      .bar-chart{\n          display:block;\n          clear: both;\n      }\n\n      .stat-title {\n          font-weight: bold;\n      }\n\n      .divchart {\n          clear: both;\n          width: 100%;\n          background: #DDD;\n          position: relative;\n          z-index: 1;\n      }\n\n      .divchart-bar {\n          position: absolute;\n          left: 0;\n          top: 0;\n          height: inherit;\n          z-index: 2;\n      }\n    "]
                },] },
    ];
    /** @nocollapse */
    CapacityBarChartComponent.ctorParameters = function () { return []; };
    CapacityBarChartComponent.propDecorators = {
        'animationTime': [{ type: Input },],
        'height': [{ type: Input },],
        'capacityUsed': [{ type: Input },],
        'totalCapacity': [{ type: Input },],
        'warningAt': [{ type: Input },],
        'criticalAt': [{ type: Input },],
        'chartTitle': [{ type: Input },],
        'totalLabel': [{ type: Input },],
        'usedLabel': [{ type: Input },],
        'freeLabel': [{ type: Input },],
        'labelTooltip': [{ type: Input },],
        'onTooltipToggle': [{ type: Output },],
    };
    __decorate([
        Deprecated({
            deprecatedSince: '03/14/18',
            message: 'CapacityBarChart now uses ngOnChanges to automatically update. Calling CapacityBarChart.update() is no longer required.'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CapacityBarChartComponent.prototype, "update", null);
    return CapacityBarChartComponent;
}());
export { CapacityBarChartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvaG9yaXpvbnRhbC1iYXItY2hhcnQvY2FwYWNpdHktYmFyLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUEsQ0FBVztBQUVsQixrREFBa0Q7QUFDbEQsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLFdBQUEsQ0FBWTtBQUV2QyxPQUFPLEVBQUUsU0FBQSxFQUFXLFlBQUEsRUFBYyxLQUFBLEVBQTBCLE1BQUEsRUFBTyxNQUFPLGVBQUEsQ0FBZ0I7QUFNMUY7Ozs7R0FJRztBQUVIO0lBQUE7UUF3RFksb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBYXRDLFlBQU8sR0FBWSxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQztJQWtKbEUsQ0FBQztJQWhKVSw0Q0FBUSxHQUFmLFVBQWdCLGVBQXNDLEVBQUUsWUFBbUM7UUFBM0UsZ0NBQUEsRUFBQSxxQkFBc0M7UUFBRSw2QkFBQSxFQUFBLGtCQUFtQztRQUN2RixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQzlCLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxlQUFlLEtBQUssVUFBVSxJQUFJLFlBQVksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEIsQ0FBQztRQUNELCtEQUErRDtRQUMvRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQztRQUVELE1BQU0sQ0FB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TyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0Usb0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUUsc3hCQWFUO29CQUNELE1BQU0sRUFBRSxDQUFDLGdkQXlCUixDQUFDO2lCQUNMLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx3Q0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLHdDQUFjLEdBQTJDO1FBQ2hFLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25DLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzVCLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2xDLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25DLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9CLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2hDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2hDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2hDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9CLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9CLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2xDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7S0FDckMsQ0FBQztJQXJGRTtRQUpDLFVBQVUsQ0FBQztZQUNSLGVBQWUsRUFBRSxVQUFVO1lBQzNCLE9BQU8sRUFBRSx5SEFBeUg7U0FDckksQ0FBQzs7OzsyREFHRDtJQW9GTCxnQ0FBQztDQXZORCxBQXVOQyxJQUFBO1NBdk5ZLHlCQUF5QiIsImZpbGUiOiJjYXBhY2l0eS1iYXItY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==