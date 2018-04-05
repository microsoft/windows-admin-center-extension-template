var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { NodeCimOutput } from './node-connection';
import { PowerShell } from './powershell';
import { PowerShellBatch } from './powershell-batch';
/**
 * The PowerShell Alternate processing class.
 */
var PowerShellAlternate = /** @class */ (function () {
    function PowerShellAlternate() {
    }
    /**
     * Create alternate PowerShell query for CIM query.
     *
     * @param nodeConnection The node connection object.
     * @param nodeName The node name.
     * @param options The node request options.
     * @return Observable<T> if there is no alternate available, return null.
     */
    PowerShellAlternate.create = function (nodeConnection, nodeName, options) {
        if (options == null || options.powerShell == null || options.powerShellContext == null) {
            return null;
        }
        var endpoint = nodeConnection.getJeaEndpoint(nodeName);
        if (endpoint == null && options.powerShellEndpoint == null && !MsftSme.self().Init.powerShellEndpoint) {
            return null;
        }
        var powerShell = PowerShellAlternate.findOrCreateNullPowerShell(nodeName, nodeConnection, options);
        var command = PowerShell.createCommand(options.powerShell, options.powerShellContext.parameters);
        return powerShell.run(command)
            .map(function (results) { return PowerShellAlternate.mapPowerShellToCim(options.powerShellContext.cimOutput, results); });
    };
    /**
     * Create alternate PowerShell Stream query for CIM query.
     *
     * @param nodeConnection The node connection object.
     * @param nodeName The node name.
     * @param options The node request options.
     * @return Observable<T> if there is no alternate available, return null.
     */
    PowerShellAlternate.createStream = function (powerShellStream, nodeName, options) {
        if (options == null || options.powerShell == null || options.powerShellContext == null) {
            return null;
        }
        var endpoint = powerShellStream.getJeaEndpoint(nodeName);
        if (endpoint == null && options.powerShellEndpoint == null && !MsftSme.self().Init.powerShellEndpoint) {
            return null;
        }
        if (!options.powerShellEndpoint) {
            options.powerShellEndpoint = endpoint;
        }
        var command = PowerShell.createCommand(options.powerShell, options.powerShellContext.parameters);
        return powerShellStream.run(nodeName, command, options)
            .map(function (results) { return PowerShellAlternate.mapPowerShellToCim(options.powerShellContext.cimOutput, results); });
    };
    /**
     * @deprecated
     * (not supported)
     * Create alternate PowerShell Batch query for CIM batch query.
     *
     * @param nodeConnection the node connection object
     * @param batchConnection The batch connection object.
     * @param nodeNames The list of node names.
     * @param options The node request options.
     * @return Observable<BatchResponseItem[]> if there is no alternate available, return null.
     */
    PowerShellAlternate.createBatch = function (nodeConnection, batchConnection, nodeNames, options) {
        if (options == null || options.powerShell == null || options.powerShellContext == null) {
            return null;
        }
        // TODO: for now we assume all endpoints match. Need to work on a more general solution.
        var node = nodeNames && nodeNames.length > 0 && nodeNames[0];
        var endpoint = nodeConnection.getJeaEndpoint(node);
        if (endpoint == null && options.powerShellEndpoint == null && !MsftSme.self().Init.powerShellEndpoint) {
            return null;
        }
        if (!options.powerShellEndpoint) {
            options.powerShellEndpoint = endpoint;
        }
        var batchSession = new PowerShellBatch(nodeNames, batchConnection, null, null, options);
        var command = PowerShell.createCommand(options.powerShell, options.powerShellContext.parameters);
        return batchSession.runSingleCommand(command, options)
            .map(function (items) { return items.map(function (item) {
            return ({
                sequenceNumber: item.sequenceNumber,
                nodeName: item.nodeName,
                response: {
                    response: PowerShellAlternate.mapPowerShellToCim(options.powerShellContext.cimOutput, item.properties),
                    status: item.status
                }
            });
        }); });
    };
    /**
     * Reserve a session for all alternate CIM non-batch query.
     *
     * @param nodeName the node name.
     * @param nodeConnection the node connection object.
     * @param options the node request options.
     */
    PowerShellAlternate.reserveSession = function (appContext, nodeName, options) {
        return appContext.powerShell.createSession(nodeName, PowerShellAlternate.cimAlternateKey, options);
    };
    /**
     * Dispose the session for alternate CIM non-batch query.
     *
     * @param session the session object.
     */
    PowerShellAlternate.disposeSession = function (session) {
        session.dispose();
    };
    /**
     * Find existing powershell session with the fixed key or create null session.
     *
     * @param nodeName the node name.
     * @param nodeConnection the node connection object.
     * @param options the node request options.
     */
    PowerShellAlternate.findOrCreateNullPowerShell = function (nodeName, nodeConnection, options) {
        var powerShell = PowerShell.find(nodeName, PowerShellAlternate.cimAlternateKey);
        if (powerShell == null) {
            powerShell = PowerShell.create(nodeName, nodeConnection, null, null, options);
        }
        return powerShell;
    };
    /**
     * Convert the PowerShell results to Cim expected format.
     *
     * @param outputType The output data type.
     * @param data
     */
    PowerShellAlternate.mapPowerShellToCim = function (outputType, data) {
        switch (outputType) {
            case NodeCimOutput.Single:
                // single instance result.
                return {
                    properties: data.results && data.results[0] && PowerShellAlternate.cleanCimInstance(data.results[0])
                };
            case NodeCimOutput.Multiple:
                // multiple instances result.
                return {
                    value: data.results.map(function (instance) {
                        return {
                            properties: PowerShellAlternate.cleanCimInstance(instance)
                        };
                    })
                };
            case NodeCimOutput.Result:
                return PowerShellAlternate.adjustCimResults(data);
            case NodeCimOutput.Query:
                // query results without properties.
                return {
                    value: data.results.map(function (instance) {
                        return PowerShellAlternate.cleanCimInstance(instance);
                    })
                };
        }
    };
    /**
     * Adjust PowerShell CIM results data.
     *
     * @param data The result data.
     */
    PowerShellAlternate.adjustCimResults = function (data) {
        var response = {};
        // invoke method results with free structured but index 0.
        if (!data.results) {
            return response;
        }
        if (data.results.length === 0) {
            return response;
        }
        //
        // Packed the same parameterName object into single array.
        //
        // parameterName
        // itemType: 16: Instance
        // itemValue: Instance Data
        // psComputerName
        //
        var results = [];
        for (var _i = 0, _a = data.results; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item['psComputerName'] !== undefined) {
                delete item['psComputerName'];
            }
            if (item.hasOwnProperty('returnValue')) {
                response = __assign({}, response, item);
            }
            if (item.hasOwnProperty('outParameters')) {
                for (var _b = 0, _c = item.outParameters; _b < _c.length; _b++) {
                    var parameter = _c[_b];
                    response[parameter.name] = parameter.value;
                }
            }
            // aggregate the same parameter name object into single array.
            if (item.hasOwnProperty('itemValue')) {
                if (item.itemValue.length > 0) {
                    var array = item.itemValue;
                    array.forEach(function (value) { return results.push(PowerShellAlternate.cleanCimInstance(value)); });
                }
                else {
                    results.push(PowerShellAlternate.cleanCimInstance(item.itemValue));
                }
            }
        }
        if (results.length > 0) {
            response.results = results;
        }
        return response;
    };
    /**
     * Clean the cim instance object to remove schema/qualifier data.
     *
     * @param data The instance object from PowerShell.
     */
    PowerShellAlternate.cleanCimInstance = function (data) {
        if (!data) {
            return data;
        }
        if (data['psComputerName'] !== undefined) {
            delete data['psComputerName'];
        }
        if (data['cimClass']) {
            delete data['cimClass'];
        }
        if (data['cimInstanceProperties']) {
            delete data['cimInstanceProperties'];
        }
        if (data['cimSystemProperties']) {
            var props = data['cimSystemProperties'];
            data['_Namespace'] = props['namespace'];
            data['_ServerName'] = props['serverName'];
            data['_ClassName'] = props['className'];
            data['_Path'] = props['path'];
            delete data['cimSystemProperties'];
        }
        return data;
    };
    /**
     * The key of powershell session.
     */
    PowerShellAlternate.cimAlternateKey = 'cimAlt';
    return PowerShellAlternate;
}());
export { PowerShellAlternate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9wb3dlcnNoZWxsLWFsdGVybmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLE9BQU8sRUFBRSxhQUFhLEVBQXNDLE1BQU0sbUJBQW1CLENBQUM7QUFDdEYsT0FBTyxFQUFFLFVBQVUsRUFBc0QsTUFBTSxjQUFjLENBQUM7QUFDOUYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3JEOztHQUVHO0FBQ0g7SUFBQTtJQWdSQSxDQUFDO0lBMVFHOzs7Ozs7O09BT0c7SUFDVywwQkFBTSxHQUFwQixVQUNRLGNBQThCLEVBQzlCLFFBQWdCLEVBQ2hCLE9BQTJCO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUNwRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxJQUFJLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25HLElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2FBQ3pCLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQXBGLENBQW9GLENBQUMsQ0FBQztJQUM5RyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNXLGdDQUFZLEdBQTFCLFVBQ1EsZ0JBQWtDLEVBQ2xDLFFBQWdCLEVBQ2hCLE9BQTJCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLGtCQUFrQixJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQ3BHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUM5QixPQUFPLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxDQUFDO1FBQzFDLENBQUM7UUFFRCxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25HLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7YUFDbEQsR0FBRyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBcEYsQ0FBb0YsQ0FBQyxDQUFDO0lBQzlHLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ1csK0JBQVcsR0FBekIsVUFDUSxjQUE4QixFQUM5QixlQUFnQyxFQUNoQyxTQUFtQixFQUNuQixPQUEyQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELHdGQUF3RjtRQUN4RixJQUFNLElBQUksR0FBRyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDcEcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUM7UUFDMUMsQ0FBQztRQUVELElBQU0sWUFBWSxHQUFHLElBQUksZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRixJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25HLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQzthQUNqRCxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtZQUNwQixPQUFBLENBQW1CO2dCQUNmLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixRQUFRLEVBQUU7b0JBQ04sUUFBUSxFQUFFLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDdEcsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUN0QjthQUNKLENBQUE7UUFQRCxDQU9DLENBQUMsRUFSSSxDQVFKLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ1csa0NBQWMsR0FBNUIsVUFBNkIsVUFBc0IsRUFBRSxRQUFnQixFQUFFLE9BQXlDO1FBQzVHLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZHLENBQUM7SUFFRDs7OztPQUlHO0lBQ1csa0NBQWMsR0FBNUIsVUFBNkIsT0FBMEI7UUFDbkQsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDWSw4Q0FBMEIsR0FBekMsVUFBMEMsUUFBZ0IsRUFBRSxjQUE4QixFQUFFLE9BQTJCO1FBQ25ILElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixDQUFDO1FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDWSxzQ0FBa0IsR0FBakMsVUFBa0MsVUFBeUIsRUFBRSxJQUFTO1FBQ2xFLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDakIsS0FBSyxhQUFhLENBQUMsTUFBTTtnQkFDckIsMEJBQTBCO2dCQUMxQixNQUFNLENBQUM7b0JBQ0gsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN2RyxDQUFDO1lBQ04sS0FBSyxhQUFhLENBQUMsUUFBUTtnQkFDdkIsNkJBQTZCO2dCQUM3QixNQUFNLENBQUM7b0JBQ0gsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTt3QkFDNUIsTUFBTSxDQUFDOzRCQUNILFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7eUJBQzdELENBQUM7b0JBQ04sQ0FBQyxDQUFDO2lCQUNMLENBQUM7WUFDTixLQUFLLGFBQWEsQ0FBQyxNQUFNO2dCQUNyQixNQUFNLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEQsS0FBSyxhQUFhLENBQUMsS0FBSztnQkFDcEIsb0NBQW9DO2dCQUNwQyxNQUFNLENBQUM7b0JBQ0gsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTt3QkFDNUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO29CQUN6RCxDQUFDLENBQUM7aUJBQ0wsQ0FBQztRQUNWLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNZLG9DQUFnQixHQUEvQixVQUFnQyxJQUFTO1FBQ3JDLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUV2QiwwREFBMEQ7UUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUVELEVBQUU7UUFDRiwwREFBMEQ7UUFDMUQsRUFBRTtRQUNGLGdCQUFnQjtRQUNoQix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLGlCQUFpQjtRQUNqQixFQUFFO1FBQ0YsSUFBTSxPQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxDQUFlLFVBQVksRUFBWixLQUFBLElBQUksQ0FBQyxPQUFPLEVBQVosY0FBWSxFQUFaLElBQVk7WUFBMUIsSUFBTSxJQUFJLFNBQUE7WUFDWCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsUUFBUSxnQkFBUSxRQUFRLEVBQUssSUFBSSxDQUFFLENBQUM7WUFDeEMsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxHQUFHLENBQUMsQ0FBa0IsVUFBa0IsRUFBbEIsS0FBQSxJQUFJLENBQUMsYUFBYSxFQUFsQixjQUFrQixFQUFsQixJQUFrQjtvQkFBbkMsSUFBSSxTQUFTLFNBQUE7b0JBQ2QsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO2lCQUM5QztZQUNMLENBQUM7WUFFRCw4REFBOEQ7WUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQU0sS0FBSyxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ3BDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQXpELENBQXlELENBQUMsQ0FBQztnQkFDdEYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSxDQUFDO1lBQ0wsQ0FBQztTQUNKO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQy9CLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7OztPQUlHO0lBQ1ksb0NBQWdCLEdBQS9CLFVBQWdDLElBQVM7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBOVFEOztPQUVHO0lBQ29CLG1DQUFlLEdBQUcsUUFBUSxDQUFDO0lBNFF0RCwwQkFBQztDQWhSRCxBQWdSQyxJQUFBO1NBaFJZLG1CQUFtQiIsImZpbGUiOiJwb3dlcnNoZWxsLWFsdGVybmF0ZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=