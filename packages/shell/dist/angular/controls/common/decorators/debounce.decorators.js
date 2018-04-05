// tslint:disable:function-name > Reason: Decorators should be PascalCase.
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/*
 * @Debounce() Method Decorator
 * Ensures a method is only executed at a maximum of 1 time per every delay interval.
 * Note: this only works with functions that return void. The delay makes it impossible to return values in the
 * same context as the function was originally executed.
 * @param delay The amount of time in milliseconds to debounce the method. Defaults to 200ms
 * @param immediateExecution If true, will execute the original method before timeout instead of afterwards. Defaults to false
 * @returns A @see MethodDecorator for the method that this is decorating
 */
export function Debounce(delay, immediateExecution) {
    if (delay === void 0) { delay = 200; }
    if (immediateExecution === void 0) { immediateExecution = false; }
    // TOOD: Can we force this into a promise like return?
    var currentTimoutRef = null;
    return function (target, propertyKey, descriptor) {
        // copy the descriptor
        var method = __assign({}, descriptor);
        // remember the old value
        var value = method.value;
        // create a new value that debounces calls
        method.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // tslint:disable-next-line:no-invalid-this > Reason: need to get instance of object that the original method is defined on
            var instance = this;
            /// if there is a timer then clear it.
            if (!MsftSme.isNullOrUndefined(currentTimoutRef)) {
                clearTimeout(currentTimoutRef);
            }
            else if (immediateExecution) {
                /// if there is a no timer and we were supposed to execute immediately, 
                // then call the original method before setting a timeout
                value.apply(instance, args);
            }
            // start a new timeout
            currentTimoutRef = setTimeout(function () {
                // when the timeout completes, clear our reference to it.
                currentTimoutRef = null;
                // if we did not start with execution, then execute now by calling the original method
                if (!immediateExecution) {
                    value.apply(instance, args);
                }
            }, delay);
        };
        return method;
    };
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvY29tbW9uL2RlY29yYXRvcnMvZGVib3VuY2UuZGVjb3JhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7Ozs7Ozs7OztBQUUxRTs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sbUJBQW1CLEtBQW1CLEVBQUUsa0JBQTBCO0lBQS9DLHNCQUFBLEVBQUEsV0FBbUI7SUFBRSxtQ0FBQSxFQUFBLDBCQUEwQjtJQUNwRSxzREFBc0Q7SUFDdEQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7SUFDNUIsTUFBTSxDQUFDLFVBQUksTUFBVyxFQUFFLFdBQTRCLEVBQUUsVUFBOEI7UUFDaEYsc0JBQXNCO1FBQ3RCLElBQUksTUFBTSxnQkFBUSxVQUFVLENBQUUsQ0FBQztRQUMvQix5QkFBeUI7UUFDekIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN6QiwwQ0FBMEM7UUFDMUMsTUFBTSxDQUFDLEtBQUssR0FBRztZQUFVLGNBQU87aUJBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztnQkFBUCx5QkFBTzs7WUFDNUIsMkhBQTJIO1lBQzNILElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztZQUVwQixzQ0FBc0M7WUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUM1Qix3RUFBd0U7Z0JBQ3hFLHlEQUF5RDtnQkFDekQsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUVELHNCQUFzQjtZQUN0QixnQkFBZ0IsR0FBRyxVQUFVLENBQ3pCO2dCQUNJLHlEQUF5RDtnQkFDekQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixzRkFBc0Y7Z0JBQ3RGLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztZQUNMLENBQUMsRUFDRCxLQUFLLENBQ1IsQ0FBQztRQUNOLENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUFBLENBQUMiLCJmaWxlIjoiZGVib3VuY2UuZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=