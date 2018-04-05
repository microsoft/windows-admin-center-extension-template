/**
 * History:
 *  Version: 0.0.6
 *  Date: 01/29/2018
 *
 *    [Add] OverlayOpen and OverlayClose
 *
 *  Version: 0.0.5
 *  Date: 12/11/2017
 *
 *    [Add] Added new RPC call for Settings
 *
 *  Version: 0.0.4
 *  Date: 10/25/2017
 *
 *    [Add] Added new RPC call.
 *
 *  Version: 0.0.3
 *  Date: 9/11/2017
 *
 *    [Updated] added assets and theme to RpcInitData
 *
 *  Version: 0.0.2
 *  Date: 9/11/2017
 *
 *    [Update] Add "reload" property to RpcShellNavigate
 *
 *  Version: 0.0.1
 *  Date: 8/23/2017
 *
 *    [Deleted] Deactivate
 *    [Updated] Open for RpcOpenResult
 *
 *  Version: 0.0.0
 *  Date: 8/14/2017
 *
 *    [Deleted] CanDeactivate
 *    [Deprecated] Deactivate
 *    [New Added] Deactivate2
 *
 */
/**
 * Version number of this RPC.
 */
export var rpcVersion = '0.0.5';
export var rpcCommandVersion = '0.0.0';
/**
 * Rpc message packet type.
 */
export var RpcMessagePacketType;
(function (RpcMessagePacketType) {
    // Rpc request call.
    RpcMessagePacketType[RpcMessagePacketType["Request"] = 0] = "Request";
    // Rpc response call with success.
    RpcMessagePacketType[RpcMessagePacketType["Response"] = 1] = "Response";
    // Rpc response call with error.
    RpcMessagePacketType[RpcMessagePacketType["Error"] = 2] = "Error";
})(RpcMessagePacketType || (RpcMessagePacketType = {}));
/**
 * Rpc open state.
 */
export var RpcOpenState;
(function (RpcOpenState) {
    /**
     * Opened.
     */
    RpcOpenState[RpcOpenState["Opened"] = 0] = "Opened";
    /**
     * Failed.
     */
    RpcOpenState[RpcOpenState["Failed"] = 1] = "Failed";
    /**
     * In progress.
     */
    RpcOpenState[RpcOpenState["InProgress"] = 2] = "InProgress";
})(RpcOpenState || (RpcOpenState = {}));
/**
 * Rpc deactivate state.
 */
export var RpcDeactivateState;
(function (RpcDeactivateState) {
    /**
     * Deactivated.
     */
    RpcDeactivateState[RpcDeactivateState["Deactivated"] = 0] = "Deactivated";
    /**
     * Cancelled.
     */
    RpcDeactivateState[RpcDeactivateState["Cancelled"] = 1] = "Cancelled";
    /**
     * In progress.
     */
    RpcDeactivateState[RpcDeactivateState["InProgress"] = 2] = "InProgress";
})(RpcDeactivateState || (RpcDeactivateState = {}));
/**
 * Rpc commands that Shell initiates to communicate a module (tool).
 */
export var RpcOutboundCommands;
(function (RpcOutboundCommands) {
    RpcOutboundCommands[RpcOutboundCommands["Init"] = 100] = "Init";
    RpcOutboundCommands[RpcOutboundCommands["Open"] = 101] = "Open";
    RpcOutboundCommands[RpcOutboundCommands["Activate"] = 102] = "Activate";
    RpcOutboundCommands[RpcOutboundCommands["Deactivate2"] = 103] = "Deactivate2";
    RpcOutboundCommands[RpcOutboundCommands["Shutdown"] = 104] = "Shutdown";
    RpcOutboundCommands[RpcOutboundCommands["Ping"] = 105] = "Ping";
    RpcOutboundCommands[RpcOutboundCommands["Forward"] = 106] = "Forward";
    RpcOutboundCommands[RpcOutboundCommands["OverlayClose"] = 107] = "OverlayClose";
})(RpcOutboundCommands || (RpcOutboundCommands = {}));
;
export var RpcSeekMode;
(function (RpcSeekMode) {
    /**
     * Create new inbound rpc on the shell.
     */
    RpcSeekMode[RpcSeekMode["Create"] = 0] = "Create";
    /**
     * Delete existing inbound rpc on the shell.
     */
    RpcSeekMode[RpcSeekMode["Delete"] = 1] = "Delete";
})(RpcSeekMode || (RpcSeekMode = {}));
/**
 * Identifies the scope that these settings have
 */
export var RpcSettingsScope;
(function (RpcSettingsScope) {
    /**
     * User Settings Scope
     */
    RpcSettingsScope[RpcSettingsScope["User"] = 0] = "User";
    /**
     * Application Settings Scope (All Users)
     */
    RpcSettingsScope[RpcSettingsScope["Application"] = 1] = "Application";
})(RpcSettingsScope || (RpcSettingsScope = {}));
/**
 * Identifies the type of provider that owns these settings
 */
export var RpcSettingsProviderType;
(function (RpcSettingsProviderType) {
    /**
     * Common provider type, indicates that these settings are owned by the common provider (shell)
     */
    RpcSettingsProviderType[RpcSettingsProviderType["Common"] = 0] = "Common";
    /**
     * Extension access type, indicates that these settings are owned by the current extension
     */
    RpcSettingsProviderType[RpcSettingsProviderType["Extension"] = 1] = "Extension";
})(RpcSettingsProviderType || (RpcSettingsProviderType = {}));
/**
 * Identifies the user profile operation type to preform
 */
export var RpcSettingsOperationType;
(function (RpcSettingsOperationType) {
    /**
     * Get Operation Type
     */
    RpcSettingsOperationType[RpcSettingsOperationType["Get"] = 0] = "Get";
    /**
     * Set Operation Type
     */
    RpcSettingsOperationType[RpcSettingsOperationType["Set"] = 1] = "Set";
})(RpcSettingsOperationType || (RpcSettingsOperationType = {}));
/**
 * Rpc commands that a Module (tool) initiates to communicate Shell.
 */
export var RpcInboundCommands;
(function (RpcInboundCommands) {
    RpcInboundCommands[RpcInboundCommands["Report"] = 200] = "Report";
    RpcInboundCommands[RpcInboundCommands["Failed"] = 201] = "Failed";
    RpcInboundCommands[RpcInboundCommands["Log"] = 202] = "Log";
    RpcInboundCommands[RpcInboundCommands["Telemetry"] = 203] = "Telemetry";
    RpcInboundCommands[RpcInboundCommands["Notification"] = 204] = "Notification";
    RpcInboundCommands[RpcInboundCommands["Forward"] = 205] = "Forward";
    RpcInboundCommands[RpcInboundCommands["WorkItem"] = 206] = "WorkItem";
    RpcInboundCommands[RpcInboundCommands["UpdateData"] = 207] = "UpdateData";
    RpcInboundCommands[RpcInboundCommands["Seek"] = 208] = "Seek";
    RpcInboundCommands[RpcInboundCommands["WorkItemFind"] = 209] = "WorkItemFind";
    RpcInboundCommands[RpcInboundCommands["ShellNavigate"] = 210] = "ShellNavigate";
    RpcInboundCommands[RpcInboundCommands["Dialog"] = 211] = "Dialog";
    RpcInboundCommands[RpcInboundCommands["Settings"] = 212] = "Settings";
    RpcInboundCommands[RpcInboundCommands["OverlayOpen"] = 213] = "OverlayOpen";
})(RpcInboundCommands || (RpcInboundCommands = {}));
;
/**
 * The type of RpcBase object.
 */
export var RpcType;
(function (RpcType) {
    RpcType[RpcType["Channel"] = 0] = "Channel";
    RpcType[RpcType["Inbound"] = 1] = "Inbound";
    RpcType[RpcType["Outbound"] = 2] = "Outbound";
})(RpcType || (RpcType = {}));
/**
 * Rpc base class.
 */
var RpcBase = /** @class */ (function () {
    /**
     * Initializes a new instance of the RpcBase class.
     *
     * @param rpcChannel the rpc channel object..
     * @param name the public name of Shell or Module (tool).
     * @param origin the origin url to start Shell or Module (tool).
     */
    function RpcBase(rpcChannel, name, origin, type) {
        this.rpcChannel = rpcChannel;
        this.name = name;
        this.origin = origin;
        this.type = type;
        // command collection to handle.
        this.commandCollection = new Map();
    }
    Object.defineProperty(RpcBase, "inboundHandlerMap", {
        /**
         * Gets the inbound handler map.
         */
        get: function () {
            var map = {};
            map[RpcInboundCommands.Report] = 'reportHandler';
            map[RpcInboundCommands.Failed] = 'failedHandler';
            map[RpcInboundCommands.Log] = 'logHandler';
            map[RpcInboundCommands.Telemetry] = 'telemetryHandler';
            map[RpcInboundCommands.Notification] = 'notificationHandler';
            map[RpcInboundCommands.Forward] = 'forwardHandler';
            map[RpcInboundCommands.WorkItem] = 'workItemHandler';
            map[RpcInboundCommands.UpdateData] = 'updateDataHandler';
            map[RpcInboundCommands.Seek] = 'seekHandler';
            map[RpcInboundCommands.WorkItemFind] = 'workItemFindHandler';
            map[RpcInboundCommands.ShellNavigate] = 'shellNavigationHandler';
            map[RpcInboundCommands.Dialog] = 'dialogHandler';
            map[RpcInboundCommands.Settings] = 'settingsHandler';
            map[RpcInboundCommands.OverlayOpen] = 'overlayOpenHandler';
            return map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RpcBase, "outboundHandlerMap", {
        /**
         * Gets the outbound handler map.
         */
        get: function () {
            var map = {};
            map[RpcOutboundCommands.Init] = 'initHandler';
            map[RpcOutboundCommands.Open] = 'openHandler';
            map[RpcOutboundCommands.Activate] = 'activateHandler';
            map[RpcOutboundCommands.Deactivate2] = 'deactivate2Handler';
            map[RpcOutboundCommands.Shutdown] = 'shutdownHandler';
            map[RpcOutboundCommands.Ping] = 'pingHandler';
            map[RpcOutboundCommands.Forward] = 'forwardHandler';
            map[RpcOutboundCommands.OverlayClose] = 'overlayCloseHandler';
            return map;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handle the command with data object.
     *
     * @param command the command name.
     * @param sourceName the name of the remote rpc that sent the request.
     * @param sourceSubName the sub name of the remote rpc that sent the request.
     * @param data the data object.
     * @return Promise<any> the promise object.
     */
    RpcBase.prototype.handle = function (command, sourceName, sourceSubName, data) {
        var handler = this.commandCollection[command];
        if (!handler) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcNotRegisteredHandler.message;
            throw new Error(message);
        }
        Object.assign(data, {
            sourceName: sourceName,
            sourceSubName: sourceSubName
        });
        return handler(data);
    };
    /**
     * Register the handler to the command.
     *
     * @param command the command name.
     * @param handler the handler function.
     */
    RpcBase.prototype.register = function (command, handler) {
        this.commandCollection[command] = handler;
    };
    return RpcBase;
}());
export { RpcBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvcnBjL3JwYy1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0NHO0FBRUg7O0dBRUc7QUFDSCxNQUFNLENBQUMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztBQXdCekM7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxvQkFTWDtBQVRELFdBQVksb0JBQW9CO0lBQzVCLG9CQUFvQjtJQUNwQixxRUFBTyxDQUFBO0lBRVAsa0NBQWtDO0lBQ2xDLHVFQUFRLENBQUE7SUFFUixnQ0FBZ0M7SUFDaEMsaUVBQUssQ0FBQTtBQUNULENBQUMsRUFUVyxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBUy9CO0FBeUZEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksWUFlWDtBQWZELFdBQVksWUFBWTtJQUNwQjs7T0FFRztJQUNILG1EQUFNLENBQUE7SUFFTjs7T0FFRztJQUNILG1EQUFNLENBQUE7SUFFTjs7T0FFRztJQUNILDJEQUFVLENBQUE7QUFDZCxDQUFDLEVBZlcsWUFBWSxLQUFaLFlBQVksUUFldkI7QUF5Q0Q7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxrQkFlWDtBQWZELFdBQVksa0JBQWtCO0lBQzFCOztPQUVHO0lBQ0gseUVBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gscUVBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsdUVBQVUsQ0FBQTtBQUNkLENBQUMsRUFmVyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBZTdCO0FBNENEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksbUJBU1g7QUFURCxXQUFZLG1CQUFtQjtJQUMzQiwrREFBVSxDQUFBO0lBQ1YsK0RBQUksQ0FBQTtJQUNKLHVFQUFRLENBQUE7SUFDUiw2RUFBVyxDQUFBO0lBQ1gsdUVBQVEsQ0FBQTtJQUNSLCtEQUFJLENBQUE7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Q3BELEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxxQkFBcUIsQ0FBQztZQUM5RCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQzs7O09BQUE7SUFXRDs7Ozs7Ozs7T0FRRztJQUNJLHdCQUFNLEdBQWIsVUFBYyxPQUFlLEVBQUUsVUFBa0IsRUFBRSxhQUFxQixFQUFFLElBQVM7UUFDL0UsSUFBSSxPQUFPLEdBQXdCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7WUFDMUcsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQWU7WUFDN0IsVUFBVSxFQUFFLFVBQVU7WUFDdEIsYUFBYSxFQUFFLGFBQWE7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSwwQkFBUSxHQUFmLFVBQWdCLE9BQWUsRUFBRSxPQUE0QjtRQUN6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQzlDLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0F0R0EsQUFzR0MsSUFBQSIsImZpbGUiOiJycGMtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=