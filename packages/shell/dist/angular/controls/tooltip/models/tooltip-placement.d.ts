/**
 * Enum for the placement of a tooltip
 */
export declare enum TooltipPlacement {
    Top = 0,
    Left = 1,
    Right = 2,
    Bottom = 3,
}
/**
 * Functions for the TooltipPlacement enum
 */
export declare module TooltipPlacement {
    /**
     * Converts a string value to a @see TooltipPlacement enum
     */
    function fromString(value: string, defaultPlacement?: TooltipPlacement): TooltipPlacement;
    /**
     * Converts a @see TooltipPlacement enum to a string value
     */
    function toString(placement: TooltipPlacement): string;
}
