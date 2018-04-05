import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NativeQ, Net, RpcDeactivateState, RpcOpenState, RpcOutboundCommands } from '../../core';
import { AppContextService } from './app-context.service';
import { Navigation } from './navigation';
;
/**
 * Once initialize this class uses the underlying RPC channel
 * to communicate with the remote RPC service.
 */
var NavigationService = /** @class */ (function () {
    /**
     * Creates a new instance of this service
     */
    function NavigationService(appContextService, router, activatedRoute) {
        this.appContextService = appContextService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.navigationOptions = { skipLocationChange: true };
        this.dialogServiceMap = {};
        this.openContext = {
            state: null,
            requestedTime: 0,
            timer: null,
            deferred: null,
            error: null
        };
        this.deactivateContext = {
            state: null,
            requestedTime: 0,
            timer: null,
            deferred: null
        };
    }
    /**
     * Initialize navigation communication from/to the shell.
     *
     *  Registers the methods with the remote RPC defined in the manifest
     *  Subscribes to the router events and reports the breadcrumb items
     *  back to the rpc remote
     *
     * @param options The options to override the default behavior
     */
    NavigationService.prototype.initialize = function (options) {
        var _this = this;
        this.active = true;
        this.options = options ? options : { idleRoute: ['idle'] };
        // navigate to idle.
        this.router.navigate(this.options.idleRoute, this.navigationOptions);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .switchMap(function (event) { return Navigation.buildSelectablePathsForRoute(_this.appContextService, _this.activatedRoute.snapshot)
            .map(function (selectablePaths) { return ({ event: event, selectablePaths: selectablePaths }); }); })
            .subscribe(function (data) {
            // in the case of initial idle state, reporting url will cause rpc error. all other cases should be ok.
            if (_this.active && data.event.url !== ("/" + _this.options.idleRoute)) {
                _this.appContextService.rpc.report({
                    path: decodeURI(data.event.urlAfterRedirects),
                    beforeRedirectedPath: decodeURI(data.event.url),
                    selectablePath: data.selectablePaths
                });
            }
        });
        this.appContextService.rpc.register(RpcOutboundCommands.Init, this.onInit.bind(this));
        this.appContextService.rpc.register(RpcOutboundCommands.Open, this.onOpen.bind(this));
        this.appContextService.rpc.register(RpcOutboundCommands.Deactivate2, this.onDeactivate2.bind(this));
        this.appContextService.rpc.register(RpcOutboundCommands.Activate, this.onActivate.bind(this));
        this.appContextService.rpc.register(RpcOutboundCommands.Shutdown, this.onShutdown.bind(this));
        this.appContextService.rpc.register(RpcOutboundCommands.OverlayClose, this.onOverlayClose.bind(this));
    };
    /**
     * Shutdown the navigation communication from/to the shell.
     */
    NavigationService.prototype.shutdown = function () {
        this.active = false;
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    };
    /**
     * Map dialog service and dialog id so that correct dialog service instance can be found
     * @param dialogService dialog service to be registered
     * @param dialogId associated dialog id
     */
    NavigationService.prototype.registerDialogService = function (dialogService, dialogId) {
        this.dialogServiceMap[dialogId] = dialogService;
    };
    NavigationService.prototype.onInit = function (data) {
        this.active = true;
        return Promise.resolve();
    };
    /**
     * Call to dialog service to request close a dialog
     * @param data data object to close a dialog from shell
     */
    NavigationService.prototype.onOverlayClose = function (data) {
        var dialogService = this.dialogServiceMap[data.dialogId];
        var result = false;
        if (dialogService) {
            result = dialogService.overlayClicked(data.dialogId);
            delete this.dialogServiceMap[data.dialogId];
        }
        return Promise.resolve({ overlayClosed: result });
    };
    /**
     * Repeated open called until navigation is established or failed.
     *
     * @param data the RpcOpenData data.
     */
    NavigationService.prototype.onOpen = function (data) {
        var _this = this;
        var context = this.openContext;
        if (context.state != null) {
            var result = {
                waitedTime: Date.now() - context.requestedTime,
                state: this.openContext.state,
                error: context.error
            };
            if (context.state !== RpcOpenState.InProgress) {
                context.state = null;
                context.requestedTime = null;
            }
            return Promise.resolve(result);
        }
        context.requestedTime = Date.now();
        context.state = RpcOpenState.InProgress;
        context.deferred = NativeQ.defer();
        // set timeout to respond back status to shell.
        context.timer = setTimeout(function () {
            context.deferred.resolve({
                waitedTime: Date.now() - context.requestedTime,
                state: context.state
            });
            context.timer = null;
            context.deferred = null;
        }, NavigationService.initialWaitTime);
        this.appContextService.servicesReady
            .take(1)
            .flatMap(function () {
            var commands = [decodeURI(data.path)];
            if (data.parameters) {
                commands.push(data.parameters);
            }
            return _this.router.navigate(commands, _this.navigationOptions);
        })
            .map(function (success) {
            context.state = RpcOpenState.Opened;
            // if timer isn't fired yet, just complete with success navigation.
            if (context.timer) {
                clearTimeout(context.timer);
                context.deferred.resolve({
                    waitedTime: Date.now() - context.requestedTime,
                    state: context.state,
                    error: context.error
                });
                context.state = null;
                context.requestedTime = null;
                context.timer = null;
                context.deferred = null;
            }
        })
            .catch(function (error, caught) {
            context.state = RpcOpenState.Failed;
            var message = '';
            if (error && error.xhr) {
                message = Net.getErrorMessage(error);
            }
            else if (typeof error === 'string') {
                message = error;
            }
            else {
                if (error.stack) {
                    message = error.stack;
                }
                else if (error.message) {
                    message = error.message;
                }
            }
            context.error = message;
            // if timer isn't fired yet, just complete with error navigation.
            if (context.timer) {
                clearTimeout(context.timer);
                context.deferred.reject(context.error);
                context.state = null;
                context.requestedTime = null;
                context.timer = null;
                context.deferred = null;
            }
            return Observable.empty();
        })
            .subscribe();
        return context.deferred.promise;
    };
    /**
     * Repeated called until Guard is continued or cancelled.
     *
     * @param data the void data.
     */
    NavigationService.prototype.onDeactivate2 = function (data) {
        var _this = this;
        var context = this.deactivateContext;
        if (context.state != null) {
            var result = {
                waitedTime: Date.now() - context.requestedTime,
                state: context.state
            };
            if (context.state !== RpcDeactivateState.InProgress) {
                context.state = null;
                context.requestedTime = null;
            }
            return Promise.resolve(result);
        }
        // it's already inactive.
        if (!this.active) {
            return Promise.resolve({
                waitedTime: 0,
                state: RpcDeactivateState.Deactivated
            });
        }
        this.active = false;
        var current = decodeURI(this.router.url);
        context.requestedTime = Date.now();
        context.state = RpcDeactivateState.InProgress;
        context.deferred = NativeQ.defer();
        // set timeout to respond back status to shell.
        context.timer = setTimeout(function () {
            context.deferred.resolve({
                waitedTime: Date.now() - context.requestedTime,
                state: context.state
            });
            context.timer = null;
            context.deferred = null;
            // if it isn't in progress, reset the state.
            if (context.state !== RpcDeactivateState.InProgress) {
                context.state = null;
                context.requestedTime = null;
            }
        }, NavigationService.initialWaitTime);
        // try navigate to idle.
        this.router.navigate(this.options.idleRoute, this.navigationOptions)
            .then(function (success) {
            if (success) {
                // navigate away so inactive mode.
                _this.lastRoute = [current];
                context.state = RpcDeactivateState.Deactivated;
            }
            else {
                // navigate cancel so active mode.
                _this.active = true;
                context.state = RpcDeactivateState.Cancelled;
            }
            // if timer isn't fired yet, just complete with success navigation.
            if (context.timer) {
                clearTimeout(context.timer);
                context.deferred.resolve({
                    waitedTime: Date.now() - context.requestedTime,
                    state: context.state
                });
                context.timer = null;
                context.deferred = null;
                context.state = null;
                context.requestedTime = null;
            }
        });
        return context.deferred.promise;
    };
    NavigationService.prototype.onActivate = function (data) {
        var newRoute = this.lastRoute || [''];
        this.active = true;
        return this.router.navigate(newRoute, this.navigationOptions);
    };
    NavigationService.prototype.onShutdown = function (data) {
        return this.router.navigate(this.options.idleRoute, this.navigationOptions)
            .then(function (result) { return { canShutdown: result }; });
    };
    NavigationService.initialWaitTime = 2000;
    NavigationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NavigationService.ctorParameters = function () { return [
        { type: AppContextService, },
        { type: Router, },
        { type: ActivatedRoute, },
    ]; };
    return NavigationService;
}());
export { NavigationService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvc2VydmljZS9uYXZpZ2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLGVBQUEsQ0FBZ0I7QUFDM0MsT0FBTyxFQUFFLGNBQUEsRUFBd0MsYUFBQSxFQUFpRCxNQUFBLEVBQXlCLE1BQ2xILGlCQUFBLENBQWtCO0FBQzNCLE9BQU8sRUFBRSxVQUFBLEVBQXlCLE1BQU8sTUFBQSxDQUFPO0FBQ2hELE9BQU8sRUFPSCxPQUFPLEVBQ1AsR0FBRyxFQUVILGtCQUFrQixFQUdsQixZQUFZLEVBQ1osbUJBQW1CLEVBTXRCLE1BQU0sWUFBQSxDQUFhO0FBSXBCLE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLHVCQUFBLENBQXdCO0FBQzFELE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxjQUFBLENBQWU7QUFvQnpDLENBQUM7QUFHRjs7O0dBR0c7QUFDSDtJQXNCSTs7T0FFRztJQUNILDJCQUNZLGlCQUFvQyxFQUNwQyxNQUFjLEVBQ2QsY0FBOEI7UUFGOUIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBMUJsQyxzQkFBaUIsR0FBcUIsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUtuRSxxQkFBZ0IsR0FBdUMsRUFBRSxDQUFDO1FBQzFELGdCQUFXLEdBQThDO1lBQzdELEtBQUssRUFBRSxJQUFJO1lBQ1gsYUFBYSxFQUFFLENBQUM7WUFDaEIsS0FBSyxFQUFFLElBQUk7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLEtBQUssRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUNNLHNCQUFpQixHQUEwRDtZQUMvRSxLQUFLLEVBQUUsSUFBSTtZQUNYLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLEtBQUssRUFBRSxJQUFJO1lBQ1gsUUFBUSxFQUFFLElBQUk7U0FDakIsQ0FBQztJ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SSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVPLHNDQUFVLEdBQWxCLFVBQW1CLElBQXFCO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUM7YUFDdEUsSUFBSSxDQUFDLFVBQUEsTUFBTSxJQUFNLE1BQU0sQ0FBb0IsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBN1NjLGlDQUFlLEdBQUcsSUFBSSxDQUFDO0lBOFNuQyw0QkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7S0FDbkIsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLGdDQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxpQkFBaUIsR0FBRztRQUMzQixFQUFDLElBQUksRUFBRSxNQUFNLEdBQUc7UUFDaEIsRUFBQyxJQUFJLEVBQUUsY0FBYyxHQUFHO0tBQ3ZCLEVBSjZGLENBSTdGLENBQUM7SUFDRix3QkFBQztDQXhURCxBQXdUQyxJQUFBO1NBeFRZLGlCQUFpQiIsImZpbGUiOiJuYXZpZ2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9