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
import { Disposer } from './disposable';
import { headerConstants, HttpStatusCode } from './http-constants';
import { Net } from './net';
/**
 * The PowerShellSession class.
 */
var PowerShellSession = /** @class */ (function () {
    function PowerShellSession(powerShell, lifetime) {
        this.powerShell = powerShell;
        this.lifetime = lifetime;
    }
    Object.defineProperty(PowerShellSession.prototype, "nodeName", {
        /**
         * Gets the node name of session.
         */
        get: function () {
            return this.powerShell.nodeName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose the session object.
     */
    PowerShellSession.prototype.dispose = function () {
        if (this.lifetime) {
            this.lifetime.dispose();
        }
    };
    return PowerShellSession;
}());
export { PowerShellSession };
/**
 * Class containing methods related to PowerShell runspace creation/deletion/command using PowerShell Raw API plugin.
 *  - It's auto holding the session as long as it's used within last 3 minutes.
 */
var PowerShellRaw = /** @class */ (function () {
    /**
     * Initializes a new instance of the PowerShellRaw class.
     *
     * @param nodeConnection The node connection service.
     * @param context The context of PowerShell run.
     */
    function PowerShellRaw(nodeConnection, context) {
        this.nodeConnection = nodeConnection;
        this.context = context;
        this.timestampInMs = 0;
        this.markDelete = false;
        this.internalActive = false;
        this.cancelPending = false;
    }
    Object.defineProperty(PowerShellRaw.prototype, "active", {
        /**
         * Gets active status of PowerShell execution.
         */
        get: function () {
            return this.internalActive;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose the runspace.
     */
    PowerShellRaw.prototype.dispose = function () {
        if (!this.active) {
            // only close sessions that have been created.
            // If a result was cached a component may not
            // execute a command and still dispose the session
            // when the component is destroyed.
            if (this.sessionId) {
                this.close();
            }
        }
        else {
            this.markDelete = true;
        }
    };
    /*
     * Runs the given command
     *
     * @param command The command to execute.
     */
    PowerShellRaw.prototype.runCommand = function (command, options) {
        var _this = this;
        // take the timestamp only success/healthy case.
        // error session would be auto-deleted after expiration time.
        this.internalActive = true;
        return this.command(command, options)
            .catch(function (error) { return _this.fallbackToJea(error, command, options); })
            .expand(function (data, index) {
            _this.timestampInMs = Date.now();
            if (_this.checkCompleted(data)) {
                return Observable.empty();
            }
            if (_this.cancelPending) {
                // submit cancel request.
                // after set active state to false and complete the observable.
                _this.cancelPending = false;
                return _this.cancel()
                    .catch(function (error, caught) {
                    _this.internalActive = false;
                    return Observable.empty();
                })
                    .flatMap(function (x) {
                    _this.internalActive = false;
                    return Observable.empty();
                });
            }
            var url = Net.powerShellApiRetrieveOutput.format(_this.sessionId);
            return _this.nodeConnection.get(_this.context.nodeName, url, _this.context.requestOptions)
                .catch(function (error) { return _this.fallbackToJea(error, command, options); });
        });
    };
    /**
     * Close/Delete the session / runspace.
     */
    PowerShellRaw.prototype.close = function () {
        if (this.sessionId) {
            var sessionUri = Net.powerShellApiSessions.format(this.sessionId);
            this.sessionId = null;
            this.nodeConnection.deleteQuick(this.context.nodeName, sessionUri, this.context.requestOptions);
            return;
        }
        Logging.log({
            level: LogLevel.Verbose,
            source: 'PowerShell/close',
            message: MsftSme.resourcesStrings().MsftSmeShell.Core.Error.PowerShellUnableSessionClose.message
        });
    };
    /**
     * Cancel the command.
     */
    PowerShellRaw.prototype.cancelCommand = function () {
        if (this.internalActive) {
            this.cancelPending = true;
        }
        return Observable.empty();
    };
    /**
     * Perform the JEA fallback, if applicable.
     * @param error The error to handle
     * @param command The command
     * @param options The request options
     */
    PowerShellRaw.prototype.fallbackToJea = function (error, command, options) {
        var _this = this;
        var authError = (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.BadRequest);
        var responseEndpoint = error && error.xhr && error.xhr.getResponseHeader(headerConstants.POWERSHELL_ENDPOINT);
        var requestEndpoint = (options && options.powerShellEndpoint);
        requestEndpoint = requestEndpoint || (this.context.requestOptions && this.context.requestOptions.powerShellEndpoint);
        if (authError && responseEndpoint && requestEndpoint !== responseEndpoint) {
            this.context.requestOptions.powerShellEndpoint = responseEndpoint;
            return this.command(command, options)
                .do(function () {
                // The JEA request went through - persist this context in authorization manager.
                _this.nodeConnection.saveJeaContext(_this.context.nodeName, responseEndpoint);
            });
        }
        this.internalActive = false;
        return Observable.throw(error);
    };
    PowerShellRaw.prototype.cancel = function () {
        if (this.sessionId && this.internalActive) {
            var cancelUri = Net.powerShellApiCancelCommand.format(this.sessionId);
            return this.nodeConnection.post(this.context.nodeName, cancelUri, null, this.context.requestOptions);
        }
        Logging.log({
            level: LogLevel.Warning,
            source: 'PowerShell',
            message: MsftSme.resourcesStrings().MsftSmeShell.Core.Error.PowerShellUnableCancelCommand.message
        });
        return Observable.empty();
    };
    Object.defineProperty(PowerShellRaw.prototype, "_isExpired", {
        /**
         * Gets if timestamp was expired.
         */
        get: function () {
            var now = Date.now();
            return this.timestampInMs !== 0 && (now - this.timestampInMs) > PowerShellRaw.maxDeltaTimeInMs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initiate command execution. It auto recycles old sessions.
     *
     * @param command the PowerShell command.
     */
    PowerShellRaw.prototype.command = function (command, options) {
        var data = Net.createPropertiesJSONString(command);
        var newOptions = __assign({}, this.context.requestOptions, {
            logAudit: options && options.logAudit,
            logTelemetry: options && options.logTelemetry
        });
        var endpoint = options && options.powerShellEndpoint;
        if (endpoint) {
            newOptions.powerShellEndpoint = endpoint;
        }
        var token = options && options.authToken;
        if (token) {
            newOptions.authToken = token;
        }
        if (this.sessionId == null || this._isExpired) {
            this.sessionId = null;
            var generatedName = (this.context.key ? this.context.key : 'X') + MsftSme.newGuid();
            var sessionUri = Net.powerShellApiSessions.format(generatedName);
            return this.nodeConnection.put(this.context.nodeName, sessionUri, data, newOptions);
        }
        else {
            var executeUri = Net.powerShellApiExecuteCommand.format(this.sessionId);
            return this.nodeConnection.post(this.context.nodeName, executeUri, data, newOptions);
        }
    };
    PowerShellRaw.prototype.checkCompleted = function (data) {
        var properties = Net.getItemProperties(data);
        if (properties.sessionId) {
            // keep the PS session GUID
            this.sessionId = properties.sessionId;
        }
        if (properties.completed.toLowerCase() === 'true') {
            this.internalActive = false;
            if (this.markDelete) {
                this.close();
            }
            return true;
        }
        return false;
    };
    // 3 minutes holding time.
    PowerShellRaw.maxDeltaTimeInMs = 3 * 60 * 1000;
    return PowerShellRaw;
}());
export { PowerShellRaw };
/**
 * The PowerShell class.
 *
 * - Single instance of PowerShell class manages single runspace.
 * - It queues coming requests and process one at a time sequentially.
 * - If a command is slow and causing with multiple responses, it aggregates response into single Q result.
 * - A PowerShell instance should be created through create() function, and it's statically stored/managed into _map collection.
 * - In QueryCache operation, it can find the PowerShell instance to run PowerShell command by using find() function.
 * - Once all lifetime references are gone, it deletes the runspace.
 * - To dispose the PowerShell instance, it can use lifetime.dispose().
 */
var PowerShell = /** @class */ (function () {
    /**
     * Initializes a new instance of the PowerShell class.
     * (private constructor which shouldn't be called directly.)
     *
     * @param nodeConnection The node connection service.
     * @param key The shared key to queue the requests to use the single runspace.
     * @param lifetime The lifetime container.
     */
    function PowerShell(nodeName, nodeConnection, key, lifetime, options) {
        var _this = this;
        /**
         * The queue of PowerShell command requests.
         */
        this.queue = [];
        this.context = {
            nodeName: nodeName,
            key: key,
            lifetimes: [],
            requestOptions: PowerShell.newEndpointOptions(options)
        };
        this.timestamp = 0;
        this.raw = new PowerShellRaw(nodeConnection, this.context);
        if (key && lifetime) {
            lifetime.registerForDispose(new Disposer(function () { return _this.lifetimeDisposer(lifetime); }));
            this.context.lifetimes.push(lifetime);
        }
    }
    /**
     * Create script as string.
     *
     * @param resource the script text from legacy ps-code converter.
     * @param parameters the arguments.
     * @param flags (optional) the switch flags.
     */
    PowerShell.createScript = function (script, parameters, flags) {
        script = 'function cvt ($o) { return ConvertFrom-Json $o }\n function SmeSubmit {\n' + script + '}\n SmeSubmit';
        for (var parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
                script += ' -{0} (cvt \'{1}\')'.format(parameter, JSON.stringify(parameters[parameter]).replace(PowerShell.escapeRegex, '\'\''));
            }
        }
        if (flags) {
            for (var i = 0; i < flags.length; i++) {
                script += ' -{0}'.format(flags[i]);
            }
        }
        return script;
    };
    /**
     * Create PowerShell request command.
     * (It creates a command object of JEA PowerShell request under restricted user role environment.)
     *
     * @param resource the script resource object with command and script data from new ps-code converter.
     * @param parameters the arguments.
     * @param flags (optional) the switch flags.
     * @return PowerShellCommand the PowerShell request command object.
     */
    PowerShell.createCommand = function (resource, parameters, flags) {
        var script = 'function cvt ($o) { return ConvertFrom-Json $o }\n function SmeSubmit {\n' + resource.script + '}\n SmeSubmit';
        for (var parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
                script += ' -{0} (cvt \'{1}\')'.format(parameter, JSON.stringify(parameters[parameter]).replace(PowerShell.escapeRegex, '\'\''));
            }
        }
        var flagParameters = {};
        if (flags) {
            for (var i = 0; i < flags.length; i++) {
                script += ' -{0}'.format(flags[i]);
                flagParameters[flags[i]] = true;
            }
        }
        return {
            module: resource.module,
            command: resource.command,
            parameters: __assign({}, flagParameters, parameters),
            script: script
        };
    };
    PowerShell.create = function (nodeName, nodeConnection, key, lifetime, requestOptions) {
        var ps;
        if (key && lifetime) {
            ps = PowerShell.map[PowerShell.indexName(nodeName, key)];
            if (ps) {
                ps.addLifetime(lifetime);
                return ps;
            }
        }
        ps = new PowerShell(nodeName, nodeConnection, key, lifetime, requestOptions);
        if (key && lifetime) {
            PowerShell.map[PowerShell.indexName(nodeName, key)] = ps;
        }
        return ps;
    };
    /**
     * Find existing PowerShell object. Create call must be called before to create the PowerShell instance.
     *
     * @param nodeName The node name.
     * @param key The shared key to queue the requests to use the single runspace.
     */
    PowerShell.find = function (nodeName, key) {
        return PowerShell.map[PowerShell.indexName(nodeName, key)];
    };
    /**
     * Gets the command object from string or PowerShellCommand.
     *
     * @param scriptOrCommand the script string or PowerShellCommand object.
     */
    PowerShell.getPowerShellCommand = function (scriptOrCommand) {
        return typeof scriptOrCommand === 'string' ?
            {
                script: scriptOrCommand
            }
            : {
                script: scriptOrCommand.script,
                command: scriptOrCommand.command,
                module: scriptOrCommand.module || MsftSme.self().Init.powerShellModuleName,
                parameters: scriptOrCommand.parameters
            };
    };
    /**
     * Create new options with debugging endpoint if requested.
     *
     * @param options the PowerShell session request options.
     */
    PowerShell.newEndpointOptions = function (options) {
        // if there is no endpoint but configured with powerShellEndpoint, set debugging endpoint.
        var newOptions = __assign({}, (options || {}));
        if (!newOptions.powerShellEndpoint && MsftSme.self().Init.powerShellEndpoint) {
            newOptions.powerShellEndpoint = MsftSme.self().Init.powerShellEndpoint;
        }
        return newOptions;
    };
    /**
     * Create the index name in map collection.
     *
     * @param nodeName The node name.
     * @param key The shared key to queue the requests to use the single runspace.
     */
    PowerShell.indexName = function (nodeName, key) {
        return nodeName + ':' + key;
    };
    Object.defineProperty(PowerShell.prototype, "nodeName", {
        /**
         * Gets node name from current context.
         */
        get: function () {
            return this.context.nodeName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Run PowerShell command.
     *
     * @param command The command.
     * @param options The options.
     * @return PromiseV The result of PowerShell command.
     */
    PowerShell.prototype.run = function (scriptOrCommand, options) {
        var command = PowerShell.getPowerShellCommand(scriptOrCommand);
        if (this.context.lifetimes.length === 0) {
            // no disposer is assigned, force to close the session after every query.
            var timeoutMs = options && options.timeoutMs;
            if (options) {
                options.timeoutMs = timeoutMs;
                options.close = true;
            }
            else {
                options = { timeoutMs: timeoutMs, close: true };
            }
        }
        // queue the request.
        var observable = this.enqueue(command, options);
        return observable;
    };
    /**
     * Cancel PowerShell command.
     */
    PowerShell.prototype.cancel = function () {
        return this.raw.cancelCommand();
    };
    /**
     * Enqueue a command request.
     *
     * @param command The command.
     * @param options The options.
     */
    PowerShell.prototype.enqueue = function (command, options) {
        var _this = this;
        return Observable.create(function (observer) {
            _this.queue.push({ observer: observer, command: command, options: options });
            _this.dequeue();
        });
    };
    /**
     * Dequeue a command request.
     */
    PowerShell.prototype.dequeue = function () {
        var _this = this;
        if (this.raw.active) {
            return false;
        }
        var item = this.queue.shift();
        if (item) {
            this.currentData = null;
            this.timestamp = Date.now();
            this.raw.runCommand(item.command, item.options).subscribe(function (data) {
                var properties = Net.getItemProperties(data);
                _this.collect(properties, item.options && item.options.timeoutMs, item.options && item.options.partial ? item.observer : null);
            }, function (error) {
                if (item.options && item.options.close) {
                    _this.raw.close();
                }
                item.observer.error(error);
                _this.timestamp = 0;
                _this.dequeue();
            }, function () {
                if (item.options && item.options.close) {
                    _this.raw.close();
                }
                if (!item.options || !item.options.partial) {
                    item.observer.next(_this.currentData);
                }
                item.observer.complete();
                _this.timestamp = 0;
                _this.dequeue();
            });
            return true;
        }
        return false;
    };
    /**
     * Collect response result and aggregate into single object.
     *
     * @param properties The properties of response object.
     * @param timeoutMs The timeout to cancel command.
     * @param observer The observer of powershell results.
     */
    PowerShell.prototype.collect = function (properties, timeoutMs, observer) {
        if (timeoutMs && this.timestamp && (Date.now() - this.timestamp > timeoutMs)) {
            // force to cancel the command because of unexpected longer execution.
            this.raw.cancelCommand();
            this.timestamp = 0;
            return;
        }
        if (observer) {
            // return partial data if observer is not null.
            observer.next(properties);
            this.currentData = properties;
            return;
        }
        if (this.currentData != null && this.currentData.results && properties.results) {
            var array_1;
            if (MsftSme.getTypeOf(this.currentData.results) === 'array') {
                array_1 = this.currentData.results;
            }
            else {
                array_1 = [this.currentData.results];
            }
            if (MsftSme.getTypeOf(properties.results) === 'array') {
                properties.results.forEach(function (x) {
                    array_1.push(x);
                });
            }
            else {
                array_1.push(properties.results);
            }
            this.currentData.results = array_1;
            return;
        }
        this.currentData = properties;
    };
    /**
     * Attach lifetime object to disposer when disposing.
     *
     * @param lifetime The lifetime object.
     */
    PowerShell.prototype.addLifetime = function (lifetime) {
        var _this = this;
        var found = MsftSme.find(this.context.lifetimes, function (value) { return value === lifetime; });
        if (!found) {
            this.context.lifetimes.push(lifetime);
            lifetime.registerForDispose(new Disposer(function () { return _this.lifetimeDisposer(lifetime); }));
        }
    };
    /**
     * Callback when disposing the container of view model.
     * If none, reference the PowerShell object. Dispose it. (Delete runspace)
     *
     * @param lifetime The lifetime object.
     */
    PowerShell.prototype.lifetimeDisposer = function (lifetime) {
        var found = MsftSme.find(this.context.lifetimes, function (value) { return value === lifetime; });
        if (found) {
            MsftSme.remove(this.context.lifetimes, lifetime);
            if (this.context.lifetimes.length === 0) {
                // cancel queue command requests.
                this.queue.forEach(function (value, index, array) {
                    value.observer.next(null);
                    value.observer.complete();
                });
                // delete from the map collection and delete the runspace/session.
                delete PowerShell.map[PowerShell.indexName(this.context.nodeName, this.context.key)];
                this.raw.dispose();
            }
        }
    };
    /**
     * Default PowerShell endpoint.
     */
    PowerShell.defaultPowerShellEndpoint = 'http://schemas.microsoft.com/powershell/microsoft.powershell';
    /**
     * SME PowerShell endpoint.
     */
    PowerShell.smePowerShellEndpoint = 'http://schemas.microsoft.com/powershell/microsoft.sme.powershell';
    /**
     * Static collection of PowerShell objects.
     */
    PowerShell.map = {};
    /**
     * Regular expression to match all the occurrences of a single quote
     */
    PowerShell.escapeRegex = new RegExp('\'', 'g');
    return PowerShell;
}());
export { PowerShell };
//# sourceMappingURL=data:application/json;base64,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a0U7Z0JBQ2xFLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDckYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN2QixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFoYUQ7O09BRUc7SUFDVyxvQ0FBeUIsR0FBRyw4REFBOEQsQ0FBQztJQUV6Rzs7T0FFRztJQUNXLGdDQUFxQixHQUFHLGtFQUFrRSxDQUFDO0lBRXpHOztPQUVHO0lBQ1ksY0FBRyxHQUFrQyxFQUFFLENBQUM7SUFFdkQ7O09BRUc7SUFDWSxzQkFBVyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQStZdkQsaUJBQUM7Q0FsYUQsQUFrYUMsSUFBQTtTQWxhWSxVQUFVIiwiZmlsZSI6InBvd2Vyc2hlbGwuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9