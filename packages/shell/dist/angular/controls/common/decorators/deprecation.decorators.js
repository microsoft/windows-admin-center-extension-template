// tslint:disable:function-name > Reason: Decorators should be PascalCase.
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Logging, LogLevel } from '../../../../core';
import { createClassDecorator, createUniversalDecorator, getDecoratorStrings } from './base';
/**
 * Logs the depreciation message. The message type is much more severe in development mode than in production.
 * @param options The deprecated decorator options
 * @param target the target object of the decorator
 * @param propertyKey the property that we are decorating if applicable
 */
function logMessage(options, target, propertyKey) {
    var isProduction = !!MsftSme.getValue(MsftSme.self(), 'Init.isProduction');
    var className = MsftSme.isFunction(target) ? target.name : target.constructor.name;
    var strings = getDecoratorStrings();
    var message;
    // create signature if not provided
    if (!options.signature) {
        options.signature = className + (propertyKey ? "." + propertyKey : '');
    }
    // if obsolete, use a different message
    if (options.obsolete) {
        if (!options.obsoleteSince) {
            // tslint:disable-next-line
            throw new SyntaxError("obsolete option set on Deprecated decorator for " + options.signature + ", but has an invalid 'obsoleteSince' date.");
        }
        // craft obsolete message from options. 
        var alternateMessage = options.alternateSignature
            ? strings.Obsolete.alternateSignatureFormat
                .format(options.alternateSignature)
            : '';
        message = strings.Obsolete.messageFormat
            .format(options.signature, options.obsoleteSince, alternateMessage, options.message || '');
    }
    else {
        if (!options.deprecatedSince) {
            // tslint:disable-next-line
            throw new SyntaxError("deprecated decorator for " + options.signature + " has an invalid 'deprecatedSince' date.");
        }
        // craft deprecated message from options. 
        var alternateMessage = options.alternateSignature
            ? strings.Deprecated.alternateSignatureFormat
                .format(options.alternateSignature)
            : '';
        message = strings.Deprecated.messageFormat
            .format(options.signature, options.deprecatedSince, alternateMessage, options.message || '');
    }
    // if not the shell or not suppressed for the shell, then log a message
    if (!options.suppressForShell || window.top !== window.self) {
        Logging.log({
            level: isProduction ? LogLevel.Debug : LogLevel.Warning,
            message: message,
            source: className
        });
    }
}
/**
 * Decorator for depreciation and obsoletion of classes, methods, and accessors
 * Results in a log message warning the consumer not to use this class.
 * In production mode this becomes a debug level message.
 * @param options The options for the decorator
 */
export function Deprecated(options) {
    // Create as a decorator that supports Classes, Accessors, and Methods. Properties and Parameters are not supported.
    return createUniversalDecorator({
        name: Deprecated.name,
        accessorDecorator: function (target, propertyKey, descriptor) {
            var accessor = __assign({}, descriptor);
            if (descriptor.get) {
                accessor.get = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    logMessage(options, target, propertyKey);
                    // tslint:disable-next-line:no-invalid-this
                    return descriptor.get.apply(this, args);
                };
            }
            if (descriptor.set) {
                accessor.set = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    logMessage(options, target, propertyKey);
                    // tslint:disable-next-line:no-invalid-this
                    return descriptor.set.apply(this, args);
                };
            }
            return accessor;
        },
        classDecorator: createClassDecorator(function (instance, originalConstructor) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            logMessage(options, instance);
        }),
        methodDecorator: function (target, propertyKey, descriptor) {
            var method = __assign({}, descriptor);
            if (descriptor.value) {
                method.value = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    logMessage(options, target, propertyKey);
                    // tslint:disable-next-line:no-invalid-this
                    return descriptor.value.apply(this, args);
                };
            }
            return method;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvY29tbW9uL2RlY29yYXRvcnMvZGVwcmVjYXRpb24uZGVjb3JhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7Ozs7Ozs7OztBQUUxRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSx3QkFBd0IsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUU3Rjs7Ozs7R0FLRztBQUNILG9CQUFvQixPQUFtQyxFQUFFLE1BQVcsRUFBRSxXQUE2QjtJQUUvRixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMzRSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUNuRixJQUFJLE9BQU8sR0FBRyxtQkFBbUIsRUFBRSxDQUFDO0lBQ3BDLElBQUksT0FBZSxDQUFDO0lBRXBCLG1DQUFtQztJQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFJLFdBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLDJCQUEyQjtZQUMz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QUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3pDLDJDQUEyQztvQkFDM0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUNELGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxVQUFDLFFBQWEsRUFBRSxtQkFBNkI7WUFBRSxjQUFPO2lCQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87Z0JBQVAsNkJBQU87O1lBQU8sVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQztRQUNuSSxlQUFlLEVBQUUsVUFBSSxNQUFXLEVBQUUsV0FBNEIsRUFBRSxVQUE4QjtZQUMxRixJQUFJLE1BQU0sZ0JBQVEsVUFBVSxDQUFFLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxLQUFLLEdBQUc7b0JBQVUsY0FBTzt5QkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO3dCQUFQLHlCQUFPOztvQkFDNUIsVUFBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3pDLDJDQUEyQztvQkFDM0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztLQUNKLENBQUMsQ0FBQztBQUNQLENBQUMiLCJmaWxlIjoiZGVwcmVjYXRpb24uZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=