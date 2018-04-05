import { Observable, Subject } from 'rxjs';
import { HttpStatusCode } from '../data/http-constants';
import { Net } from '../data/net';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { EnvironmentModule } from '../manifest/environment-modules';
import { ConnectionUtility } from './connection';
import { ConnectionChangeType } from './connection-manager';
/**
 * The live connection status type.
 */
export var LiveConnectionStatusType;
(function (LiveConnectionStatusType) {
    /**
     * Online status.
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Online"] = 0] = "Online";
    /**
     * Warning status.
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Warning"] = 1] = "Warning";
    /**
     * Unauthorized status.
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Unauthorized"] = 2] = "Unauthorized";
    /**
     * Error status.
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Error"] = 3] = "Error";
    /**
     * Fatal status.
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Fatal"] = 4] = "Fatal";
    /**
     * Unknown status (used for loading status).
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Unknown"] = 5] = "Unknown";
    /**
     * Forbidden status.
     */
    LiveConnectionStatusType[LiveConnectionStatusType["Forbidden"] = 6] = "Forbidden";
})(LiveConnectionStatusType || (LiveConnectionStatusType = {}));
/**
 * The live connection change type.
 */
export var LiveConnectionChangeType;
(function (LiveConnectionChangeType) {
    /**
     * Add change.
     */
    LiveConnectionChangeType[LiveConnectionChangeType["Add"] = 0] = "Add";
    /**
     * Remove change.
     */
    LiveConnectionChangeType[LiveConnectionChangeType["Remove"] = 1] = "Remove";
    /**
     * Update change.
     */
    LiveConnectionChangeType[LiveConnectionChangeType["Update"] = 2] = "Update";
    /**
     * Error change (reserved)
     */
    LiveConnectionChangeType[LiveConnectionChangeType["Error"] = 3] = "Error";
})(LiveConnectionChangeType || (LiveConnectionChangeType = {}));
/**
 * ConnectionStream class that enables to get all connections once and listen to the change.
 *
 * TODO:
 * 1. Support live connection status for a single connection in such a way that one could subscribe to it from ActiveConnection
 *    with that observable always being for the active connection.
 * 2. Support updating all connection status on an interval. (using existing expiration field in cache)
 * 3. Support preserving status across sessions during the interval time.
 *    currently we are using session storage, this may also require credentials to be preserved across sessions.
 */
var ConnectionStream = /** @class */ (function () {
    /**
     * Initializes a new instance of the ConnectionStream class.
     * @param connectionManager the connection manager object.
     * @param powershellConnection the powerShell connection object.
     * @param gatewayConnection the gateway connection object.
     */
    function ConnectionStream(rpc, connectionManager, powershellConnection, gatewayConnection) {
        var _this = this;
        this.rpc = rpc;
        this.connectionManager = connectionManager;
        this.powershellConnection = powershellConnection;
        this.gatewayConnection = gatewayConnection;
        this.refreshAllSubject = new Subject();
        this.refreshOneSubject = new Subject();
        this.statusLabelMap = {};
        this.connectionStrings = MsftSme.resourcesStrings().MsftSmeShell.Core.Connection;
        this.statusLabelMap[LiveConnectionStatusType.Error] = this.connectionStrings.ErrorState.label;
        this.statusLabelMap[LiveConnectionStatusType.Fatal] = this.connectionStrings.FatalState.label;
        this.statusLabelMap[LiveConnectionStatusType.Online] = this.connectionStrings.OnlineState.label;
        this.statusLabelMap[LiveConnectionStatusType.Unauthorized] = this.connectionStrings.NeedsAuthorizationState.label;
        this.statusLabelMap[LiveConnectionStatusType.Unknown] = this.connectionStrings.UnknownState.label;
        this.statusLabelMap[LiveConnectionStatusType.Warning] = this.connectionStrings.WarningState.label;
        // TODO: when persistent local storage is used, we may not need to clear the cache anymore. 
        // we clear it now because page refresh is technically in the same session, but may persist         
        // inaccurate status as credentials for connections are not persisted.
        var global = window;
        if (global.MsftSme.Init.moduleName === EnvironmentModule.nameOfShell) {
            Observable.fromEvent(window, 'beforeunload').subscribe(function (e) {
                // in the future we want to make sure the catch is always saved when the window exits. As well as after refresh intervals.
                // we should check performance on saving the cache on every change to the stream.
                // don't clear other than shell.
                _this.clearCache();
            });
        }
    }
    /**
     * Clears the connections stream cache
     */
    ConnectionStream.clearCache = function () {
        sessionStorage.removeItem(ConnectionStream.cacheKey);
    };
    Object.defineProperty(ConnectionStream.prototype, "liveConnectionCollection", {
        /**
         * Gets current live connection collection.
         * - Subscribe liveConnectionChanged observable afterward.
         *
         * @return LiveConnection[] current live connections data.
         */
        get: function () {
            var _this = this;
            return this.connectionManager.connectionsInitialized.map(function () {
                // restore stream cache.
                var changed = _this.restoreCache();
                // refresh data if it has no expiration or expired.
                if (changed || !_this.cache.timestamp || (Date.now() - _this.cache.timestamp) > ConnectionStream.cacheDurationInMilliseconds) {
                    _this.clearCache();
                    _this.refresh();
                }
                else {
                    Object.keys(_this.cache.connections).map(function (key) { return _this.cache.connections[key]; }).forEach(function (live) {
                        if (!live.status || live.status.type === LiveConnectionStatusType.Unknown) {
                            _this.refresh(live.connection);
                        }
                    });
                }
                return Object.keys(_this.cache.connections).map(function (key) { return _this.cache.connections[key]; });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionStream.prototype, "liveConnectionChanged", {
        /**
         * Gets the observable of live connection change.
         *
         * @return Observable<LiveConnectionChange> change of live connection data.
         */
        get: function () {
            return this.createChangeObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Wraps a connection in a live connection object by retrieving its current status
     * @param connection
     */
    ConnectionStream.prototype.getLiveConnection = function (connection) {
        var _this = this;
        // get the connection types status provider
        var typeInfo = ConnectionUtility.getConnectionTypeInfo(connection);
        if (typeInfo && typeInfo.provider && typeInfo.provider.connectionStatusProvider) {
            var now = Date.now();
            var statusProvider = typeInfo.provider.connectionStatusProvider;
            if (this.cacheLiveConnection
                && this.cacheLiveConnection.status.type === LiveConnectionStatusType.Online
                && this.cacheLiveConnection.connection
                && this.cacheLiveConnection.connection.name === connection.name
                && this.cacheLiveConnection.connection.type === connection.type
                && now - this.cacheLiveConnection.lastUpdated < 2000) {
                return Observable.of(this.cacheLiveConnection);
            }
            else {
                return this.getConnectionStatus(statusProvider, connection, connection.name).map(function (data) {
                    _this.cacheLiveConnection = data;
                    return data;
                });
            }
        }
        // this should not happen, it means we have a malformed manifest.
        var logMessage = this.connectionStrings.NoStatusProvider.message.format(connection.type);
        // log warning about this condition
        Logging.log({
            source: 'ConnectionStream',
            level: LogLevel.Warning,
            message: logMessage
        });
        // we dont need to fail, we can set this items status to unknown and continue
        var statusLabel = this.connectionStrings.NoStatusProvider.label;
        return Observable.of({
            connection: connection,
            loading: false,
            status: {
                label: statusLabel,
                type: LiveConnectionStatusType.Unknown,
                details: logMessage
            }
        });
    };
    /**
     * Get connection status and aliases from statusProvider, retry alaises when connection nodeName NotFound
     * @param statusProvider status provider from typeInfo manifest
     * @param connection original connection
     * @param nodeName retry nodeName, can be connection.name or alias
     */
    ConnectionStream.prototype.getConnectionStatus = function (statusProvider, connection, nodeName) {
        var _this = this;
        var statusAwaiter;
        // collect the status data from the status provider
        if (statusProvider.powerShell) {
            statusAwaiter = this.getConnectionStatusFromPowershell(nodeName, statusProvider.powerShell);
        }
        else if (statusProvider.relativeGatewayUrl) {
            statusAwaiter = this.getConnectionStatusFromGatewayUrl(nodeName, statusProvider.relativeGatewayUrl);
        }
        return statusAwaiter
            .map(function (statusData) {
            // create connection object to return
            var liveConnection = {
                connection: connection,
                loading: false,
                lastUpdated: Date.now()
            };
            // extract the status field from the data
            if (statusData['status']) {
                liveConnection.status = statusData['status'];
                delete statusData['status'];
            }
            else {
                // if there is no status field, assume everything is good since we got this far.
                liveConnection.status = {
                    type: LiveConnectionStatusType.Online
                };
            }
            // load localized values for label and details
            if (statusProvider.displayValueMap) {
                var label = statusProvider.displayValueMap[liveConnection.status.label];
                var details = statusProvider.displayValueMap[liveConnection.status.details];
                liveConnection.status.label = label || liveConnection.status.label;
                liveConnection.status.details = details || liveConnection.status.details;
            }
            // extract the aliases field from the data
            if (statusData['aliases']) {
                var save = false;
                var aliases = statusData['aliases'];
                delete statusData['aliases'];
                _this.connectionManager.saveAliasesData(aliases, connection, nodeName);
            }
            // any other properties returned by status call live in property bag.
            liveConnection.properties = statusData;
            // fill properties of connection with status data.
            connection.properties = connection.properties || {};
            Object.assign(connection.properties, statusData);
            // return the new live connection
            return liveConnection;
        })
            .catch(function (error) {
            var liveConnection = {
                connection: connection,
                loading: false,
                lastUpdated: Date.now()
            };
            if (error.status === HttpStatusCode.Unauthorized) {
                liveConnection.status = {
                    type: LiveConnectionStatusType.Unauthorized
                };
            }
            else if (error.status === HttpStatusCode.Forbidden) {
                liveConnection.status = {
                    type: LiveConnectionStatusType.Forbidden
                };
            }
            else if (error.status === HttpStatusCode.NotFound || error.status === HttpStatusCode.BadRequest) {
                // failed connect to target node
                var alias = _this.connectionManager.getActiveAlias(connection.name);
                // found alias, retry
                if (alias) {
                    return _this.getConnectionStatus(statusProvider, connection, alias);
                }
                else {
                    var label = _this.connectionStrings.NoConnection.label;
                    var message = _this.connectionStrings.NoConnection.message;
                    liveConnection.status = {
                        label: label,
                        type: LiveConnectionStatusType.Unknown,
                        details: message
                    };
                }
            }
            else {
                liveConnection.status = {
                    type: LiveConnectionStatusType.Fatal,
                    details: Net.getErrorMessage(error)
                };
            }
            return Observable.of(liveConnection);
        })
            .do(function (liveConnection) {
            if (!liveConnection.status.label) {
                liveConnection.status.label = _this.statusLabelMap[liveConnection.status.type]
                    || _this.statusLabelMap[LiveConnectionStatusType.Unknown];
            }
        });
    };
    /**
     * Refreshes the connection stream. If a connection is provided, only that connections live information will be refreshed.
     *
     * @param connection the connection object (optional)
     */
    ConnectionStream.prototype.refresh = function (connection) {
        if (connection) {
            this.refreshOneSubject.next(connection);
        }
        else {
            this.refreshAllSubject.next();
        }
    };
    /**
     * Create change observable.
     */
    ConnectionStream.prototype.createChangeObservable = function () {
        var _this = this;
        // when connections are incoming, add them to the cache
        return this.getIncomingChange().map(function (change) {
            change.liveConnection.lastUpdated = Date.now();
            _this.cache.connections[change.liveConnection.connection.id] = change.liveConnection;
            _this.saveCache();
            return change;
        })
            .catch(function (error, caught) {
            // catch any errors and log them, but continue with  whatever was in the cache previously
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ConnectionStream.message;
            Logging.log({
                source: 'ConnectionStream',
                level: LogLevel.Error,
                message: message.format(Net.getErrorMessage(error))
            });
            return Observable.of({ liveConnection: null, type: LiveConnectionChangeType.Error });
        });
    };
    /**
     * Returns an observable that emits an live connection object
     * for every additive connection event such as initialized, added, and updated
     */
    ConnectionStream.prototype.getIncomingChange = function () {
        var _this = this;
        return Observable.merge(
        // refresh all case.
        this.refreshAllSubject.switchMap(function () { return Observable.from(_this.connectionManager.connections); })
            .map(function (connection) { return _this.createChange(connection, LiveConnectionChangeType.Update); }), 
        // refresh one case.
        this.refreshOneSubject
            .map(function (connection) { return _this.createChange(connection, LiveConnectionChangeType.Update); }), 
        // connection change case.
        this.connectionManager.connectionsChanged
            .filter(function (event) { return event.type === ConnectionChangeType.Added || event.type === ConnectionChangeType.Removed; })
            .map(function (event) { return _this.createChange(event.connection, event.type === ConnectionChangeType.Added ? LiveConnectionChangeType.Add : LiveConnectionChangeType.Remove); }))
            .flatMap(function (change) {
            // prepare an initial value to emit right away that shows this connection as loading
            if (change.type === LiveConnectionChangeType.Remove) {
                var liveConnection = _this.cache.connections[change.liveConnection.connection.id];
                if (liveConnection) {
                    delete _this.cache.connections[change.liveConnection.connection.id];
                }
                // sending remove change.
                return Observable.of(change);
            }
            var changeUpdate = _this.getLiveConnection(change.liveConnection.connection)
                .map(function (update) {
                var updateChange = {
                    type: LiveConnectionChangeType.Update,
                    liveConnection: update
                };
                updateChange.liveConnection.loading = false;
                return updateChange;
            });
            // sending update with loading state, and later send updated status.
            return Observable.merge(Observable.of(change), changeUpdate);
        });
    };
    ConnectionStream.prototype.createChange = function (connection, type) {
        return {
            liveConnection: {
                connection: connection,
                loading: true
            },
            type: type
        };
    };
    /**
     * Retrieves a connections status from a powershell status provider
     * @param nodeName
     * @param options The powershell options
     */
    ConnectionStream.prototype.getConnectionStatusFromPowershell = function (nodeName, options) {
        if (!nodeName) {
            // log warning about this condition
            var message = this.connectionStrings.ErrorNodeName.message;
            Logging.log({
                source: 'ConnectionStream',
                level: LogLevel.Error,
                message: message.format(nodeName)
            });
            return Observable.throw(new Error(message));
        }
        var psSession = this.powershellConnection.createSession(nodeName, null, { noAuth: true });
        return this.powershellConnection
            .run(psSession, options.command ? options : options.script)
            .map(function (response) {
            // we expect the script to return an object as the first result. 
            // The object should have some property called 'status' but we will check this later.
            return response.results[0];
        });
    };
    /**
     * Retrieves a connections status from a gatewayUrl status provider
     * @param nodeName
     * @param relativeUrl the relative url from the relativeGatewayUrl provider
     */
    ConnectionStream.prototype.getConnectionStatusFromGatewayUrl = function (nodeName, relativeUrl) {
        if (!relativeUrl) {
            // log warning about this condition
            var message = this.connectionStrings.ErrorGatewayUrl.message;
            Logging.log({
                source: 'ConnectionStream',
                level: LogLevel.Error,
                message: message
            });
            return Observable.throw(new Error(message));
        }
        relativeUrl = relativeUrl.replace('$connectionName', nodeName);
        return this.gatewayConnection.get(relativeUrl);
    };
    /**
     * Saves the connections stream catch
     */
    ConnectionStream.prototype.saveCache = function () {
        this.cache.timestamp = Date.now();
        var savedCache = JSON.stringify(this.cache);
        sessionStorage.setItem(ConnectionStream.cacheKey, savedCache);
    };
    /**
     * Restores the connections stream catch
     *
     * @return boolean indicate there is difference in cache.
     */
    ConnectionStream.prototype.restoreCache = function () {
        var savedCache = sessionStorage.getItem(ConnectionStream.cacheKey);
        this.cache = savedCache ? JSON.parse(savedCache) : { connections: {} };
        var keys = Object.keys(this.cache.connections);
        if (keys.length !== this.connectionManager.connections.length) {
            // length doesn't match.
            return true;
        }
        var _loop_1 = function (key) {
            if (!this_1.connectionManager.connections.find(function (x) { return x.id === key; })) {
                return { value: false };
            }
        };
        var this_1 = this;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    /**
     * Clears the connections stream catch
     */
    ConnectionStream.prototype.clearCache = function () {
        this.cache = { connections: {}, timestamp: null };
        ConnectionStream.clearCache();
    };
    /**
     * The Cache key for the connection stream class
     */
    ConnectionStream.cacheKey = '@msft-sme/shell:connection-stream.cache';
    /**
     * The duration in milliseconds for the connection stream cache. Current is 10 minutes.
     */
    ConnectionStream.cacheDurationInMilliseconds = 10 * 60 * 1000;
    return ConnectionStream;
}());
export { ConnectionStream };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2VjdXJpdHkvY29ubmVjdGlvbi1zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUE4QixVQUFVLEVBQWlCLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUd0RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUdsQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pELE9BQU8sRUFDSCxpQkFBaUIsRUFHcEIsTUFBTSxpQ0FBaUMsQ0FBQztBQUt6QyxPQUFPLEVBQXVDLGlCQUFpQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RGLE9BQU8sRUFBMEIsb0JBQW9CLEVBQXFCLE1BQU0sc0JBQXNCLENBQUM7QUFvRHZHOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksd0JBbUNYO0FBbkNELFdBQVksd0JBQXdCO0lBQ2hDOztPQUVHO0lBQ0gsMkVBQVUsQ0FBQTtJQUVWOztPQUVHO0lBQ0gsNkVBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsdUZBQWdCLENBQUE7SUFFaEI7O09BRUc7SUFDSCx5RUFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCx5RUFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCw2RUFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxpRkFBYSxDQUFBO0FBQ2pCLENBQUMsRUFuQ1csd0JBQXdCLEtBQXhCLHdCQUF3QixRQW1DbkM7QUFFRDs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLHdCQW9CWDtBQXBCRCxXQUFZLHdCQUF3QjtJQUNoQzs7T0FFRztJQUNILHFFQUFHLENBQUE7SUFFSDs7T0FFRztJQUNILDJFQUFNLENBQUE7SUFFTjs7T0FFRztJQUNILDJFQUFNLENBQUE7SUFFTjs7T0FFRztJQUNILHlFQUFLLENB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QWMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssdUNBQVksR0FBcEI7UUFDSSxJQUFJLFVBQVUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUN2RSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUQsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztnQ0FFUSxHQUFHO1lBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFLLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBWixDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBRXZELEtBQUs7WUFDaEIsQ0FBQztRQUNMLENBQUM7O1FBTEQsR0FBRyxDQUFDLENBQVksVUFBSSxFQUFKLGFBQUksRUFBSixrQkFBSSxFQUFKLElBQUk7WUFBZixJQUFJLEdBQUcsYUFBQTtrQ0FBSCxHQUFHOzs7U0FLWDtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNLLHFDQUFVLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2xELGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUE5YUQ7O09BRUc7SUFDWSx5QkFBUSxHQUFHLHlDQUF5QyxDQUFDO0lBRXBFOztPQUVHO0lBQ1ksNENBQTJCLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7SUF1YWhFLHVCQUFDO0NBaGJELEFBZ2JDLElBQUE7U0FoYlksZ0JBQWdCIiwiZmlsZSI6ImNvbm5lY3Rpb24tc3RyZWFtLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==