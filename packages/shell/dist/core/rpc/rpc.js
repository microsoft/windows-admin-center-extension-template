var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoreEnvironment } from '../data/core-environment';
import { NativeQ } from '../data/native-q';
import { RpcInboundCommands, RpcOutboundCommands, RpcSeekMode, RpcType, rpcVersion } from './rpc-base';
import { RpcManager } from './rpc-manager';
/**
 * The Rpc class.
 */
var Rpc = /** @class */ (function () {
    /**
     * Initializes a new instance of the Rpc class.
     *
     * @param http the Http class instance injected.
     */
    function Rpc() {
        var _this = this;
        /**
         * Deferred response collection.
         */
        this.deferredCollection = new Map();
        /**
         * Active status of rpc by Observable.
         */
        this.stateChangedInternal = new Subject();
        /**
         * Active status of rpc.
         */
        this.stateActiveInternal = false;
        /**
         * Inbound module handlers to process when rpc is called.
         *  - called from Module to Shell.
         */
        this.rpcInboundHandlers = {
            reportHandler: function (data) {
                var result = __assign({}, data, _this.rpcManager.getSourceStatus(data.sourceName, data.sourceSubName));
                return _this.processNextForSubject(RpcInboundCommands.Report, result);
            },
            failedHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Notification, data);
            },
            logHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Log, data);
            },
            telemetryHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Telemetry, data);
            },
            notificationHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Notification, data);
            },
            forwardHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Forward, data);
            },
            workItemHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.WorkItem, data);
            },
            updateDataHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.UpdateData, data);
            },
            seekHandler: function (data) {
                return Promise.resolve({ name: data.sourceName, subName: data.sourceSubName });
            },
            workItemFindHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.WorkItemFind, data);
            },
            shellNavigationHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.ShellNavigate, data);
            },
            dialogHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Dialog, data);
            },
            settingsHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.Settings, data);
            },
            overlayOpenHandler: function (data) {
                return _this.processNextForSubject(RpcInboundCommands.OverlayOpen, data);
            }
        };
        /**
         * Outbound shell handlers to process when rpc is called.
         *  - called from Shell to Module.
         *  - if code reached a handler, module is not ready yet.
         *    set timeout for RPC call.
         */
        this.rpcOutboundHandlers = {
            initHandler: function (data) {
                return _this.createTimerPromise(RpcOutboundCommands.Init, Rpc.rpcTimeout, { locale: data.locale });
            },
            openHandler: function (rpcOpenData) {
                return _this.createTimerPromise(RpcOutboundCommands.Open, Rpc.rpcTimeout, rpcOpenData);
            },
            activateHandler: function (data) {
                return _this.createTimerPromise(RpcOutboundCommands.Activate, Rpc.rpcTimeout, data);
            },
            deactivate2Handler: function (data) {
                return _this.createTimerPromise(RpcOutboundCommands.Deactivate2, Rpc.rpcTimeout, data);
            },
            shutdownHandler: function (data) {
                return _this.createTimerPromise(RpcOutboundCommands.Shutdown, Rpc.rpcTimeout, data);
            },
            forwardHandler: function (data) {
                return _this.createPromise(RpcOutboundCommands.Forward, data);
            },
            pingHandler: function (data) {
                _this.changeActiveState(true);
                return Promise.resolve({ name: 'pong' });
            },
            overlayCloseHandler: function (data) {
                return _this.createTimerPromise(RpcOutboundCommands.OverlayClose, Rpc.rpcTimeout, data);
            }
        };
        /**
         * Rpc manager object.
         */
        this.rpcManager = new RpcManager();
        this.rpcSubjects = {};
        var commands = Object.keys(RpcInboundCommands);
        commands.forEach(function (value, index, array) {
            _this.rpcSubjects[RpcInboundCommands[value]] = new Subject();
        });
    }
    Object.defineProperty(Rpc.prototype, "stateChanged", {
        /**
         * Gets observable to watch the state change.
         */
        get: function () {
            this.stateChangedInternal.next(this.stateActiveInternal);
            return this.stateChangedInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rpc.prototype, "stateActive", {
        /**
         * Gets the state of rpc.
         */
        get: function () {
            return this.stateActiveInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rpc.prototype, "isShell", {
        /**
         * Gets whether rpc is running on the shell.
         */
        get: function () {
            if (this.rpcManager.rpcChannel == null) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcNotInitialized.message;
                throw new Error(message);
            }
            return this.rpcManager.rpcChannel.rpcMode === 0 /* Shell */;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initializes Rpc configuration
     */
    Rpc.prototype.init = function () {
        this.rpcManager.init(this.rpcInboundHandlers, this.rpcOutboundHandlers);
        if (this.isShell) {
            this.changeActiveState(true);
        }
    };
    /***************************************************************
     * Section for Shell usage.
     ***************************************************************/
    /**
     * This updates its value every time there's a reported data from the rpc channel
     */
    Rpc.prototype.moduleSubjects = function (commandType) {
        return this.rpcSubjects[RpcInboundCommands[commandType]];
    };
    /**
     * Connect a module with name and iframe.
     * - start pinging to iframe to wait for response.
     *
     * @param name the name of the module.
     * @param path the path to open the module the module name.
     * @param iframe the iframe window object.
     * @param primary the primary window to affect router url.
     * @return Promise<string> the promise with subName created for the window.
     */
    Rpc.prototype.moduleConnect = function (name, path, iframe, primary) {
        return this.rpcManager.connectRpcOutbound(name, path, iframe, primary);
    };
    /**
     * Init the module.
     *
     * @param name the name of module.
     * @param subName the sub name of rpc channel.
     * @return Promise<void> the promise object of init result.
     */
    Rpc.prototype.moduleInit = function (name, subName) {
        var _this = this;
        var rpc = this.rpcManager.rpcChannel.getRpc(name, subName, RpcType.Outbound);
        var self = MsftSme.self();
        var data = {
            theme: self.Resources.theme,
            assets: self.Resources.assets,
            locale: self.Resources.localeId,
            sessionId: self.Init.sessionId,
            modules: self.Environment.modules,
            accessibilityMode: self.Resources.accessibilityMode
        };
        return rpc.init(data).then(function (result) {
            // copy the version string of remote module.
            if (result && result.version) {
                rpc.version = result.version;
            }
            _this.changeActiveState(true);
            return result;
        });
    };
    /**
     * Open the module by specifying the path and parameters.
     *
     * @param name the name of module.
     * @param subName the sub name of rpc channel.
     * @param path the open path.
     * @param parameters the parameters if any.
     * @return Promise<RpcOpenResult> the promise object of RpcOpenResult.
     */
    Rpc.prototype.moduleOpen = function (name, subName, path, parameters) {
        var rpc = this.rpcManager.rpcChannel.getRpc(name, subName, RpcType.Outbound);
        var data = {
            path: path,
            parameters: parameters
        };
        return rpc.open(data);
    };
    /**
     * Activate the module to start receiving data.
     *
     * @param name the module name.
     * @param subName the sub name of rpc channel.
     * @param primary the primary window to affect router url.
     * @return Promise<void> the promise of activation result.
     */
    Rpc.prototype.moduleActivate = function (name, subName, primary) {
        var _this = this;
        var rpc = this.rpcManager.reconnectRpcOutbound(name, subName, primary);
        return rpc.activate({}).then(function (data) {
            _this.changeActiveState(true);
            return data;
        });
    };
    /**
     * Deactivate 2 the module to stop receiving data.
     *
     * @param name the module name.
     * @param subName the sub name of rpc channel.
     * @param primary the primary window to affect router url.
     * @return Promise<void> the promise of deactivation result.
     */
    Rpc.prototype.moduleDeactivate2 = function (name, subName, primary) {
        this.changeActiveState(false);
        var rpc = this.rpcManager.rpcChannel.getRpc(name, subName, RpcType.Outbound);
        return rpc.deactivate2({});
    };
    /**
     * Request to shutdown the module.
     *
     * @param name the module name.
     * @param subName the sub name of rpc channel.
     * @param primary the primary window to affect router url.
     * @param force the forcible state.
     * @return Promise<RpcShutdownResult> the promise object of result.
     */
    Rpc.prototype.moduleShutdown = function (name, subName, primary, force) {
        var rpc = this.rpcManager.reconnectRpcOutbound(name, subName, primary);
        return rpc.shutdown({ force: force });
    };
    /**
     * Remove the module from the rpc channel.
     *
     * @param name the module name.
     * @param subName the sub name of rpc channel.
     */
    Rpc.prototype.moduleRemove = function (name, subName) {
        this.rpcManager.removeRpcOutbound(name, subName);
    };
    /**
     * Get module version string.
     *
     * @param name the name of module.
     * @param subName the sub name of rpc channel.
     * @return string the RPC version of module.
     */
    Rpc.prototype.moduleVersion = function (name, subName) {
        var rpc = this.rpcManager.rpcChannel.getRpc(name, subName, RpcType.Outbound);
        return rpc && rpc.version;
    };
    /**
     * Request to close the dialog in module
     * @param data Rpc data sent from shell to module
     */
    Rpc.prototype.overlayClose = function (data) {
        return Observable.fromPromise(this.rpcManager.rpcOutbound.overlayClose(data));
    };
    /***************************************************************
     * Section for Either usage.
     ***************************************************************/
    /**
     * report a forward update from the shell or module
     */
    Rpc.prototype.forward = function (data) {
        var _this = this;
        if (this.isShell) {
            // If we are the shell, then broadcast forwards to all iframes 
            // since only gateway, connections, and auth services use this architecture, it should be safe.
            return Observable
                .zip(this.rpcManager.getCurrentRpcOutbound().map(function (o) { return o.forward(data); }))
                .map(function (results) {
                // TODO: do we care about errors from other frames?
                return results.find(function (r) { return r === _this.rpcManager.rpcOutbound; }) || results[0];
            })
                .toPromise();
        }
        else {
            return this.rpcManager.rpcInbound.forward(data);
        }
    };
    /***************************************************************
     * Section for Module usage.
     ***************************************************************/
    /**
     * Accept delay register in case of loading/initialization took a time for module.
     *
     * @param command the RPC Shell command.
     * @param handler the handler to handle Shell request.
     */
    Rpc.prototype.register = function (command, handler) {
        var _this = this;
        var deferredData = this.deferredCollection[command];
        if (deferredData) {
            delete this.deferredCollection[command];
            handler(deferredData.data).then(deferredData.deferred.resolve, deferredData.deferred.reject);
            return;
        }
        if (command === RpcOutboundCommands.Init) {
            var modifiedHandler = function (data) {
                // node context is used before passing request to handler.
                _this.changeActiveState(true);
                var self = MsftSme.self();
                self.Init.sessionId = data.sessionId;
                self.Environment.modules = data.modules;
                if (!MsftSme.isNullOrUndefined(self.Resources.accessibilityMode) && !MsftSme.isNullOrUndefined(data.accessibilityMode)) {
                    self.Resources.accessibilityMode = data.accessibilityMode;
                    CoreEnvironment.accessibilityManager.changeAccessibilityMode(self.Resources.accessibilityMode);
                }
                CoreEnvironment.assetManager.loadAssets(data.theme, data.assets);
                var localeLoader = CoreEnvironment.moduleLoadLocale(data.locale);
                var passingData = {
                    locale: data.locale,
                    sessionId: data.sessionId
                };
                return localeLoader
                    .then(function () { return _this.seekShell(RpcSeekMode.Create); })
                    .then(function () { return handler(passingData); })
                    .then(function () { return { version: rpcVersion }; });
            };
            this.rpcManager.rpcInbound.register(RpcOutboundCommands[command], modifiedHandler);
        }
        else {
            this.rpcManager.rpcInbound.register(RpcOutboundCommands[command], handler);
        }
    };
    /**
     * Module report the path update information to shell.
     */
    Rpc.prototype.report = function (data) {
        var rpc = this.rpcManager.rpcReportDataInbound;
        return rpc.report(data);
    };
    /**
     * Module report a failure.
     */
    Rpc.prototype.failed = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.failed(data);
    };
    /**
     * Module report a logging data.
     */
    Rpc.prototype.log = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.log(data);
    };
    /**
     * Module report a telemetry information.
     */
    Rpc.prototype.telemetry = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.telemetry(data);
    };
    /**
     * Module report a notification update.
     *
     * @param data the rpc notification request.
     */
    Rpc.prototype.notify = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.notify(data);
    };
    /**
     * Module submit or query a work item.
     *
     * @param data the rpc work item request.
     */
    Rpc.prototype.submitOrQueryWorkItem = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.submitOrQueryWorkItem(data);
    };
    /**
     * Module update any data results.
     *
     * @param data the rcp completed results data.
     */
    Rpc.prototype.updateData = function (name, subName, data) {
        var rpc = this.rpcManager.rpcChannel.getRpc(name, subName, RpcType.Inbound);
        if (rpc) {
            return rpc.updateData(data);
        }
        var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcNotFountInbound.message;
        return Promise.reject(message.format(name, subName));
    };
    /**
     * Seek shell frame.
     *
     * @param Promise<any> the promise object.
     */
    Rpc.prototype.seekShell = function (mode) {
        return this.rpcManager.seekShell(mode);
    };
    /**
     * Find work items.
     *
     * @param data the query notification data.
     * @return Promise<RpcWorkItemFindResult> the promise of RpcWorkItemFindResult.
     */
    Rpc.prototype.workItemFind = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.workItemFind(data);
    };
    /**
     * Shell navigation.
     *
     * @param data the navigation data to the shell.
     * @return Promise<RpcShellNavigateResult> the promise of RpcShellNavigateResult.
     */
    Rpc.prototype.shellNavigate = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.shellNavigate(data);
    };
    /**
     * The dialog request to shell.
     *
     * @param data the RpcDialogData object.
     * @return Promise<RpcDialogResult> the promise object.
     */
    Rpc.prototype.dialog = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.dialog(data);
    };
    /**
     * Request to add/remove overlay in shell from a dialog
     * @param data Rpc data sent from module to shell
     */
    Rpc.prototype.overlayOpen = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.overlayOpen(data);
    };
    /**
     * User Profile
     *
     * @param data the user profile operation data
     * @return Promise<RpcSettingsResult> the promise of RpcSettingsResult.
     */
    Rpc.prototype.settings = function (data) {
        var rpc = this.rpcManager.rpcInbound;
        return rpc.settings(data);
    };
    /**
     * Validate existing outbound connection and remove if it doesn't live anymore.
     *
     * @return number the count of removed outbound.
     */
    Rpc.prototype.validate = function () {
        var _this = this;
        var count = 0;
        var collection = this.rpcManager.getCurrentRpcOutbound();
        collection.forEach(function (rpc, index, array) {
            if (!_this.rpcManager.rpcChannel.validate(rpc)) {
                count++;
            }
        });
        return count;
    };
    /**
     * Change the active status of rpc.
     */
    Rpc.prototype.changeActiveState = function (state) {
        this.stateActiveInternal = state;
        this.stateChangedInternal.next(state);
    };
    /**
     * Create auto-failed timered promise.
     *
     * @param command the outbound commmand type.
     * @param timeoutMs the timeout milliseconds.
     * @param data the data context.
     * @return Promise<any> the promise.
     */
    Rpc.prototype.createTimerPromise = function (command, timeoutMs, data) {
        var _this = this;
        var deferred = NativeQ.defer();
        this.deferredCollection[command] = { deferred: deferred, data: data };
        setTimeout(function () {
            var deferredData = _this.deferredCollection[command];
            if (deferredData) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcTimeout.message;
                deferredData.deferred.reject(message);
                delete _this.deferredCollection[command];
            }
        }, timeoutMs);
        return deferred.promise;
    };
    /**
     * Create promise that does not timeout.
     *
     * @param command the outbound type.
     * @param data the data context.
     * @return Promise<any> the promise.
     */
    Rpc.prototype.createPromise = function (command, data) {
        var deferred = NativeQ.defer();
        this.deferredCollection[command] = { deferred: deferred, data: data };
        return deferred.promise;
    };
    /**
     * Process data pushing into next call of subject with defered data type.
     *
     * @param command the inbound command type.
     * @param data the rpc data came from a module/iframe.
     * @return Promise the promise which receiver must settle within fixed waiting time (10 seconds)
     */
    Rpc.prototype.processNextForSubject = function (command, data) {
        var subject = this.rpcSubjects[RpcInboundCommands[command]];
        if (subject.closed || subject.hasError) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.RpcSubjectClosed.message;
            throw new Error(message.format(RpcInboundCommands[command]));
        }
        var deferredData = {
            data: data,
            deferred: NativeQ.defer()
        };
        subject.next(deferredData);
        return deferredData.deferred.promise;
    };
    // RPC timeout 10 seconds.
    Rpc.rpcTimeout = 10 * 1000;
    return Rpc;
}());
export { Rpc };
//# sourceMappingURL=data:application/json;base64,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QU0sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7WUFDbkcsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRUQsSUFBSSxZQUFZLEdBQWlDO1lBQzdDLElBQUksRUFBRSxJQUFJO1lBQ1YsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQVc7U0FDckMsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQ3pDLENBQUM7SUF4a0JELDBCQUEwQjtJQUNYLGNBQVUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBd2tCMUMsVUFBQztDQTFrQkQsQUEwa0JDLElBQUE7U0Exa0JZLEdBQUciLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==