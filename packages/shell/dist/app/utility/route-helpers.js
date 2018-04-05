import { Observable } from 'rxjs';
import { connectionTypeConstants, ConnectionUtility, EnvironmentModule } from '../../core';
export var routeParts = {
    solutionId: 'solutionId',
    toolId: 'toolId',
    toolUrl: 'toolUrl',
    tools: 'tools',
    connections: 'connections',
    connectionName: 'connectionName',
    connectionType: 'connectionType'
};
export var ApplicationErrorType;
(function (ApplicationErrorType) {
    ApplicationErrorType[ApplicationErrorType["UnsupportedBrowser"] = 0] = "UnsupportedBrowser";
    ApplicationErrorType[ApplicationErrorType["Generic"] = 1] = "Generic";
    ApplicationErrorType[ApplicationErrorType["Forbidden"] = 2] = "Forbidden";
})(ApplicationErrorType || (ApplicationErrorType = {}));
;
var RouteHelpers = /** @class */ (function () {
    function RouteHelpers() {
    }
    RouteHelpers.getFullRouteParams = function (route) {
        // combine all parts of the route to get the complete picture of the route parameters
        var params = {};
        var parent = route;
        while (parent) {
            params = Object.assign({}, parent.params, params);
            parent = parent.parent;
        }
        // walk down the primary outlet chain ar well
        var child = route;
        while (child.firstChild) {
            params = Object.assign({}, params, child.firstChild.params);
            if (!child.firstChild.firstChild) {
                params = Object.assign({}, params, { toolUrl: child.firstChild.url.map(function (segment) { return segment.path; }).join('/') });
            }
            child = child.firstChild;
        }
        if (params.connectionName) {
            params.connectionName = params.connectionName.toLowerCase();
        }
        return params;
    };
    RouteHelpers.getFullShellRoutingParameters = function (route) {
        var params = RouteHelpers.getFullRouteParams(route);
        return RouteHelpers.getShellRoutingParameters(params);
    };
    RouteHelpers.getShellRoutingParameters = function (params) {
        var result = {};
        if (params[routeParts.toolUrl]) {
            result.toolUrl = params[routeParts.toolUrl].split('/');
        }
        // handle connection properties
        result.connectionName = params[routeParts.connectionName];
        var connectionTypeName = params[routeParts.connectionType];
        result.connectionType = EnvironmentModule.getConnectionTypeFromFriendlyUrlSegment(connectionTypeName);
        if (result.connectionType) {
            result.connectionFriendlyType = connectionTypeName;
        }
        else {
            result.connectionType = connectionTypeName;
        }
        // handle solution properties
        var solutionName = params[routeParts.solutionId];
        result.solutionId = EnvironmentModule.getEntryPointFromFriendlyUrlSegment(solutionName, 'solution');
        if (result.solutionId) {
            result.solutionFriendlyName = solutionName;
        }
        else {
            result.solutionId = solutionName;
        }
        result.solution = RouteHelpers.resolveEntryPointOfType(result.solutionId, 'solution');
        // handle tool properties
        var toolName = params[routeParts.toolId];
        result.toolId = EnvironmentModule.getEntryPointFromFriendlyUrlSegment(toolName, 'tool');
        if (result.toolId) {
            result.toolFriendlyName = toolName;
        }
        else {
            result.toolId = toolName;
        }
        result.tool = RouteHelpers.resolveEntryPointOfType(result.toolId, 'tool');
        return result;
    };
    RouteHelpers.resolveEntryPointOfType = function (id, entryPointType) {
        if (id) {
            var entryPoint = EnvironmentModule.resolveEntrypoint(id);
            if (entryPoint && entryPoint.entryPointType === entryPointType) {
                return entryPoint;
            }
        }
        return null;
    };
    RouteHelpers.navigateToHome = function (router) {
        return router.navigateByUrl('/');
    };
    RouteHelpers.navigateToAppHome = function (router, gateway) {
        return this.navigateToConnection(router, connectionTypeConstants.windowsClient, RouteHelpers.appModeConnectionName);
    };
    /**
     * navigates to an error page
     * @param router The angular router
     * @param errorType the type of error to navigate to
     * @param queryParams the parameters for the error
     * @param navViaHref indicates that angular routing wont work, therfore use window.location.href
     */
    RouteHelpers.navigateToError = function (router, errorType, queryParams, navViaHref) {
        if (queryParams === void 0) { queryParams = null; }
        if (navViaHref === void 0) { navViaHref = false; }
        var errorRoute;
        switch (errorType) {
            case ApplicationErrorType.UnsupportedBrowser: {
                errorRoute = 'unsupported-browser';
                break;
            }
            case ApplicationErrorType.Forbidden: {
                errorRoute = 'forbidden';
                break;
            }
            case ApplicationErrorType.Generic:
            default: {
                errorRoute = '';
            }
        }
        var url = MsftSme.isNullOrWhiteSpace(errorRoute) ? 'errors' : "errors/" + errorRoute;
        if (!navViaHref) {
            return router.navigateByUrl("/" + url, { queryParams: queryParams });
        }
        var search = MsftSme.isNullOrUndefined(queryParams)
            ? ''
            : Object.keys(queryParams)
                .map(function (key) { return key + "=" + queryParams[key]; })
                .join('&');
        if (!MsftSme.isNullOrWhiteSpace(search)) {
            search = "?" + search;
        }
        window.location.href = "" + url + (search || '');
        return Promise.resolve(true);
    };
    RouteHelpers.navigateToSolution = function (router, solutionEntryPoint) {
        var solutionId = EnvironmentModule.createFormattedEntrypoint(solutionEntryPoint);
        return router.navigate(['/', EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(solutionId, 'solution')]);
    };
    RouteHelpers.navigateToConnections = function (router, solutionEntryPoint) {
        if (!solutionEntryPoint) {
            // go to all connections
            RouteHelpers.navigateToHome(router);
        }
        // go to solution connections
        var solutionId = EnvironmentModule.createFormattedEntrypoint(solutionEntryPoint);
        return router.navigate([
            '/',
            EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(solutionId, 'solution'),
            routeParts.connections
        ]);
    };
    RouteHelpers.navigateToConnection = function (router, connectionType, connectionName, solution) {
        var route = ['/'];
        if (solution) {
            // go to solution connection
            var solutionId = EnvironmentModule.createFormattedEntrypoint(solution);
            route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(solutionId, 'solution'));
        }
        else {
            // go to connection types default solution connection
            var typeInfo = EnvironmentModule.getConnectionTypeInfo(connectionType);
            var solutionId = EnvironmentModule.createFormattedEntrypoint(typeInfo.solution);
            route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(solutionId, 'solution'));
        }
        var connectionTypeName = EnvironmentModule.getFriendlyUrlSegmentForConnectionType(connectionType);
        route.push(routeParts.connections, connectionTypeName, connectionName);
        return router.navigate(route);
    };
    RouteHelpers.navigateToTool = function (router, params, appendTools) {
        if (appendTools === void 0) { appendTools = null; }
        var route = ['/'];
        if (appendTools === null) {
            appendTools = params.solution.tools && params.solution.tools.enabled;
        }
        if (params.solution) {
            appendTools = appendTools && params.solution.tools && params.solution.tools.enabled;
            route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(params.solutionId, 'solution'));
            if (params.solution.rootNavigationBehavior === 'connections') {
                route.push(routeParts.connections);
                if (params.connectionName && params.connectionType) {
                    var connectionTypeName = EnvironmentModule.getFriendlyUrlSegmentForConnectionType(params.connectionType);
                    route.push(connectionTypeName, params.connectionName);
                }
                else {
                    appendTools = false;
                }
            }
            if (appendTools) {
                route.push(routeParts.tools);
                if (params.toolId) {
                    route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(params.toolId, 'tool'));
                    route.push.apply(route, params.toolUrl);
                }
            }
        }
        return router.navigate(route);
    };
    RouteHelpers.navigateByParams = function (router, params) {
        var route = ['/'];
        if (params.solution) {
            route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(params.solutionId, 'solution'));
            if (params.solution.rootNavigationBehavior === 'connections') {
                route.push(routeParts.connections);
                if (params.connectionType && params.connectionName) {
                    var connectionTypeName = EnvironmentModule.getFriendlyUrlSegmentForConnectionType(params.connectionType);
                    route.push(connectionTypeName, params.connectionName);
                }
                else {
                    return router.navigate(route);
                }
            }
            if (params.solution.tools && params.solution.tools.enabled) {
                route.push(routeParts.tools);
                if (params.toolId) {
                    route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(params.toolId, 'tool'));
                    route.push.apply(route, params.toolUrl);
                }
            }
        }
        return router.navigate(route);
    };
    RouteHelpers.getBaseToolsRoute = function (params) {
        var route = ['/'];
        if (params.solution) {
            route.push(EnvironmentModule.getFriendlyUrlSegmentForEntryPoint(params.solutionId, 'solution'));
            if (params.solution.rootNavigationBehavior === 'connections') {
                var connectionTypeName = EnvironmentModule.getFriendlyUrlSegmentForConnectionType(params.connectionType);
                route.push(routeParts.connections, connectionTypeName, params.connectionName);
            }
            if (params.solution.tools && params.solution.tools.enabled) {
                route.push(routeParts.tools);
            }
        }
        return route;
    };
    RouteHelpers.queryToolsListFromShellParameters = function (appContextService, caches, params) {
        var connection = appContextService.connectionManager.connections
            .find(function (c) { return c.name === params.connectionName && c.type === params.connectionType; });
        if (!connection || !params.solution) {
            return Observable.of([]);
        }
        return ConnectionUtility.queryToolsList(appContextService, caches, connection, params.solution);
    };
    RouteHelpers.getDefaultToolForSolution = function (appContextService, params) {
        if (!params.solution || !params.solution.tools || !params.solution.tools.enabled || !params.solution.tools.defaultTool) {
            return null;
        }
        var tools = RouteHelpers.getToolsListFromShellParametersSimple(appContextService, params);
        return tools.find(function (tool) {
            return tool.name === params.solution.tools.defaultTool
                && tool.parentModule.name === params.solution.parentModule.name;
        });
    };
    RouteHelpers.getToolsListFromShellParametersSimple = function (appContextService, params) {
        var connection = appContextService.connectionManager.connections
            .find(function (c) { return c.name === params.connectionName && c.type === params.connectionType; });
        if (!connection || !params.solution) {
            return [];
        }
        return ConnectionUtility.getToolsList(connection, params.solution);
    };
    RouteHelpers.appModeConnectionName = 'localhost';
    RouteHelpers.queryParams = {
        disableDayZero: 'disableDayZero'
    };
    return RouteHelpers;
}());
export { RouteHelpers };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlsaXR5L3JvdXRlLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBaUIsTUFBTSxNQUFNLENBQUM7QUFHakQsT0FBTyxFQUVILHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsaUJBQWlCLEVBT3BCLE1BQU0sWUFBWSxDQUFDO0FBZXBCLE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBRztJQUN0QixVQUFVLEVBQUUsWUFBWTtJQUN4QixNQUFNLEVBQUUsUUFBUTtJQUNoQixPQUFPLEVBQUUsU0FBUztJQUNsQixLQUFLLEVBQUUsT0FBTztJQUNkLFdBQVcsRUFBRSxhQUFhO0lBQzFCLGNBQWMsRUFBRSxnQkFBZ0I7SUFDaEMsY0FBYyxFQUFFLGdCQUFnQjtDQUNuQyxDQUFDO0FBRUYsTUFBTSxDQUFOLElBQVksb0JBSVg7QUFKRCxXQUFZLG9CQUFvQjtJQUM1QiwyRkFBa0IsQ0FBQTtJQUNsQixxRUFBTyxDQUFBO0lBQ1AseUVBQVMsQ0FBQTtBQUNiLENBQUMsRUFKVyxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBSS9CO0FBQUEsQ0FBQztBQUVGO0lBQUE7SUFpU0EsQ0FBQztJQXpSaUIsK0JBQWtCLEdBQWhDLFVBQWlDLEtBQTZCO1FBQzFELHFGQUFxRjtRQUNyRixJQUFJLE1BQU0sR0FBOEIsRUFBRSxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNuQixPQUFPLE1BQU0sRUFBRSxDQUFDO1lBQ1osTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEQsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsQ0FBQztRQUVELDZDQUE2QztRQUM3QyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbEIsT0FBTyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDdEIsTUFBTSxH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