import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { KeyCode } from '../../../core';
import { DropdownService } from './dropdown.service';
/**
 * Component to create an dropdown
 */
var DropdownComponent = /** @class */ (function () {
    /**
     * Initializes a new instance of the DropdownDirective
     * @param dropdownService
     */
    function DropdownComponent(renderer, element, dropdownService) {
        this.renderer = renderer;
        this.element = element;
        this.dropdownService = dropdownService;
        /**
         * Event Emitter for when the dropdown opens or closes. Emits a boolean to indicate if the dropdown is open
         */
        this.onToggled = new EventEmitter();
        /**
         * Indicates the open state of the dropdown
         */
        this.isOpen = false;
        /**
         * Indicates how far the dropdown content has been translated to remain fully on screen
         */
        this.translateX = 0;
        /**
         * Indicates how far the dropdown content has been translated to remain fully on screen
         */
        this.translateY = 0;
        /**
         * Indicates that dropdown should be disabled.
         */
        this.disabled = false;
        renderer.addClass(element.nativeElement, 'sme-layout-relative');
    }
    /**
     * Angulars On Init Lifecycle Hook
     */
    DropdownComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.renderer.setAttribute(this.toggleElement.nativeElement, 'aria-haspopup', 'true');
        this.unsubscribeToggleClick = this.renderer.listen(this.toggleElement.nativeElement, 'click', function (event) { return _this.onToggleClick(event); });
    };
    /**
     * Angulars On Destroy Lifecycle Hook
     */
    DropdownComponent.prototype.ngOnDestroy = function () {
        this.close();
        this.unsubscribeToggleClick();
    };
    /**
     * Opens this dropdown
     */
    DropdownComponent.prototype.open = function () {
        this.toggle(true);
    };
    /**
     * Listen to keyboard event and close dropdown when users do not focus on dropdown list
     * @param event
     */
    DropdownComponent.prototype.onKeydown = function (event) {
        if (event.keyCode === KeyCode.Tab
            || (event.keyCode === KeyCode.LeftArrow && event.target.className.indexOf('sme-dropdown-toggle') > -1)) {
            this.close();
        }
    };
    /**
     * Closes this dropdown
     */
    DropdownComponent.prototype.close = function () {
        this.toggle(false);
    };
    /**
     * Toggles the dropdown
     * @param open Optional. If provided, forces the dropdown open or closed.
     */
    DropdownComponent.prototype.toggle = function (open) {
        // If we are already in the correct state, return
        if (!MsftSme.isNullOrUndefined(open) && open === this.isOpen) {
            return;
        }
        if (this.isOpen) {
            // close if opened
            this.dropdownService.close(this);
            this.renderer.setAttribute(this.toggleElement.nativeElement, 'aria-expanded', 'false');
        }
        else {
            // open if closed
            this.dropdownService.open(this);
            this.renderer.setAttribute(this.toggleElement.nativeElement, 'aria-expanded', 'true');
        }
        // emit the current state of the dropdown
        this.onToggled.emit(this.isOpen);
    };
    /**
     * Handler for the click event for the toggle element
     * @param event the mouse event of the click
     */
    DropdownComponent.prototype.onToggleClick = function (event) {
        event.stopPropagation();
        // toggle the dropdown if not disabled
        if (!this.disabled) {
            this.toggle();
        }
        return false;
    };
    DropdownComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-dropdown',
                    template: "\n      <div #smeDropdownToggle class=\"sme-dropdown-toggle-container\">\n          <ng-content select=\".sme-dropdown-toggle\"></ng-content>\n      </div>\n      <div #smeDropdownContent class=\"sme-layout-dropdown sme-layout-absolute sme-position-below sme-scheme-dropdown sme-layer-nav sme-shadow-dropdown\" [ngClass]=\"{'sme-layout-hidden': !isOpen, 'sme-layout-inline-block': isOpen, 'sme-position-left-none': !alignToRight, 'sme-position-right-none': alignToRight}\">\n          <ng-content select=\".sme-dropdown-content\"></ng-content>\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    DropdownComponent.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
        { type: DropdownService, },
    ]; };
    DropdownComponent.propDecorators = {
        'onToggled': [{ type: Output },],
        'alignToRight': [{ type: Input },],
        'contentElement': [{ type: ViewChild, args: ['smeDropdownContent',] },],
        'toggleElement': [{ type: ViewChild, args: ['smeDropdownToggle',] },],
        'disabled': [{ type: HostBinding, args: ['class.disabled',] }, { type: Input },],
        'onKeydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    };
    return DropdownComponent;
}());
export { DropdownComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZHJvcGRvd24vZHJvcGRvd24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFFWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDWixNQUFNLGVBQUEsQ0FBZ0I7QUFFdkIsT0FBTyxFQUFFLE9BQUEsRUFBUSxNQUFPLGVBQUEsQ0FBZ0I7QUFDeEMsT0FBTyxFQUFFLGVBQUEsRUFBZ0IsTUFBTyxvQkFBQSxDQUFxQjtBQUdyRDs7R0FFRztBQUVIO0lBK0NJOzs7T0FHRztJQUNILDJCQUFvQixRQUFtQixFQUFVLE9BQW1CLEVBQVUsZUFBZ0M7UUFBMUYsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFqRDlHOztXQUVHO1FBQ0ssY0FBUyxHQUEwQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBbUI5RDs7V0FFRztRQUNJLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFFdEI7O1dBRUc7UUFDSSxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXRCOztXQUVHO1FBQ0ksZUFBVSxHQUFHLENBQUMsQ0FBQztRQUV0Qjs7V0FFRztRQUVNLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFTdEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLHFCQUFxQixDQUFDLENBQUE7SUFDbkUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksb0NBQVEsR0FBZjtRQUFBLGlCQUdDO1FBRkcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFD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cEIsRUFBQyxJQUFJLEVBQUUsZUFBZSxHQUFHO0tBQ3hCLEVBSjZGLENBSTdGLENBQUM7SUFDSyxnQ0FBYyxHQUEyQztRQUNoRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNoQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNsQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRyxFQUFFLEVBQUU7UUFDeEUsZUFBZSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLG1CQUFtQixFQUFHLEVBQUUsRUFBRTtRQUN0RSxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLEVBQUcsRUFBRSxFQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2hGLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7S0FDdEUsQ0FBQztJQUNGLHdCQUFDO0NBbEtELEFBa0tDLElBQUE7U0FsS1ksaUJBQWlCIiwiZmlsZSI6ImRyb3Bkb3duLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=