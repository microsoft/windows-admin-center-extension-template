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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { PowerShell } from './powershell';
import { WebsocketStreamConnectionState, WebsocketStreamDataRequestState, WebsocketStreamDataState, WebsocketStreamProcessor } from './websocket-stream';
/**
 * PowerShell Processor interface.
 */
var PowerShellProcessor = /** @class */ (function (_super) {
    __extends(PowerShellProcessor, _super);
    function PowerShellProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PowerShellProcessor;
}(WebsocketStreamProcessor));
/**
 * The PowerShell stream class.
 */
var PowerShellStream = /** @class */ (function () {
    /**
     * Initializes a new instance of the PowerShellStream class.
     *
     * @param websocketStream the websocket stream object.
     * @param authorizationManager the authorization manager object.
     */
    function PowerShellStream(websocketStream, authorizationManager) {
        this.websocketStream = websocketStream;
        this.authorizationManager = authorizationManager;
        this.processors = new Map();
        this.queues = new Map();
        this.strings = MsftSme.resourcesStrings().MsftSmeShell.Core.WebsocketStream.PowerShellStream;
        websocketStream.registerProcessor('SME-PowerShell', this);
    }
    /**
     * PowerShell script run.
     *
     * @param nodeName the node name.
     * @param script the script to run.
     * @param options the options for this request.
     * @return Observable<PowerShellResult> the query observable.
     */
    PowerShellStream.prototype.run = function (nodeName, commandOrScript, options) {
        var command = PowerShell.getPowerShellCommand(commandOrScript);
        return this.createRequest(nodeName, command, PowerShell.newEndpointOptions(options));
    };
    /**
     * Cancel active powershell script.
     * Result response comes back to the original query to end.
     *
     * @param nodeName the node name.
     * @param id the id of original request specified as options.queryId.
     */
    PowerShellStream.prototype.cancel = function (nodeName, id, options) {
        var target = this.getTarget(nodeName, PowerShell.newEndpointOptions(options));
        var requestState = WebsocketStreamDataRequestState.Cancel;
        var request = { id: id, target: target, requestState: requestState, script: null };
        // remove from queue if not submitted yet.
        var queue = this.queues.get(target.nodeName);
        if (queue) {
            var pendingRequest = queue.pendingRequests.find(function (entry) { return entry.id === id; });
            if (pendingRequest) {
                queue.pendingRequests.remove(pendingRequest);
                queue.outstandingCount--;
                var processor = this.processors.get(id);
                this.processors.delete(id);
                processor.complete();
                return;
            }
        }
        this.websocketStream.sendNext('SME-PowerShell', request);
    };
    /**
     * Reset data for connection cleanup.
     */
    PowerShellStream.prototype.reset = function () {
        var _this = this;
        Logging.log({ level: LogLevel.Warning, message: this.strings.ResetError.message, source: 'PowerShellStream' });
        var processors = [];
        this.processors.forEach(function (value, key, map) { return processors.push(value); });
        this.processors.clear();
        processors.forEach(function (processor, key, map) {
            processor.error(new Error(_this.strings.ResetError.message));
        });
    };
    /**
     * Process the socket message.
     *
     * @param message the socket message.
     */
    PowerShellStream.prototype.process = function (message) {
        if (!message) {
            throw new Error(this.strings.NoContentError.message);
        }
        var processor = this.processors.get(message.id);
        if (!processor) {
            Logging.log({ level: LogLevel.Warning, message: this.strings.UnexpectedReceivedError.message, source: 'PowerShellStream' });
            return;
        }
        switch (message.state) {
            case WebsocketStreamDataState.Data:
                this.operationNext(processor, message.response);
                break;
            case WebsocketStreamDataState.Completed:
                this.operationComplete(processor, message.response);
                this.operationEnd(message.id);
                break;
            case WebsocketStreamDataState.Error:
                this.operationError(processor, { xhr: message });
                this.operationEnd(message.id);
                break;
            case WebsocketStreamDataState.Noop:
                break;
        }
    };
    /**
     * Gets the JEA powershell endpoint, if it exists
     *
     * @param nodeName The node name
     */
    PowerShellStream.prototype.getJeaEndpoint = function (nodeName) {
        return this.authorizationManager.getJeaEndpoint(nodeName);
    };
    PowerShellStream.prototype.operationNext = function (processor, response) {
        var partial = processor.options && processor.options.partial;
        // buffering result.
        if (!partial) {
            if (!processor.response) {
                processor.response = response;
            }
            else {
                if (response.errors) {
                    if (!processor.response.errors) {
                        processor.response.errors = response.errors;
                    }
                    else {
                        response.errors.forEach(function (value) { return processor.response.errors.push(value); });
                    }
                }
                if (response.progress) {
                    if (!processor.response.progress) {
                        processor.response.progress = response.progress;
                    }
                    else {
                        response.progress.forEach(function (value) { return processor.response.progress.push(value); });
                    }
                }
                if (response.results) {
                    if (!processor.response.results) {
                        processor.response.results = response.results;
                    }
                    else {
                        response.results.forEach(function (value) { return processor.response.results.push(value); });
                    }
                }
            }
        }
        else {
            processor.next(response);
        }
        return !partial;
    };
    PowerShellStream.prototype.operationComplete = function (processor, response) {
        if (this.operationNext(processor, response)) {
            processor.next(processor.response);
        }
        processor.complete();
    };
    PowerShellStream.prototype.operationError = function (processor, error) {
        processor.error(error);
    };
    PowerShellStream.prototype.operationEnd = function (id) {
        var processor = this.processors.get(id);
        this.processors.delete(id);
        var queue = this.queues.get(processor.target.nodeName);
        if (--queue.outstandingCount === 0) {
            this.queues.delete(processor.target.nodeName);
        }
        if (queue.pendingRequests.length > 0) {
            // if there is queued item, then send request.
            var request = queue.pendingRequests.shift();
            this.websocketStream.sendNext('SME-PowerShell', request);
        }
    };
    PowerShellStream.prototype.createRequest = function (nodeName, command, options) {
        var _this = this;
        // publish object is created two ways.
        // 1) socket is connected so submit the request immediately with simple observable.
        //   (if-block and this is the most of cases.)
        // 2) socket is not connected so wait for the socket to ready and submit request with
        //    complex observable. Initial connect and re-connection takes this observable.
        //   (else-block and this is a few cases.)
        var publish;
        var endpoint = this.authorizationManager.getJeaEndpoint(nodeName);
        var newOptions = __assign({}, (options || {}));
        if (endpoint) {
            newOptions.powerShellEndpoint = endpoint;
        }
        if (this.websocketStream.socketStateRaw === WebsocketStreamConnectionState.Connected) {
            publish = this.createRequestSimple(nodeName, command, newOptions);
        }
        else {
            publish = this.websocketStream.socketState
                .filter(function (state) { return state === WebsocketStreamConnectionState.Connected
                || state === WebsocketStreamConnectionState.Failed
                || state === WebsocketStreamConnectionState.NotConfigured; })
                .take(1)
                .flatMap(function (state) {
                if (state === WebsocketStreamConnectionState.Connected) {
                    return _this.createRequestSimple(nodeName, command, newOptions);
                }
                return Observable.throw(new Error(_this.strings.ConnectionError.message));
            });
        }
        return publish
            .catch(function (error, caught) {
            // retry if reset connection of socket was observed.
            if (error && error.message === _this.strings.ResetError.message) {
                return _this.createRequest(nodeName, command, newOptions);
            }
            return Observable.throw(error);
        });
    };
    PowerShellStream.prototype.createRequestSimple = function (nodeName, command, options) {
        var _this = this;
        return Observable.create(function (observer) {
            var target = _this.getTarget(nodeName, options);
            var requestState = WebsocketStreamDataRequestState.Normal;
            var id = _this.sendRequest(observer, target, requestState, command, options);
            return function () {
                var processor = _this.processors.get(id);
                if (processor) {
                    processor.end = true;
                    if (!processor.closed && !processor.closing) {
                        _this.cancel(processor.target.nodeName, id);
                    }
                }
            };
        });
    };
    PowerShellStream.prototype.sendRequest = function (observer, target, requestState, command, options) {
        var id = (options && options.queryId) || MsftSme.getUniqueId();
        var request = __assign({
            id: id,
            target: target,
            requestState: requestState
        }, command);
        var processor = new PowerShellProcessor(observer, target, options);
        var queue = this.queues.get(target.nodeName);
        this.processors.set(id, processor);
        // During a send request, if caller provides 'options.close' as true,
        // we shouldn't manage the request via a queue and on Gateway, we should create a 
        // new, one time use Runspace, which is disposed after use, instead of using one from the pool. 
        // As currently this is not handled on Gateway, just ignore the 'options.close' for now.
        /*
        if (options && options.close) {
            // disposing session.
            this.websocketStream.sendNext('SME-PowerShell', request);
            return id;
        }
        */
        if (++queue.outstandingCount > PowerShellStream.maxRunPerNode) {
            queue.pendingRequests.push(request);
            return id;
        }
        this.websocketStream.sendNext('SME-PowerShell', request);
        return id;
    };
    PowerShellStream.prototype.getTarget = function (nodeName, options) {
        if (!this.queues.has(nodeName)) {
            var queue = { outstandingCount: 0, pendingRequests: [] };
            this.queues.set(nodeName, queue);
        }
        return this.websocketStream.getTarget(this.authorizationManager, nodeName, options.powerShellEndpoint);
    };
    PowerShellStream.maxRunPerNode = 5;
    return PowerShellStream;
}());
export { PowerShellStream };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9wb3dlcnNoZWxsLXN0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBRTVDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFJakQsT0FBTyxFQUFFLFVBQVUsRUFBcUIsTUFBTSxjQUFjLENBQUM7QUFDN0QsT0FBTyxFQUVILDhCQUE4QixFQUM5QiwrQkFBK0IsRUFDL0Isd0JBQXdCLEVBSXhCLHdCQUF3QixFQUUzQixNQUFNLG9CQUFvQixDQUFDO0FBMEk1Qjs7R0FFRztBQUNIO0lBQWtDLHVDQUFtRTtJQUFyRzs7SUFLQSxDQUFDO0lBQUQsMEJBQUM7QUFBRCxDQUxBLEFBS0MsQ0FMaUMsd0JBQXdCLEdBS3pEO0FBaUJEOztHQUVHO0FBQ0g7SUFNSTs7Ozs7T0FLRztJQUNILDBCQUFvQixlQUFnQyxFQUFVLG9CQUEwQztRQUFwRixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBVSx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBVmhHLGVBQVUsR0FBOEMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNsRSxXQUFNLEdBQXNELElBQUksR0FBRyxFQUFFLENBQUM7UUFDdEUsWUFBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDO1FBU3JHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLDhCQUFHLEdBQVYsVUFDUSxRQUFnQixFQUNoQixlQUEyQyxFQUMzQyxPQUFpQztRQUNyQyxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMs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QUFFLE9BQWdDO1FBQ2hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQU0sS0FBSyxHQUEwQixFQUFFLGdCQUFnQixFQUFFLENBQUMsRUFBRSxlQUFlLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDbEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBeFNjLDhCQUFhLEdBQUcsQ0FBQyxDQUFDO0lBeVNyQyx1QkFBQztDQTFTRCxBQTBTQyxJQUFBO1NBMVNZLGdCQUFnQiIsImZpbGUiOiJwb3dlcnNoZWxsLXN0cmVhbS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=