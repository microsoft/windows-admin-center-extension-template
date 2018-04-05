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
import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionBarComponent } from '../../containers/action-bar/action-bar.component';
import { ActionItem, ActionItemComponent, ActionItemRendererComponent } from '../action-item.component';
var ActionButton = /** @class */ (function (_super) {
    __extends(ActionButton, _super);
    function ActionButton() {
        return _super.call(this, ActionButtonRendererComponent) || this;
    }
    ActionButton.prototype.execute = function (model) {
        this.container.executed.emit({ result: model, item: this });
    };
    return ActionButton;
}(ActionItem));
export { ActionButton };
var ActionButtonAsync = /** @class */ (function (_super) {
    __extends(ActionButtonAsync, _super);
    function ActionButtonAsync() {
        return _super.call(this) || this;
    }
    ActionButtonAsync.prototype.execute = function (target) {
        var _this = this;
        if (this.enabled) {
            this.preExecute(target);
            this.onExecute(target).take(1).subscribe(function (result) {
                _this.container.executed.emit({ result: result || target, item: _this });
            }, function (error) {
                _this.container.error.emit({ error: error, item: _this });
            }, function () {
                _this.postExecute(target);
            });
        }
    };
    ActionButtonAsync.prototype.preExecute = function (target) {
        this.busy = true;
    };
    ActionButtonAsync.prototype.onExecute = function (target) {
        // By default just return the target wrapped in observable and do nothing.
        // This should be overridden in derived classes
        return Observable.of(target);
    };
    ActionButtonAsync.prototype.postExecute = function (target) {
        this.busy = false;
    };
    return ActionButtonAsync;
}(ActionButton));
export { ActionButtonAsync };
var ActionButtonRendererComponent = /** @class */ (function (_super) {
    __extends(ActionButtonRendererComponent, _super);
    function ActionButtonRendererComponent(renderer, hostElement) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.hostElement = hostElement;
        renderer.addClass(hostElement.nativeElement, 'sme-position-stretch-h');
        return _this;
    }
    ActionButtonRendererComponent.prototype.itemChanged = function (item) {
        _super.prototype.itemChanged.call(this, item);
    };
    ActionButtonRendererComponent.prototype.ngDoCheck = function () {
        if (this.element.nativeElement.offsetWidth === 0) {
            return;
        }
        // It looks like the CSS icon isn't being included in the offsetWidth, nor the clientWidth.
        // Adding here for simplicity and clarity.
        var cssIconWidth = 14;
        var calculatedWidth = this.element.nativeElement.offsetWidth + cssIconWidth;
        if (this.item.width !== calculatedWidth) {
            this.item.width = calculatedWidth;
        }
    };
    ActionButtonRendererComponent.prototype.execute = function () {
        if (this.item.execute) {
            this.item.execute.call(this.item, this.item.target);
        }
    };
    ActionButtonRendererComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-action-button-renderer',
                    template: "\n      <button #actionButtonElement [ngClass]=\"['sme-button-trigger sme-button-auto-width sme-button-align-left sme-action-bar-item-height sme-position-stretch-h', item.iconClass || '']\" (click)=\"execute()\" [smeDisabled]=\"!item.enabled || item.busy || !item.ready\"\n          type=\"button\">\n          {{item.text}}\n      </button>\n    "
                },] },
    ];
    /** @nocollapse */
    ActionButtonRendererComponent.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
    ]; };
    ActionButtonRendererComponent.propDecorators = {
        'element': [{ type: ViewChild, args: ['actionButtonElement',] },],
    };
    return ActionButtonRendererComponent;
}(ActionItemRendererComponent));
export { ActionButtonRendererComponent };
var ActionButtonComponent = /** @class */ (function (_super) {
    __extends(ActionButtonComponent, _super);
    function ActionButtonComponent(actionBarComponent) {
        var _this = _super.call(this) || this;
        _this.actionBarComponent = actionBarComponent;
        _this.execute = new EventEmitter(false);
        return _this;
    }
    ActionButtonComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.actionBarComponent.updateActionBar();
        });
    };
    ActionButtonComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        setTimeout(function () {
            _this.actionBarComponent.updateActionBar();
        });
    };
    ActionButtonComponent.prototype.createActionItem = function () {
        var _this = this;
        var button = new ActionButton();
        button.execute = function (target) {
            _this.execute.emit(target);
        };
        return button;
    };
    ActionButtonComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-action-button',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    ActionButtonComponent.ctorParameters = function () { return [
        { type: ActionBarComponent, },
    ]; };
    ActionButtonComponent.propDecorators = {
        'execute': [{ type: Output },],
    };
    return ActionButtonComponent;
}(ActionItemComponent));
export { ActionButtonComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvYWN0aW9ucy9pdGVtcy9hY3Rpb24tYnV0dG9uL2FjdGlvbi1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBRUgsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBSVosTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1osTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBRSxVQUFBLEVBQW9CLE1BQU8sTUFBQSxDQUFPO0FBQzNDLE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLGtEQUFBLENBQW1EO0FBRXRGLE9BQU8sRUFBRSxVQUFBLEVBQVksbUJBQUEsRUFBcUIsMkJBQUEsRUFBNEIsTUFBTywwQkFBQSxDQUEyQjtBQUV4RztJQUFrQyxnQ0FBVTtJQUd4QztlQUNJLGtCQUFNLDZCQUE2QixDQUFDO0lBQ3hDLENBQUM7SUFFTSw4QkFBTyxHQUFkLFVBQWUsS0FBVztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDTCxtQkFBQztBQUFELENBVkEsQUFVQyxDQVZpQyxVQUFVLEdBVTNDOztBQUVEO0lBQTBDLHFDQUFZO0lBRWxEO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRU0sbUNBQU8sR0FBZCxVQUFlLE1BQVU7UUFBekIsaUJBY0M7UUFiRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUNwQyxVQUFBLE1BQU07Z0JBQ0YsS0FBSSxDQUFDLFNBQVMsQ0FB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QUFTLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUcsRUFBRSxFQUFFO0tBQ2pFLENBQUM7SUFDRixvQ0FBQztDQXBERCxBQW9EQyxDQXBEa0QsMkJBQTJCLEdBb0Q3RTtTQXBEWSw2QkFBNkI7QUF1RDFDO0lBQTJDLHlDQUFtQjtJQUkxRCwrQkFBb0Isa0JBQXNDO1FBQTFELFlBQ0ksaUJBQU8sU0FDVjtRQUZtQix3QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBRm5ELGFBQU8sR0FBc0IsSUFBSSxZQUFZLENBQU0sS0FBSyxDQUFDLENBQUM7O0lBSWpFLENBQUM7SUFFTSwrQ0FBZSxHQUF0QjtRQUFBLGlCQUlDO1FBSEcsVUFBVSxDQUFDO1lBQ1AsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLDJDQUFXLEdBQWxCO1FBQUEsaUJBSUM7UUFIRyxVQUFVLENBQUM7WUFDUCxLQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsZ0RBQWdCLEdBQTFCO1FBQUEsaUJBTUM7UUFMRyxJQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxNQUFNO1lBQ3BCLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNFLGdDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFLEVBQUU7aUJBQ2YsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLG9DQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxrQkFBa0IsR0FBRztLQUMzQixFQUY2RixDQUU3RixDQUFDO0lBQ0ssb0NBQWMsR0FBMkM7UUFDaEUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7S0FDN0IsQ0FBQztJQUNGLDRCQUFDO0NBeENELEFBd0NDLENBeEMwQyxtQkFBbUIsR0F3QzdEO1NBeENZLHFCQUFxQiIsImZpbGUiOiJhY3Rpb24tYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=