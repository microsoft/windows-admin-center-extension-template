export declare function SmeInject(token: any, optional?: boolean): PropertyDecorator;
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
export declare function SmeInjectable(): ClassDecorator;
