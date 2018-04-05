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
import { NativeDeferred } from '../data/native-q';
import { Net } from '../data/net';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { EnvironmentModule } from '../manifest/environment-modules';
import { RpcBase, RpcInboundCommands, RpcMessagePacketType, RpcOutboundCommands, RpcSeekMode, RpcType } from './rpc-base';
import { RpcOutbound } from './rpc-outbound';
/**
 * RpcChannel class.
 * - Both Shell and Module creates one instance to present itself.
 */
var RpcChannel = /** @class */ (function (_super) {
    __extends(RpcChannel, _super);
    /**
     * Initiates a new instance of the RpcChannel class.
     *
     * @param name the public name of itself.
     * @param origin the origin url of itself.
     * @param signature the signature of the gateway running instance.
     */
    function RpcChannel(name, origin, signature) {
        var _this = _super.call(this, null, name, origin, RpcType.Channel) || this;
        // RpcShell/RpcModule collection.
        _this.rpcCollection = new Map();
        _this.sequence = 0;
        _this.deferredQueue = new Map();
        _this.global = window;
        _this.signature = signature;
        _this.rpcMode = name === EnvironmentModule.nameOfShell ? 0 /* Shell */ : 1 /* Module */;
        if (_this.rpcMode === 0 /* Shell */) {
            _this.depth = 0;
        }
        else {
            _this.depth = null;
        }
        return _this;
    }
    Object.defineProperty(RpcChannel.prototype, "rpcInboundHandlers", {
        /**
         * Sets the rpc inbound handlers to use when creating for seek command.
         */
        set: function (handlers) {
            this.inboundHandlers = handlers;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Register Inbound/Outbound.
     *
     * @param rpcObject the RpcInbound/RpcOutbound class instance.
     * @param type the type of rpc object.
     */
    RpcChannel.prototype.registerRpc = function (rpcObject, type) {
        if (rpcObject.type !== type) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTypeNoMatch.message;
            throw new Error(message.format('registerRpc'));
        }
        this.addToCollection(rpcObject);
    };
    /**
     * Unregister module with subNams
     *
     * @param name the name of module.
     * @param subName the subName.
     * @return RpcBase the rpc object.
     */
    RpcChannel.prototype.unregisterRpc = function (name, subName, type) {
        // unregister it by both origin and name.
        var rpcObject = this.getFromCollection(name, subName, true);
        if (rpcObject.type !== type) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTypeNoMatch.message;
            throw new Error(message.format('unregisterRpc'));
        }
        if (rpcObject) {
            this.removeFromCollection(rpcObject);
            return rpcObject;
        }
        else {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcNotFoundModule.message;
            throw new Error(message.format(name, subName));
        }
    };
    /**
     * Get Rpc object by module with subName for Inbound.
     *
     * @param name the name of module.
     * @param subName the subName.
     * @param type the type of rpc object.
     * @return RpcBase the rpc object.
     */
    RpcChannel.prototype.getRpc = function (name, subName, type) {
        var rpcObject = this.getFromCollection(name, subName, true);
        if (rpcObject && rpcObject.type !== type) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTypeNoMatch.message;
            throw new Error(message.format('getRpc'));
        }
        // return null if it cannot find.
        return rpcObject;
    };
    /**
     * Get all Rpc objects for the specified type.
     */
    RpcChannel.prototype.getAllRpc = function (type) {
        var results = [];
        this.rpcCollection.forEach(function (subCollection, key, map) {
            subCollection.forEach(function (rpc, index, array) {
                if (rpc.type === type) {
                    results.push(rpc);
                }
            });
        });
        return results;
    };
    /**
     * Get RpcInbound/RpcOutbound object for module name and module sub name.
     * If it doesn't configure subName yet, it returns it so the channel set it up.
     *
     * @param name the module name.
     * @param subName the sub name of the iframe object.
     * @return RpcBase the matched Rpc object.
     */
    RpcChannel.prototype.getFromCollection = function (name, subName, exact) {
        var subCollection = this.rpcCollection.get(name);
        if (subCollection == null) {
            return null;
        }
        return subCollection.find(function (value) { return (!exact && value.subName == null) || value.subName === subName; });
    };
    RpcChannel.prototype.removeFromCollection = function (rpcObject) {
        var subCollection = this.rpcCollection.get(rpcObject.name);
        if (subCollection == null) {
            return null;
        }
        var results = MsftSme.remove(subCollection, rpcObject);
        if (subCollection.length === 0) {
            // remove the entry if it's empty.
            this.rpcCollection.delete(rpcObject.name);
        }
        if (results && results.length === 1) {
            return results[0];
        }
        return null;
    };
    RpcChannel.prototype.addToCollection = function (rpcObject) {
        var subCollection = this.rpcCollection.get(rpcObject.name);
        if (subCollection == null) {
            subCollection = [rpcObject];
            this.rpcCollection.set(rpcObject.name, subCollection);
        }
        else {
            subCollection.push(rpcObject);
        }
    };
    /**
     * Start the message listener.
     */
    RpcChannel.prototype.start = function () {
        var _this = this;
        this.listnerFunction = function (ev) { return _this.listener(ev); };
        this.global.addEventListener('message', this.listnerFunction);
    };
    /**
     * Stop the message listener.
     */
    RpcChannel.prototype.stop = function () {
        this.global.removeEventListener('message', this.listnerFunction);
    };
    /**
     * Post the message with retry delay.
     *
     * @param target the RpcToModule or RpcToShell object.
     * @param message the message packet.
     * @param count the retry count.
     * @param delay the interval milliseconds.
     * @return Promise<T> the promise object.
     */
    RpcChannel.prototype.retryPost = function (target, message, count, delay) {
        var _this = this;
        if (target == null || target.window == null) {
            var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTargetWindowNotConfigured.message;
            throw new Error(message2);
        }
        var deferred = new NativeDeferred();
        var lastSequence = this.sequence;
        this.deferredQueue[this.sequence] = deferred;
        message.srcName = this.name;
        message.srcSubName = this.subName;
        message.srcDepth = this.depth;
        message.destName = target.name;
        message.destSubName = target.subName;
        message.signature = this.signature;
        message.sequence = this.sequence;
        message.type = RpcMessagePacketType.Request; // post
        this.sequence++;
        var header = "Retry " + RpcMessagePacketType[message.type] + " \"" + message.command + "\" to " + message.destName + "!" + message.destSubName;
        this.debugLogRpcMessage(message, header);
        target.window.postMessage(message, target.origin);
        var timer = setInterval(function () {
            if (deferred.isPending) {
                if (--count < 0) {
                    var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcExpiredRetry.message;
                    clearInterval(timer);
                    deferred.reject(message2.format(message.command));
                    if (_this.deferredQueue[lastSequence]) {
                        delete _this.deferredQueue[lastSequence];
                    }
                    return;
                }
                target.window.postMessage(message, target.origin);
                return;
            }
            clearInterval(timer);
        }, delay);
        return deferred.promise;
    };
    /**
     * Post the request message.
     *
     * @param target the RpcToModule or RpcToShell object.
     * @param message the message packet.
     * @param timeout the timeout. (10 seconds at default)
     * @return Promise<TResult> the promise object.
     */
    RpcChannel.prototype.post = function (target, message, timeout) {
        var _this = this;
        var ignoreTimeout = false;
        if (timeout === -1) {
            ignoreTimeout = true;
            timeout = null;
        }
        timeout = timeout || 10 * 1000; // 10 seconds
        if (target == null || target.window == null) {
            var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTargetWindowNotConfigured.message;
            throw new Error(message2);
        }
        var deferred = new NativeDeferred();
        var lastSequence = this.sequence;
        this.deferredQueue[this.sequence] = deferred;
        message.srcName = this.name;
        message.srcSubName = this.subName;
        message.srcDepth = this.depth;
        message.destName = target.name;
        message.destSubName = target.subName;
        message.signature = this.signature;
        message.sequence = this.sequence;
        message.type = RpcMessagePacketType.Request; // post
        this.sequence++;
        var header = RpcMessagePacketType[message.type] + "  \"" + message.command + "\" to " + message.destName + "!" + message.destSubName;
        this.debugLogRpcMessage(message, header);
        target.window.postMessage(message, target.origin);
        setTimeout(function () {
            if (deferred.isPending) {
                if (ignoreTimeout) {
                    deferred.resolve();
                }
                else {
                    var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcExpired.message;
                    deferred.reject(message2.format(_this.name, _this.subName, target.name, target.subName, message.command, message.type));
                }
            }
            if (_this.deferredQueue[lastSequence]) {
                delete _this.deferredQueue[lastSequence];
            }
        }, timeout);
        return deferred.promise;
    };
    /**
     * Validate the target window if exist by sending null packet.
     *
     * @param target the target Rpc object.
     * @return boolean if false, it remove the target from the list.
     */
    RpcChannel.prototype.validate = function (target) {
        try {
            target.window.postMessage({ validate: 'validate' }, target.origin);
            return true;
        }
        catch (error) {
            this.removeFromCollection(target);
            return false;
        }
    };
    /**
     * Log the debug message.
     * @param message the message object.
     * @param header the header string (used for the log group header).
     */
    RpcChannel.prototype.debugLog = function (message, header) {
        Logging.log({ source: 'rpc', message: message, level: LogLevel.Debug, consoleGroupHeader: header });
    };
    /**
     * Process and log and rpc message.
     * @param message the rpc message packet
     * @param header the header string (used for the log group header).
     */
    RpcChannel.prototype.debugLogRpcMessage = function (message, header) {
        var logMessage = __assign({}, message);
        if (message.command === RpcOutboundCommands[RpcOutboundCommands.Init]) {
            // Why is this hidden?
            logMessage.data = '(hidden...)';
        }
        this.debugLog(logMessage, header);
    };
    /**
     * The listen handler.
     *
     * @param messageEvent the Rpc message event.
     */
    RpcChannel.prototype.listener = function (messageEvent) {
        var _this = this;
        if (!messageEvent.data || !messageEvent.data.command) {
            // ignore null event.
            this.debugLog('listener: {0}'.format(messageEvent));
            return;
        }
        var message = messageEvent.data;
        var header = RpcMessagePacketType[message.type] + " \"" + message.command + "\" from " + message.srcName + "!" + message.srcSubName;
        this.debugLogRpcMessage(message, header);
        if (message.signature !== this.signature) {
            var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcSignatureError.message;
            throw new Error(message2);
        }
        // accept shell seek query
        if (message.destName !== this.name) {
            var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcUnexpectedDestination.message;
            throw new Error(message2.format(message.destName));
        }
        var target = this.getFromCollection(message.srcName, message.srcSubName, false);
        if (!target) {
            // unknown request was received.
            if (message.type === RpcMessagePacketType.Request
                && message.command === RpcOutboundCommands[RpcOutboundCommands.Ping]) {
                target = this.getFromCollection('*', '*', true);
                if (target) {
                    // keep remote window object to respond.
                    // current channel is child, and target is parent.
                    // target could be shell or a parent module.
                    // remove the rpcInbound object once and re-register back again with new name.
                    this.removeFromCollection(target);
                    target.name = message.srcName;
                    target.subName = message.srcSubName;
                    target.window = messageEvent.source;
                    target.origin = messageEvent.origin;
                    target.depth = message.srcDepth;
                    this.subName = message.destSubName;
                    this.depth = message.srcDepth + 1;
                    this.registerRpc(target, RpcType.Inbound);
                }
            }
        }
        // Seek to create or delete RpcInbound on the shell to access a child call.
        if (message.command === RpcInboundCommands[RpcInboundCommands.Seek]
            && this.name === EnvironmentModule.nameOfShell
            && message.type === RpcMessagePacketType.Request) {
            var seekData = message.data;
            if (seekData.mode === RpcSeekMode.Create) {
                if (target) {
                    // update window object.
                    target.subName = message.srcSubName;
                    target.window = messageEvent.source;
                    target.depth = message.srcDepth;
                }
                else {
                    target = new RpcOutbound(this, message.srcName, messageEvent.origin);
                    target.subName = message.srcSubName;
                    target.window = messageEvent.source;
                    target.depth = message.srcDepth;
                    target.registerAll(this.inboundHandlers);
                    this.registerRpc(target, RpcType.Outbound);
                }
            }
            else if (seekData.mode === RpcSeekMode.Delete && target) {
                this.removeFromCollection(target);
            }
        }
        if (!target) {
            // ignore older/unknown response packet. current channel no longer watching it for response, but treat new request as an error.
            if (message.type === RpcMessagePacketType.Request) {
                var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcUnexpectedEvent.message;
                throw new Error(message2.format(message.srcName, message.srcSubName));
            }
            return;
        }
        var deferred;
        switch (message.type) {
            case RpcMessagePacketType.Request:// post: processing response/error.
                target.handle(message.command, message.srcName, message.srcSubName, message.data).then(function (data) {
                    message.data = data;
                    return _this.response(target, message);
                }, function (error) {
                    var logMessage = '';
                    var logStack = '';
                    if (typeof error === 'string') {
                        message.data = error;
                        logMessage = error;
                    }
                    else {
                        message.data = {};
                        if (error && error.xhr) {
                            var netError = Net.getErrorMessage(error);
                            message.data.message = netError;
                            logMessage = netError;
                        }
                        else if (error.message) {
                            message.data.message = error.message;
                            logMessage = error.message;
                        }
                        if (error.stack) {
                            message.data.stack = error.stack;
                            logStack = error.stack;
                        }
                    }
                    Logging.log({
                        source: 'RpcChannel',
                        level: LogLevel.Error,
                        message: logMessage,
                        stack: logStack
                    });
                    // telemetry with predefined view/action name.
                    Logging.trace({
                        view: 'sme-generic-error',
                        instance: 'rpc-channel',
                        action: 'exceptionLog',
                        data: { stack: '' }
                    });
                    return _this.error(target, message);
                });
                break;
            case RpcMessagePacketType.Response:// response: received result with success.
                deferred = this.deferredQueue[message.sequence];
                if (!deferred) {
                    if (message.command === RpcOutboundCommands[RpcOutboundCommands.Ping]) {
                        // ping can be sent multiple times and deferred could be settled already.
                        break;
                    }
                    var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcUnexpectedSequence.message;
                    throw new Error(message2);
                }
                delete this.deferredQueue[message.sequence];
                deferred.resolve(message.data);
                break;
            case RpcMessagePacketType.Error:// error: received result with error.
                deferred = this.deferredQueue[message.sequence];
                if (!deferred) {
                    var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcUnexpectedErrorSequence.message;
                    throw new Error(message2);
                }
                delete this.deferredQueue[message.sequence];
                deferred.reject(message.data);
                break;
        }
    };
    /**
     * Sending response message.
     *
     * @param target the RpcToModule or RpcToShell object.
     * @param message the Rpc message packet.
     */
    RpcChannel.prototype.response = function (target, message) {
        if (target == null || target.window == null) {
            var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTargetWindowNotConfigured.message;
            throw new Error(message2);
        }
        message.srcName = this.name;
        message.srcSubName = this.subName;
        message.srcDepth = this.depth;
        message.destName = target.name;
        message.destSubName = target.subName;
        message.signature = this.signature;
        message.type = RpcMessagePacketType.Response; // response
        target.window.postMessage(message, target.origin);
    };
    /**
     * Sending error message.
     *
     * @param target the RpcToModule or RpcToShell object.
     * @param message the Rpc message packet.
     */
    RpcChannel.prototype.error = function (target, message) {
        if (target == null || target.window == null) {
            var message2 = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTargetWindowNotConfigured.message;
            throw new Error(message2);
        }
        message.srcName = this.name;
        message.srcSubName = this.subName;
        message.srcDepth = this.depth;
        message.destName = target.name;
        message.destSubName = target.subName;
        message.signature = this.signature;
        message.type = RpcMessagePacketType.Error; // error
        target.window.postMessage(message, target.origin);
    };
    return RpcChannel;
}(RpcBase));
export { RpcChannel };
//# sourceMappingURL=data:application/json;base64,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QUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM5QixPQUFPLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQyxPQUFPLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVE7UUFDbkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQW5oQkEsQUFtaEJDLENBbmhCK0IsT0FBTyxHQW1oQnRDIiwiZmlsZSI6InJwYy1jaGFubmVsLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==