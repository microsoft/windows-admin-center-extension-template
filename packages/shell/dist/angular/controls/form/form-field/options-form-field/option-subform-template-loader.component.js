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
import { Component, Input, ViewContainerRef } from '@angular/core';
import { TemplateLoaderBaseComponent } from '../../../common/template-loader-base.component';
var FormFieldOptionSubFormTemplateLoaderComponent = /** @class */ (function (_super) {
    __extends(FormFieldOptionSubFormTemplateLoaderComponent, _super);
    /**
     * Instantiates a new instance of FormFieldOptionSubFormTemplateLoaderComponent
     * @param viewContainer the reference to this elements view container
     */
    function FormFieldOptionSubFormTemplateLoaderComponent(viewContainer) {
        return _super.call(this, viewContainer) || this;
    }
    /**
     * Creates the context for our embeded view
     */
    FormFieldOptionSubFormTemplateLoaderComponent.prototype.createContext = function () {
        return {
            $implicit: this.data,
            optionIndex: this.optionIndex
        };
    };
    FormFieldOptionSubFormTemplateLoaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-option-template-loader',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    FormFieldOptionSubFormTemplateLoaderComponent.ctorParameters = function () { return [
        { type: ViewContainerRef, },
    ]; };
    FormFieldOptionSubFormTemplateLoaderComponent.propDecorators = {
        'optionIndex': [{ type: Input },],
    };
    return FormFieldOptionSubFormTemplateLoaderComponent;
}(TemplateLoaderBaseComponent));
export { FormFieldOptionSubFormTemplateLoaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3JtLWZpZWxkL29wdGlvbnMtZm9ybS1maWVsZC9vcHRpb24tc3ViZm9ybS10ZW1wbGF0ZS1sb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFLTCxnQkFBZ0IsRUFDbkIsTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBbUIsMkJBQUEsRUFBNEIsTUFBTyxnREFBQSxDQUFpRDtBQVE5RztJQUNZLGlFQUE0RjtJQVNwRzs7O09BR0c7SUFDSCx1REFBWSxhQUErQjtlQUN2QyxrQkFBTSxhQUFhLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ08scUVBQWEsR0FBdkI7UUFDSSxNQUFNLENBQUM7WUFDSCxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDcEIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1NBQ2hDLENBQUM7SUFDTixDQUFDO0lBQ0Usd0RBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUUsRUFBRTtpQkFDZixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsNERBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGdCQUFnQixHQUFHO0tBQ3pCLEVBRjZGLENBRTdGLENBQUM7SUFDSyw0REFBYyxHQUEyQztRQUNoRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUNoQyxDQUFDO0lBQ0Ysb0RBQUM7Q0F4Q0QsQUF3Q0MsQ0F2Q1csMkJBQTJCLEdBdUN0QztTQXhDWSw2Q0FBNkMiLCJmaWxlIjoib3B0aW9uLXN1YmZvcm0tdGVtcGxhdGUtbG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=