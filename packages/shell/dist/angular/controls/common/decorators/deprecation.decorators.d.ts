/**
 * Defines the options for the deprecated decorator
 */
export interface DeprecatedDecoratorOptions {
    /**
     * An additional message to include in the warning to users about the depreciation
     */
    message?: string;
    /**
     * The signature of the element that we are depreciating
     */
    signature?: string;
    /**
     * The alternative signature to suggest using instead of the current signature
     */
    alternateSignature?: string;
    /**
     * Date that this was deprecated in the mm/dd/yy format.
     */
    deprecatedSince: string;
    /**
     * Date that this was obsolete in the mm/dd/yy format. (required if 'obsolete' is true)
     */
    obsoleteSince?: string;
    /**
     * Indicates that the decorated signature is obsolete
     */
    obsolete?: boolean;
    /**
     * Indicates that this method is deprecated for modules to use, but may still be used by the shell.
     */
    suppressForShell?: boolean;
}
/**
 * Decorator for depreciation and obsoletion of classes, methods, and accessors
 * Results in a log message warning the consumer not to use this class.
 * In production mode this becomes a debug level message.
 * @param options The options for the decorator
 */
export declare function Deprecated(options: DeprecatedDecoratorOptions): any;
