import { AjaxError, AjaxRequest, Observable } from 'rxjs';
import { HttpStatusCode } from '../data/http-constants';
import { Rpc } from '../rpc/rpc';
import { RpcRelationshipType } from '../rpc/rpc-base';
import { RpcForwardResponse } from '../rpc/rpc-forward-report-data';
import { RpcServiceForwarder } from '../rpc/rpc-forwarder';
/**
 * Defines the response from an Authorization Handler
 */
export interface AuthorizationCredentials {
    username: string;
    password: string;
    applyToAllNodes?: boolean;
    useLaps?: boolean;
    lapsLocalAdminName?: string;
}
/**
 * Defines the response the AuthorizationManager returns from getToken
 */
export interface AuthorizationTokenResponse {
    token: AuthorizationToken;
    appliesTo?: string | string[];
}
/**
 * Defines an authorizationToken
 */
export interface AuthorizationToken {
    value: string;
    username: string;
    useLaps: boolean;
    lapsLocalAdminName: string;
}
/**
 * The create authorization token options
 */
export interface CreateAuthorizationTokenOptions {
    password?: string;
    username?: string;
    useLaps?: boolean;
    lapsLocalAdminName?: string;
}
/**
 * Defines a handler that takes a nodeName and returns authorization credentials
 */
export interface NodeAuthorizationHandler {
    (nodeName?: string | string[]): Observable<AuthorizationCredentials>;
}
/**
 * Defines properties that will be provided to child instances on a forward init request
 */
export interface AuthorizationManagerInitProperties {
    manageAsToken: AuthorizationToken;
    nodeTokens: MsftSme.StringMap<AuthorizationToken>;
    nodePowershellEndpoints: MsftSme.StringMap<string>;
}
/**
 * Authorization Manager class. Handles SME authentication for service requests.
 */
export declare class AuthorizationManager extends RpcServiceForwarder {
    private authorize;
    /**
     * If no laps local admin name is defined, it will default to 'administrator'
     */
    static defaultLapsLocalAdminName: string;
    private static rpcCommands;
    /**
     * Create a map of nodeNames to token objects to hold node specific tokens.
     */
    nodeTokens: MsftSme.StringMap<AuthorizationToken>;
    /**
     * The backing store fro the manageAsToken
     */
    private token;
    /**
     * The JSON Web Key. Single string with JSON.stringify format.
     */
    private jwk;
    /**
     * The mapping of connections to PowershellEndpoints
     */
    private nodePowershellEndpoints;
    /**
     * The token awaiter subject.
     */
    private tokenAwaiter;
    /**
     * Gets the current manage as token
     */
    /**
     * Sets the current manage as token
     * If running with an Rpc child, notify of the change
     */
    manageAsToken: AuthorizationToken;
    /**
     * Sets the gateway encryption certificate JWK.
     * If this is not set by Shell/Add-Connection, it will send clear text password.
     */
    gatewayJwk: string;
    /**
     * Gets an observable the emits when the authorization token is ready
     */
    readonly authAwaiter: Observable<AuthorizationTokenResponse>;
    /**
     * Initializes a new instance of the Authorization Manager class
     * @param authorize An AuthorizationHandler with which to retrieve user credentials
     * @param rpc The rpc to forward auth requests to a parent window
     */
    constructor(authorize: NodeAuthorizationHandler, rpc: Rpc);
    /**
     * defines the conditions under which the AuthorizationManager can handle an ajax error
     */
    canHandleAjaxFailure(code: HttpStatusCode, error: AjaxError): boolean;
    /**
     * When canHandle returns true for an ajax error, this method can be called to handle that error.
     */
    handleAjaxFailure(code: HttpStatusCode, request: AjaxRequest, error: AjaxError, nodeName?: string): Observable<AjaxRequest>;
    saveJeaContext(nodeName: string, endpoint: string): void;
    getJeaEndpoint(nodeName: string): string;
    /**
     * Calls the authorize method and gets a new token.
     * If running as a child, the token comes from the parent windows service
     */
    getNewToken(nodeName?: string): Observable<AuthorizationTokenResponse>;
    getNewToken(nodeNames?: string[]): Observable<AuthorizationTokenResponse>;
    /**
     * @deprecated use createSecureToke() after configured gatewayJwk property.
     *
     * Creates a token from the given options that may be used for node authentication
     * @param options The token creation options
     */
    createToken(options: CreateAuthorizationTokenOptions): AuthorizationToken;
    /**
     * Creates a secure token from the given options that may be used for node authentication
     *
     * @param options The token creation options
     */
    createSecureToken(options: CreateAuthorizationTokenOptions): Observable<AuthorizationToken>;
    /**
     * Creates a secure token from the given options that may be used for node authentication
     *
     * @param options The token creation options
     */
    private secureToken(options);
    /**
     * Completes the token awaiter
     */
    private completeTokenAwaiter(result, error?);
    /**
     * Get the saved Auth token for a node.
     *
     * @param nodeName The nodeName to get token for.
     */
    getSavedNodeToken(nodeName: string): AuthorizationToken;
    /**
     * Adds a authorization header to a request given a node with a manageAsToken
     * @param request The request to add headers to
     * @param nodeName optional. The node to add headers for if not provided, the global token will be used
     * @param token optional. The token to use for the headers. if provided, the nodeName is not used.
     */
    addAuthorizationRequestHeader(request: AjaxRequest, nodeName?: string, token?: AuthorizationToken): void;
    /**
     * Create token headers.
     *
     * @param nodeName the node name.
     * @param token the token to override current setting (optional).
     */
    createTokenHeaders(nodeName: string, token?: AuthorizationToken): MsftSme.StringMap<string>;
    /**
     * Adds a authorization header to a request given a node with a manageAsToken
     */
    addAuthorizationTokensToMultiPartBody(body: string[], nodeName?: string, token?: AuthorizationToken): void;
    /**
     * Called on a child service instance when onForwardInit returns from the parent
     * @param data The response from the forwardInit call
     */
    protected onForwardInitResponse(data: RpcForwardResponse<AuthorizationManagerInitProperties>): void;
    /**
     * Called when a new instance of the service in another window is initialized and needs to synchronize with its parent
     * @param from The RpcRelationshipType that this request is from
     * @returns an observable for the all the values needed to initialize the service
     */
    protected onForwardInit(): Observable<AuthorizationManagerInitProperties>;
    /**
     * Called when the forwarded services counterpart wants to get data from the parent
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the method to forward to
     * @param args The arguments of the method
     * @returns an observable for the result of the method call
     */
    protected onForwardExecute(from: RpcRelationshipType, name: string, args: any[]): Observable<any>;
    /**
     * Called when the forwarded services counterpart sends a notify message
     * @param from The RpcRelationshipType that this request is from
     * @param name The name of the property to change
     * @param value The new value of the property
     * @returns an observable that completes when the property has been changed.
     */
    protected onForwardNotify(from: RpcRelationshipType, name: string, value: any): Observable<void>;
}
