import { EmbeddedViewRef, OnChanges, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
export interface TemplateContext<TData> {
    $implicit: TData;
}
/**
 * Base class for template loaders
 */
export declare abstract class TemplateLoaderBaseComponent<TData, TContext extends TemplateContext<TData>> implements OnInit, OnChanges, OnDestroy {
    private viewContainer;
    /**
     * The data context of the view we create
     */
    data: TData;
    /**
     * The Template to load into the view container
     */
    template: TemplateRef<TContext>;
    /**
     * The reference to the view created for the template
     */
    protected view: EmbeddedViewRef<TContext>;
    /**
     * Instantiates a new instance of TemplateLoaderBaseComponent
     * @param viewContainer the reference to this elements view container
     */
    constructor(viewContainer: ViewContainerRef);
    /**
     * Implementation of angular OnInit interface
     */
    ngOnInit(): void;
    /**
     * Implementation of angular OnChanges interface
     * @param changes the changes that occured
     */
    ngOnChanges(changes: any): void;
    /**
     * Implementation of angular OnDestroy interface
     */
    ngOnDestroy(): void;
    /**
     * Creates the context for our embeded view
     */
    protected abstract createContext(): TContext;
}
