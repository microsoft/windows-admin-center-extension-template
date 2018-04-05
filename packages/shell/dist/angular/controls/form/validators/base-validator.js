/**
 * Base class for form validation.
 */
var FormValidatorBase = /** @class */ (function () {
    /**
     * Instantiates a new instance of FormValidatorBase
     */
    function FormValidatorBase() {
        /**
         * Revalidates the model attached to this validator
         */
        this.revalidate = MsftSme.noop;
        // placeholder
    }
    /**
     * Implementation of Validator interface.
     * Validates the value of this elements form control. Use the @see checkValidate event to hook into this function.
     * @param c The FormControl attached to this element
     * @return null when valid, otherwise returns a validation object in the form of "{ errorType: {valid: false} }".
     */
    FormValidatorBase.prototype.validate = function (c) {
        // we have no alerts, so return null this should be overridden by derived classes
        return null;
    };
    /**
     * Implementation of Validator interface.
     * registers a change function that should be called anytime revalidation needs to occur
     */
    FormValidatorBase.prototype.registerOnValidatorChange = function (fn) {
        this.revalidate = fn;
    };
    /**
     * Checks if an alerts object has alerts and returns it, otherwise returns null.
     * @param alerts The alerts to check
     */
    FormValidatorBase.prototype.nullIfNoAlerts = function (alerts) {
        if (MsftSme.isNullOrUndefined(alerts) && Object.keys(alerts).length === 0) {
            return null;
        }
        return alerts;
    };
    return FormValidatorBase;
}());
export { FormValidatorBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS92YWxpZGF0b3JzL2Jhc2UtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBOztHQUVHO0FBQ0g7SUFNSTs7T0FFRztJQUNIO1FBUkE7O1dBRUc7UUFDTyxlQUFVLEdBQW1CLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFNaEQsY0FBYztJQUNsQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxvQ0FBUSxHQUFmLFVBQWdCLENBQWM7UUFDMUIsaUZBQWlGO1FBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHFEQUF5QixHQUFoQyxVQUFpQyxFQUFrQjtRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7OztPQUdHO0lBQ08sMENBQWMsR0FBeEIsVUFBeUIsTUFBd0I7UUFDN0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQTFDQSxBQTBDQyxJQUFBIiwiZmlsZSI6ImJhc2UtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==