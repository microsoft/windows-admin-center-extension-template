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
import { ChangeDetectorRef, ContentChildren, Directive, EventEmitter, Injector, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { CoreBaseComponent } from '../../controls/common/base.component';
/**
 * Directive to provide notification or state changes for angulars @see RouterLink directive.
 * The design of this directive is identical to @see RouterLinkActive
 * and as such supports the same @see RouterLinkActiveOptions are supported.
 */
var SmeRouterLinkDirective = /** @class */ (function (_super) {
    __extends(SmeRouterLinkDirective, _super);
    /**
     * Initializes a new instance of the @see PivotComponent class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator in the base @see BaseComponent class
     * @param {Router} router The angular router service
     */
    function SmeRouterLinkDirective(injector, router, changeDetectorRef) {
        var _this = _super.call(this, injector) || this;
        _this.router = router;
        _this.changeDetectorRef = changeDetectorRef;
        /**
         * The output for when the route is activated
         */
        _this.smeRouterLinkActivated = new EventEmitter();
        /**
         * The output for when the route is deactivated
         */
        _this.smeRouterLinkDeactivated = new EventEmitter();
        /**
         * Use the same input options as angulars @see RouterLinkActive Directive
         */
        _this.routerLinkActiveOptions = { exact: false };
        /**
         * Placeholder for the current activation state
         */
        _this.isActive = false;
        _this.subscriptions.push(_this.router.events.subscribe(function (s) {
            if (s instanceof NavigationEnd) {
                _this.updateIsActive();
            }
        }));
        return _this;
    }
    /**
     * Angulars AfterContentInit life cycle event
     */
    SmeRouterLinkDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        _super.prototype.ngAfterContentInit.call(this);
        this.subscriptions.push(this.links.changes.subscribe(function () { return _this.updateIsActive(); }));
        this.subscriptions.push(this.linksWithHrefs.changes.subscribe(function () { return _this.updateIsActive(); }));
        this.updateIsActive();
    };
    /**
     * Angulars OnChanges life cycle event
     */
    SmeRouterLinkDirective.prototype.ngDoCheck = function () {
        _super.prototype.ngDoCheck.call(this);
        this.updateIsActive();
    };
    /**
     * Updates the isActive state and fires appropriete events if that state has changed.
     */
    SmeRouterLinkDirective.prototype.updateIsActive = function () {
        if (!this.links || !this.linksWithHrefs || !this.router.navigated) {
            return;
        }
        var hasActiveLinks = this.hasActiveLinks();
        if (this.isActive !== hasActiveLinks) {
            this.isActive = hasActiveLinks;
            if (this.isActive) {
                this.smeRouterLinkActivated.next();
            }
            else {
                this.smeRouterLinkDeactivated.next();
            }
            this.changeDetectorRef.detectChanges();
        }
    };
    /**
     * Indicates if a given link is active
     * @param link the link to check
     */
    SmeRouterLinkDirective.prototype.isLinkActive = function (link) {
        return this.router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
    };
    /**
     * Indicates that at leased one link is active
     */
    SmeRouterLinkDirective.prototype.hasActiveLinks = function () {
        var _this = this;
        return this.links.some(function (link) { return _this.isLinkActive(link); }) ||
            this.linksWithHrefs.some(function (link) { return _this.isLinkActive(link); });
    };
    SmeRouterLinkDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[routerLink][smeRouterLinkActivated],[routerLink][smeRouterLinkDeactivated]'
                },] },
    ];
    /** @nocollapse */
    SmeRouterLinkDirective.ctorParameters = function () { return [
        { type: Injector, },
        { type: Router, },
        { type: ChangeDetectorRef, },
    ]; };
    SmeRouterLinkDirective.propDecorators = {
        'smeRouterLinkActivated': [{ type: Output },],
        'smeRouterLinkDeactivated': [{ type: Output },],
        'links': [{ type: ContentChildren, args: [RouterLink, { descendants: true },] },],
        'linksWithHrefs': [{ type: ContentChildren, args: [RouterLinkWithHref, { descendants: true },] },],
        'routerLinkActiveOptions': [{ type: Input },],
    };
    return SmeRouterLinkDirective;
}(CoreBaseComponent));
export { SmeRouterLinkDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvZGlyZWN0aXZlcy9yb3V0ZXIvcm91dGVyLWxpbmsuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBRUgsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixTQUFTLEVBRVQsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUdULE1BQU0sZUFBQSxDQUFnQjtBQUN2QixPQUFPLEVBQUUsYUFBQSxFQUFlLE1BQUEsRUFBUSxVQUFBLEVBQVksa0JBQUEsRUFBbUIsTUFBTyxpQkFBQSxDQUFrQjtBQUN4RixPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyxzQ0FBQSxDQUF1QztBQUV6RTs7OztHQUlHO0FBRUg7SUFBNEMsMENBQWlCO0lBcUN6RDs7OztPQUlHO0lBQ0gsZ0NBQVksUUFBa0IsRUFBVSxNQUFjLEVBQVUsaUJBQW9DO1FBQXBHLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBUWxCO1FBVHVDLFlBQU0sR0FBTixNQUFNLENBQVE7UUFBVSx1QkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBeENwRzs7V0FFRztRQUVJLDRCQUFzQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkQ7O1dBRUc7UUFFSSw4QkFBd0IsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBY3JEOztXQUVHO1FBRUksNkJBQXVCLEdBQXVCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRXRFOztXQUVHO1FBQ0ssY0FBUSxHQUFHLEtBQUssQ0FBQztRQVNyQixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDbkIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDLENB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LE1BQU0sRUFBRSxFQUFFO1FBQzdDLDBCQUEwQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDL0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsRUFBRyxFQUFFLEVBQUU7UUFDbEYsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUcsRUFBRSxFQUFFO1FBQ25HLHlCQUF5QixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7S0FDNUMsQ0FBQztJQUNGLDZCQUFDO0NBNUhELEFBNEhDLENBNUgyQyxpQkFBaUIsR0E0SDVEO1NBNUhZLHNCQUFzQiIsImZpbGUiOiJyb3V0ZXItbGluay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9