import { Observable } from 'rxjs';
import { AuthorizationManager, AuthorizationToken } from '../security/authorization-manager';
import { GatewayConnection, GatewayRequest } from './gateway-connection';
import { PowerShellCommand } from './powershell';
/**
 * Node Cim output type.
 */
export declare enum NodeCimOutput {
    /**
     * Single instance.
     */
    Single = 0,
    /**
     * Multiple instances.
     */
    Multiple = 1,
    /**
     * Invoke result.
     */
    Result = 2,
    /**
     * WQL query result.
     */
    Query = 3,
}
/**
 * Node Request options that we use to extend the GatewayRequest interface
 */
export interface NodeRequestOptions {
    /**
     * Indicates that no auth failure handling should take place, however, any auth headers for this node will still be added.
     */
    noAuth?: boolean;
    /**
     * Provides an alternative token to use for just this request
     */
    authToken?: AuthorizationToken;
    /**
     * Indicates that audit logging for this request should be made. Default is false.
     */
    logAudit?: boolean;
    /**
     * Indicates that telemetry logging for this request should be made. Default is false.
     */
    logTelemetry?: boolean;
    /**
     * Indicates targeting to specific PowerShell endpoint.
     * The endpoint data is inserted to the endpoint header.
     */
    powerShellEndpoint?: string;
    /**
     * The PowerShell command resource on JEA PowerShell endpoint.
     * The command object is used for auto fallback time on a CIM query.
     * (Only CIM query uses this property)
     */
    powerShell?: PowerShellCommand;
    /**
     * The parameters for instance query powershell alternative.
     * (Only CIM query uses this property)
     */
    powerShellParameters?: any;
    /**
     * The PowerShell context to replace CIM call.
     * (Only CIM query uses this property)
     */
    powerShellContext?: {
        /**
         * CIM output data type.
         */
        cimOutput: NodeCimOutput;
        /**
         * CIM input parameters.
         */
        parameters?: any;
    };
}
/**
 * Extension of GatewayRequest interface for calling the Gateway Node API
 */
export interface NodeRequest extends GatewayRequest, NodeRequestOptions {
}
/**
 * The Node Connection class for creating requests and calling the Gateway's Node API
 */
export declare class NodeConnection {
    private gateway;
    private authorizationManager;
    /**
     * Initializes a new instance of the GatewayService class.
     *
     * @param gateway the gateway Connection
     * @param authorizationManager the authorization manager.
     */
    constructor(gateway: GatewayConnection, authorizationManager: AuthorizationManager);
    /**
     * Makes a POST call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    post(nodeName: string, relativeUrl: string, body?: any, request?: NodeRequest): Observable<any>;
    /**
     * Makes a GET call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param request the node request object.
     */
    get(nodeName: string, relativeUrl: string, request?: NodeRequest): Observable<any>;
    /**
     * Makes a PUT call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    put(nodeName: string, relativeUrl: string, body?: string, request?: NodeRequest): Observable<any>;
    /**
     * Makes a PATCH call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    patch(nodeName: string, relativeUrl: string, body?: string, request?: NodeRequest): Observable<any>;
    /**
     * Makes a DELETE call to the gateway node api
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object.
     */
    delete(nodeName: string, relativeUrl: string, body?: string, request?: NodeRequest): Observable<any>;
    /**
     * Makes a DELETE call to the gateway node api without waiting for the response.
     *
     * @param nodeName the name of the node to call the API for
     * @param relativeUrl the relative Url after "/api/nodes/<nodeName>"
     * @param request the node request object.
     */
    deleteQuick(nodeName: string, relativeUrl: string, request?: NodeRequest): void;
    /**
     * Persists the JEA powershell endpoint context
     * @param nodeName The node name
     * @param endpoint The powershell endpoint
     */
    saveJeaContext(nodeName: string, endpoint: string): void;
    /**
     * Gets the JEA powershell endpoint, if it exists
     * @param nodeName The node name
     */
    getJeaEndpoint(nodeName: string): string;
    /**
     * Adds default parameters to a NodeRequest
     *
     * @param method the http method to use
     * @param relativeUrl the relative Url after "/api/"
     * @param body the body string JSON.stringfy'ed
     * @param request the node request object to extend.
     */
    private createNodeRequest(request, nodeName);
    /**
     * Creates a Node url
     *
     * @param nodeName the name of the node to make a call against
     * @param relativeUrl the relative Url after "/nodes/<nodeName>/"
     */
    getNodeUrl(nodeName: string, relativeUrl: string): string;
}
