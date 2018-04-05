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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ElementRef, Injector, Renderer2 } from '@angular/core';
import { Dom, Logging, LogLevel } from '../../../core';
import { SmeInject, SmeInjectable } from './decorators';
import { NgLifecycleBaseComponent } from './ng-lifecycle-base.component';
/**
 * A base class for all components.
 * @template TResourceStrings The typed interface for resource strings.
 */
var BaseComponent = /** @class */ (function (_super) {
    __extends(BaseComponent, _super);
    /**
     * Initializes a new instance of the {BaseComponent} class.
     * @param {Injector} injector The angular injection service. required by @SmeInjectable() decorator
     */
    function BaseComponent(injector) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        // load the strings for the application
        _this.strings = MsftSme.self().Resources.strings;
        // initialize subscriptions to empty
        _this.subscriptions = [];
        // setup component id and idBag
        _this.componentId = "component-" + BaseComponent_1.nextComponentId++;
        _this.idBag = _this.createIdBag();
        MsftSme.forEachKey(_this.idBag, function (key) {
            _this.idBag[key] = _this.componentId + "-" + key;
        });
        // setup initial host classes on this element
        _this.applyInitialHostClasses();
        return _this;
    }
    BaseComponent_1 = BaseComponent;
    /**
     * Implementation of angular OnDestroy interface
     * derived classes are always expected to call super.ngOnDestroy() when overriding
     */
    BaseComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            if (subscription && !subscription.closed) {
                subscription.unsubscribe();
            }
        });
    };
    /**
     * Creates the idBag used by this component to store unique element ids
     * Derived classes are always expected to call super.createIdBag() when overriding
     */
    BaseComponent.prototype.createIdBag = function () {
        return {};
    };
    /**
     * Gets the initial host classes to be applied to this element
     * Derived classes are always expected to call super.getInitialHostClasses() when overriding
     */
    BaseComponent.prototype.getInitialHostClasses = function () {
        return [];
    };
    /**
     * Shortcut to set an attribute on the host element
     * @param name The name of the attribute
     * @param value The value of the attribute
     */
    BaseComponent.prototype.setAttribute = function (name, value) {
        this.renderer.setAttribute(this.hostElement.nativeElement, name, value);
    };
    /**
     * Shortcut to remove an attribute on the host element
     * @param name The name of the attribute
     */
    BaseComponent.prototype.removeAttribute = function (name) {
        this.renderer.removeAttribute(this.hostElement.nativeElement, name);
    };
    /**
     * Shortcut to log a record. The source name is automatically picked up from the class instance
     * @param message the message of the log record
     * @param level (optional) the log level (defaults to Debug)
     * @param params (optional) the parameters to log
     * @param source (optional) the source of the log message. Defaults to the name of the constructor that instantiated this instance
     * @return Promise<any> settle to resolve if buffered.
     */
    BaseComponent.prototype.log = function (message, level, params, source) {
        if (level === void 0) { level = LogLevel.Debug; }
        if (source === void 0) { source = this.constructor.name; }
        return Logging.log({
            level: level,
            message: message,
            params: params,
            source: source
        });
    };
    /**
     * Applies the initial classes to this components host element.
     * We preserve any custom classes by removing them, applying the base classes and reapplying the custom classes.
     */
    BaseComponent.prototype.applyInitialHostClasses = function () {
        var _this = this;
        var customClasses = Dom.getClasses(this.hostElement.nativeElement);
        customClasses.forEach(function (c) { return _this.renderer.removeClass(_this.hostElement.nativeElement, c); });
        this.getInitialHostClasses()
            .concat(customClasses)
            .forEach(function (c) { return _this.renderer.addClass(_this.hostElement.nativeElement, c); });
    };
    /**
     * Static constant to provide unique ids for each component
     * @see {componentId}
     */
    BaseComponent.nextComponentId = 0;
    __decorate([
        SmeInject(Renderer2),
        __metadata("design:type", Renderer2)
    ], BaseComponent.prototype, "renderer", void 0);
    __decorate([
        SmeInject(ElementRef),
        __metadata("design:type", ElementRef)
    ], BaseComponent.prototype, "hostElement", void 0);
    BaseComponent = BaseComponent_1 = __decorate([
        SmeInjectable(),
        __metadata("design:paramtypes", [Injector])
    ], BaseComponent);
    return BaseComponent;
    var BaseComponent_1;
}(NgLifecycleBaseComponent));
export { BaseComponent };
/**
 * Internal base component for SME Core controls. It simply removes the need to supply the string type parameter
 * This class is exported from this file, but not meant to be exported from index.ts bundles.
 */
var CoreBaseComponent = /** @class */ (function (_super) {
    __extends(CoreBaseComponent, _super);
    function CoreBaseComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreBaseComponent;
}(BaseComponent));
export { CoreBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvY29tbW9uL2Jhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQWEsVUFBVSxFQUFFLFFBQVEsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdEYsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRXpFOzs7R0FHRztBQUVIO0lBQThELGlDQUF3QjtJQTBDbEY7OztPQUdHO0lBQ0gsdUJBQXNCLFFBQWtCO1FBQXhDLFlBQ0ksaUJBQU8sU0FnQlY7UUFqQnFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFFcEMsdUNBQXVDO1FBQ3ZDLEtBQUksQ0FBQyxPQUFPLEdBQXFCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBRWxFLG9DQUFvQztRQUNwQyxLQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV4QiwrQkFBK0I7UUFDL0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxlQUFhLGVBQWEsQ0FBQyxlQUFlLEVBQUksQ0FBQztRQUNsRSxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUFHO1lBQy9CLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQU0sS0FBSSxDQUFDLFdBQVcsU0FBSSxHQUFLLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsS0FBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7O0lBQ25DLENBQUM7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