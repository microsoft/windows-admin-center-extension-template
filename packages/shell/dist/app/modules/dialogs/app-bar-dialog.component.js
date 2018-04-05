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
import { HostListener } from '@angular/core';
import { BaseDialogComponent } from '../../../angular';
import { Dom, KeyCode } from '../../../core';
var AppBarBaseDialogComponent = /** @class */ (function (_super) {
    __extends(AppBarBaseDialogComponent, _super);
    /**
     * Initializes a new instance of the AppBarBaseDialogComponent class.
     */
    function AppBarBaseDialogComponent(dialogService, dialogSelector, appBarButtonId) {
        var _this = _super.call(this, dialogService) || this;
        _this.dialogSelector = dialogSelector;
        _this.appBarButtonId = appBarButtonId;
        return _this;
    }
    AppBarBaseDialogComponent.prototype.onKeyDown = function (event) {
        var _this = this;
        var currentElement = event.target;
        if (event.keyCode === KeyCode.UpArrow
            && Dom.getSpecificAncestor(currentElement, function (element) { return element.tagName.toLowerCase() === _this.dialogSelector; }) !== null
            && currentElement.isSameNode(Dom.getFirstElementInZone(currentElement))) {
            var tab = document.getElementById(this.appBarButtonId);
            if (tab) {
                tab.focus();
                event.stopPropagation();
            }
        }
    };
    AppBarBaseDialogComponent.propDecorators = {
        'onKeyDown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    };
    return AppBarBaseDialogComponent;
}(BaseDialogComponent));
export { AppBarBaseDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2RpYWxvZ3MvYXBwLWJhci1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBQSxFQUFhLE1BQU8sZUFBQSxDQUFnQjtBQUM3QyxPQUFPLEVBQUUsbUJBQUEsRUFBaUUsTUFBTyxrQkFBQSxDQUFtQjtBQUNwRyxPQUFPLEVBQUUsR0FBQSxFQUFLLE9BQUEsRUFBUSxNQUFPLGVBQUEsQ0FBZ0I7QUFFN0M7SUFDWSw2Q0FBc0M7SUFFOUM7O09BRUc7SUFDSCxtQ0FBWSxhQUE0QixFQUFVLGNBQXNCLEVBQVUsY0FBc0I7UUFBeEcsWUFDSSxrQkFBTSxhQUFhLENBQUMsU0FDdkI7UUFGaUQsb0JBQWMsR0FBZCxjQUFjLENBQVE7UUFBVSxvQkFBYyxHQUFkLGNBQWMsQ0FBUTs7SUFFeEcsQ0FBQztJQUdTLDZDQUFTLEdBQW5CLFVBQW9CLEtBQUs7UUFBekIsaUJBV0M7UUFWRyxJQUFNLGNBQWMsR0FBZ0IsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxPQUFPO2VBQzlCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsVUFBQyxPQUFPLElBQUssT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUksQ0FBQyxjQUFjLEVBQXJELENBQXFELENBQUMsS0FBSyxJQUFJO2VBQ3BILGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNaLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM1QixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRSx3Q0FBYyxHQUEyQztRQUNoRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUcsRUFBRSxFQUFFO0tBQ3RFLENBQUM7SUFDRixnQ0FBQztDQTNCRCxBQTJCQyxDQTFCVyxtQkFBbUIsR0EwQjlCO1NBM0JZLHlCQUF5QiIsImZpbGUiOiJhcHAtYmFyLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9