import { Observable } from 'rxjs';
import { RpcDialogState, RpcDialogType } from '../rpc/rpc-dialogs';
/**
 * Frame connection class.
 */
var FrameConnection = /** @class */ (function () {
    /**
     * Initializes a new instance of the FrameConnection class.
     *
     * @param rpc the RPC object.
     */
    function FrameConnection(rpc) {
        this.rpc = rpc;
        this.activeRpcDialogsOrigins = new Map();
    }
    /**
     * Open a message dialog and wait for completion through RPC.
     * To close the dialog before user input, unsubscribe the observable.
     *
     * @param request the request object of rpc based dialog message.
     */
    FrameConnection.prototype.showDialogMessage = function (request) {
        return this.showDialog(request, RpcDialogType.OpenMessageDialog);
    };
    /**
     * Open a confirmation dialog and wait for completion through RPC.
     * To close the dialog before user input, unsubscribe the observable.
     *
     * @param request the request object of rpc based dialog confirmation.
     */
    FrameConnection.prototype.showDialogConfirmation = function (request) {
        return this.showDialog(request, RpcDialogType.OpenConfirmationDialog);
    };
    /**
     * Open a confirmation list dialog and wait for completion through RPC.
     * To close the dialog before user input, unsubscribe the observable.
     *
     * @param request the request object of rpc based dialog confirmation list.
     */
    FrameConnection.prototype.showDialogConfirmationList = function (request) {
        return this.showDialog(request, RpcDialogType.OpenConfirmationListDialog);
    };
    /**
     * Call rpc for overlay command and create an observable
     * @param overlayData true add overlay, false remove
     * @param id id of dialog
     */
    FrameConnection.prototype.overlayOpen = function (overlayData, id) {
        var data = {
            overlay: overlayData,
            dialogId: id
        };
        return Observable.fromPromise(this.rpc.overlayOpen(data));
    };
    /**
     * Open a message dialog and wait for completion through RPC.
     *
     * @param request the request object of rpc based dialog message.
     */
    FrameConnection.prototype.showDialog = function (request, type) {
        var _this = this;
        var data = {
            dialogId: MsftSme.getUniqueId(),
            type: type,
            request: request
        };
        this.activeRpcDialogsOrigins.set(data.dialogId, document.activeElement);
        return Observable.create(function (observer) {
            var subscription = _this.openAndLongPolling(data)
                .map(function (value) {
                switch (value.state) {
                    case RpcDialogState.Closed:
                        _this.removeActiveDialog(data.dialogId);
                        observer.next(value.response);
                        observer.complete();
                        break;
                    case RpcDialogState.Failed:
                        _this.removeActiveDialog(data.dialogId);
                        observer.error(new Error(value.failedMessage));
                        break;
                    case RpcDialogState.ForcedTerminated:
                        _this.removeActiveDialog(data.dialogId);
                        observer.error(new Error('forced terminated'));
                        break;
                }
            })
                .subscribe();
            return function () {
                if (!subscription.closed) {
                    // sending close request to the shell/dialog if not closed yet.
                    subscription.unsubscribe();
                    data.request = null;
                    data.type = RpcDialogType.Close;
                    _this.rpc.dialog(data);
                    _this.removeActiveDialog(data.dialogId);
                }
            };
        });
    };
    FrameConnection.prototype.removeActiveDialog = function (dialogId) {
        if (this.activeRpcDialogsOrigins.has(dialogId)) {
            var focusOn = this.activeRpcDialogsOrigins.get(dialogId);
            if (focusOn) {
                focusOn.focus();
            }
            this.activeRpcDialogsOrigins.delete(dialogId);
        }
    };
    ;
    FrameConnection.prototype.openAndLongPolling = function (data) {
        var _this = this;
        return this.requestDialog(data)
            .expand(function (result, index) {
            if (result.state === RpcDialogState.Opened) {
                // status polling...
                var newData = {
                    dialogId: data.dialogId,
                    type: RpcDialogType.PollingStatus
                };
                return _this.requestDialog(newData);
            }
            return Observable.empty();
        })
            .filter(function (result) { return result.state !== RpcDialogState.Opened; });
    };
    FrameConnection.prototype.requestDialog = function (data) {
        return Observable.fromPromise(this.rpc.dialog(data));
    };
    return FrameConnection;
}());
export { FrameConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZnJhbWUvZnJhbWUtY29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBSTVDLE9BQU8sRUFTSCxjQUFjLEVBQ2QsYUFBYSxFQUNoQixNQUFNLG9CQUFvQixDQUFDO0FBRTVCOztHQUVHO0FBQ0g7SUFJSTs7OztPQUlHO0lBQ0gseUJBQW9CLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ3hCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSwyQ0FBaUIsR0FBeEIsVUFBeUIsT0FBZ0M7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ2xCLE9BQU8sRUFBRSxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxnREFBc0IsR0FBN0IsVUFBOEIsT0FBcUM7UUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ2xCLE9BQU8sRUFBRSxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxvREFBMEIsR0FBakMsVUFBa0MsT0FBeUM7UUFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ2xCLE9BQU8sRUFBRSxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHFDQUFXLEdBQWxCLFVBQW1CLFdBQW9CLEVBQUUsRUFBVTtRQUMvQyxJQUFNLElBQUksR0FBeUI7WUFDL0IsT0FBTyxFQUFFLFdBQVc7WUFDcEIsUUFBUSxFQUFFLEVBQUU7U0FDZixDQUFDO1FBQ0YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMs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QUM7YUFDMUIsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUs7WUFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDekMsb0JBQW9CO2dCQUNwQixJQUFNLE9BQU8sR0FBa0I7b0JBQzNCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxhQUFhO2lCQUNwQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxLQUFLLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTyx1Q0FBYSxHQUFyQixVQUFzQixJQUFtQjtRQUNyQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBa0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQTFJQSxBQTBJQyxJQUFBIiwiZmlsZSI6ImZyYW1lLWNvbm5lY3Rpb24uanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9