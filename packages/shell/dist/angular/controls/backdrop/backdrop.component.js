import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AppContextService } from '../../service/app-context.service';
var BackdropComponent = /** @class */ (function () {
    function BackdropComponent(appContext) {
        this.appContext = appContext;
        this.showBackdrop = true;
        this.level = 1;
        this.clicked = new EventEmitter();
        this.zindex = BackdropComponent.zIndexPerLevel;
    }
    /**
     * emits clicked event
     */
    BackdropComponent.prototype.onClick = function () {
        this.clicked.emit();
    };
    BackdropComponent.prototype.ngOnChanges = function (changes) {
        if (changes['level'] !== undefined) {
            this.zindex = changes['level'].currentValue * BackdropComponent.zIndexPerLevel;
        }
    };
    BackdropComponent.prototype.getCssClass = function () {
        return this.appContext.rpc.isShell ? 'sme-position-top-xxl' : '';
    };
    BackdropComponent.zIndexPerLevel = 100000;
    BackdropComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-backdrop',
                    template: "\n      <div class=\"sme-position-inset-none sme-layout-fixed\" [ngClass]=\"getCssClass()\">\n        <div class=\"sme-position-inset-none sme-layout-fixed\" [ngClass]=\"getCssClass()\" (click)=\"onClick()\" [class.sme-scheme-backdrop-opaque]=\"showBackdrop\"></div>\n        <ng-content></ng-content>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    BackdropComponent.ctorParameters = function () { return [
        { type: AppContextService, },
    ]; };
    BackdropComponent.propDecorators = {
        'showBackdrop': [{ type: Input },],
        'level': [{ type: Input },],
        'clicked': [{ type: Output },],
        'zindex': [{ type: HostBinding, args: ['style.z-index',] },],
    };
    return BackdropComponent;
}());
export { BackdropComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYmFja2Ryb3AvYmFja2Ryb3AuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsWUFBQSxFQUFjLFdBQUEsRUFBYSxLQUFBLEVBQWtCLE1BQUEsRUFBc0IsTUFBTyxlQUFBLENBQWdCO0FBQzlHLE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLG1DQUFBLENBQW9DO0FBR3RFO0lBVUksMkJBQW9CLFVBQTZCO1FBQTdCLGVBQVUsR0FBVixVQUFVLENBQW1CO1FBUHpDLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDVixZQUFPLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFHeEQsV0FBTSxHQUFHLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztJQUdqRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxtQ0FBTyxHQUFkO1FBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU0sdUNBQVcsR0FBbEIsVUFBbUIsT0FBc0I7UUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztRQUNuRixDQUFDO0lBQ0wsQ0FBQztJQUVNLHVDQUFXLEdBQWxCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNyRSxDQUFDO0lBM0J1QixnQ0FBYyxHQUFHLE1BQU0sQ0FBQztJQTRCN0MsNEJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLG1VQUtUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEdBQUc7S0FDMUIsRUFGNkYsQ0FFN0YsQ0FBQztJQUNLLGdDQUFjLEdBQTJDO1FBQ2hFLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2xDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNCLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzlCLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFlLEVBQUcsRUFBRSxFQUFFO0tBQzVELENBQUM7SUFDRix3QkFBQztDQWxERCxBQWtEQyxJQUFBO1NBbERZLGlCQUFpQiIsImZpbGUiOiJiYWNrZHJvcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9