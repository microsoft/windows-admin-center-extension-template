/**
 * Enum for the placement of a tooltip
 */
export var TooltipPlacement;
(function (TooltipPlacement) {
    TooltipPlacement[TooltipPlacement["Top"] = 0] = "Top";
    TooltipPlacement[TooltipPlacement["Left"] = 1] = "Left";
    TooltipPlacement[TooltipPlacement["Right"] = 2] = "Right";
    TooltipPlacement[TooltipPlacement["Bottom"] = 3] = "Bottom";
})(TooltipPlacement || (TooltipPlacement = {}));
/**
 * Functions for the TooltipPlacement enum
 */
(function (TooltipPlacement) {
    /**
     * List of all the values of the @see TooltipPlacement enum
     */
    var placements = [
        TooltipPlacement.Top,
        TooltipPlacement.Left,
        TooltipPlacement.Right,
        TooltipPlacement.Bottom
    ];
    /**
     * Converts a string value to a @see TooltipPlacement enum
     */
    function fromString(value, defaultPlacement) {
        if (defaultPlacement === void 0) { defaultPlacement = TooltipPlacement.Bottom; }
        if (MsftSme.isNullOrWhiteSpace(value)) {
            return defaultPlacement;
        }
        value = value.toLowerCase();
        return placements.find(function (tp) { return TooltipPlacement[tp].toLowerCase() === value; }) || defaultPlacement;
    }
    TooltipPlacement.fromString = fromString;
    /**
     * Converts a @see TooltipPlacement enum to a string value
     */
    function toString(placement) {
        return TooltipPlacement[placement];
    }
    TooltipPlacement.toString = toString;
})(TooltipPlacement || (TooltipPlacement = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvdG9vbHRpcC9tb2RlbHMvdG9vbHRpcC1wbGFjZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxnQkFLWDtBQUxELFdBQVksZ0JBQWdCO0lBQ3hCLHFEQUFHLENBQUE7SUFDSCx1REFBSSxDQUFBO0lBQ0oseURBQUssQ0FBQTtJQUNMLDJEQUFNLENBQUE7QUFDVixDQUFDLEVBTFcsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQUszQjtBQUVEOztHQUVHO0FBQ0gsV0FBYyxnQkFBZ0I7SUFFMUI7O09BRUc7SUFDSCxJQUFNLFVBQVUsR0FBRztRQUNmLGdCQUFnQixDQUFDLEdBQUc7UUFDcEIsZ0JBQWdCLENBQUMsSUFBSTtRQUNyQixnQkFBZ0IsQ0FBQyxLQUFLO1FBQ3RCLGdCQUFnQixDQUFDLE1BQU07S0FDMUIsQ0FBQztJQUVGOztPQUVHO0lBQ0gsb0JBQTJCLEtBQWEsRUFBRSxnQkFBNEQ7UUFBNUQsaUNBQUEsRUFBQSxtQkFBcUMsZ0JBQWdCLENBQUMsTUFBTTtRQUNsRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM1QixDQUFDO1FBQ0QsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM1QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDO0lBQ25HLENBQUM7SUFOZSwyQkFBVSxhQU16QixDQUFBO0lBQ0Q7O09BRUc7SUFDSCxrQkFBeUIsU0FBMkI7UUFDaEQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFGZSx5QkFBUSxXQUV2QixDQUFBO0FBQ0wsQ0FBQyxFQTVCYSxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBNEI3QiIsImZpbGUiOiJ0b29sdGlwLXBsYWNlbWVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=