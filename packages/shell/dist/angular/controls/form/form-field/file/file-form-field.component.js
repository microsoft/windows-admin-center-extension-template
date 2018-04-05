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
import { Component, Injector, Input, ViewChild } from '@angular/core';
import { ValidationAlertSeverity } from '../../validation-alert/validation-alert';
import { SmeInternalFormFieldComponent } from '../form-field.component';
/**
 * Accessable file field implementation
 */
var FileFormFieldComponent = /** @class */ (function (_super) {
    __extends(FileFormFieldComponent, _super);
    /**
     * Initializes a new instance of the FileFormFieldComponent
     */
    function FileFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.selectedFilesLabel = '';
        _this.placeholder = _this.strings.MsftSmeShell.Angular.Form.File.placeholder;
        _this.buttonLabel = _this.strings.MsftSmeShell.Angular.Form.File.buttonText;
        _this.multipleFileFormat = _this.strings.MsftSmeShell.Angular.Form.File.multipleFilesFormat;
        return _this;
    }
    Object.defineProperty(FileFormFieldComponent.prototype, "files", {
        /**
         * Gets the files currently selected
         */
        get: function () {
            return MsftSme.getValue(this.fileInput, 'nativeElement.files') || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileFormFieldComponent.prototype, "hasFiles", {
        /**
         * Indicates if there are any files selected
         */
        get: function () {
            return !!this.files && this.files.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileFormFieldComponent.prototype, "hasFileTypes", {
        /**
         * Indicates if there are any file type restrictions
         */
        get: function () {
            return !!this.fileTypes && this.fileTypes.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileFormFieldComponent.prototype, "accept", {
        /**
         * Returns a formatted accept property for our file input
         */
        get: function () {
            return this.fileTypes ? this.fileTypes.join(', ') : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Occurs when the text input was clicked
     */
    FileFormFieldComponent.prototype.textElementClick = function (e) {
        e.preventDefault();
        this.fileInput.nativeElement.click();
    };
    /**
     * Occurs when the file input has changed
     */
    FileFormFieldComponent.prototype.onFileChanged = function () {
        if (!this.hasFiles) {
            this.value = null;
            this.selectedFilesLabel = '';
        }
        else {
            if (this.files.length === 1) {
                this.value = this.files[0];
                this.selectedFilesLabel = this.value.name;
            }
            else {
                this.value = this.files;
                this.selectedFilesLabel = this.multipleFileFormat.format(this.value.length);
            }
        }
    };
    /**
     * Performs validation that is internal to this control
     * @param c The form control attached to this instance
     */
    FileFormFieldComponent.prototype.validate = function (c) {
        // do not allow files types that are not valid
        if (this.hasFileTypes && this.hasFiles) {
            var _loop_1 = function (i) {
                var file = this_1.files[i];
                var segments = file.name.split('.');
                var extension = segments.length > 1 ? MsftSme.last(segments) : null;
                if (!this_1.fileTypes.some(function (type) { return type === file.type || (extension !== null && type === extension); })) {
                    return { value: {
                            invalidFileType: {
                                message: this_1.strings.MsftSmeShell.Angular.Form.File.invalidFileTypeFormat.format(file.type || extension),
                                valid: false,
                                severity: ValidationAlertSeverity.Error
                            }
                        } };
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.files.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        return _super.prototype.validate.call(this, c);
    };
    FileFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="file"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n              <span class=\"sme-position-flex-auto\">{{label}}</span>\n              <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n              <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n          </label>\n      <div class=\"sme-file-input\">\n          <input #file type=\"file\" [disabled]=\"disabled\" (change)=\"onFileChanged()\" [attr.multiple]=\"multiple || null\" [attr.accept]=\"accept\">\n          <input type=\"text\" class=\"sme-hidden-focus\" aria-hidden=\"true\" [placeholder]=\"placeholder\" [readonly]=\"true\" (click)=\"textElementClick($event)\" [value]=\"selectedFilesLabel\">\n          <button name=\"button\" class=\"sme-button-primary\" [disabled]=\"disabled\" (click)=\"file.click()\">{{buttonLabel}}</button>\n      </div>\n      <span class=\"sme-screen-reader\" [id]=\"idBag.detailsSpan\">{{details}}</span>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    FileFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    FileFormFieldComponent.propDecorators = {
        'fileInput': [{ type: ViewChild, args: ['file',] },],
        'multiple': [{ type: Input },],
        'fileTypes': [{ type: Input },],
        'buttonLabel': [{ type: Input },],
        'multipleFileFormat': [{ type: Input },],
    };
    return FileFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { FileFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL2ZpbGUvZmlsZS1mb3JtLWZpZWxkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBb0MsUUFBQSxFQUFVLEtBQUEsRUFBZSxTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBRXZHLE9BQU8sRUFBcUMsdUJBQUEsRUFBd0IsTUFBTyx5Q0FBQSxDQUEwQztBQUNySCxPQUFPLEVBQUUsNkJBQUEsRUFBOEIsTUFBTyx5QkFBQSxDQUEwQjtBQUV4RTs7R0FFRztBQUVIO0lBQTRDLDBDQUE4QztJQWlFdEY7O09BRUc7SUFDSCxnQ0FDSSxRQUFrQjtRQUR0QixZQUdJLGtCQUFNLFFBQVEsQ0FBQyxTQUtsQjtRQUpHLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDN0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDM0UsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDMUUsS0FBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDOztJQUM5RixDQUFDO0lBcENELHNCQUFZLHlDQUFLO1FBSGpCOztXQUVHO2FBQ0g7WUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLElBQUksSUFBSSxDQUFDO1FBQzNFLENBQUM7OztPQUFBO0lBS0Qsc0JBQVksNENBQVE7UUFIcEI7O1dBRUc7YUFDSDtZQUNJLE1B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