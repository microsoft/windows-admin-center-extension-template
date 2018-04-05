import { OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TemplateContext, TemplateLoaderBaseComponent } from '../../controls/common/template-loader-base.component';
export declare class TemplateOutletDirective extends TemplateLoaderBaseComponent<any, TemplateContext<any>> implements OnChanges {
    /**
     * The data context of the host that should be given to the template context
     */
    hostData: any;
    /**
     * The property name to use for host data
     */
    hostDataName: string;
    /**
     * Instantiates a new instance of TooltipTemplateLoaderComponent
     * @param viewContainer the reference to this elements view container
     */
    constructor(viewContainer: ViewContainerRef);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Creates the context for our embedded view
     */
    protected createContext(): TemplateContext<any>;
    /**
     * Applies the hostData property to a given context object.
     */
    private applyHostData(context);
}
