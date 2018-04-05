/**
 * The state definition of Tool condition.
 */
export var EnvironmentModuleToolState;
(function (EnvironmentModuleToolState) {
    /**
     * Tool is available on the connection.
     */
    EnvironmentModuleToolState[EnvironmentModuleToolState["Available"] = 0] = "Available";
    /**
     * Tool is not available because it's not configured properly.
     */
    EnvironmentModuleToolState[EnvironmentModuleToolState["NotConfigured"] = 1] = "NotConfigured";
    /**
     * Tool it not supported on the connection.
     */
    EnvironmentModuleToolState[EnvironmentModuleToolState["NotSupported"] = 2] = "NotSupported";
})(EnvironmentModuleToolState || (EnvironmentModuleToolState = {}));
/**
 * Environment module class.
 */
var EnvironmentModule = /** @class */ (function () {
    function EnvironmentModule() {
    }
    /**
     * Find resource string for the key.
     *
     * @param resources The resource.
     * @param locale The locale.
     * @param key The key string.
     */
    EnvironmentModule.findResource = function (resources, locale, key) {
        var prefix = 'resources:strings:';
        if (!key.startsWith(prefix)) {
            return key;
        }
        key = key.substr(prefix.length);
        var en = resources.first(function (value) { return value.locale === 'default'; });
        var current = resources.first(function (value) { return value.locale === locale; });
        if (current && current.strings[key]) {
            return current.strings[key];
        }
        else if (en && en.strings[key]) {
            return en.strings[key];
        }
        return key;
    };
    /**
     * Recursively processes manifest resources
     *
     * @param module the manifest object.
     * @param locale the locale string such as 'en'.
     * @param the current object, defaults to the module itself
     */
    EnvironmentModule.processModuleResources = function (module, locale, obj) {
        if (obj === void 0) { obj = module; }
        if (!Array.isArray(module.resources)) {
            module.resources = [];
        }
        var keys = Object.keys(obj);
        keys.forEach(function (key) {
            if (typeof obj[key] === 'string') {
                obj[key] = EnvironmentModule.findResource(module.resources, locale, obj[key]);
            }
            else if (typeof obj[key] === 'object') {
                EnvironmentModule.processModuleResources(module, locale, obj[key]);
            }
        });
    };
    /**
     * Create environment object from the manifest.
     *
     * @param manifest the manifest object.
     * @param locale the locale string such as 'en'.
     */
    EnvironmentModule.createEnvironment = function (manifest, locale) {
        var global = window;
        // initialize entrypoint structures
        this.allEntryPoints = [];
        this.entryPointsByType = {};
        this.entryPointsByType['connectionProvider'] = [];
        this.entryPointsByType['solution'] = [];
        this.entryPointsByType['tool'] = [];
        this.entryPointsByType['component'] = [];
        this.entryPointsByType['service'] = [];
        this.friendlyUrlMap = {
            connectionTypes: { to: {}, from: {} },
            solutions: { to: {}, from: {} },
            tools: { to: {}, from: {} }
        };
        if (manifest.hasOwnProperty('modules')) {
            var modules = manifest.modules;
            for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
                var module_1 = modules_1[_i];
                // TODO: signature is going to be removed from modules, for now always use default.
                module_1.signature = EnvironmentModule.defaultSignature;
                // if the module has no origin, use the global one.
                module_1.origin = module_1.origin || global.location.origin;
                // process resources                
                EnvironmentModule.processModuleResources(module_1, locale);
                EnvironmentModule.processEntryPoints(module_1);
                delete module_1['resources'];
            }
            // default entry point collections to be sorted alphabetically
            var alphaSort = function (a, b) { return a.displayName.localeCompareIgnoreCase(b.displayName); };
            this.allEntryPoints.sort(alphaSort);
            this.entryPointsByType['solution'].sort(alphaSort);
            this.entryPointsByType['tool'].sort(alphaSort);
        }
        // use local origin automatically.
        manifest.origin = global.location.origin;
        return manifest;
    };
    /**
     * Gets the environment module.
     *
     * @param name the name of module.
     * @return EnvironmentModule the environment module.
     */
    EnvironmentModule.getEnvironmentModule = function (name) {
        var global = window;
        var modules = global.MsftSme.Environment && global.MsftSme.Environment.modules;
        if (modules) {
            for (var _i = 0, modules_2 = modules; _i < modules_2.length; _i++) {
                var module_2 = modules_2[_i];
                if (module_2.name === name) {
                    return module_2;
                }
            }
        }
        return null;
    };
    /**
     * Process Entry points for quick and easy access later
     * @param module the modules to process
     */
    EnvironmentModule.processEntryPoints = function (module) {
        var _this = this;
        if (!EnvironmentModule.allEntryPoints) {
            EnvironmentModule.allEntryPoints = [];
        }
        if (!EnvironmentModule.entryPointsByType) {
            EnvironmentModule.entryPointsByType = {};
        }
        module.entryPoints.forEach(function (entryPoint) {
            // save the module information into the entry point
            entryPoint.parentModule = module;
            // create entry in entry points by type if it doesn't exist
            if (!EnvironmentModule.entryPointsByType[entryPoint.entryPointType]) {
                EnvironmentModule.entryPointsByType[entryPoint.entryPointType] = [];
            }
            // push to data structures
            EnvironmentModule.allEntryPoints.push(entryPoint);
            EnvironmentModule.entryPointsByType[entryPoint.entryPointType].push(entryPoint);
            if (entryPoint.urlName) {
                var entryPointId = EnvironmentModule.createFormattedEntrypoint(entryPoint);
                if (entryPoint.entryPointType === 'solution') {
                    _this.friendlyUrlMap.solutions.to[entryPointId] = entryPoint.urlName;
                    _this.friendlyUrlMap.solutions.from[entryPoint.urlName] = entryPointId;
                }
                else if (entryPoint.entryPointType === 'tool') {
                    _this.friendlyUrlMap.tools.to[entryPointId] = entryPoint.urlName;
                    _this.friendlyUrlMap.tools.from[entryPoint.urlName] = entryPointId;
                }
            }
            if (entryPoint.entryPointType === 'connectionProvider' && entryPoint.connectionTypeUrlName) {
                _this.friendlyUrlMap.connectionTypes.to[entryPoint.connectionType] = entryPoint.connectionTypeUrlName;
                _this.friendlyUrlMap.connectionTypes.from[entryPoint.connectionTypeUrlName] = entryPoint.connectionType;
            }
        });
    };
    /**
     * Evaluates all of the modules in the environment and returns a flat list of all of their entry points.
     * optionally filtered by the 'filter' function
     *
     * @param filter the filter to apply to the entry points.
     * @return a flat list of all module entry points
     */
    EnvironmentModule.getEntryPoints = function (filter) {
        var global = window;
        if (!global.MsftSme || !global.MsftSme.Environment) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.EnvironmentNotInitialized.message;
            throw Error(message);
        }
        return filter ? EnvironmentModule.allEntryPoints.filter(filter) : EnvironmentModule.allEntryPoints;
    };
    /**
     * Gets the available entry points from all of the modules in the environment, filtered by type.
     *
     * @param name the name of module.
     * @return EnvironmentModule the environment module.
     */
    EnvironmentModule.getEntryPointsByType = function (entryPointTypes) {
        var global = window;
        if (!global.MsftSme || !global.MsftSme.Environment) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.EnvironmentNotInitialized.message;
            throw Error(message);
        }
        return entryPointTypes.mapMany(function (type) { return EnvironmentModule.entryPointsByType[type]; });
    };
    /**
     * Gets the connection type mapping data.
     *
     * @return { [name: string]: EnvironmentConnectionTypeInfo } the mapping object.
     */
    EnvironmentModule.getConnectionMap = function () {
        if (!EnvironmentModule.connectionMap) {
            EnvironmentModule.connectionMap = EnvironmentModule.createConnectionMap();
        }
        return EnvironmentModule.connectionMap;
    };
    /**
     * Gets a friendly url segment from a connection type
     * @param connectionType the connection type to map.
     * @return string friendly url for the connection type or the connection type if no friendly name exists.
     */
    EnvironmentModule.getFriendlyUrlSegmentForConnectionType = function (connectionType, fallbackToUnfriendlySegment) {
        if (fallbackToUnfriendlySegment === void 0) { fallbackToUnfriendlySegment = true; }
        return EnvironmentModule.friendlyUrlMap.connectionTypes.to[connectionType] || (fallbackToUnfriendlySegment ? connectionType : null);
    };
    /**
     * Gets a connection type from a friendly url segment
     * @param urlSegment the url segment to map
     * @return string connection type found using the friendly url segment
     */
    EnvironmentModule.getConnectionTypeFromFriendlyUrlSegment = function (urlSegment) {
        return EnvironmentModule.friendlyUrlMap.connectionTypes.from[urlSegment];
    };
    /**
     * Gets a friendly url segment from an entry point id
     * @param urlSegment the url segment.
     * @param entryPointType the type of entry point to look for.
     * @return string friendly url for the entry point id
     */
    EnvironmentModule.getFriendlyUrlSegmentForEntryPoint = function (entryPoint, entryPointType, fallbackToUnfriendlySegment) {
        if (fallbackToUnfriendlySegment === void 0) { fallbackToUnfriendlySegment = true; }
        if (entryPointType === 'solution') {
            return EnvironmentModule.friendlyUrlMap.solutions.to[entryPoint] || (fallbackToUnfriendlySegment ? entryPoint : null);
        }
        else if (entryPointType === 'tool') {
            return EnvironmentModule.friendlyUrlMap.tools.to[entryPoint] || (fallbackToUnfriendlySegment ? entryPoint : null);
        }
        return null;
    };
    /**
     * Gets a friendly url segment for an entry point
     * @param urlSegment the url segment.
     * @param entryPointType the type of entry point to look for.
     * @return string friendly url for the entry point
     */
    EnvironmentModule.getEntryPointFromFriendlyUrlSegment = function (urlSegment, entryPointType) {
        if (entryPointType === 'solution') {
            return EnvironmentModule.friendlyUrlMap.solutions.from[urlSegment];
        }
        else if (entryPointType === 'tool') {
            return EnvironmentModule.friendlyUrlMap.tools.from[urlSegment];
        }
        return null;
    };
    /**
     * Gets the connection type information.
     *
     * @param typeName the type name.
     * @return EnvironmentConnectionTypeInfo the connection type information.
     */
    EnvironmentModule.getConnectionTypeInfo = function (typeName) {
        return EnvironmentModule.getConnectionMap()[typeName];
    };
    EnvironmentModule.createConnectionMap = function () {
        var _this = this;
        var map = {};
        var providers = this.getEntryPointsByType(['connectionProvider']);
        providers.forEach(function (provider) {
            if (!provider.connectionTypeDefaultSolution) {
                var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.EnvironmentMissingDefault.message;
                throw new Error(message);
            }
            var solutionEntrypoint = EnvironmentModule.splitFormattedEntrypoint(provider.connectionTypeDefaultSolution);
            var solution = _this.getEntryPointsByType(['solution'])
                .first(function (ep) { return ep.parentModule.name === solutionEntrypoint.moduleName && ep.name === solutionEntrypoint.entrypointName; });
            // TODO [tiba]: default tool for connection type is going away. Delete the tool from this code when done.
            var tool = null;
            if (provider.connectionTypeDefaultTool) {
                var toolEntrypoint_1 = EnvironmentModule.splitFormattedEntrypoint(provider.connectionTypeDefaultTool);
                tool = _this.getEntryPointsByType(['tool'])
                    .first(function (ep) { return ep.parentModule.name === toolEntrypoint_1.moduleName && ep.name === toolEntrypoint_1.entrypointName; });
            }
            map[provider.connectionType] = { provider: provider, solution: solution, tool: tool };
            if (solution && solution.parentModule && solution.parentModule.name) {
                map[solution.parentModule.name] = map[provider.connectionType];
            }
        });
        return map;
    };
    /**
     * splits an entrypoint identifier string into its respective module and entrypoint names
     * @param format the formatted entrypoint identifier string
     */
    EnvironmentModule.splitFormattedEntrypoint = function (format) {
        var parts = format.split('!');
        return { moduleName: parts[0], entrypointName: parts[1] };
    };
    /**
     * creates a formatted entrypoint identifier string from an entrypoint
     * @param entryPoint the entrypoint to create the string from
     */
    EnvironmentModule.createFormattedEntrypoint = function (entryPoint) {
        return entryPoint.parentModule.name + "!" + entryPoint.name;
    };
    /**
     * resolves an entrypoint from a formatted entrypoint identifier string
     * @param formattedEntrypointIdentifier the formatted entrypoint identifier string
     */
    EnvironmentModule.resolveEntrypoint = function (formattedEntrypointIdentifier) {
        if (!formattedEntrypointIdentifier) {
            return null;
        }
        var parts = EnvironmentModule.splitFormattedEntrypoint(formattedEntrypointIdentifier);
        if (!parts.moduleName || !parts.entrypointName) {
            return null;
        }
        var entrypoints = this.getEntryPoints(function (ep) { return ep.name === parts.entrypointName && ep.parentModule.name === parts.moduleName; });
        return entrypoints[0] || null;
    };
    /**
     * Gets the name of current shell or module.
     */
    EnvironmentModule.getModuleName = function () {
        var self = MsftSme.self();
        return self.Init.moduleName;
    };
    /**
     * Gets the version of current shell or module.
     */
    EnvironmentModule.getModuleVersion = function () {
        var self = MsftSme.self();
        if (self.Environment.version) {
            return self.Environment.version;
        }
        for (var _i = 0, _a = self.Environment.modules; _i < _a.length; _i++) {
            var module_3 = _a[_i];
            if (module_3.name === self.Init.moduleName && module_3.version) {
                self.Environment.version = module_3.version;
                return module_3.version;
            }
        }
        return '0.0.0';
    };
    /**
     * Static mapping for connection information.
     */
    EnvironmentModule.connectionMap = null;
    /**
     * Static mapping for friendly url strings to entrypoint ids
     */
    EnvironmentModule.friendlyUrlMap = null;
    /**
     * The name of shell.
     */
    EnvironmentModule.nameOfShell = 'msft.sme.shell';
    /**
     * The default signature if missing manifest.
     */
    EnvironmentModule.defaultSignature = 'version 0.0.0';
    return EnvironmentModule;
}());
export { EnvironmentModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvbWFuaWZlc3QvZW52aXJvbm1lbnQtbW9kdWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3UEE7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSwwQkFlWDtBQWZELFdBQVksMEJBQTBCO0lBQ2xDOztPQUVHO0lBQ0gscUZBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsNkZBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsMkZBQVksQ0FBQTtBQUNoQixDQUFDLEVBZlcsMEJBQTBCLEtBQTFCLDBCQUEwQixRQWVyQztBQXFIRDs7R0FFRztBQUNIO0lBQUE7SUFvZEEsQ0FBQztJQXJXRzs7Ozs7O09BTUc7SUFDVyw4QkFBWSxHQUExQixVQUEyQixTQUFzQyxFQUFFLE1BQWMsRUFBRSxHQUFXO1FBQzFGLElBQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFFRCxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsSUFBTSxFQUFFLEdBQThCLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBQyxLQUFnQyxJQUFLLE9BQUEsS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQTFCLENBQTBCLENBQUMsQ0FBQztRQUN4SCxJQUFNLE9BQU8sR0FBOEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFDLEtBQWdDLElBQUssT0FBQSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1FBQzFILEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFH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QUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsVUFBVSxFQUE3RSxDQUE2RSxDQUFDLENBQUM7UUFDM0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ1csK0JBQWEsR0FBM0I7UUFDSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNXLGtDQUFnQixHQUE5QjtRQUNJLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBZSxVQUF3QixFQUF4QixLQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUF4QixjQUF3QixFQUF4QixJQUF3QjtZQUF0QyxJQUFJLFFBQU0sU0FBQTtZQUNYLEVBQUUsQ0FBQyxDQUFDLFFBQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksUUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFFBQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxRQUFNLENBQUMsT0FBTyxDQUFDO1lBQzFCLENBQUM7U0FDSjtRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQWxkRDs7T0FFRztJQUNZLCtCQUFhLEdBQXNELElBQUksQ0FBQztJQUV2Rjs7T0FFRztJQUNZLGdDQUFjLEdBQXFDLElBQUksQ0FBQztJQUV2RTs7T0FFRztJQUNXLDZCQUFXLEdBQUcsZ0JBQWdCLENBQUM7SUFFN0M7O09BRUc7SUFDVyxrQ0FBZ0IsR0FBRyxlQUFlLENBQUM7SUFpY3JELHdCQUFDO0NBcGRELEFBb2RDLElBQUE7U0FwZFksaUJBQWlCIiwiZmlsZSI6ImVudmlyb25tZW50LW1vZHVsZXMuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9