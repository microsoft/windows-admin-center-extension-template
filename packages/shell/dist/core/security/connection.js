import { Observable } from 'rxjs';
import { EnvironmentModule } from '../manifest/environment-modules';
import { ToolConditionValidator } from './tool-condition-validator';
/**
 * Defines connection type strings known by core
 * Be careful that these strings match what is defined by the manifest of @msft-sme/server-manager
 */
export var connectionTypeConstants = {
    server: 'msft.sme.connection-type.server',
    cluster: 'msft.sme.connection-type.cluster',
    hyperConvergedCluster: 'msft.sme.connection-type.hyper-converged-cluster',
    windowsClient: 'msft.sme.connection-type.windows-client',
    clusterNodesProperty: 'nodes'
};
/**
 * Connection Utility class.
 */
var ConnectionUtility = /** @class */ (function () {
    function ConnectionUtility() {
    }
    /**
     * Determines if one connection is referring to the same object as another connection
     *
     * @param a the first connection in the comparison
     * @param b the second connection in the comparison
     * @returns true if the connections are of the same type and have the same name
     */
    ConnectionUtility.areEqual = function (a, b) {
        if (!a || !b) {
            return a === b;
        }
        if (a.type !== b.type) {
            return false;
        }
        if (a.name !== b.name) {
            return false;
        }
        if (a.id !== b.id) {
            return false;
        }
        return true;
    };
    /**
     * Determines if the given connection is to a server
     *
     * @param connection the connection to check
     */
    ConnectionUtility.isServer = function (connection) {
        return connection.type === connectionTypeConstants.server;
    };
    /**
     * Determines if the given connection is to a cluster connection.
     * Currently we support: HCI and Failover Cluster.
     *
     * @param connection the connection to check
     */
    ConnectionUtility.isCluster = function (connection) {
        return connection.type === connectionTypeConstants.cluster ||
            connection.type === connectionTypeConstants.hyperConvergedCluster;
    };
    /**
     * Determines if the given connection is to a FailOver cluster
     *
     * @param connection the connection to check
     */
    ConnectionUtility.isFailoverCluster = function (connection) {
        return connection.type === connectionTypeConstants.cluster;
    };
    /**
     * Determines if the given connection is to a HCI cluster
     *
     * @param connection the connection to check
     */
    ConnectionUtility.isHyperConvergedCluster = function (connection) {
        return connection.type === connectionTypeConstants.hyperConvergedCluster;
    };
    /**
     * Determines if the given connection is to a windows client
     *
     * @param connection the connection to check
     */
    ConnectionUtility.isWindowsClient = function (connection) {
        return connection.type === connectionTypeConstants.windowsClient;
    };
    /**
     * Determines if the given connection is to a node
     *
     * @param connection the connection to check
     */
    ConnectionUtility.isNode = function (connection) {
        return this.isServer(connection) || this.isCluster(connection) || this.isWindowsClient(connection);
    };
    /**
     * Gets the name of a node from a connection. This assumes the connection is to a single server or cluster.
     *
     * @param connection the connection object. (should be of type server or cluster)
     * @param throwError throw an error if not a server or cluster.
     */
    ConnectionUtility.getNodeName = function (connection, throwError) {
        if (throwError === void 0) { throwError = false; }
        if (!this.isNode(connection)) {
            if (throwError) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ExpectedSingleNode.message;
                throw new Error(message);
            }
            return null;
        }
        return connection.name;
    };
    /**
     * Gets the name of a valid node from a connection. This assumes the connection is to a single server or cluster.
     *   if activeAlias is used return it, otherwise return connection.name
     *
     * @param connection the connection object. (should be of type server or cluster)
     * @param throwError throw an error if not a server or cluster.
     */
    ConnectionUtility.getValidNodeName = function (connection, throwError) {
        if (throwError === void 0) { throwError = false; }
        if (!this.isNode(connection)) {
            if (throwError) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ExpectedSingleNode.message;
                throw new Error(message);
            }
            return null;
        }
        if (connection.activeAlias) {
            return connection.activeAlias;
        }
        else {
            return connection.name;
        }
    };
    /**
     * Gets nodes of a connection of type cluster
     *
     * @param connection the connection object. (should be of type cluster)
     * @param throwError throw an error if not a cluster.
     */
    ConnectionUtility.getClusterNodes = function (connection, throwError) {
        if (throwError === void 0) { throwError = false; }
        if (!this.isCluster(connection)) {
            if (throwError) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ExpectedClusterNode.message;
                throw new Error(message);
            }
            return [];
        }
        return connection.properties[connectionTypeConstants.clusterNodesProperty];
    };
    /**
     * Gets the connection type info for a given connection
     *
     * @param connection the connection object.
     */
    ConnectionUtility.getConnectionTypeInfo = function (connection) {
        return EnvironmentModule.getConnectionTypeInfo(connection.type);
    };
    /**
     * creates a connection Identifier
     *
     * @param connectionType the connection type.
     * @param connectionName the connection name.
     */
    ConnectionUtility.createConnectionId = function (connectionType, connectionName) {
        return connectionType.toLocaleLowerCase() + "!" + connectionName.toLocaleLowerCase();
    };
    /**
     * Ensures tat important fields in a connection are lowercase
     * @param connection
     */
    ConnectionUtility.forceLowercase = function (connection) {
        connection.id = connection.id.toLocaleLowerCase();
        connection.name = connection.name.toLocaleLowerCase();
        connection.type = connection.type.toLocaleLowerCase();
    };
    /**
     * Ensures tat important fields in a connection are lowercase
     * @param connection
     */
    ConnectionUtility.hasTags = function (connection) {
        return connection.tags && connection.tags.length > 0;
    };
    /**
     * Create an observable to determine the collection of tools to be applicable to the connection.
     *
     * @param appContext the application context.
     * @param caches the share inventory query caches.
     * @param connection the connection object.
     * @param solution the entry point object of the solution.
     */
    ConnectionUtility.queryToolsList = function (appContext, caches, connection, solution) {
        var observables = [];
        var tools = [];
        var endpoint = appContext.authorizationManager.getJeaEndpoint(connection.name);
        EnvironmentModule.getEntryPointsByType(['tool'])
            .filter(function (entryPoint) { return !endpoint || entryPoint.parentModule.jea; })
            .map(function (tool) {
            var item = ToolConditionValidator.current(caches).scanToolCondition(connection, solution, tool);
            if (item instanceof Observable) {
                observables.push(item);
            }
            else {
                tools.push(item);
            }
        });
        var observable = Observable.create(function (observer) {
            // respond tools that have no conditional observable.
            observer.next(tools);
            // process observable sequentially by using concat.
            var subscription = Observable.concat.apply(Observable, observables).subscribe(function (data) { return tools.push(data); }, function (error) { return observer.error(error); }, function () {
                observer.next(tools);
                observer.complete();
            });
            return function () { return subscription.unsubscribe(); };
        });
        return observable;
    };
    ConnectionUtility.getToolsList = function (connection, solution) {
        var tools = EnvironmentModule.getEntryPointsByType(['tool'])
            .filter(function (tool) { return ConnectionUtility.checkToolRequirements(connection, solution, tool); });
        // TODO, explore if we should cache this list
        return tools;
    };
    ConnectionUtility.checkToolRequirements = function (connection, solution, tool) {
        if (!tool.requirements) {
            // tool is missing requirements, never show.
            return false;
        }
        var solutionId = EnvironmentModule.createFormattedEntrypoint(solution);
        // process each tool requirement.
        for (var i = 0; i < tool.requirements.length; i++) {
            var req = tool.requirements[i];
            if (req.solutionIds
                && req.connectionTypes
                && req.solutionIds.some(function (s) { return s === solutionId; })
                && req.connectionTypes.some(function (c) { return c === connection.type; })) {
                return true;
            }
        }
        return false;
    };
    return ConnectionUtility;
}());
export { ConnectionUtility };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2VjdXJpdHkvY29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBRzVDLE9BQU8sRUFFSCxpQkFBaUIsRUFHcEIsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQXNFcEU7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLElBQU0sdUJBQXVCLEdBQUc7SUFDbkMsTUFBTSxFQUFFLGlDQUFpQztJQUN6QyxPQUFPLEVBQUUsa0NBQWtDO0lBQzNDLHFCQUFxQixFQUFFLGtEQUFrRDtJQUN6RSxhQUFhLEVBQUUseUNBQXlDO0lBQ3hELG9CQUFvQixFQUFFLE9BQU87Q0FDaEMsQ0FBQztBQUVGOztHQUVHO0FBQ0g7SUFBQTtJQThQQSxDQUFDO0lBNVBHOzs7Ozs7T0FNRztJQUNXLDBCQUFRLEdBQXRCLFVBQXVCLENBQWEsRUFBRSxDQUFhO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFF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Q0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksVUFBVSxHQUFHLGlCQUFpQixDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXZFLGlDQUFpQztRQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDaEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVzttQkFDWixHQUFHLENBQUMsZUFBZTttQkFDbkIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssVUFBVSxFQUFoQixDQUFnQixDQUFDO21CQUMzQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxVQUFVLENBQUMsSUFBSSxFQUFyQixDQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQTlQQSxBQThQQyxJQUFBIiwiZmlsZSI6ImNvbm5lY3Rpb24uanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9