var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Net } from '../data/net';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { RpcServiceForwarder } from '../rpc/rpc-forwarder';
import { connectionTypeConstants, ConnectionUtility } from './connection';
export var ConnectionChangeType;
(function (ConnectionChangeType) {
    ConnectionChangeType[ConnectionChangeType["Initialized"] = 0] = "Initialized";
    ConnectionChangeType[ConnectionChangeType["Activated"] = 1] = "Activated";
    ConnectionChangeType[ConnectionChangeType["Added"] = 2] = "Added";
    ConnectionChangeType[ConnectionChangeType["Removed"] = 3] = "Removed";
})(ConnectionChangeType || (ConnectionChangeType = {}));
var ConnectionManager = /** @class */ (function (_super) {
    __extends(ConnectionManager, _super);
    function ConnectionManager(rpc, gatewayConnection) {
        var _this = _super.call(this, 'connection-manager', rpc) || this;
        _this.gatewayConnection = gatewayConnection;
        _this.allConnections = [];
        _this.activeConnectionIndex = -1;
        /**
         * The map of active nodes aliases list, this will be build on demand and clear up whenever any connection aliases changed
         * key: nodeName, this is unique, that means same nodeName with different connection type treat as one entry
         * value: A aliases list for this nodeName (say cluster name),
         *  this may contains child aliases (say IP address) of any alias (say server node).
         */
        _this.connectionAliasesMap = {};
        /**
         * nodeAliasesVisit map, the key is connection nodeName
         */
        _this.nodeAliasesVisitMap = {};
        /**
         * Subject that Fires once and remembers when connections have been initialized
         */
        _this.connectionsInitialized = new ReplaySubject(1);
        /**
         * Event subject that signals that the connection(s) have changed.
         * Filter on changeType to determine what type of change has occurred
         */
        _this.connectionsChanged = new Subject();
        /**
         * Indicates that restoring connections has started and shouldnt call the gateway again
         */
        _this.restoreStarted = false;
        return _this;
    }
    ConnectionManager.prototype.restoreConnections = function () {
        var _this = this;
        if (!this.canForward(0 /* Parent */) && !this.restoreStarted) {
            this.restoreStarted = true;
            this.gatewayConnection.get(ConnectionManager.gatewayConnectionApi)
                .map(function (data) {
                if (data.value) {
                    (Array.isArray(data.value) ? data.value : [data.value])
                        .forEach(function (connection) {
                        // for some reason the node api returns properties in a nested format. Unpack it into the correct format
                        if (connection.properties) {
                            connection = connection.properties;
                        }
                        // ensure bare minimum properties exist, ignore otherwise
                        if (connection && connection.name && connection.type && connection.id) {
                            _this.addOrUpdateConnection(connection, false);
                            return;
                        }
                    });
                }
                return _this.allConnections;
            })
                .catch(function (error) {
                _this.restoreStarted = false;
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ServerListRetrieve.message;
                Logging.log({
                    source: 'ConnectionManager',
                    level: LogLevel.Error,
                    message: message.format(Net.getErrorMessage(error))
                });
                _this.connectionsInitialized.error(error);
                return Observable.of(_this.allConnections);
            })
                .subscribe(function (data) {
                _this.forwardNotify(1 /* Child */, ConnectionManager.connectionsPropertyName, _this.allConnections);
                _this.connectionsChanged.next({
                    type: ConnectionChangeType.Initialized,
                    connections: _this.allConnections
                });
                _this.connectionsInitialized.next(_this.allConnections);
            });
        }
        return this.connectionsInitialized;
    };
    Object.defineProperty(ConnectionManager.prototype, "connections", {
        /**
         * Gets all connections
         */
        get: function () {
            return this.allConnections;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionManager.prototype, "activeConnection", {
        /**
         * Gets active connection.
         */
        get: function () {
            return this.allConnections[this.activeConnectionIndex];
        },
        /**
         * Sets active connection.
         */
        set: function (connection) {
            // only change active connection if it has really changed
            if (!ConnectionUtility.areEqual(this.activeConnection, connection)) {
                if (!connection) {
                    this.activeConnectionIndex = -1;
                }
                else {
                    this.activeConnectionIndex = this.addOrUpdateConnection(connection, false);
                }
                this.connectionsChanged.next({ type: ConnectionChangeType.Activated, connection: connection });
                this.forwardNotify(1 /* Child */, ConnectionManager.activeConnectionPropertyName, this.activeConnection);
                this.forwardNotify(0 /* Parent */, ConnectionManager.activeConnectionPropertyName, this.activeConnection);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add or update connection.
     */
    ConnectionManager.prototype.addOrUpdateConnection = function (connection, save) {
        if (save === void 0) { save = true; }
        ConnectionUtility.forceLowercase(connection);
        var index = this.allConnections.findIndex(function (c) { return ConnectionUtility.areEqual(c, connection); });
        if (index >= 0) {
            this.allConnections[index] = connection;
        }
        else {
            this.allConnections.push(connection);
            this.connectionsChanged.next({ type: ConnectionChangeType.Added, connection: connection });
            index = this.allConnections.length - 1;
            // notify parent and child of collection changed.
            this.forwardNotify(0 /* Parent */, ConnectionManager.connectionsPropertyName, this.allConnections);
            this.forwardNotify(1 /* Child */, ConnectionManager.connectionsPropertyName, this.allConnections);
        }
        if (save) {
            this.saveConnection(connection).subscribe();
        }
        return index;
    };
    /**
     * Remove connection.
     */
    ConnectionManager.prototype.removeConnection = function (connection) {
        var _this = this;
        var forward = this.forwardExecute(0 /* Parent */, ConnectionManager.removeConnectionMethodName, [connection]);
        if (forward) {
            return forward;
        }
        return this.gatewayConnection.delete(ConnectionManager.gatewayConnectionApi + "/" + connection.id)
            .map(function (response) {
            var index = _this.allConnections.findIndex(function (c) { return ConnectionUtility.areEqual(c, connection); });
            if (index >= 0) {
                // if this connection is active, set active connection to null
                if (_this.activeConnectionIndex === index) {
                    _this.activeConnection = null;
                }
                // remove the connection from all connections
                _this.allConnections.splice(index, 1);
            }
            _this.connectionsChanged.next({ type: ConnectionChangeType.Removed, connection: connection });
            // notify our children that connections have changed
            _this.forwardNotify(1 /* Child */, ConnectionManager.connectionsPropertyName, _this.allConnections);
            return response;
        });
    };
    ConnectionManager.prototype.updateConnectionLastCheckedTime = function (connection) {
        var now = Date.now();
        if (connection.properties == null
            || connection.properties.lastUpdatedTime == null
            || MsftSme.round(connection.properties.lastUpdatedTime / 1000) + 2 < MsftSme.round(now / 1000)) {
            // update if there is more than 2 second difference.
            connection.properties = connection.properties || {};
            connection.properties.lastUpdatedTime = now;
            return this.saveConnection(connection);
        }
        return Observable.of(null);
    };
    ConnectionManager.prototype.saveConnection = function (connection) {
        var _this = this;
        ConnectionUtility.forceLowercase(connection);
        var forward = this.forwardExecute(0 /* Parent */, ConnectionManager.saveConnectionMethodName, [connection]);
        if (forward) {
            return forward;
        }
        if (!connection.type || !connection.name) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ServerListFailedSave.message;
            return Observable.throw(message);
        }
        if (!connection.id) {
            connection.id = ConnectionUtility.createConnectionId(connection.type, connection.name);
        }
        return this.gatewayConnection.put(ConnectionManager.gatewayConnectionApi + "/" + connection.id, JSON.stringify(connection))
            .do(function (data) {
            if (data.properties.displayName) {
                connection.properties.displayName = data.properties.displayName;
            }
            _this.forwardNotify(1 /* Child */, ConnectionManager.connectionsPropertyName, _this.allConnections);
        });
    };
    /**
     * Bulk operation for saving multiple connections
     * @param connection
     */
    ConnectionManager.prototype.saveConnections = function (connections) {
        var _this = this;
        connections.forEach(function (connection) {
            ConnectionUtility.forceLowercase(connection);
            if (!connection.type || !connection.name) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ServerListFailedSave.message;
                return Observable.throw(message);
            }
            if (!connection.id) {
                connection.id = ConnectionUtility.createConnectionId(connection.type, connection.name);
            }
        });
        var forward = this.forwardExecute(0 /* Parent */, ConnectionManager.saveConnectionsMethodName, [connections]);
        if (forward) {
            return forward;
        }
        return this.gatewayConnection.put("" + ConnectionManager.gatewayConnectionApi, JSON.stringify(connections))
            .do(function (data) {
            _this.forwardNotify(1 /* Child */, ConnectionManager.connectionsPropertyName, _this.allConnections);
        });
    };
    /**
     * Finds a connection given a name and type
     * @param name the name of the connection to find
     * @param type the type of the connection to find, defaults to server type
     */
    ConnectionManager.prototype.findConnection = function (name, type) {
        var _this = this;
        if (!name) {
            return Observable.of(null);
        }
        type = type || connectionTypeConstants.server;
        if (this.activeConnection && this.activeConnection.name === name && this.activeConnection.type === type) {
            return Observable.of(this.activeConnection);
        }
        return this.connectionsInitialized.map(function (connections) {
            return _this.connections.find(function (c) { return c.name === name && c.type === type; });
        });
    };
    /**
     * Called on a child service instance when onForwardInit returns from the parent
     * @param data The response from the forwardInit call
     */
    ConnectionManager.prototype.onForwardInitResponse = function (data) {
        if (data.error) {
            // if there is an error, we cannot continue, so throw its
            throw data.error;
        }
        this.allConnections = data.result.connections;
        this.activeConnection = data.result.activeConnection;
        this.connectionsChanged.next({
            type: ConnectionChangeType.Initialized,
            connections: this.allConnections
        });
        this.connectionsInitialized.next(this.allConnections);
    };
    /**
     * Called when a new instance of the service in another window is initialized and needs to synchronize with its parent
     * @param from The RpcRelationshipType that this request is from
     * @returns an observable for the all the values needed to initialize the service
     */
    ConnectionManager.prototype.onForwardInit = function () {
        return Observable.of({
            connections: this.connections,
            activeConnection: this.activeConnection
        });
    };
    /**
     * Called when the forwarded services counterpart wants to get data from the parent
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the method to forward to
     * @param args The arguments of the method
     * @returns an observable for the result of the method call
     */
    ConnectionManager.prototype.onForwardExecute = function (from, name, args) {
        if (from === 1 /* Child */) {
            if (name === ConnectionManager.saveConnectionMethodName) {
                // we dont actually have anything to return here.
                return this.saveConnection.apply(this, args).map(function () { return null; });
            }
            if (name === ConnectionManager.saveConnectionsMethodName) {
                return this.saveConnections.apply(this, args);
            }
            if (name === ConnectionManager.removeConnectionMethodName) {
                // we dont actually have anything to return here.
                return this.removeConnection.apply(this, args).map(function () { return null; });
            }
        }
        // ConnectionManager does not allow any method calls at this time
        return this.nameNotFound(name);
    };
    /**
     * Called when the forwarded services counterpart sends a notify message
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the property to change
     * @param value The new value of the property
     * @returns an observable that completes when the property has been changed.
     */
    ConnectionManager.prototype.onForwardNotify = function (from, name, value) {
        if (name === ConnectionManager.connectionsPropertyName) {
            this.allConnections = value;
            this.connectionsChanged.next({
                type: ConnectionChangeType.Initialized,
                connections: this.allConnections
            });
            this.connectionsInitialized.next(this.allConnections);
            return Observable.of(null);
        }
        if (name === ConnectionManager.activeConnectionPropertyName) {
            this.activeConnection = value;
            return Observable.of(null);
        }
        return this.nameNotFound(name);
    };
    /**
     * Get aliases data and save the change with connection
     * @param aliases
     * @param connection
     * @param nodeName
     */
    ConnectionManager.prototype.saveAliasesData = function (aliases, connection, nodeName) {
        var save = false;
        // save the connection if aliase info changed
        if (!this.isArraySame(aliases, connection.aliases)) {
            connection.aliases = aliases;
            // remove the activeAlias if it's not in aliases any more
            if (connection.aliases.indexOf(connection.activeAlias) === -1) {
                connection.activeAlias = null;
            }
            save = true;
        }
        // if current nodeName is not connection name save it as activeAlias
        if (connection.name !== nodeName && connection.activeAlias !== nodeName) {
            connection.activeAlias = nodeName;
            save = true;
        }
        else {
            // current nodeName is connection name, remove connection activeAlias
            if (connection.name === nodeName && !!connection.activeAlias) {
                connection.activeAlias = null;
                save = true;
            }
        }
        if (save) {
            this.saveConnection(connection);
        }
        // delete visit map entry when succeed
        this.deleteAliasesVisitList(connection.name);
    };
    /**
     * Get active alias from nodeAliasesVisit map with given nodeName
     *  return the node in aliases list in order,
     *  return null if no alias or end of list
     * @param nodeName key in nodeAliasesVisitMap
     */
    ConnectionManager.prototype.getActiveAlias = function (nodeName) {
        // aliases visit list already exists
        if (nodeName in this.nodeAliasesVisitMap) {
            var vlist = this.nodeAliasesVisitMap[nodeName];
            // move currentIndex to next
            if (++vlist.currentIndex < vlist.aliases.length) {
                return vlist.aliases[vlist.currentIndex];
            }
            else {
                // end of the list
                this.deleteAliasesVisitList(nodeName);
                return null;
            }
        }
        else {
            var aliases = this.getNodeAliasesList(nodeName);
            if (aliases) {
                var vlist = {
                    currentIndex: 0,
                    aliases: aliases
                };
                this.nodeAliasesVisitMap[nodeName] = vlist;
                // return first item, aliases[vlist.currentIndex]
                return aliases[0];
            }
            else {
                // no aliases, return null
                return null;
            }
        }
    };
    /**
     * Delete aliasesVistList entry with given nodeName from nodeAliasesVisitMap
     * @param nodeName
     */
    ConnectionManager.prototype.deleteAliasesVisitList = function (nodeName) {
        if (nodeName in this.nodeAliasesVisitMap) {
            delete this.nodeAliasesVisitMap[nodeName];
        }
    };
    ConnectionManager.prototype.isArraySame = function (array1, array2) {
        // both are not null, compare every element
        if (array1 && array2) {
            return (array1.length === array2.length) && array1.every(function (element, index) {
                return element === array2[index];
            });
        }
        else {
            // both are null
            if (!array1 && !array2) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    /**
     * Get nodeAliasesList from map; if not exists create it
     * @param nodeName name of the node, this is unique regardless connection type
     */
    ConnectionManager.prototype.getNodeAliasesList = function (nodeName) {
        if (nodeName in this.connectionAliasesMap) {
            return this.connectionAliasesMap[nodeName];
        }
        else {
            return this.buildNodeAliasesList(nodeName);
        }
    };
    /**
     * Build nodeAliasesList entry with given nodeName, then add it into the map,
     *  return the list of aliases
     * @param nodeName name of the node
     */
    ConnectionManager.prototype.buildNodeAliasesList = function (nodeName) {
        var connection = this.findConnectionWithAliases(nodeName);
        if (!connection) {
            return null;
        }
        // assume activeAlias is in aliases[]
        var aliases = [];
        if (connection.activeAlias) {
            // put activeAlias at the first of the list
            aliases.push(connection.activeAlias);
            aliases = aliases.concat(connection.aliases.filter(function (item) { return item !== connection.activeAlias; }));
        }
        else {
            aliases = connection.aliases;
        }
        for (var i = 0; i < aliases.length; i++) {
            var childList = this.buildNodeAliasesList(aliases[i]);
            // insert the childList to list, the list.length will increase
            if (childList) {
                // remove remaining items after current item
                var remainList = aliases.splice(i + 1, aliases.length - i);
                aliases = aliases.concat(childList, remainList);
                // next iteration move to node in childList
            }
        }
        this.connectionAliasesMap[nodeName] = aliases;
        return aliases;
    };
    /**
     * Finds the first connection with aliases info given a name, assume the connections already initialized
     * @param name the name of the connection to find
     */
    ConnectionManager.prototype.findConnectionWithAliases = function (name) {
        if (!name) {
            return null;
        }
        if (this.activeConnection && this.activeConnection.name === name && !!this.activeConnection.aliases) {
            return this.activeConnection;
        }
        return this.connections.find(function (c) { return c.name === name && !!(c.aliases); });
    };
    ConnectionManager.activeConnectionPropertyName = 'activeConnection';
    ConnectionManager.connectionsPropertyName = 'connections';
    ConnectionManager.saveConnectionMethodName = 'saveConnection';
    ConnectionManager.saveConnectionsMethodName = 'saveConnections';
    ConnectionManager.removeConnectionMethodName = 'removeConnection';
    ConnectionManager.gatewayConnectionApi = 'connections';
    return ConnectionManager;
}(RpcServiceForwarder));
export { ConnectionManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2VjdXJpdHkvY29ubmVjdGlvbi1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHMUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBSWpELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzNELE9BQU8sRUFBYyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQU90RixNQUFNLENBQU4sSUFBWSxvQkFLWDtBQUxELFdBQVksb0JBQW9CO0lBQzVCLDZFQUFlLENBQUE7SUFDZix5RUFBYSxDQUFBO0lBQ2IsaUVBQVMsQ0FBQTtJQUNULHFFQUFXLENBQUE7QUFDZixDQUFDLEVBTFcsb0JBQW9CLEtBQXBCLG9CQUFvQixRQUsvQjtBQTZCRDtJQUF1QyxxQ0FBbUI7SUF5Q3RELDJCQUFZLEdBQVEsRUFBVSxpQkFBb0M7UUFBbEUsWUFDSSxrQkFBTSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsU0FDbkM7UUFGNkIsdUJBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQWhDMUQsb0JBQWMsR0FBaUIsRUFBRSxDQUFDO1FBQ2xDLDJCQUFxQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRW5DOzs7OztXQUtHO1FBQ0ssMEJBQW9CLEdBQWdDLEVBQUUsQ0FBQztRQUUvRDs7V0FFRztRQUNLLHlCQUFtQixHQUF3QyxFQUFFLENBQUM7UUFFdEU7O1dBRUc7UUFDSSw0QkFBc0IsR0FBRyxJQUFJLGFBQWEsQ0FBZSxDQUFDLENBQUMsQ0FBQztRQUVuRTs7O1dBR0c7UUFDSSx3QkFBa0IsR0FBRyxJQUFJLE9B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RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHFEQUF5QixHQUFqQyxVQUFrQyxJQUFZO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDbEcsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUNqQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQTdmYyw4Q0FBNEIsR0FBRyxrQkFBa0IsQ0FBQztJQUNsRCx5Q0FBdUIsR0FBRyxhQUFhLENBQUM7SUFDeEMsMENBQXdCLEdBQUcsZ0JBQWdCLENBQUM7SUFDNUMsMkNBQXlCLEdBQUcsaUJBQWlCLENBQUM7SUFDOUMsNENBQTBCLEdBQUcsa0JBQWtCLENBQUM7SUFFaEQsc0NBQW9CLEdBQUcsYUFBYSxDQUFDO0lBd2Z4RCx3QkFBQztDQS9mRCxBQStmQyxDQS9mc0MsbUJBQW1CLEdBK2Z6RDtTQS9mWSxpQkFBaUIiLCJmaWxlIjoiY29ubmVjdGlvbi1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==