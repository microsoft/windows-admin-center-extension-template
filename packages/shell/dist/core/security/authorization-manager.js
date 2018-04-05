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
import { Observable, Subject } from 'rxjs';
import { headerConstants, HttpStatusCode } from '../data/http-constants';
import { Net } from '../data/net';
import { Logging } from '../diagnostics/logging';
import { RpcForwarder, RpcServiceForwarder } from '../rpc/rpc-forwarder';
/**
 * Authorization Manager class. Handles SME authentication for service requests.
 */
var AuthorizationManager = /** @class */ (function (_super) {
    __extends(AuthorizationManager, _super);
    /**
     * Initializes a new instance of the Authorization Manager class
     * @param authorize An AuthorizationHandler with which to retrieve user credentials
     * @param rpc The rpc to forward auth requests to a parent window
     */
    function AuthorizationManager(authorize, rpc) {
        var _this = _super.call(this, 'authorization-manager', rpc) || this;
        _this.authorize = authorize;
        /**
         * Create a map of nodeNames to token objects to hold node specific tokens.
         */
        _this.nodeTokens = {};
        /**
         * The mapping of connections to PowershellEndpoints
         */
        _this.nodePowershellEndpoints = {};
        return _this;
    }
    Object.defineProperty(AuthorizationManager.prototype, "manageAsToken", {
        /**
         * Gets the current manage as token
         */
        get: function () {
            return this.token;
        },
        /**
         * Sets the current manage as token
         * If running with an Rpc child, notify of the change
         */
        set: function (token) {
            this.token = token;
            this.nodePowershellEndpoints = {};
            this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.manageAsToken, token);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthorizationManager.prototype, "gatewayJwk", {
        /**
         * Sets the gateway encryption certificate JWK.
         * If this is not set by Shell/Add-Connection, it will send clear text password.
         */
        set: function (jwk) {
            this.jwk = jwk;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthorizationManager.prototype, "authAwaiter", {
        /**
         * Gets an observable the emits when the authorization token is ready
         */
        get: function () {
            if (this.tokenAwaiter && !this.tokenAwaiter.closed) {
                // return the global token
                return this.tokenAwaiter;
            }
            // return the global token
            return Observable.of({ appliesTo: null, token: this.manageAsToken });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * defines the conditions under which the AuthorizationManager can handle an ajax error
     */
    AuthorizationManager.prototype.canHandleAjaxFailure = function (code, error) {
        // we can handle ajax errors if we have a getter defined, and the code is Unauthorized (401) or we get a cim authorization failure
        return this.authorize && code === HttpStatusCode.Unauthorized;
    };
    /**
     * When canHandle returns true for an ajax error, this method can be called to handle that error.
     */
    AuthorizationManager.prototype.handleAjaxFailure = function (code, request, error, nodeName) {
        var _this = this;
        return this.getNewToken(nodeName).flatMap(function (response) {
            // There may be multiple nodes requesting authentication, but we can only ask the user for one.
            // check if the result if for our node, otherwise try again.
            // It looks for inside of array only for first name.
            var names = response.appliesTo;
            var isTokenForNode = !names || names === nodeName || (Array.isArray(names) && names[0] === nodeName);
            if (isTokenForNode) {
                // this token applies to our node, so continue
                _this.addAuthorizationRequestHeader(request, nodeName);
                return Observable.of(request);
            }
            else {
                // this token did not apply to our node. Ask again.
                return _this.handleAjaxFailure(code, request, error, nodeName);
            }
        });
    };
    AuthorizationManager.prototype.saveJeaContext = function (nodeName, endpoint) {
        Logging.trace({
            view: 'sme-ui-control',
            instance: 'saveJeaContext',
            action: 'command-click',
            data: { message: 'Establishing session using JEA endpoint' }
        });
        this.nodePowershellEndpoints[nodeName.toLocaleLowerCase()] = endpoint;
        this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setJeaContext, { nodeName: nodeName, endpoint: endpoint });
    };
    AuthorizationManager.prototype.getJeaEndpoint = function (nodeName) {
        return this.nodePowershellEndpoints[nodeName.toLocaleLowerCase()];
    };
    AuthorizationManager.prototype.getNewToken = function (nodeNames) {
        var _this = this;
        // if we are already awaiting a token, then hook into the current request and try using that token
        if (this.tokenAwaiter && !this.tokenAwaiter.closed) {
            return this.tokenAwaiter;
        }
        // ensure input is an array only if not null.
        if (nodeNames && !Array.isArray(nodeNames)) {
            nodeNames = [nodeNames];
        }
        // define a new subject for multiple requests to wait on
        this.tokenAwaiter = new Subject();
        // try to forward execute getNewToken from our parent
        var parentExecuter = this.forwardExecute(0 /* Parent */, AuthorizationManager.rpcCommands.getNewToken, [nodeNames]);
        if (parentExecuter) {
            return this.tokenAwaiter;
        }
        // Need to clear the endpoints before we acquire a new token,
        // because we must try new credentials in an admin context before any fallback happens.
        if (nodeNames) {
            for (var _i = 0, _a = nodeNames; _i < _a.length; _i++) {
                var node = _a[_i];
                this.nodePowershellEndpoints[node.toLocaleLowerCase()] = null;
            }
        }
        // since we could not forward the request We must ask for the auth token ourselves
        this.authorize(nodeNames)
            .flatMap(function (credentials) {
            if (credentials.applyToAllNodes) {
                _this.nodeTokens = {};
                var forward = _this.forwardExecute(1 /* Child */, AuthorizationManager.rpcCommands.clearNodeTokens, []);
                if (forward) {
                    return forward.map(function () { return credentials; });
                }
            }
            return Observable.of(credentials);
        })
            .flatMap(function (credentials) {
            var appliesTo = credentials.applyToAllNodes ? null : nodeNames || null;
            return _this.createSecureToken({
                username: credentials.username,
                password: credentials.password,
                useLaps: credentials.useLaps,
                lapsLocalAdminName: credentials.lapsLocalAdminName
            })
                .map(function (token) {
                return {
                    token: token,
                    appliesTo: appliesTo
                };
            });
        })
            .take(1)
            .subscribe(function (result) {
            _this.completeTokenAwaiter(result);
            _this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setNodeToken, result);
        }, function (error) {
            _this.completeTokenAwaiter(null, error);
            _this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setNodeTokenError, RpcForwarder.ensureSerializable(error));
        });
        return this.tokenAwaiter;
    };
    /**
     * @deprecated use createSecureToke() after configured gatewayJwk property.
     *
     * Creates a token from the given options that may be used for node authentication
     * @param options The token creation options
     */
    AuthorizationManager.prototype.createToken = function (options) {
        // ensure a valid value for laps local admin name
        if (MsftSme.isNullOrWhiteSpace(options.lapsLocalAdminName)) {
            options.lapsLocalAdminName = AuthorizationManager.defaultLapsLocalAdminName;
        }
        // ensure username has a valid value
        if (MsftSme.isNullOrWhiteSpace(options.username)) {
            options.username = null;
        }
        if (options.useLaps || !options.username) {
            return {
                value: null,
                username: null,
                useLaps: options.useLaps,
                lapsLocalAdminName: options.lapsLocalAdminName
            };
        }
        // ensure password has a valid value
        if (MsftSme.isNullOrWhiteSpace(options.password)) {
            options.password = null;
        }
        var username;
        if (options.username.indexOf('@') >= 0) {
            username = options.username.split('@').reverse();
        }
        else {
            username = options.username.split('\\');
        }
        var token = Net.createEncodedAuthenticationHeader(username, options.password);
        return {
            value: token,
            username: options.username,
            useLaps: false,
            lapsLocalAdminName: null
        };
    };
    /**
     * Creates a secure token from the given options that may be used for node authentication
     *
     * @param options The token creation options
     */
    AuthorizationManager.prototype.createSecureToken = function (options) {
        var forward = this.forwardExecute(0 /* Parent */, AuthorizationManager.rpcCommands.secureToken, [options]);
        if (forward) {
            return forward;
        }
        else {
            return this.secureToken(options);
        }
    };
    /**
     * Creates a secure token from the given options that may be used for node authentication
     *
     * @param options The token creation options
     */
    AuthorizationManager.prototype.secureToken = function (options) {
        // ensure a valid value for laps local admin name
        if (MsftSme.isNullOrWhiteSpace(options.lapsLocalAdminName)) {
            options.lapsLocalAdminName = AuthorizationManager.defaultLapsLocalAdminName;
        }
        // ensure username has a valid value
        if (MsftSme.isNullOrWhiteSpace(options.username)) {
            options.username = null;
        }
        if (options.useLaps || !options.username) {
            return Observable.of({
                value: null,
                username: null,
                useLaps: options.useLaps,
                lapsLocalAdminName: options.lapsLocalAdminName
            });
        }
        // ensure password has a valid value
        if (MsftSme.isNullOrWhiteSpace(options.password)) {
            options.password = null;
        }
        var username;
        if (options.username.indexOf('@') >= 0) {
            username = options.username.split('@').reverse();
        }
        else {
            username = options.username.split('\\');
        }
        var tokenData = {
            value: undefined,
            username: options.username,
            useLaps: false,
            lapsLocalAdminName: null
        };
        if (this.jwk) {
            return Net.createEncryptedAuthenticationHeader(this.jwk, username, options.password).map(function (newToken) {
                tokenData.value = newToken;
                return tokenData;
            });
        }
        tokenData.value = Net.createEncodedAuthenticationHeader(username, options.password);
        return Observable.of(tokenData);
    };
    /**
     * Completes the token awaiter
     */
    AuthorizationManager.prototype.completeTokenAwaiter = function (result, error) {
        var _this = this;
        if (error) {
            if (this.tokenAwaiter) {
                var awaiter = this.tokenAwaiter;
                this.tokenAwaiter = null;
                awaiter.error(error);
            }
        }
        else {
            if (!result.appliesTo) {
                this.manageAsToken = result.token;
            }
            else if (Array.isArray(result.appliesTo)) {
                result.appliesTo.forEach(function (nodeName) {
                    _this.nodeTokens[nodeName.toLocaleLowerCase()] = result.token;
                });
            }
            else {
                this.nodeTokens[result.appliesTo.toLocaleLowerCase()] = result.token;
            }
            if (this.tokenAwaiter) {
                var awaiter = this.tokenAwaiter;
                this.tokenAwaiter = null;
                awaiter.next(result);
                awaiter.complete();
            }
        }
    };
    /**
     * Get the saved Auth token for a node.
     *
     * @param nodeName The nodeName to get token for.
     */
    AuthorizationManager.prototype.getSavedNodeToken = function (nodeName) {
        if (nodeName && this.nodeTokens[nodeName.toLocaleLowerCase()]) {
            return this.nodeTokens[nodeName.toLocaleLowerCase()];
        }
        return this.manageAsToken;
    };
    /**
     * Adds a authorization header to a request given a node with a manageAsToken
     * @param request The request to add headers to
     * @param nodeName optional. The node to add headers for if not provided, the global token will be used
     * @param token optional. The token to use for the headers. if provided, the nodeName is not used.
     */
    AuthorizationManager.prototype.addAuthorizationRequestHeader = function (request, nodeName, token) {
        if (!token) {
            token = this.manageAsToken;
            if (nodeName && this.nodeTokens[nodeName.toLocaleLowerCase()]) {
                token = this.nodeTokens[nodeName.toLocaleLowerCase()];
            }
        }
        if (token) {
            if (token.value) {
                // If username and password are explicitly provided, we only add the Authorization header. 
                request.headers[headerConstants.SME_AUTHORIZATION] = token.value;
            }
            else {
                // If not, we add useLaps header.
                request.headers[headerConstants.USE_LAPS] = token.useLaps;
                request.headers[headerConstants.LAPS_LOCALADMINNAME] = token.lapsLocalAdminName;
            }
        }
    };
    /**
     * Create token headers.
     *
     * @param nodeName the node name.
     * @param token the token to override current setting (optional).
     */
    AuthorizationManager.prototype.createTokenHeaders = function (nodeName, token) {
        var headers = {};
        token = token || this.getSavedNodeToken(nodeName);
        if (token) {
            if (token.value) {
                // If username and password are explicitly provided, we only add the Authorization header. 
                headers[headerConstants.SME_AUTHORIZATION] = token.value;
            }
            else {
                // If not, we add useLaps header.
                headers[headerConstants.USE_LAPS] = token.useLaps ? 'true' : 'false';
                headers[headerConstants.LAPS_LOCALADMINNAME] = token.lapsLocalAdminName;
            }
        }
        return headers;
    };
    /**
     * Adds a authorization header to a request given a node with a manageAsToken
     */
    AuthorizationManager.prototype.addAuthorizationTokensToMultiPartBody = function (body, nodeName, token) {
        if (!token) {
            token = this.manageAsToken;
            if (nodeName && this.nodeTokens[nodeName.toLocaleLowerCase()]) {
                token = this.nodeTokens[nodeName.toLocaleLowerCase()];
            }
        }
        if (token) {
            if (token.value) {
                // If username and password are explicitly provided, we only add the Authorization header. 
                body.push(headerConstants.SME_AUTHORIZATION + ': ' + token.value);
            }
            else {
                // If not, we add useLaps header.
                body.push(headerConstants.USE_LAPS + ': ' + token.useLaps);
                body.push(headerConstants.LAPS_LOCALADMINNAME + ': ' + token.lapsLocalAdminName);
            }
        }
    };
    /**
     * Called on a child service instance when onForwardInit returns from the parent
     * @param data The response from the forwardInit call
     */
    AuthorizationManager.prototype.onForwardInitResponse = function (data) {
        if (data && data.error) {
            // if there is an error, we cannot continue, so throw it
            throw data.error;
        }
        this.manageAsToken = data.result.manageAsToken;
        this.nodeTokens = data.result.nodeTokens;
        this.nodePowershellEndpoints = data.result.nodePowershellEndpoints;
    };
    /**
     * Called when a new instance of the service in another window is initialized and needs to synchronize with its parent
     * @param from The RpcRelationshipType that this request is from
     * @returns an observable for the all the values needed to initialize the service
     */
    AuthorizationManager.prototype.onForwardInit = function () {
        // authorization manager doesn't pass any properties to child services at this time.
        return Observable.of({
            manageAsToken: this.manageAsToken,
            nodeTokens: this.nodeTokens,
            nodePowershellEndpoints: this.nodePowershellEndpoints
        });
    };
    /**
     * Called when the forwarded services counterpart wants to get data from the parent
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the method to forward to
     * @param args The arguments of the method
     * @returns an observable for the result of the method call
     */
    AuthorizationManager.prototype.onForwardExecute = function (from, name, args) {
        var _this = this;
        // command comes from child
        if (from === 1 /* Child */) {
            switch (name) {
                case AuthorizationManager.rpcCommands.getNewToken:
                    // start getting the new token, but return immediately to avoid timeout
                    var subscription_1 = this.getNewToken(args ? args[0] : null).subscribe(function (result) {
                        subscription_1.unsubscribe();
                    }, function (error) {
                        subscription_1.unsubscribe();
                        _this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setNodeTokenError, RpcForwarder.ensureSerializable(error));
                    });
                    return Observable.of(null);
                case AuthorizationManager.rpcCommands.secureToken:
                    var options = args && args[0];
                    if (!options) {
                        return Observable.of(null);
                    }
                    return this.secureToken(options);
            }
        }
        // command comes from parent
        if (from === 0 /* Parent */) {
            if (name === AuthorizationManager.rpcCommands.clearNodeTokens) {
                this.nodeTokens = {};
                this.nodePowershellEndpoints = {};
                // if we also have children, forward the request on
                var forward = this.forwardExecute(1 /* Child */, AuthorizationManager.rpcCommands.clearNodeTokens, args);
                return forward || Observable.of(null);
            }
        }
        // command not implemented
        return this.nameNotFound(name);
    };
    /**
     * Called when the forwarded services counterpart sends a notify message
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the property to change
     * @param value The new value of the property
     * @returns an observable that completes when the property has been changed.
     */
    AuthorizationManager.prototype.onForwardNotify = function (from, name, value) {
        // allow our parent to give us a new token        
        if (from === 0 /* Parent */) {
            if (name === AuthorizationManager.rpcCommands.manageAsToken) {
                this.manageAsToken = value;
                // if we also have children, forward the notification on
                var forward = this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.manageAsToken, value);
                return forward || Observable.of(null);
            }
            if (name === AuthorizationManager.rpcCommands.setNodeToken) {
                if (!value) {
                    var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.InvalidValue.message;
                    return Observable.throw(message.format(AuthorizationManager.rpcCommands.setNodeToken));
                }
                this.completeTokenAwaiter(value);
                var forward = this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setNodeToken, value);
                return forward || Observable.of(null);
            }
            if (name === AuthorizationManager.rpcCommands.setNodeTokenError) {
                if (!value) {
                    var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.InvalidValue.message;
                    return Observable.throw(message.format(AuthorizationManager.rpcCommands.setNodeTokenError));
                }
                this.completeTokenAwaiter(null, value);
                var forward = this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setNodeTokenError, value);
                return forward || Observable.of(null);
            }
            if (name === AuthorizationManager.rpcCommands.setJeaContext) {
                if (!value) {
                    var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.InvalidValue.message;
                    return Observable.throw(message.format(AuthorizationManager.rpcCommands.setJeaContext));
                }
                this.saveJeaContext(value.nodeName, value.endpoint);
                var forward = this.forwardNotify(1 /* Child */, AuthorizationManager.rpcCommands.setJeaContext, value);
                return forward || Observable.of(null);
            }
        }
        return this.nameNotFound(name);
    };
    /**
     * If no laps local admin name is defined, it will default to 'administrator'
     */
    AuthorizationManager.defaultLapsLocalAdminName = 'administrator';
    AuthorizationManager.rpcCommands = {
        setNodeToken: 'setNodeToken',
        manageAsToken: 'manageAsToken',
        setNodeTokenError: 'setNodeTokenError',
        setJeaContext: 'setJeaContext',
        clearNodeTokens: 'clearNodeTokens',
        getNewToken: 'getNewToken',
        secureToken: 'secureToken'
    };
    return AuthorizationManager;
}(RpcServiceForwarder));
export { AuthorizationManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2VjdXJpdHkvYXV0aG9yaXphdGlvbi1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQTBCLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUtqRCxPQUFPLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUF5RHpFOztHQUVHO0FBQ0g7SUFBMEMsd0NBQW1CO0lBK0V6RDs7OztPQUlHO0lBQ0gsOEJBQW9CLFNBQW1DLEVBQUUsR0FBUTtRQUFqRSxZQUNJLGtCQUFNLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxTQUN0QztRQUZtQixlQUFTLEdBQVQsU0FBUyxDQUEwQjtRQXBFdkQ7O1dBRUc7UUFDSSxnQkFBVSxHQUEwQyxFQUFFLENBQUM7UUFZOUQ7O1dBRUc7UUFDSyw2QkFBdUIsR0FBOEIsRUFBRSxDQUFDOztJQW9EaEUsQ0FBQztJQXpDRCxzQkFBVywrQ0FBYTtRQU14Qjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQWZEOzs7V0FHRzthQUNILFVBQXlCLEtBQXlCO1lBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLGFBQWEsZ0JBQTRCLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekcsQ0FBQzs7O09BQUE7SUFhRCxzQkFBVyw0Q0FBVTtRQUpyQjs7O1dBR0c7YUFDSCxVQUFzQixH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T0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLGdCQUE0QixvQkFBb0IsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3pILE1BQU0sQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztvQkFDakcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDNUYsQ0FBQztnQkFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxnQkFBNEIsb0JBQW9CLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDckgsTUFBTSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQWxsQkQ7O09BRUc7SUFDVyw4Q0FBeUIsR0FBRyxlQUFlLENBQUM7SUFFM0MsZ0NBQVcsR0FBRztRQUN6QixZQUFZLEVBQUUsY0FBYztRQUM1QixhQUFhLEVBQUUsZUFBZTtRQUM5QixpQkFBaUIsRUFBRSxtQkFBbUI7UUFDdEMsYUFBYSxFQUFFLGVBQWU7UUFDOUIsZUFBZSxFQUFFLGlCQUFpQjtRQUNsQyxXQUFXLEVBQUUsYUFBYTtRQUMxQixXQUFXLEVBQUUsYUFBYTtLQUM3QixDQUFBO0lBc2tCTCwyQkFBQztDQXBsQkQsQUFvbEJDLENBcGxCeUMsbUJBQW1CLEdBb2xCNUQ7U0FwbEJZLG9CQUFvQiIsImZpbGUiOiJhdXRob3JpemF0aW9uLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9