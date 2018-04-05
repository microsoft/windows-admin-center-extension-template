import { Observable } from 'rxjs';
import { Rpc } from '../rpc/rpc';
import { RpcDialogConfirmationListRequest, RpcDialogConfirmationRequest, RpcDialogConfirmationResponse, RpcDialogMessageRequest, RpcDialogMessageResponse } from '../rpc/rpc-dialogs';
/**
 * Frame connection class.
 */
export declare class FrameConnection {
    private rpc;
    activeRpcDialogsOrigins: Map<string, HTMLElement>;
    /**
     * Initializes a new instance of the FrameConnection class.
     *
     * @param rpc the RPC object.
     */
    constructor(rpc: Rpc);
    /**
     * Open a message dialog and wait for completion through RPC.
     * To close the dialog before user input, unsubscribe the observable.
     *
     * @param request the request object of rpc based dialog message.
     */
    showDialogMessage(request: RpcDialogMessageRequest): Observable<RpcDialogMessageResponse>;
    /**
     * Open a confirmation dialog and wait for completion through RPC.
     * To close the dialog before user input, unsubscribe the observable.
     *
     * @param request the request object of rpc based dialog confirmation.
     */
    showDialogConfirmation(request: RpcDialogConfirmationRequest): Observable<RpcDialogConfirmationResponse>;
    /**
     * Open a confirmation list dialog and wait for completion through RPC.
     * To close the dialog before user input, unsubscribe the observable.
     *
     * @param request the request object of rpc based dialog confirmation list.
     */
    showDialogConfirmationList(request: RpcDialogConfirmationListRequest): Observable<RpcDialogConfirmationResponse>;
    /**
     * Call rpc for overlay command and create an observable
     * @param overlayData true add overlay, false remove
     * @param id id of dialog
     */
    overlayOpen(overlayData: boolean, id: string): Observable<void>;
    /**
     * Open a message dialog and wait for completion through RPC.
     *
     * @param request the request object of rpc based dialog message.
     */
    private showDialog<TRequest, TResult>(request, type);
    private removeActiveDialog(dialogId);
    private openAndLongPolling(data);
    private requestDialog(data);
}
