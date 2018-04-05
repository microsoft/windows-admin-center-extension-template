/**
 * The RPC dialog type.
 */
export var RpcDialogType;
(function (RpcDialogType) {
    /**
     * Open the confirmation dialog.
     */
    RpcDialogType[RpcDialogType["OpenConfirmationDialog"] = 1] = "OpenConfirmationDialog";
    /**
     * Open the confirmation list dialog.
     */
    RpcDialogType[RpcDialogType["OpenConfirmationListDialog"] = 2] = "OpenConfirmationListDialog";
    /**
     * Open the message dialog.
     */
    RpcDialogType[RpcDialogType["OpenMessageDialog"] = 3] = "OpenMessageDialog";
    /**
     * Close the dialog.
     */
    RpcDialogType[RpcDialogType["Close"] = 4] = "Close";
    /**
     * Polling the status of the dialog.
     */
    RpcDialogType[RpcDialogType["PollingStatus"] = 5] = "PollingStatus";
})(RpcDialogType || (RpcDialogType = {}));
/**
 * The RPC dialog state.
 */
export var RpcDialogState;
(function (RpcDialogState) {
    /**
     * The dialog is opened.
     */
    RpcDialogState[RpcDialogState["Opened"] = 1] = "Opened";
    /**
     * The dialog is closed.
     */
    RpcDialogState[RpcDialogState["Closed"] = 2] = "Closed";
    /**
     * The dialog is terminated by shell or rpc request.
     */
    RpcDialogState[RpcDialogState["ForcedTerminated"] = 3] = "ForcedTerminated";
    /**
     * The dialog is failed.
     */
    RpcDialogState[RpcDialogState["Failed"] = 4] = "Failed";
})(RpcDialogState || (RpcDialogState = {}));
/**
 * The levels of severity of a RPC alert.
 */
export var RpcAlertSeverity;
(function (RpcAlertSeverity) {
    RpcAlertSeverity[RpcAlertSeverity["Informational"] = 0] = "Informational";
    RpcAlertSeverity[RpcAlertSeverity["Warning"] = 1] = "Warning";
    RpcAlertSeverity[RpcAlertSeverity["Error"] = 2] = "Error";
})(RpcAlertSeverity || (RpcAlertSeverity = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvcnBjL3JwYy1kaWFsb2dzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksYUF5Qlg7QUF6QkQsV0FBWSxhQUFhO0lBQ3JCOztPQUVHO0lBQ0gscUZBQTBCLENBQUE7SUFFMUI7O09BRUc7SUFDSCw2RkFBMEIsQ0FBQTtJQUUxQjs7T0FFRztJQUNILDJFQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsbURBQUssQ0FBQTtJQUVMOztPQUVHO0lBQ0gsbUVBQWEsQ0FBQTtBQUNqQixDQUFDLEVBekJXLGFBQWEsS0FBYixhQUFhLFFBeUJ4QjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksY0FvQlg7QUFwQkQsV0FBWSxjQUFjO0lBQ3RCOztPQUVHO0lBQ0gsdURBQVUsQ0FBQTtJQUVWOztPQUVHO0lBQ0gsdURBQU0sQ0FBQTtJQUVOOztPQUVHO0lBQ0gsMkVBQWdCLENBQUE7SUFFaEI7O09BRUc7SUFDSCx1REFBTSxDQUFBO0FBQ1YsQ0FBQyxFQXBCVyxjQUFjLEtBQWQsY0FBYyxRQW9CekI7QUFvUEQ7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxnQkFJWDtBQUpELFdBQVksZ0JBQWdCO0lBQ3hCLHlFQUFpQixDQUFBO0lBQ2pCLDZEQUFXLENBQUE7SUFDWCx5REFBUyxDQUFBO0FBQ2IsQ0FBQyxFQUpXLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFJM0IiLCJmaWxlIjoicnBjLWRpYWxvZ3MuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9