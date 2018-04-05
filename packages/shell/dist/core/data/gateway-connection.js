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
import { EnvironmentModule } from '../manifest/environment-modules';
import { RpcServiceForwarder } from '../rpc/rpc-forwarder';
import { Http } from './http';
import { headerConstants } from './http-constants';
import { HttpStatusCode } from './http-constants';
import { Net } from './net';
/**
 * The Gateway Connection class for creating requests and calling the Gateway's REST API
 */
var GatewayConnection = /** @class */ (function (_super) {
    __extends(GatewayConnection, _super);
    /**
     * Initializes a new instance of the Gateway class.
     *
     * @param http the Http object.
     * @param rpc the Rpc class.
     */
    function GatewayConnection(http, rpc) {
        var _this = _super.call(this, 'gateway-connection', rpc) || this;
        _this.http = http;
        /**
         * The replay subject for gateway url to settle.
         */
        _this.gatewayUrlAwaiter = new ReplaySubject(1);
        /**
         * The subject to handle forbidden errors
         */
        _this.onForbidden = new Subject();
        // setup forbidden handler for all gateway requests.
        _this.forbiddenHandler = {
            canHandle: function (code, error) {
                return code === HttpStatusCode.Forbidden;
            },
            handleNoRetry: function (code, request, error) {
                _this.enterForbiddenState();
                return Observable.of(null);
            }
        };
        return _this;
    }
    Object.defineProperty(GatewayConnection.prototype, "gatewayUrl", {
        /**
         * Gets the gateway URL to connect to.
         */
        get: function () {
            return this.internalGatewayUrl;
        },
        /**
         * Sets the gateway URL to connect to.
         */
        set: function (value) {
            this.internalGatewayUrl = value;
            this.gatewayUrlAwaiter.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GatewayConnection.prototype, "gatewayInfo", {
        /**
         * Gets the gateway information.
         */
        get: function () {
            if (!this.internalGatewayUrl) {
                throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.GatewayUrlNotConfigured.message);
            }
            // RegEx: ('http' or 'https') '://' (('<gatewayName1>'):('<port>') or ('<gatewayName2>'))
            // 0: url
            // 1: https or http
            // 2: <gatewayName1>:<port> or <gatewayName2>
            // 3: <gatewayName1> or undefined
            // 4: <port> or undefined
            // 5: <gatewayName2>
            var url = MsftSme.trimEnd(this.internalGatewayUrl.toLowerCase(), '/');
            var match = url.match(/(http|https):\/\/((.+):(\d+)|(.+))/);
            if (!match) {
                throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.GatewayUrlMalformed.message);
            }
            var secure = (match[1] === 'https');
            var name = match[3] || match[2];
            var port = parseInt(match[4], 10) || (secure ? 443 : 80);
            return { name: name, secure: secure, port: port };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GatewayConnection.prototype, "gatewayName", {
        /**
         * Gets the gateway node name to make a CIM/PowerShell query to the gateway node.
         */
        get: function () {
            // localhost will be used to locally query gateway node. if this causes any access problem, need to be replaced.
            return 'localhost';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Enters the application into the forbidden error state.
     */
    GatewayConnection.prototype.enterForbiddenState = function () {
        if (this.rpc.isShell) {
            this.onForbidden.next();
        }
        else {
            this.forwardNotify(0 /* Parent */, GatewayConnection.rpcCommands.forbiddenReceived, null);
        }
    };
    /**
     * Makes a POST call to the gateway
     *
     * @param relativeUrl the relative Url after "/api"
     * @param body the body string JSON.stringfy'ed
     * @param request the gateway request object.
     */
    GatewayConnection.prototype.post = function (relativeUrl, body, request) {
        var postRequest = this.createRequest(Http.methodPost, relativeUrl, body, request);
        return this.call(postRequest);
    };
    /**
     * Makes a GET call to the gateway
     *
     * @param relativeUrl the relative Url after "/api"
     * @param request the gateway request object.
     */
    GatewayConnection.prototype.get = function (relativeUrl, request) {
        var getRequest = this.createRequest(Http.methodGet, relativeUrl, null, request);
        return this.call(getRequest);
    };
    /**
     * Makes a PUT call to the gateway
     *
     * @param relativeUrl the relative Url after "/api"
     * @param body the body string JSON.stringfy'ed
     * @param request the gateway request object.
     */
    GatewayConnection.prototype.put = function (relativeUrl, body, request) {
        var putRequest = this.createRequest(Http.methodPut, relativeUrl, body, request);
        return this.call(putRequest);
    };
    /**
     * Makes a PATCH call to the gateway
     *
     * @param relativeUrl the relative Url after "/api"
     * @param body the body string JSON.stringfy'ed
     * @param request the gateway request object.
     */
    GatewayConnection.prototype.patch = function (relativeUrl, body, request) {
        var patchRequest = this.createRequest(Http.methodPatch, relativeUrl, body, request);
        return this.call(patchRequest);
    };
    /**
     * Makes a DELETE call to the gateway
     *
     * @param relativeUrl the relative Url after "/api"
     * @param body the body string JSON.stringfy'ed
     * @param request the gateway request object.
     */
    GatewayConnection.prototype.delete = function (relativeUrl, body, request) {
        var deleteRequest = this.createRequest(Http.methodDelete, relativeUrl, body, request);
        return this.call(deleteRequest);
    };
    /**
     * Makes a DELETE call to the gateway without waiting for the response.
     *
     * @param relativeUrl the relative Url after "/api"
     * @param request the gateway request object.
     */
    GatewayConnection.prototype.deleteQuick = function (relativeUrl, headers) {
        headers[headerConstants.MODULE_NAME] = EnvironmentModule.getModuleName();
        headers[headerConstants.MODULE_VERSION] = EnvironmentModule.getModuleVersion();
        var url = Net.gatewayApi(this.gatewayUrl, relativeUrl);
        this.http.deleteQuick(url, headers);
    };
    /**
     * Creates a GatewayRequest.
     *
     * @param method the http method to use
     * @param relativeUrl the relative Url after "/api/"
     * @param body the body string JSON.stringfy'ed
     * @param request the gateway request object to extend.
     */
    GatewayConnection.prototype.createRequest = function (method, relativeUrl, body, request) {
        var defaultMaxRetry = 3;
        // if request is undefined, default to empty object
        request = request || {};
        request.headers = request.headers || {};
        request.headers[headerConstants.MODULE_NAME] = EnvironmentModule.getModuleName();
        request.headers[headerConstants.MODULE_VERSION] = EnvironmentModule.getModuleVersion();
        return Object.assign(request, {
            method: method,
            url: relativeUrl,
            // default to the passed in body, the request body, or an empty string
            body: body || request.body || '',
            // default to the request headers, or an empty object
            headers: request.headers,
            // for the next 2 props, default to true unless explicitly set to false
            withCredentials: request.withCredentials === false ? false : true,
            crossDomain: request.crossDomain === false ? false : true,
            // use default retry options if none are provided
            retryHandlers: request.retryHandlers || [],
            maxRetryCount: request.maxRetryCount === 0 ? 0 : request.maxRetryCount || defaultMaxRetry
        });
    };
    /**
     * Make a request.
     *
     * @param request the request to execute against the gateway.
     * @return Observable<any> the query result observable.
     */
    GatewayConnection.prototype.call = function (request) {
        var _this = this;
        if (!this.gatewayUrl) {
            return this.gatewayUrlAwaiter.flatMap(function () { return _this.call(request); });
        }
        // create gateway url from current url
        request.url = Net.gatewayApi(this.gatewayUrl, request.url);
        // create retry options from request
        var retryOptions = {
            handlers: (request.retryHandlers || []).concat([this.forbiddenHandler]),
            maxRetry: request.maxRetryCount
        };
        // create observable for our request
        var requestObservable = this.http.request(request, retryOptions).map(function (response) { return response ? response.response : {}; });
        if (request.beforeCall) {
            return request.beforeCall(request).flatMap(function () { return requestObservable; });
        }
        return requestObservable;
    };
    /**
     * Called on a child service instance when onForwardInit returns from the parent
     * @param data The response from the forwardInit call
     */
    GatewayConnection.prototype.onForwardInitResponse = function (data) {
        if (data.error) {
            // if there is an error, we cannot continue, so throw its
            throw data.error;
        }
        this.gatewayUrl = data.result.gatewayName;
    };
    /**
     * Called when a new instance of the service in another window is initialized and needs to synchronize with its parent
     * @param from The RpcRelationshipType that this request is from
     * @returns an observable for the all the values needed to initialize the service
     */
    GatewayConnection.prototype.onForwardInit = function () {
        if (this.gatewayUrl) {
            return Observable.of({ gatewayName: this.gatewayUrl });
        }
        else {
            // if gateway value hasnt been set yet, then wait for it.
            return this.gatewayUrlAwaiter.map(function (url) {
                return { gatewayName: url };
            });
        }
    };
    /**
     * Called when the forwarded services counterpart wants to get data from the parent
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the method to forward to
     * @param args The arguments of the method
     * @returns an observable for the result of the method call
     */
    GatewayConnection.prototype.onForwardExecute = function (from, name, args) {
        // gatewayConnection does not allow any method calls at this time
        return this.nameNotFound(name);
    };
    /**
     * Called when the forwarded services counterpart sends a notify message
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the property to change
     * @param value The new value of the property
     * @returns an observable that completes when the property has been changed.
     */
    GatewayConnection.prototype.onForwardNotify = function (from, name, value) {
        if (from === 1 /* Child */ && name === GatewayConnection.rpcCommands.forbiddenReceived) {
            // if our child recieves a forbidden, enacte our forbidden handling
            this.onForbidden.next();
            return Observable.of(null);
        }
        // gatewayConnection does not allow any other notifications at this time
        return this.nameNotFound(name);
    };
    GatewayConnection.rpcCommands = {
        forbiddenReceived: 'forbiddenRecieved'
    };
    return GatewayConnection;
}(RpcServiceForwarder));
export { GatewayConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9nYXRld2F5LWNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBNkIsVUFBVSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFFakcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFJcEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0QsT0FBTyxFQUFFLElBQUksRUFBOEMsTUFBTSxRQUFRLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBMEQ1Qjs7R0FFRztBQUNIO0lBQXVDLHFDQUFtQjtJQTRFdEQ7Ozs7O09BS0c7SUFDSCwyQkFBbUIsSUFBVSxFQUFFLEdBQVE7UUFBdkMsWUFDSSxrQkFBTSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsU0FZbkM7UUFia0IsVUFBSSxHQUFKLElBQUksQ0FBTTtRQXZFN0I7O1dBRUc7UUFDSyx1QkFBaUIsR0FBRyxJQUFJLGFBQWEsQ0FBUyxDQUFDLENBQUMsQ0FBQztRQUV6RDs7V0FFRztRQUNhLGlCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWtFOUMsb0RBQW9EO1FBQ3BELEtBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUNwQixTQUFTLEVBQUUsVUFBQyxJQUFJLEVBQUUsS0FBSztnQkFDbkIsTUFBTSxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQzdDLENBQUM7WUFDRCxhQUFhLEVBQUUsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUs7Z0JBQ2hDLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUMzQixNQUFNLENBQUMsVUFB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LENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ08sNENBQWdCLEdBQTFCLFVBQTJCLElBQXlCLEVBQUUsSUFBWSxFQUFFLElBQVc7UUFDM0UsaUVBQWlFO1FBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTywyQ0FBZSxHQUF6QixVQUEwQixJQUF5QixFQUFFLElBQVksRUFBRSxLQUFVO1FBQ3pFLEVBQUUsQ0FBQyxDQUFDLElBQUksa0JBQThCLElBQUksSUFBSSxLQUFLLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDakcsbUVBQW1FO1lBQ25FLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUNELHdFQUF3RTtRQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBbFRjLDZCQUFXLEdBQUc7UUFDekIsaUJBQWlCLEVBQUUsbUJBQW1CO0tBQ3pDLENBQUE7SUFpVEwsd0JBQUM7Q0FyVEQsQUFxVEMsQ0FyVHNDLG1CQUFtQixHQXFUekQ7U0FyVFksaUJBQWlCIiwiZmlsZSI6ImdhdGV3YXktY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=