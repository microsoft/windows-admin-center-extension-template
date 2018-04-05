import { Observable } from 'rxjs/Observable';
import { AppContext } from './app-context';
import { BatchConnection, BatchResponseItem } from './batch-connection';
import { NodeConnection, NodeRequestOptions } from './node-connection';
import { PowerShellSession, PowerShellSessionRequestOptions } from './powershell';
import { PowerShellStream } from './powershell-stream';
/**
 * The PowerShell Alternate processing class.
 */
export declare class PowerShellAlternate {
    /**
     * The key of powershell session.
     */
    static readonly cimAlternateKey: string;
    /**
     * Create alternate PowerShell query for CIM query.
     *
     * @param nodeConnection The node connection object.
     * @param nodeName The node name.
     * @param options The node request options.
     * @return Observable<T> if there is no alternate available, return null.
     */
    static create<T>(nodeConnection: NodeConnection, nodeName: string, options: NodeRequestOptions): Observable<T>;
    /**
     * Create alternate PowerShell Stream query for CIM query.
     *
     * @param nodeConnection The node connection object.
     * @param nodeName The node name.
     * @param options The node request options.
     * @return Observable<T> if there is no alternate available, return null.
     */
    static createStream<T>(powerShellStream: PowerShellStream, nodeName: string, options: NodeRequestOptions): Observable<T>;
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
    static createBatch(nodeConnection: NodeConnection, batchConnection: BatchConnection, nodeNames: string[], options: NodeRequestOptions): Observable<BatchResponseItem[]>;
    /**
     * Reserve a session for all alternate CIM non-batch query.
     *
     * @param nodeName the node name.
     * @param nodeConnection the node connection object.
     * @param options the node request options.
     */
    static reserveSession(appContext: AppContext, nodeName: string, options?: PowerShellSessionRequestOptions): PowerShellSession;
    /**
     * Dispose the session for alternate CIM non-batch query.
     *
     * @param session the session object.
     */
    static disposeSession(session: PowerShellSession): void;
    /**
     * Find existing powershell session with the fixed key or create null session.
     *
     * @param nodeName the node name.
     * @param nodeConnection the node connection object.
     * @param options the node request options.
     */
    private static findOrCreateNullPowerShell(nodeName, nodeConnection, options);
    /**
     * Convert the PowerShell results to Cim expected format.
     *
     * @param outputType The output data type.
     * @param data
     */
    private static mapPowerShellToCim(outputType, data);
    /**
     * Adjust PowerShell CIM results data.
     *
     * @param data The result data.
     */
    private static adjustCimResults(data);
    /**
     * Clean the cim instance object to remove schema/qualifier data.
     *
     * @param data The instance object from PowerShell.
     */
    private static cleanCimInstance(data);
}
