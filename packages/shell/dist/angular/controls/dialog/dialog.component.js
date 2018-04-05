import { ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Dom, KeyCode } from '../../../core';
var DialogHeaderComponent = /** @class */ (function () {
    function DialogHeaderComponent() {
    }
    DialogHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-dialog-header',
                    template: '<div class="sme-padding-spread-h-sm"><ng-content></ng-content></div>'
                },] },
    ];
    /** @nocollapse */
    DialogHeaderComponent.ctorParameters = function () { return []; };
    return DialogHeaderComponent;
}());
export { DialogHeaderComponent };
var DialogContentComponent = /** @class */ (function () {
    function DialogContentComponent() {
    }
    DialogContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-dialog-content',
                    template: '<ng-content></ng-content>'
                },] },
    ];
    /** @nocollapse */
    DialogContentComponent.ctorParameters = function () { return []; };
    return DialogContentComponent;
}());
export { DialogContentComponent };
var DialogFooterComponent = /** @class */ (function () {
    function DialogFooterComponent() {
    }
    DialogFooterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-dialog-footer',
                    template: '<div class="sme-layout-float-right sme-position-right-inline sme-padding-spread-h-sm"><ng-content></ng-content></div>'
                },] },
    ];
    /** @nocollapse */
    DialogFooterComponent.ctorParameters = function () { return []; };
    return DialogFooterComponent;
}());
export { DialogFooterComponent };
export var DialogCloseReason;
(function (DialogCloseReason) {
    DialogCloseReason[DialogCloseReason["SoftDismiss"] = 0] = "SoftDismiss";
    DialogCloseReason[DialogCloseReason["CloseButton"] = 1] = "CloseButton";
    DialogCloseReason[DialogCloseReason["EscapeKey"] = 2] = "EscapeKey";
    DialogCloseReason[DialogCloseReason["CompetingDialog"] = 3] = "CompetingDialog";
})(DialogCloseReason || (DialogCloseReason = {}));
export var dialogModePane = 'pane';
export var dialogModeCompact = 'compact';
export var dialogModeCompactSquare = 'compact-square';
export var dialogModeFullscreen = 'fullscreen';
export var dialogModeCentered = 'centered';
export var dialogModeCenteredLarge = 'centered-large';
export var modalDialog = 'modal';
export var alertDialog = 'alert';
var DialogComponent = /** @class */ (function () {
    function DialogComponent(elementRef, changeDetectorRef) {
        this.elementRef = elementRef;
        this.changeDetectorRef = changeDetectorRef;
        this.dialogRole = 'alertdialog';
        this.dialogLevel = 1;
        this.showBackdrop = true;
        this.clickBackdrop = true;
        /**
         * Indicates the dialog mode to use. The valid values are:
         * @see dialogModePane - 'pane'
         * @see dialogModeFullSCreen - 'fullscreen'
         * @see dialogModeCentered - 'centered'
         */
        this.dialogMode = dialogModePane;
        /**
         * Dialog types. Mostly used for accessibility. Valid values:
         * @see modalDialog = 'modal';
         * @see alertDialog = "alert";
         */
        this.dialogType = '';
        this.doAutoFocus = false;
        this.isVisible = false;
        // Create closeRequested subject to notify dialogs when a close is requested and how it was requested (DialogCloseReason)
        this.closeRequested = new Subject();
        this.setDialogModeFromInput();
    }
    Object.defineProperty(DialogComponent.prototype, "actionPane", {
        /**
         * Sets whether this should be an action pane or a centered dialog
         *
         * @deprecated Use dialogMode instead
         * @param newValue {boolean} if true, uses a left pane dialog, othewrwise a centered dialog
         */
        set: function (newValue) {
            if (newValue) {
                this.dialogMode = dialogModePane;
            }
            else {
                this.dialogMode = dialogModeCentered;
            }
            this.setDialogModeFromInput();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogComponent.prototype, "visible", {
        get: function () {
            return this.isVisible;
        },
        set: function (visible) {
            this.isVisible = visible;
            this.doAutoFocus = visible;
        },
        enumerable: true,
        configurable: true
    });
    DialogComponent.prototype.onKeyUp = function (event) {
        if (this.visible) {
            switch (event.keyCode) {
                case KeyCode.Escape:
                    this.onEscapePressed();
                    break;
            }
        }
    };
    /**
     * Angular Life Cycle hook for After View Checked.
     * When the visibility changes, we are going to focus on the first element that has the autofocus attribute
     */
    DialogComponent.prototype.ngAfterViewChecked = function () {
        if (this.doAutoFocus) {
            this.autoFocus();
        }
    };
    /**
     * Completed the closeRequested subject
     */
    DialogComponent.prototype.ngOnDestroy = function () {
        this.closeRequested.complete();
    };
    /**
     * Auto focus on first element that is focusable
     */
    DialogComponent.prototype.autoFocus = function () {
        this.doAutoFocus = false;
        var firstFocusable = Dom.getFirstFocusableDescendent(this.elementRef.nativeElement);
        if (firstFocusable) {
            firstFocusable.focus();
        }
    };
    /**
     * Shows the dialog.
     */
    DialogComponent.prototype.show = function () {
        this.visible = true;
    };
    /**
     * Hides the dialog.
     */
    DialogComponent.prototype.hide = function () {
        this.visible = false;
        this.changeDetectorRef.detectChanges();
    };
    /**
     * Notifies closeRequested subscribers that the backdrop has been clicked, requesting a soft dismiss
     */
    DialogComponent.prototype.onBackgroundClicked = function () {
        this.closeRequested.next(DialogCloseReason.SoftDismiss);
    };
    DialogComponent.prototype.onEscapePressed = function () {
        this.closeRequested.next(DialogCloseReason.EscapeKey);
    };
    DialogComponent.prototype.ngOnChanges = function (changes) {
        var dialogModeChange = changes['dialogMode'];
        if (dialogModeChange && dialogModeChange.currentValue) {
            this.setDialogModeFromInput();
        }
    };
    DialogComponent.prototype.setDialogModeFromInput = function () {
        var _this = this;
        var newValue = this.dialogMode.toLowerCase().trim();
        var classes = ['sme-layout-absolute', 'sme-scheme-dialog'];
        var commonPaneClasses = ['sme-position-vertical-none', 'sme-position-right-none'];
        if (newValue === dialogModePane) {
            classes.push.apply(classes, commonPaneClasses.concat(['sme-layout-dialog-pane', 'sme-border-left-md']));
        }
        else if (newValue === dialogModeCompact) {
            classes.push.apply(classes, commonPaneClasses.concat(['sme-layout-dialog-compact', 'sme-border-left-md']));
        }
        else if (newValue === dialogModeCompactSquare) {
            classes.push('sme-position-center sme-layout-dialog-centered sme-layout-dialog-compact-square', 'sme-border-inset-md');
        }
        else if (newValue === dialogModeFullscreen) {
            classes.push.apply(classes, commonPaneClasses.concat(['sme-layout-dialog-fullscreen', 'sme-border-left-md']));
        }
        else if (newValue === dialogModeCentered) {
            classes.push('sme-position-center sme-layout-dialog-centered', 'sme-border-inset-md');
        }
        else if (newValue === dialogModeCenteredLarge) {
            classes.push('sme-position-center sme-layout-dialog-centered-large', 'sme-border-inset-md');
        }
        classes.push('sme-arrange-stack-v');
        this.dialogClasses = classes;
        // accessibility
        if (this.dialogType) {
            this.dialogRole = this.dialogType === modalDialog ? 'dialog' : 'alertdialog';
        }
        else {
            // by default centered dialogs are considered as alerts
            var alertModes = [dialogModeCentered, dialogModeCenteredLarge, dialogModeCompactSquare];
            this.dialogRole = alertModes.some(function (mode) { return _this.dialogMode === mode; }) ? 'alertdialog' : 'dialog';
        }
    };
    DialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-dialog',
                    template: "\n      <sme-backdrop *ngIf=\"visible\" [level]=\"dialogLevel\" (clicked)=\"!!clickBackdrop ? onBackgroundClicked() : ''\" [showBackdrop]=\"showBackdrop\" class=\"sme-layout-absolute sme-position-inset-none\">\n        <div [ngClass]=\"dialogClasses\" [attr.role]=\"dialogRole\" [attr.aria-hidden]=\"!visible\" aria-labelledby=\"sme-dialog-title\" aria-describedby=\"sme-dialog-desc\" aria-modal=\"true\">\n          <div class=\"sme-position-flex-none\">\n            <ng-content select=\"sme-dialog-header\"></ng-content>\n          </div>\n          <div class=\"sme-layout-relative sme-position-flex-auto sme-padding-horizontal-lg sme-arrange-overflow-auto-y sme-arrange-overflow-hide-x\">\n            <ng-content select=\"sme-dialog-content\"></ng-content>\n          </div>\n          <div class=\"sme-position-flex-none\">\n            <ng-content select=\"sme-dialog-footer\"></ng-content>\n          </div>\n        </div>\n      </sme-backdrop>\n    "
                },] },
    ];
    /** @nocollapse */
    DialogComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
    ]; };
    DialogComponent.propDecorators = {
        'showBackdrop': [{ type: Input },],
        'clickBackdrop': [{ type: Input },],
        'actionPane': [{ type: Input },],
        'dialogMode': [{ type: Input },],
        'dialogType': [{ type: Input },],
        'onKeyUp': [{ type: HostListener, args: ['document:keyup', ['$event'],] },],
    };
    return DialogComponent;
}());
export { DialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGlhbG9nL2RpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBS1IsTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBRSxPQUFBLEVBQVEsTUFBTyxjQUFBLENBQWU7QUFDdkMsT0FBTyxFQUFFLEdBQUEsRUFBSyxPQUFBLEVBQVEsTUFBTyxlQUFBLENBQWdCO0FBSTdDO0lBQUE7SUFVQSxDQUFDO0lBVE0sZ0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsc0VBQXNFO2lCQUNuRixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsb0NBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDRiw0QkFBQztDQVZELEFBVUMsSUFBQTtTQVZZLHFCQUFxQjtBQWFsQztJQUFBO0lBVUEsQ0FBQztJQVRNLGlDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsUUFBUSxFQUFFLDJCQUEyQjtpQkFDeEMsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLHFDQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0YsNkJBQUM7Q0FWRCxBQVVDLElBQUE7U0FWWSxzQkFBc0I7QUFhbkM7SUFBQTtJQVVBLENBQUM7SUFUTSxnQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxtQkFBbUI7b0JB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RSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsVUFBVSxHQUFHO1FBQ3BCLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHO0tBQzFCLEVBSDZGLENBRzdGLENBQUM7SUFDSyw4QkFBYyxHQUEyQztRQUNoRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNsQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNuQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNoQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNoQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNoQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7S0FDM0UsQ0FBQztJQUNGLHNCQUFDO0NBdE1ELEFBc01DLElBQUE7U0F0TVksZUFBZSIsImZpbGUiOiJkaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==