import { OnChanges, ViewContainerRef } from '@angular/core';
import { TemplateContext, TemplateLoaderBaseComponent } from '../../../common/template-loader-base.component';
import { FormFieldOptionComponent } from './form-field-option.component';
export interface FormFieldOptionSubFormTemplateContext extends TemplateContext<FormFieldOptionComponent> {
    optionIndex: number;
}
export declare class FormFieldOptionSubFormTemplateLoaderComponent extends TemplateLoaderBaseComponent<FormFieldOptionComponent, FormFieldOptionSubFormTemplateContext> implements OnChanges {
    /**
     * The index of the row for this template
     */
    optionIndex: number;
    /**
     * Instantiates a new instance of FormFieldOptionSubFormTemplateLoaderComponent
     * @param viewContainer the reference to this elements view container
     */
    constructor(viewContainer: ViewContainerRef);
    /**
     * Creates the context for our embeded view
     */
    protected createContext(): FormFieldOptionSubFormTemplateContext;
}
