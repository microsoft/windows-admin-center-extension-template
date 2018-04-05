import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
/**
 * Defines a generic option for control types that display multiple options.
 * These include, radio, checklist, multiselect, select, etc...
 * The current implementation is pretty basic, but could be extended to support a variety of features
 */
var FormFieldOptionComponent = /** @class */ (function () {
    function FormFieldOptionComponent() {
    }
    FormFieldOptionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-option',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    FormFieldOptionComponent.ctorParameters = function () { return []; };
    FormFieldOptionComponent.propDecorators = {
        'value': [{ type: Input },],
        'label': [{ type: Input },],
        'subFormTemplate': [{ type: ContentChild, args: [TemplateRef,] },],
    };
    return FormFieldOptionComponent;
}());
export { FormFieldOptionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL29wdGlvbnMtZm9ybS1maWVsZC9mb3JtLWZpZWxkLW9wdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxZQUFBLEVBQWMsS0FBQSxFQUFPLFdBQUEsRUFBWSxNQUFPLGVBQUEsQ0FBZ0I7QUFFNUU7Ozs7R0FJRztBQUVIO0lBQUE7SUFpQ0EsQ0FBQztJQWRNLG1DQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSxFQUFFO2lCQUNmLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx1Q0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLHVDQUFjLEdBQTJDO1FBQ2hFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNCLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNCLGlCQUFpQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRyxFQUFFLEVBQUU7S0FDbEUsQ0FBQztJQUNGLCtCQUFDO0NBakNELEFBaUNDLElBQUE7U0FqQ1ksd0JBQXdCIiwiZmlsZSI6ImZvcm0tZmllbGQtb3B0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=