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
import { Component, HostBinding, Injector, Input } from '@angular/core';
import { Dom } from '../../../../../core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
var TagsFormFieldComponent = /** @class */ (function (_super) {
    __extends(TagsFormFieldComponent, _super);
    /**
     * Initializes a new instance of the TagsInputComponent
     */
    function TagsFormFieldComponent(injector) {
        var _this = _super.call(this, injector) || this;
        /**
         * The current value of the new tags to add to this controls value
         */
        _this.newTags = '';
        /**
         * The suggestions property, but filtered to exclude existing tags.
         */
        _this.displayedSuggestions = [];
        /**
         * Indicates the character to use to split tags on.
         */
        _this.tagSplitCharacter = ',';
        /**
         * internal value holder for suggestions property
         */
        _this.internalSuggestions = [];
        _this.instructions = _this.strings.MsftSmeShell.Angular.TagsInput.Instructions.label;
        return _this;
    }
    Object.defineProperty(TagsFormFieldComponent.prototype, "suggestions", {
        /**
         * Suggestions for possible tags that the user could enter
         */
        get: function () {
            return this.internalSuggestions;
        },
        set: function (value) {
            this.internalSuggestions = value;
            this.updateDisplayedSuggestions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagsFormFieldComponent.prototype, "ariaLabel", {
        /**
         * The aria label for this instance
         */
        get: function () {
            return this.getMergedDescriptionLabel();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implementation of angular OnInit interface
     */
    TagsFormFieldComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setAttribute('role', 'group');
    };
    /**
     * Removes a tag from the value of this input
     * @param index the index to remove
     */
    TagsFormFieldComponent.prototype.removeTag = function (event, index) {
        // remove the index from the array without modifying the original array.        
        var value = this.value.slice();
        value.splice(index, 1);
        // move focus to the next element, (as this one is going away)
        var next = Dom.getNextFocusableElement(document.activeElement);
        if (next) {
            next.focus();
        }
        // reassign the array back to the value
        this.value = value;
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * Submits the current newTagsInput value as new tags for our controls value.
     */
    TagsFormFieldComponent.prototype.submitTags = function ($event) {
        var tags = this.newTags
            .split(this.tagSplitCharacter)
            .map(function (tag) { return tag.trim().toLocaleLowerCase(); })
            .filter(function (tag) { return !MsftSme.isNullOrWhiteSpace(tag); });
        if (tags.length > 0) {
            this.value = MsftSme.unique(this.value.concat(tags).unique());
        }
        this.newTags = '';
        $event.preventDefault();
        $event.stopPropagation();
    };
    /**
     * Updates the displayed suggestions to exclude existing tags.
     */
    TagsFormFieldComponent.prototype.updateDisplayedSuggestions = function () {
        var suggestions = this.suggestions || [];
        var tags = this.value || [];
        this.displayedSuggestions = suggestions.filter(function (s) { return tags.every(function (t) { return s !== t; }); });
    };
    /**
     * Occurs every time the value of the control changes, in the UI or programmatically.
     * @param value the value of the form control
     */
    TagsFormFieldComponent.prototype.onValueChanged = function (value) {
        this.updateDisplayedSuggestions();
        _super.prototype.onValueChanged.call(this, value);
    };
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    TagsFormFieldComponent.prototype.createIdBag = function () {
        return {
            newTagSuggestionsList: '',
            screenReaderInstructions: ''
        };
    };
    TagsFormFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-form-field[type="tags"]',
                    template: "\n      <label class=\"sme-arrange-stack-h\" aria-hidden=\"true\">\n          <span class=\"sme-position-flex-auto\">{{label}}</span>\n          <span class=\"sme-position-flex-none sme-margin-left-xs\" *ngIf=\"required\">{{strings.MsftSmeShell.Angular.Common.Form.Validation.required}}</span>\n          <span class=\"sme-position-flex-none sme-icon sme-icon-info sme-margin-left-xs\" *ngIf=\"details\" [title]=\"details\"> </span>\n      </label>\n      <div class=\"sme-tags-input\">\n          <div class=\"sme-tag\" *ngFor=\"let tag of value; let i = index\">\n              <span class=\"sme-tag-content\">{{tag}}</span>\n              <button class=\"sme-button-trigger sme-button-auto-width sme-tag-button sme-tag-button-delete\" role=\"button\" (click)=\"removeTag($event, i)\" [attr.aria-label]=\"strings.MsftSmeShell.Angular.TagsInput.RemoveTag.labelFormat | smeFormat:tag\" [title]=\"strings.MsftSmeShell.Angular.TagsInput.RemoveTag.labelFormat | smeFormat:tag\">\n                  <span class=\"sme-icon sme-icon-clear sme-icon-size-xxs\"></span>\n              </button>\n          </div>\n          <div class=\"sme-tag\">\n              <span class=\"sme-screen-reader\" [id]=\"idBag.screenReaderInstructions\">{{instructions}}</span>\n              <!-- This input does not need to be in a form as this entire component is meant to be used as an element within a form. -->\n              <input #newTagInput class=\"sme-tag-input\" type=\"text\" [attr.list]=\"idBag.newTagSuggestionsList\" autocomplete=\"off\" [(ngModel)]=\"newTags\" (keydown.enter)=\"submitTags($event)\" (blur)=\"submitTags($event)\" [attr.aria-required]=\"required\" [attr.aria-describedby]=\"idBag.screenReaderInstructions\"\n              />\n              <datalist [id]=\"idBag.newTagSuggestionsList\">\n                  <option *ngFor=\"let suggestion of displayedSuggestions\" >{{suggestion}}</option>\n              </datalist>\n              <button class=\"sme-button-trigger sme-tag-button sme-button-auto-width sme-tag-button-add\" role=\"button\" [attr.aria-label]=\"strings.MsftSmeShell.Angular.TagsInput.AddTag.label\" [title]=\"(!value || value.length === 0) ? '' : strings.MsftSmeShell.Angular.TagsInput.AddTag.label\"\n                  (click)=\"newTagInput.focus()\">\n                  <span class=\"sme-icon sme-icon-add sme-icon-size-xxs\"></span>\n                  <span *ngIf=\"!value || value.length === 0\">{{strings.MsftSmeShell.Angular.TagsInput.AddTag.label}}</span>\n              </button>\n          </div>\n      </div>\n      <sme-validation-alert [alert]=\"alert\"></sme-validation-alert>\n    "
                },] },
    ];
    /** @nocollapse */
    TagsFormFieldComponent.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    TagsFormFieldComponent.propDecorators = {
        'tagSplitCharacter': [{ type: Input },],
        'suggestions': [{ type: Input },],
        'ariaLabel': [{ type: HostBinding, args: ['attr.aria-label',] },],
    };
    return TagsFormFieldComponent;
}(SmeInternalFormFieldComponent));
export { TagsFormFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL3RhZ3MvdGFncy1mb3JtLWZpZWxkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxXQUFBLEVBQWEsUUFBQSxFQUFVLEtBQUEsRUFBYyxNQUFPLGVBQUEsQ0FBZ0I7QUFDaEYsT0FBTyxFQUFFLEdBQUEsRUFBSSxNQUFPLHFCQUFBLENBQXNCO0FBQzFDLE9BQU8sRUFBRSw2QkFBQSxFQUE4QixNQUFPLHlCQUFBLENBQTBCO0FBR3hFO0lBQTRDLDBDQUF1QztJQTJDL0U7O09BRUc7SUFDSCxnQ0FDSSxRQUFrQjtRQUR0QixZQUdJLGtCQUFNLFFBQVEsQ0FBQyxTQUVsQjtRQWpERDs7V0FFRztRQUNJLGFBQU8sR0FBRyxFQUFFLENBQUM7UUFFcEI7O1dBRUc7UUFDSSwwQkFBb0IsR0FBYSxFQUFFLENBQUM7UUFFM0M7O1dBRUc7UUFFSSx1QkFBaUIsR0FBRyxHQUFHLENBQUM7UUFjL0I7O1dBRUc7UUFDSyx5QkFBbUIsR0FBYSxFQUFFLENBQUM7UUFpQnZDLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDOztJQUN2RixDQUFDO0lBN0JELHNCQUFXLCtDQUFXO1FBSnRCOztXQUVHO2FBRUg7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQ3BDLENBQUM7YUFDRCxVQUF1QixLQUFlO1lBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUE7UUFDckMsQ0FBQzs7O09BSkE7SUFlRCxzQkFBVyw2Q0FBUztRQUpwQjs7V0FFRzthQUVIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQzVD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QUFRLEVBQUUsOGpGQTZCVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gscUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLFFBQVEsR0FBRztLQUNqQixFQUY2RixDQUU3RixDQUFDO0lBQ0sscUNBQWMsR0FBMkM7UUFDaEUsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN2QyxhQUFhLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNqQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUcsRUFBRSxFQUFFO0tBQ2pFLENBQUM7SUFDRiw2QkFBQztDQTVLRCxBQTRLQyxDQTVLMkMsNkJBQTZCLEdBNEt4RTtTQTVLWSxzQkFBc0IiLCJmaWxlIjoidGFncy1mb3JtLWZpZWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=