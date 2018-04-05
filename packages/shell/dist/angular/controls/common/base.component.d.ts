import { ElementRef, Injector, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { LogLevel } from '../../../core';
import { Strings } from '../../../generated/strings';
import { NgLifecycleBaseComponent } from './ng-lifecycle-base.component';
/**
 * A base class for all components.
 * @template TResourceStrings The typed interface for resource strings.
 */
export declare abstract class BaseComponent<TResourceStrings> extends NgLifecycleBaseComponent implements OnDestroy {
    protected injector: Injector;
    /**
     * Static constant to provide unique ids for each component
     * @see {componentId}
     */
    private static nextComponentId;
    /**
     * The localized strings for the current project
     */
    strings: TResourceStrings;
    /**
     * A bag of ids generated using @see {componentId} and the map returned from @see {createIdBag}
     */
    idBag: MsftSme.StringMap<string>;
    /**
     * The unique id of this component.
     * This is useful when controls need to use an ID (such as in forms) but may appear multiple times on the same page.
     * Using this ID as the basis for the controls internal IDs generated in @see {createIdBag} keeps the IDs unique.
     */
    protected componentId: string;
    /**
     * Container for active subscriptions that should be cleaned up in the OnDestroy call.
     */
    protected subscriptions: Subscription[];
    /**
     * The angular renderer service
     */
    protected renderer: Renderer2;
    /**
     * The element reference for this component
     */
    protected hostElement: ElementRef;
    /**
     * Initializes a new instance of the {BaseComponent} class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator
     */
    constructor(injector: Injector);
    /**
     * Implementation of angular OnDestroy interface
     * derived classes are always expected to call super.ngOnDestroy() when overriding
     */
    ngOnDestroy(): void;
    /**
     * Creates the idBag used by this component to store unique element ids
     * Derived classes are always expected to call super.createIdBag() when overriding
     */
    protected createIdBag(): MsftSme.StringMap<string>;
    /**
     * Gets the initial host classes to be applied to this element
     * Derived classes are always expected to call super.getInitialHostClasses() when overriding
     */
    protected getInitialHostClasses(): string[];
    /**
     * Shortcut to set an attribute on the host element
     * @param name The name of the attribute
     * @param value The value of the attribute
     */
    protected setAttribute(name: string, value: string): void;
    /**
     * Shortcut to remove an attribute on the host element
     * @param name The name of the attribute
     */
    protected removeAttribute(name: string): void;
    /**
     * Shortcut to log a record. The source name is automatically picked up from the class instance
     * @param message the message of the log record
     * @param level (optional) the log level (defaults to Debug)
     * @param params (optional) the parameters to log
     * @param source (optional) the source of the log message. Defaults to the name of the constructor that instantiated this instance
     * @return Promise<any> settle to resolve if buffered.
     */
    protected log(message: string, level?: LogLevel, params?: any, source?: string): Promise<any>;
    /**
     * Applies the initial classes to this components host element.
     * We preserve any custom classes by removing them, applying the base classes and reapplying the custom classes.
     */
    private applyInitialHostClasses();
}
/**
 * Internal base component for SME Core controls. It simply removes the need to supply the string type parameter
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
export declare class CoreBaseComponent extends BaseComponent<Strings> {
}
