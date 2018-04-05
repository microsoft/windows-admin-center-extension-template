import { OnChanges, ViewContainerRef } from '@angular/core';
import { TemplateContext, TemplateLoaderBaseComponent } from '../common/template-loader-base.component';
import { DataTableDataItem } from './data-table-contract';
export interface DataTableTemplateContext extends TemplateContext<DataTableDataItem> {
    rowIndex: number;
}
export declare class DataTableTemplateLoaderComponent extends TemplateLoaderBaseComponent<DataTableDataItem, DataTableTemplateContext> implements OnChanges {
    /**
     * The index of the row for this template
     */
    rowIndex: number;
    /**
     * Instantiates a new instance of DataTableTemplateLoaderComponent
     * @param viewContainer the reference to this elements view container
     */
    constructor(viewContainer: ViewContainerRef);
    /**
     * Creates the context for our embeded view
     */
    protected createContext(): DataTableTemplateContext;
}
