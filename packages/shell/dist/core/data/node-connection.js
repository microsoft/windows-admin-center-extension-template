import { Observable } from 'rxjs';
import { headerConstants } from './http-constants';
/**
 * Node Cim output type.
 */
export var NodeCimOutput;
(function (NodeCimOutput) {
    /**
     * Single instance.
     */
    NodeCimOutput[NodeCimOutput["Single"] = 0] = "Single";
    /**
     * Multiple instances.
     */
    NodeCimOutput[NodeCimOutput["Multiple"] = 1] = "Multiple";
    /**
     * Invoke result.
     */
    NodeCimOutput[NodeCimOutput["Result"] = 2] = "Result";
    /**
     * WQL query result.
     */
    NodeCimOutput[NodeCimOutput["Query"] = 3] = "Query";
})(NodeCimOutput || (NodeCimOutput = {}));
/**
 * The Node Connection class for creating requests and calling the Gateway's Node API
 */
var NodeConnection = /** @class */ (function () {
    /**
     * Initializes a new instance of the GatewayService class.
     *
     * @param gateway the gateway Connection
     * @param authorizationManager the authorization manager.
     */
    function NodeConnection(gateway, authorizationManager) {
        this.gateway = gateway;
        this.authorizationManager = authorizationManager;
    }
    /**
     * Makes a POST call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    NodeConnection.prototype.post = function (nodeName, relativeUrl, body, request) {
        relativeUrl = this.getNodeUrl(nodeName, relativeUrl);
        request = this.createNodeRequest(request || {}, nodeName);
        return this.gateway.post(relativeUrl, body, request);
    };
    /**
     * Makes a GET call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param request the node request object.
     */
    NodeConnection.prototype.get = function (nodeName, relativeUrl, request) {
        relativeUrl = this.getNodeUrl(nodeName, relativeUrl);
        request = this.createNodeRequest(request || {}, nodeName);
        return this.gateway.get(relativeUrl, request);
    };
    /**
     * Makes a PUT call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    NodeConnection.prototype.put = function (nodeName, relativeUrl, body, request) {
        relativeUrl = this.getNodeUrl(nodeName, relativeUrl);
        request = this.createNodeRequest(request || {}, nodeName);
        return this.gateway.put(relativeUrl, body, request);
    };
    /**
     * Makes a PATCH call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    NodeConnection.prototype.patch = function (nodeName, relativeUrl, body, request) {
        relativeUrl = this.getNodeUrl(nodeName, relativeUrl);
        request = this.createNodeRequest(request || {}, nodeName);
        return this.gateway.patch(relativeUrl, body, request);
    };
    /**
     * Makes a DELETE call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    NodeConnection.prototype.delete = function (nodeName, relativeUrl, body, request) {
        relativeUrl = this.getNodeUrl(nodeName, relativeUrl);
        request = this.createNodeRequest(request || {}, nodeName);
        return this.gateway.delete(relativeUrl, body, request);
    };
    /**
     * Makes a DELETE call to the gateway node api without waiting for the response.
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param request the node request object.
     */
    NodeConnection.prototype.deleteQuick = function (nodeName, relativeUrl, request) {
        request.headers = request.headers || {};
        if (!request.authToken) {
            // if we dont have an authToken, then make sure we are not waiting on one.
            this.authorizationManager.addAuthorizationRequestHeader(request, nodeName);
        }
        else {
            this.authorizationManager.addAuthorizationRequestHeader(request, nodeName, request.authToken);
        }
        var endpoint = this.authorizationManager.getJeaEndpoint(nodeName);
        if (request.powerShellEndpoint) {
            // Override JEA fallback if endpoint is explicitly set for debugging purposes
            request.headers[headerConstants.POWERSHELL_ENDPOINT] = request.powerShellEndpoint;
        }
        else if (endpoint) {
            request.headers[headerConstants.POWERSHELL_ENDPOINT] = endpoint;
        }
        var url = this.getNodeUrl(nodeName, relativeUrl);
        return this.gateway.deleteQuick(url, request.headers);
    };
    /**
     * Persists the JEA powershell endpoint context
     * @param nodeName The node name
     * @param endpoint The powershell endpoint
     */
    NodeConnection.prototype.saveJeaContext = function (nodeName, endpoint) {
        this.authorizationManager.saveJeaContext(nodeName, endpoint);
    };
    /**
     * Gets the JEA powershell endpoint, if it exists
     * @param nodeName The node name
     */
    NodeConnection.prototype.getJeaEndpoint = function (nodeName) {
        return this.authorizationManager.getJeaEndpoint(nodeName);
    };
    /**
     * Adds default parameters to a NodeRequest
     *
     * @param method the http method to use
     * @param relativeUrl the relative Url after "/api/"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object to extend.
     */
    NodeConnection.prototype.createNodeRequest = function (request, nodeName) {
        var _this = this;
        // if we did not specify no auth, and we are not using a custom token... 
        if (!request.noAuth && !request.authToken) {
            // ...then add node specific authorization handlers
            request.retryHandlers = (request.retryHandlers || []).concat([{
                    canHandle: function (code, error) { return _this.authorizationManager.canHandleAjaxFailure(code, error); },
                    handle: function (code, originalRequest, error) {
                        return _this.authorizationManager.handleAjaxFailure(code, originalRequest, error, nodeName);
                    }
                }]);
        }
        var oldBeforeCall = request.beforeCall;
        // Add before call handler to wait for any pending node authorization
        request.beforeCall = function (pendingRequest) {
            var observable = null;
            if (!request.authToken) {
                // if we dont have an authToken, then make sure we are not waiting on one.
                observable = _this.authorizationManager.authAwaiter.map(function () {
                    return _this.authorizationManager.addAuthorizationRequestHeader(pendingRequest, nodeName);
                });
            }
            else {
                observable = Observable.of(_this.authorizationManager.addAuthorizationRequestHeader(pendingRequest, nodeName, request.authToken));
            }
            if (oldBeforeCall) {
                return oldBeforeCall(request).flatMap(function () { return observable; });
            }
            return observable;
        };
        request.headers = request.headers || {};
        if (request.logAudit === true || request.logAudit === false) {
            request.headers[headerConstants.LOG_AUDIT] = request.logAudit ? 'true' : 'false';
        }
        if (request.logTelemetry === true || request.logTelemetry === false) {
            request.headers[headerConstants.LOG_TELEMETRY] = request.logTelemetry ? 'true' : 'false';
        }
        var endpoint = this.authorizationManager.getJeaEndpoint(nodeName);
        if (request.powerShellEndpoint) {
            // Override JEA fallback if endpoint is explicitly set for debugging purposes
            request.headers[headerConstants.POWERSHELL_ENDPOINT] = request.powerShellEndpoint;
        }
        else if (endpoint) {
            request.headers[headerConstants.POWERSHELL_ENDPOINT] = endpoint;
        }
        return request;
    };
    /**
     * Creates a Node url
     *
     * @param nodeName the name of the node to make a call against
     * @param relativeUrl the relative Url after "/nodes/<nodeName>/"
     */
    NodeConnection.prototype.getNodeUrl = function (nodeName, relativeUrl) {
        // create node url from current url
        if (!relativeUrl.startsWith('/')) {
            relativeUrl = "/" + relativeUrl;
        }
        return "/nodes/" + nodeName + relativeUrl;
    };
    return NodeConnection;
}());
export { NodeConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9ub2RlLWNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUE2QixVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFJN0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR25EOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksYUFvQlg7QUFwQkQsV0FBWSxhQUFhO0lBQ3JCOztPQUVHO0lBQ0gscURBQU0sQ0FBQTtJQUVOOztPQUVHO0lBQ0gseURBQVEsQ0FBQTtJQUVSOztPQUVHO0lBQ0gscURBQU0sQ0FBQTtJQUVOOztPQUVHO0lBQ0gsbURBQUssQ0FBQTtBQUNULENBQUMsRUFwQlcsYUFBYSxLQUFiLGFBQWEsUUFvQnhCO0FBb0VEOztHQUVHO0FBQ0g7SUFFSTs7Ozs7T0FLRztJQUNILHdCQUFvQixPQUEwQixFQUFVLG9CQUEwQztRQUE5RSxZQUFPLEdBQVAsT0FBTyxDQUFtQjtRQUFVLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7SUFBSSxDQUFDO0lBRXZHOzs7Ozs7O09BT0c7SUFDSSw2QkFBSSxHQUFYLFVBQVksUUFBZ0IsRUFBRSxXQUFtQixFQUFFLElBQVUsRUFBRSxPQUFxQjtRQUNoRixXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDckQsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSw0QkFBRyxHQUFWLFVBQVcsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLE9BQXFCO1FBQ25FLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEs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