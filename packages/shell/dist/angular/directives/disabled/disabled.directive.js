var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { Dom } from '../../../core';
import { Debounce } from '../../controls/common/decorators/debounce.decorators';
var DisabledDirective = /** @class */ (function () {
    function DisabledDirective(host) {
        this.host = host;
    }
    Object.defineProperty(DisabledDirective.prototype, "smeDisabled", {
        get: function () {
            return this.internalDisabled;
        },
        set: function (value) {
            this.internalDisabled = value;
            if (value && this.host && document.activeElement === this.host.nativeElement) {
                this.removeFocus();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisabledDirective.prototype, "attrDisabled", {
        get: function () {
            // angular wont add an attribute if it is null. so return false as null.
            return this.smeDisabled ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    DisabledDirective.prototype.removeFocus = function () {
        if (this.smeDisabled) {
            if (document.activeElement === this.host.nativeElement || document.activeElement === document.body) {
                var next = Dom.getNextFocusableElement(this.host.nativeElement) || Dom.getNextZoneElement(this.host.nativeElement);
                if (next) {
                    next.focus();
                }
            }
        }
        else if (!this.smeDisabled && document.activeElement === document.body) {
            this.host.nativeElement.focus();
        }
    };
    DisabledDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector > Reason: this is for all disabled elements
                    selector: '[smeDisabled]'
                },] },
    ];
    /** @nocollapse */
    DisabledDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    DisabledDirective.propDecorators = {
        'smeDisabled': [{ type: Input },],
        'attrDisabled': [{ type: HostBinding, args: ['attr.disabled',] },],
    };
    __decorate([
        Debounce(0),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DisabledDirective.prototype, "removeFocus", null);
    return DisabledDirective;
}());
export { DisabledDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvZGlyZWN0aXZlcy9kaXNhYmxlZC9kaXNhYmxlZC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxVQUFBLEVBQVksV0FBQSxFQUFhLEtBQUEsRUFBTSxNQUFPLGVBQUEsQ0FBZ0I7QUFDMUUsT0FBTyxFQUFFLEdBQUEsRUFBSSxNQUFPLGVBQUEsQ0FBZ0I7QUFDcEMsT0FBTyxFQUFFLFFBQUEsRUFBUyxNQUFPLHNEQUFBLENBQXVEO0FBR2hGO0lBcUJJLDJCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQW5CekMsc0JBQVcsMENBQVc7YUFBdEI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pDLENBQUM7YUFDRCxVQUF1QixLQUFjO1lBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixDQUFDO1FBRUwsQ0FBQzs7O09BUEE7SUFVRCxzQkFBVywyQ0FBWTthQUF2QjtZQUNJLHdFQUF3RTtZQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDMUMsQ0FBQzs7O09BQUE7SUFPTyx1Q0FBVyxHQUFuQjtRQUVJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakcsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ25ILEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFLLFFBQVEsQ0FBQyxhQUFhLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEMsQ0FBQztJQUNMLENBQUM7SUFFRSw0QkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLDBGQUEwRjtvQkFDMUYsUUFBUSxFQUFFLGVBQWU7aUJBQzVCLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsVUFBVSxHQUFHO0tBQ25CLEVBRjZGLENBRTdGLENBQUM7SUFDSyxnQ0FBYyxHQUEyQztRQUNoRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNqQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBZSxFQUFHLEVBQUUsRUFBRTtLQUNsRSxDQUFDO0lBM0JFO1FBREMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7Ozt3REFhWDtJQWdCTCx3QkFBQztDQXBERCxBQW9EQyxJQUFBO1NBcERZLGlCQUFpQiIsImZpbGUiOiJkaXNhYmxlZC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9