/**
 * Gets the Decorator strings from the shell strings on the fly
 */
export function getDecoratorStrings() {
    return MsftSme.self().Resources.strings.MsftSmeShell.Angular.Decorators;
}
;
;
/**
 * Extends a class in such a way that each instance can be modified independently
 * @param originalConstructor The original class constructor
 * @param instanceModifier
 * @param copyStaticChecker
 */
export function createClassDecorator(instanceModifier, classModifier, copyStaticProperty) {
    // TODO: Investigate the use of typescript mixin as an alternative way to define 
    // class decorators rather than manually copying the prototype
    // 
    //     let target = class extends classType {
    //         constructor(...args: any[]) {
    //             instanceModifier(this, classType, ...args);
    //             super(args);
    //         }
    //     }
    //     if (classModifier) {
    //         classModifier(target, classType);
    //     }
    //     return result;
    return function (target) {
        var f = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // tslint:disable-next-line:no-invalid-this > Reason: Class Decorators have no other way to modify the class instance
            var instance = this;
            // modify this instance
            instanceModifier.apply(void 0, [instance, target].concat(args));
            // now call the original constructor
            return target.apply(instance, args);
        };
        // copy prototype so instanceof operator still works
        f.prototype = target.prototype;
        // wrap any static props so that they can be accessed correctly
        Object.keys(target).forEach(function (key) {
            // dont copy some properties specified by input
            if (copyStaticProperty && !copyStaticProperty(key)) {
                return;
            }
            // copy any other property
            Object.defineProperty(f, key, {
                get: function () { return target[key]; },
                set: function (value) { return target[key] = value; }
            });
        });
        // Play nice with angular by copying metadata from the original constructor as well
        // We cast reflect to any because angular provides the metadata reflection library for us, but importing it into this file 
        // will cause the angular aot compiler to break. So we lose typing here.
        var reflect = Reflect;
        reflect.getMetadataKeys(target).forEach(function (key) {
            var targetMetadata = reflect.getMetadata(key, target);
            reflect.defineMetadata(key, targetMetadata, f);
        });
        // give our caller an opportunity to modify the class itself
        if (classModifier) {
            classModifier(f, target);
        }
        // return new constructor (will override original)
        return f;
    };
}
/**
 * Enables the creation of a decorator that in turn can be used for any decorator type provided in the options
 * @param options The options for this decorator
 */
export function createUniversalDecorator(options) {
    return function (target, property, descriptorOrParameterIndex) {
        // Only class decorators have 1 argument
        if (arguments.length === 1) {
            if (!options.classDecorator) {
                throw new SyntaxError(options.name + " decorator is not supported on classes.");
            }
            return options.classDecorator(target);
        }
        // Only property decorators have no third argument.
        if (descriptorOrParameterIndex === undefined) {
            if (!options.propertyDecorator) {
                throw new SyntaxError(options.name + " decorator is not supported on properties.");
            }
            return options.propertyDecorator(target, property);
        }
        // Parameter decorators have a nuumber as the third argument.
        if (MsftSme.isNumber(descriptorOrParameterIndex)) {
            if (!options.parameterDecorator) {
                throw new SyntaxError(options.name + " decorator is not supported on parameters.");
            }
            return options.parameterDecorator(target, property, descriptorOrParameterIndex);
        }
        // now we know that the third argument must be a descriptor
        var descriptor = descriptorOrParameterIndex;
        // Method descriptors have a value
        if (MsftSme.isFunction(descriptor.value)) {
            if (!options.methodDecorator) {
                throw new SyntaxError(options.name + " decorator is not supported on methods.");
            }
            return options.methodDecorator(target, property, descriptor);
        }
        // Accessor descriptors have a get/set
        if (MsftSme.isFunction(descriptor.get) || MsftSme.isFunction(descriptor.set)) {
            if (!options.accessorDecorator) {
                throw new SyntaxError(options.name + " decorator is not supported on get/set accessors.");
            }
            return options.accessorDecorator(target, property, descriptor);
        }
        // if we get here something terrible has happened and we shall be scratching our heads.
        var type = MsftSme.getValue(target, 'name') || MsftSme.getValue(target, 'constructor.name') || property || 'unknown type';
        throw new SyntaxError(options.name + " decorator target not supported on " + type + ".");
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvY29tbW9uL2RlY29yYXRvcnMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7R0FFRztBQUNILE1BQU07SUFDRixNQUFNLENBQVcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDdkYsQ0FBQztBQU9BLENBQUM7QUFPRCxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSCxNQUFNLCtCQUNGLGdCQUEwQyxFQUMxQyxhQUFxQyxFQUNyQyxrQkFBbUQ7SUFHbkQsaUZBQWlGO0lBQ2pGLDhEQUE4RDtJQUM5RCxHQUFHO0lBQ0gsNkNBQTZDO0lBQzdDLHdDQUF3QztJQUN4QywwREFBMEQ7SUFDMUQsMkJBQTJCO0lBQzNCLFlBQVk7SUFDWixRQUFRO0lBQ1IsMkJBQTJCO0lBQzNCLDRDQUE0QztJQUM1QyxRQUFRO0lBQ1IscUJBQXFCO0lBRXJCLE1BQU0sQ0FBQyxVQUFzQyxNQUFpQjtRQUMxRCxJQUFJLENBQUMsR0FBUTtZQUFVLGNBQWM7aUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnQkFBZCx5QkFBYzs7WUFDakMscUhBQXFIO1lBQ3JILElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztZQUNwQix1QkFBdUI7WUFDdkIsZ0JBQWdCLGdCQUFDLFFBQVEsRUFBRSxNQUFNLFNBQUssSUFBSSxHQUFFO1lBQzVDLG9DQUFvQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFBO1FBRUQsb0RBQW9EO1FBQ3BELENBQUMsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUUvQiwrREFBK0Q7UUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO1lBRTNCLCtDQUErQztZ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