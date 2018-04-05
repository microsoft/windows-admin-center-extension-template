import { PowerShell, PowerShellSession } from './powershell';
import { PowerShellBatch, PowerShellBatchSession } from './powershell-batch';
/**
 * The PowerShell Connection class.
 */
var PowerShellConnection = /** @class */ (function () {
    /**
     * Initializes a new instance of the PowerShellConnection class.
     *
     * @param lifetimeService the lifetimeService class instance injected.
     * @param nodeConnection the nodeConnection class instance injected.
     * @param batchConnection the batchConnection class instance injected.
     */
    function PowerShellConnection(lifetimeData, nodeConnection, batchConnection) {
        this.lifetimeData = lifetimeData;
        this.nodeConnection = nodeConnection;
        this.batchConnection = batchConnection;
    }
    PowerShellConnection.prototype.createSession = function (nodeName, key, requestOptions) {
        if (MsftSme.isNullOrWhiteSpace(key)) {
            return new PowerShellSession(PowerShell.create(nodeName, this.nodeConnection, null, null, requestOptions));
        }
        var lifeTime = this.lifetimeData.manager.createChildLifetime();
        return new PowerShellSession(PowerShell.create(nodeName, this.nodeConnection, key, lifeTime, requestOptions), lifeTime);
    };
    PowerShellConnection.prototype.run = function (session, scriptOrCommand, options) {
        var command = PowerShell.getPowerShellCommand(scriptOrCommand);
        if (typeof scriptOrCommand !== 'string' && !command.command) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.PowerShellRunCommandFormat.message;
            throw new Error(message);
        }
        return session.powerShell.run(command, options);
    };
    /**
     * Find existing PowerShellSession by the node name and key.
     *
     * @param nodeName the node name.
     * @param key the key string.
     * @return PowerShellSession the powershell session which is not disposable.
     */
    PowerShellConnection.prototype.find = function (nodeName, key) {
        var ps = PowerShell.find(nodeName, key);
        if (ps) {
            return new PowerShellSession(ps);
        }
        return null;
    };
    /**
     * Cancel the script run.
     * @param session the PowerShell session object.
     */
    PowerShellConnection.prototype.cancel = function (session) {
        return session.powerShell.cancel();
    };
    PowerShellConnection.prototype.createBatchSession = function (nodeNamesList, key, requestOptions) {
        if (!nodeNamesList || nodeNamesList.length === 0) {
            throw new Error('CreateBatchSession needs a valid non-empty nodes list.');
        }
        if (MsftSme.isNullOrWhiteSpace(key)) {
            return new PowerShellBatchSession(PowerShellBatch.create(nodeNamesList, this.batchConnection, null, null, requestOptions));
        }
        var lifeTime = this.lifetimeData.manager.createChildLifetime();
        return new PowerShellBatchSession(PowerShellBatch.create(nodeNamesList, this.batchConnection, key, lifeTime, requestOptions), lifeTime);
    };
    PowerShellConnection.prototype.runBatch = function (session, scriptOrCommandList, options) {
        var commandList = [];
        for (var _i = 0, scriptOrCommandList_1 = scriptOrCommandList; _i < scriptOrCommandList_1.length; _i++) {
            var scriptOrCommand = scriptOrCommandList_1[_i];
            commandList.push(PowerShell.getPowerShellCommand(scriptOrCommand));
        }
        return session.powerShellBatch.run(commandList, options);
    };
    PowerShellConnection.prototype.runBatchSingleCommand = function (session, scriptOrCommand, options) {
        return session.powerShellBatch.runSingleCommand(PowerShell.getPowerShellCommand(scriptOrCommand), options);
    };
    /**
     * Find existing PowerShellBatchSession by the node names list and key.
     *
     * @param nodeNames the node names list.
     * @param key the key string.
     * @return PowerShellBatchSession the powershell batch session which is not disposable.
     */
    PowerShellConnection.prototype.findBatchSession = function (nodeNamesList, key) {
        var ps = PowerShellBatch.find(nodeNamesList, key);
        if (ps) {
            return new PowerShellBatchSession(ps);
        }
        return null;
    };
    return PowerShellConnection;
}());
export { PowerShellConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9wb3dlcnNoZWxsLWNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsT0FBTyxFQUFFLFVBQVUsRUFBd0MsaUJBQWlCLEVBQW1DLE1BQU0sY0FBYyxDQUFDO0FBQ3BJLE9BQU8sRUFBRSxlQUFlLEVBQStCLHNCQUFzQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFMUc7O0dBRUc7QUFDSDtJQUNJOzs7Ozs7T0FNRztJQUNILDhCQUNZLFlBQTBCLEVBQzFCLGNBQThCLEVBQzlCLGVBQWdDO1FBRmhDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7SUFDNUMsQ0FBQztJQWtCTSw0Q0FBYSxHQUFwQixVQUFxQixRQUFnQixFQUFFLEdBQVksRUFBRSxjQUFnRDtRQUNqRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQy9HLENBQUM7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1SCxDQUFDO0lBa0JNLGtDQUFHLEdBQVYsVUFBVyxPQUEwQixFQUFFLGVBQTJDLEVBQUUsT0FBMkI7UUFDM0csSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLE9BQU8sZUFBZSxLQUFLLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQztZQUMvRyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQ0FBSSxHQUFYLFVBQVksUUFBZ0IsRUFBRSxHQUFXO1FBQ3JDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0kscUNBQU0sR0FBYixVQUFjLE9BQTBCO1FBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUF1Qk0saURBQWtCLEdBQXpCLFVBQTBCLGFBQXVCLEVBQUUsR0FBWSxFQUFFLGNBQWdEO1FBRzdHLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLElBQUksc0JBQXNCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDL0gsQ0FBQztRQUVELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDL0QsTUFBTSxDQUFDLElBQUksc0JBQXNCLENBQzdCLGVBQWUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsRUFDMUYsUUFBUSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQWtCTSx1Q0FBUSxHQUFmLFVBQWdCLE9BQStCLEVBQUUsbUJBQW1ELEVBQUUsT0FBMkI7UUFFN0gsSUFBSSxXQUFXLEdBQXdCLEVBQUUsQ0FBQztRQUMxQyxHQUFHLENBQUMsQ0FBd0IsVUFBbUIsRUFBbkIsMkNBQW1CLEVBQW5CLGlDQUFtQixFQUFuQixJQUFtQjtZQUExQyxJQUFJLGVBQWUsNEJBQUE7WUFDcEIsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUN0RTtRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQWtCTSxvREFBcUIsR0FBNUIsVUFBNkIsT0FBK0IsRUFBRSxlQUEyQyxFQUFFLE9BQTJCO1FBRWxJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksK0NBQWdCLEdBQXZCLFVBQXdCLGFBQXVCLEVBQUUsR0FBVztRQUN4RCxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ0wsTUFBTSxDQUFDLElBQUksc0JBQXNCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0E3TEEsQUE2TEMsSUFBQSIsImZpbGUiOiJwb3dlcnNoZWxsLWNvbm5lY3Rpb24uanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9