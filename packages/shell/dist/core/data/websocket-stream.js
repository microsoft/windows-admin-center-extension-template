import { Observable, ReplaySubject } from 'rxjs';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { headerConstants } from './http-constants';
import { Net } from './net';
/**
 * The state of Websocket connection.
 */
export var WebsocketStreamConnectionState;
(function (WebsocketStreamConnectionState) {
    /**
     * Initializing.
     */
    WebsocketStreamConnectionState[WebsocketStreamConnectionState["Initializing"] = 1] = "Initializing";
    /**
     * Connected.
     */
    WebsocketStreamConnectionState[WebsocketStreamConnectionState["Connected"] = 2] = "Connected";
    /**
     * Disconnected.
     */
    WebsocketStreamConnectionState[WebsocketStreamConnectionState["Disconnected"] = 3] = "Disconnected";
    /**
     * Failed.
     */
    WebsocketStreamConnectionState[WebsocketStreamConnectionState["Failed"] = 4] = "Failed";
    /**
     * Not configured.
     */
    WebsocketStreamConnectionState[WebsocketStreamConnectionState["NotConfigured"] = 5] = "NotConfigured";
})(WebsocketStreamConnectionState || (WebsocketStreamConnectionState = {}));
/**
 * The state of Websocket stream packet.
 */
export var WebsocketStreamState;
(function (WebsocketStreamState) {
    /**
     * Empty packet.
     */
    WebsocketStreamState[WebsocketStreamState["Noop"] = 1] = "Noop";
    /**
     * Data packet.
     */
    WebsocketStreamState[WebsocketStreamState["Data"] = 2] = "Data";
    /**
     * Error packet. (reserved for socket level error communication if any)
     */
    WebsocketStreamState[WebsocketStreamState["Error"] = 3] = "Error";
})(WebsocketStreamState || (WebsocketStreamState = {}));
/**
 * The request state of data such as CIM and PowerShell stream.
 */
export var WebsocketStreamDataRequestState;
(function (WebsocketStreamDataRequestState) {
    /**
     * empty packet.
     */
    WebsocketStreamDataRequestState[WebsocketStreamDataRequestState["Noop"] = 1] = "Noop";
    /**
     * Data packet.
     */
    WebsocketStreamDataRequestState[WebsocketStreamDataRequestState["Normal"] = 2] = "Normal";
    /**
     * Cancel
     */
    WebsocketStreamDataRequestState[WebsocketStreamDataRequestState["Cancel"] = 3] = "Cancel";
})(WebsocketStreamDataRequestState || (WebsocketStreamDataRequestState = {}));
/**
 * The response state of data such as CIM and PowerShell stream.
 */
export var WebsocketStreamDataState;
(function (WebsocketStreamDataState) {
    /**
     * empty packet.
     */
    WebsocketStreamDataState[WebsocketStreamDataState["Noop"] = 1] = "Noop";
    /**
     * Completed packet.
     */
    WebsocketStreamDataState[WebsocketStreamDataState["Completed"] = 2] = "Completed";
    /**
     * Data packet.
     */
    WebsocketStreamDataState[WebsocketStreamDataState["Data"] = 3] = "Data";
    /**
     * Error
     */
    WebsocketStreamDataState[WebsocketStreamDataState["Error"] = 4] = "Error";
    /**
     * Cancelled
     */
    WebsocketStreamDataState[WebsocketStreamDataState["Cancelled"] = 5] = "Cancelled";
})(WebsocketStreamDataState || (WebsocketStreamDataState = {}));
/**
 * Websocket Stream Processor class.
 */
var WebsocketStreamProcessor = /** @class */ (function () {
    /**
     * Initializes a new instance of the CimProcessor class.
     * @param observer Observer to send back result to caller.
     * @param target Stream Target object.
     * @param options Options for Cim stream query.
     */
    function WebsocketStreamProcessor(observer, target, options) {
        this.observer = observer;
        this.target = target;
        this.options = options;
    }
    /**
     * Push the result to the observer.
     * @param result the result of TData.
     */
    WebsocketStreamProcessor.prototype.next = function (result) {
        if (this.observer && !this.observer.closed) {
            this.observer.next(result);
        }
        this.sendOnce = true;
    };
    /**
     * Complete the observer.
     */
    WebsocketStreamProcessor.prototype.complete = function () {
        this.closing = true;
        if (this.observer && !this.observer.closed) {
            this.observer.complete();
        }
        this.closed = true;
    };
    /**
     * Error the observer.
     */
    WebsocketStreamProcessor.prototype.error = function (error) {
        this.closing = true;
        if (this.observer && !this.observer.closed) {
            this.observer.error(error);
        }
        this.closed = true;
    };
    return WebsocketStreamProcessor;
}());
export { WebsocketStreamProcessor };
/**
 * The Websocket stream class.
 */
var WebsocketStream = /** @class */ (function () {
    /**
     * Initializes a new instance of the WebsocketStream class.
     *
     * @param gateway the gateway connection object.
     */
    function WebsocketStream(gateway) {
        var _this = this;
        this.gateway = gateway;
        this.socketStateRaw = WebsocketStreamConnectionState.Disconnected;
        this.socketState = new ReplaySubject();
        this.connectionRetries = WebsocketStream.maxConnectionRetries;
        this.handlers = new Map();
        this.strings = MsftSme.resourcesStrings().MsftSmeShell.Core.WebsocketStream;
        // initialize only after gateway data was populated via RPC.
        this.gateway.initialize().subscribe(function () {
            // enable websocket stream only when the module added the options at initialization.
            var global = window;
            if (global.MsftSme.Init.websocket) {
                _this.initialize(true);
            }
            else {
                _this.socketState.next(WebsocketStreamConnectionState.NotConfigured);
                _this.socketStateRaw = WebsocketStreamConnectionState.NotConfigured;
            }
        });
    }
    /**
     * Register the processor for the stream name.
     * @param name the name of stream.
     * @param handler the handler to process packet.
     */
    WebsocketStream.prototype.registerProcessor = function (name, handler) {
        this.handlers.set(name, handler);
    };
    /**
     * Send next stream data to websocket.
     *
     * @param streamName the stream name.
     * @param data the data to send.
     * @param options the options.
     */
    WebsocketStream.prototype.sendNext = function (streamName, data, options) {
        if (!this.socket) {
            throw new Error('WebsocketStream: socket is not ready.');
        }
        var packet = { streamName: streamName, state: WebsocketStreamState.Data, data: data, options: options };
        this.debugLog('Socket sending data.', packet);
        this.socket.next(JSON.stringify(packet));
    };
    /**
     * Send error stream data to websocket.
     *
     * @param streamName the stream name.
     * @param error the error to send.
     * @param options the options.
     */
    WebsocketStream.prototype.sendError = function (streamName, error, options) {
        if (!this.socket) {
            throw new Error('WebsocketStream: socket is not ready.');
        }
        var packet = { streamName: streamName, state: WebsocketStreamState.Error, data: error, options: options };
        this.debugLog('Socket sending error.', packet);
        this.socket.next(JSON.stringify(packet));
    };
    /**
     * Get target data.
     * @param authorizationManager the authorization manager.
     * @param nodeName the node Name
     * @param endpoint the endpoint data.
     * @return  WebsocketStreamDataTarget target data.
     */
    WebsocketStream.prototype.getTarget = function (authorizationManager, nodeName, endpoint) {
        var headers = authorizationManager.createTokenHeaders(nodeName);
        if (endpoint) {
            headers[headerConstants.POWERSHELL_ENDPOINT] = endpoint;
        }
        var target = { nodeName: nodeName, headers: headers };
        return target;
    };
    WebsocketStream.prototype.initialize = function (firstTime) {
        var _this = this;
        // get gateway socket url.
        var gatewaySocketUrl = this.gateway.gatewayUrl.replace('http', 'ws');
        var moduleName = window.MsftSme.Init.moduleName;
        var url = Net.streamSocket.format(gatewaySocketUrl, moduleName);
        this.debugLog('Socket initializing...: {0}'.format(url));
        if (!firstTime) {
            this.handlers.forEach(function (value) { return value.reset(); });
        }
        // create stream socket.
        this.socketState.next(WebsocketStreamConnectionState.Initializing);
        this.socket = Observable.webSocket({
            url: url,
            openObserver: {
                next: function (openEvent) {
                    _this.debugLog('Socket opened: {0}'.format(url));
                    _this.socketState.next(WebsocketStreamConnectionState.Connected);
                    _this.socketStateRaw = WebsocketStreamConnectionState.Connected;
                    _this.connectionRetries = WebsocketStream.maxConnectionRetries;
                }
            },
            closeObserver: {
                next: function (closeEvent) {
                    _this.debugLog('Socket closed: {0}'.format(url));
                    _this.socketState.next(WebsocketStreamConnectionState.Disconnected);
                    _this.socketStateRaw = WebsocketStreamConnectionState.Disconnected;
                    _this.reconnect(new Error(_this.strings.Common.ConnectionRetiesError.message));
                }
            }
        });
        this.socket.subscribe(function (received) {
            var message = received;
            _this.debugLog('Socket received data.', message);
            if (message.state === WebsocketStreamState.Data) {
                var handler = _this.handlers.get(message.streamName);
                if (handler) {
                    handler.process(message.data);
                }
                else {
                    throw new Error(_this.strings.Common.HandlerRegistrationError.message.format(message.streamName));
                }
            }
            else if (message.state === WebsocketStreamState.Error) {
                var errorMessage = _this.strings.Common.CommunicationError.message;
                if (message.data && message.data.error && message.data.error.message) {
                    errorMessage = _this.strings.Common.CommunicationErrorDetail.message.format(message.data.error.message);
                }
                Logging.log({ level: LogLevel.Error, source: 'WebsocketStream', message: errorMessage });
                _this.reconnect(new Error(errorMessage));
            }
        }, function (error) { return _this.reconnect(error); });
    };
    WebsocketStream.prototype.dispose = function () {
        if (this.socket) {
            this.socket.unsubscribe();
            this.socket = null;
        }
    };
    WebsocketStream.prototype.reconnect = function (error) {
        var _this = this;
        if (this.connectionRetries-- > 0) {
            this.dispose();
            setTimeout(function () { return _this.initialize(false); }, WebsocketStream.reconnectWaitTime);
        }
        else {
            this.socketState.next(WebsocketStreamConnectionState.Failed);
            throw error;
        }
    };
    WebsocketStream.prototype.debugLog = function (message, object) {
        Logging.log({ level: LogLevel.Debug, source: 'WebsocketStream', message: message });
        if (object) {
            Logging.debug(object);
        }
    };
    WebsocketStream.maxConnectionRetries = 10;
    WebsocketStream.reconnectWaitTime = 500;
    return WebsocketStream;
}());
export { WebsocketStream };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS93ZWJzb2NrZXQtc3RyZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQVksYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRzNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHakQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFFNUI7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSw4QkF5Qlg7QUF6QkQsV0FBWSw4QkFBOEI7SUFDdEM7O09BRUc7SUFDSCxtR0FBZ0IsQ0FBQTtJQUVoQjs7T0FFRztJQUNILDZGQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILG1HQUFZLENBQUE7SUFFWjs7T0FFRztJQUNILHVGQUFNLENBQUE7SUFFTjs7T0FFRztJQUNILHFHQUFhLENBQUE7QUFDakIsQ0FBQyxFQXpCVyw4QkFBOEIsS0FBOUIsOEJBQThCLFFBeUJ6QztBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksb0JBZVg7QUFmRCxXQUFZLG9CQUFvQjtJQUM1Qjs7T0FFRztJQUNILCtEQUFRLENBQUE7SUFFUjs7T0FFRztJQUNILCtEQUFJLENBQUE7SUFFSjs7T0FFRztJQUNILGlFQUFLLENBQUE7QUFDVCxDQUFDLEVBZlcsb0JBQW9CLEtBQXBCLG9CQUFvQixRQWUvQjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksK0JBZVg7QUFmRCxXQUFZLCtCQUErQjtJQUN2Qzs7T0FFRztJQUNILHFGQUFRLENBQUE7SUFFUjs7T0FFRztJQUNILHlGQUFNLENBQUE7SUFFTjs7T0FFRztJQUNILHlGQUFNLENBQUE7QUFDVixDQUFDLEVBZlcsK0JBQStCLEtBQS9CLCtCQUErQixRQWUxQztBQUVEOztH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Q0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNHLENBQUM7Z0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFDekYsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDLEVBQ0QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVPLGlDQUFPLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztJQUNMLENBQUM7SUFFTyxtQ0FBUyxHQUFqQixVQUFrQixLQUFVO1FBQTVCLGlCQVFDO1FBUEcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQXRCLENBQXNCLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0QsTUFBTSxLQUFLLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7SUFFTyxrQ0FBUSxHQUFoQixVQUFpQixPQUFlLEVBQUUsTUFBWTtRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3BGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0lBdEtjLG9DQUFvQixHQUFHLEVBQUUsQ0FBQztJQUMxQixpQ0FBaUIsR0FBRyxHQUFHLENBQUM7SUFzSzNDLHNCQUFDO0NBeEtELEFBd0tDLElBQUE7U0F4S1ksZUFBZSIsImZpbGUiOiJ3ZWJzb2NrZXQtc3RyZWFtLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==