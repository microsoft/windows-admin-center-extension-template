// tslint:disable:function-name > Reason: Decorators should be PascalCase.
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { createClassDecorator } from './base';
/**
 * Constant key for the property that we auto-magically inject into decorated class instances to manage dependencies.
 * the value should be unique enough to never conflict with realistic property names in a class.
 */
var smeInjectKey = '__SmeInjectionMap__';
/*
 * @SmeInjectable() Property Decorator
 * Works in tandem with SmeInjectable class decorators to inject angular services into class properties using the Injector Service.
 * This will populate the @see smeInjectKey property on the instance of the class before the original constructor is called.
 * @param token The Type of the class to inject
 * @param optional If true, will return null if 'token' is not available for the current class instance @optional
 * @returns A @PropertyDecorator for the property that this is decorating
 */
export function SmeInject(token, optional) {
    if (optional === void 0) { optional = false; }
    // Property decorators return a function that passes in the instance of the class that owns the property and the property name.
    return function (target, propertyKey) {
        var targetClass = target.constructor;
        if (MsftSme.isNullOrUndefined(targetClass[smeInjectKey])) {
            targetClass[smeInjectKey] = {};
        }
        targetClass[smeInjectKey][propertyKey] = { token: token, optional: optional };
    };
}
/**
 * @SmeInjectable() Class Decorator
 * Works in tandem with SmeInject property decorators to inject angular services into class properties using the Injector Service.
 *
 * Results in a wrapper around the decorated classes constructor that handles the injection
 *
 * Limitations:
 * This currently requires the decorated class to have the 'Injector' as the first argument to the function.
 * In the future, we should remove this limitation by overriding angulars class metadata to inject the additional argument into the
 * wrapped constructor.
 *
 * For now, the best we can do is check that there is a first argument, but we have no way of
 * knowing that it is actually the Injector service. If it is not, this will fail in unknown ways.
 * @returns A ClassDecorator for the class that this
 */
export function SmeInjectable() {
    var injectionWrapper = function (instance, originalConstructor, injector) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (MsftSme.isNullOrUndefined(injector)) {
            // tslint:disable-next-line:max-line-length
            throw new Error("SmeInjectable: No Injector in constructor for " + originalConstructor.name + ". The angular Injector must be the first argument to the constructor.");
        }
        var injectionMap = {};
        var proto = Object.getPrototypeOf(instance);
        while (!MsftSme.isNullOrUndefined(proto)) {
            var protoType = proto.constructor;
            // find out if we have anything to inject on this prototype. This is populated by the 'SmeInject' annotation.
            var protoInjection = protoType[smeInjectKey] || {};
            injectionMap = __assign({}, protoInjection, injectionMap);
            // get next prototype
            proto = Object.getPrototypeOf(proto);
        }
        // process any injected properties we found
        var propertyKeys = Object.keys(injectionMap);
        if (propertyKeys.length > 0) {
            // Use the injector to do the heavy lifting and resolve our tokens into properties.
            propertyKeys.forEach(function (prop) {
                var options = injectionMap[prop];
                if (options.optional) {
                    instance[prop] = injector.get(options.token, null);
                }
                else {
                    instance[prop] = injector.get(options.token);
                }
            });
        }
    };
    return createClassDecorator(injectionWrapper, null, function (key) { return key !== smeInjectKey; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvY29tbW9uL2RlY29yYXRvcnMvaW5qZWN0aW9uLmRlY29yYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEVBQTBFOzs7Ozs7Ozs7QUFHMUUsT0FBTyxFQUFFLG9CQUFvQixFQUE0QixNQUFNLFFBQVEsQ0FBQztBQUV4RTs7O0dBR0c7QUFDSCxJQUFNLFlBQVksR0FBRyxxQkFBcUIsQ0FBQztBQWUzQzs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxvQkFBb0IsS0FBVSxFQUFFLFFBQWdCO0lBQWhCLHlCQUFBLEVBQUEsZ0JBQWdCO0lBQ2xELCtIQUErSDtJQUMvSCxNQUFNLENBQUMsVUFBVSxNQUFjLEVBQUUsV0FBNEI7UUFFekQsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUVyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELFdBQVcsQ0FBQyxZQUFZLENBQUMsR0FBb0IsRUFBRSxDQUFBO1FBQ25ELENBQUM7UUFDQSxXQUFXLENBQUMsWUFBWSxDQUFxQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDdkcsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTTtJQUVGLElBQUksZ0JBQWdCLEdBQ2hCLFVBQUMsUUFBYSxFQUFFLG1CQUE2QixFQUFFLFFBQWtCO1FBQUUsY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCw2QkFBTzs7UUFDdEUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QywyQ0FBMkM7WUFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBaUQsbUJBQW1CLENBQUMsSUFBSSwwRUFBdUUsQ0FBQyxDQUFBO1FBQ3JLLENBQUM7UUFFRCxJQUFJLFlBQVksR0FBb0IsRUFBRSxDQUFDO1FBQ3ZDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDbEMsNkdBQTZHO1lBQzdHLElBQUksY0FBYyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkQsWUFBWSxnQkFBUSxjQUFjLEVBQUssWUFBWSxDQUFFLENBQUE7WUFFckQscUJBQXFCO1lBQ3JCLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCwyQ0FBMkM7UUFDM0MsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU3QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsbUZBQW1GO1lBQ25GLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNyQixJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVOLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEtBQUssWUFBWSxFQUFwQixDQUFvQixDQUFDLENBQUM7QUFDckYsQ0FBQyIsImZpbGUiOiJpbmplY3Rpb24uZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=