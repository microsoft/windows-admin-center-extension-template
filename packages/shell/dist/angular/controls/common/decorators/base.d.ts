/**
 * Gets the Decorator strings from the shell strings on the fly
 */
export declare function getDecoratorStrings(): {
    Deprecated: {
        messageFormat: string;
        alternateSignatureFormat: string;
    };
    Obsolete: {
        messageFormat: string;
        alternateSignatureFormat: string;
    };
};
/**
 * Describes a function used to modify an instance of a class before its constructor is called
 */
export interface InstanceModifierFunction {
    <TFunction extends Function>(instance: any, originalConstructor: TFunction, ...args: any[]): void;
}
/**
 * Describes a function used to modify an instance of a class before its constructor is called
 */
export interface ClassModifierFunction {
    <TFunction extends Function>(newConstructor: TFunction, originalConstructor: TFunction): void;
}
/**
 * Extends a class in such a way that each instance can be modified independently
 * @param originalConstructor The original class constructor
 * @param instanceModifier
 * @param copyStaticChecker
 */
export declare function createClassDecorator(instanceModifier: InstanceModifierFunction, classModifier?: ClassModifierFunction, copyStaticProperty?: MsftSme.Func1<string, boolean>): ClassDecorator;
/**
 * Universal Decorator Options
 */
export interface UniversalDecoratorOptions {
    /**
     * The name of this decorator
     */
    name: string;
    /**
     * The decorator to use if a class decorator is needed
     */
    classDecorator?: ClassDecorator;
    /**
     * The decorator to use if a property decorator is needed
     */
    propertyDecorator?: PropertyDecorator;
    /**
     * The decorator to use if a accessor decorator is needed
     */
    accessorDecorator?: MethodDecorator;
    /**
     * The decorator to use if a method decorator is needed
     */
    methodDecorator?: MethodDecorator;
    /**
     * The decorator to use if a parameter decorator is needed
     */
    parameterDecorator?: ParameterDecorator;
}
/**
 * Generic definition for any Decorator type
 */
export declare type Decorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator;
/**
 * Enables the creation of a decorator that in turn can be used for any decorator type provided in the options
 * @param options The options for this decorator
 */
export declare function createUniversalDecorator(options: UniversalDecoratorOptions): any;
