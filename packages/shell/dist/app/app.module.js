var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, UrlTree } from '@angular/router';
import { AlertBarModule, AppContextService, AppErrorHandler, BackdropModule, CoreServiceModule, DialogModule, GuidedPanelModule, IconModule, LoadingWheelModule, NodeCredentialsFormModule, PipesModule, ResourceService, SmeFormsModule, SmeStylesComponent, SmeStylesModule, TooltipModule } from '../angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBarModule } from './modules/app-bar/app-bar.module';
import { AboutDialogComponent } from './modules/dialogs/about-dialog/about-dialog.component';
import { AddConnectionDialogComponent } from './modules/dialogs/add-connection-dialog/add-connection-dialog.component';
import { AddConnectionFrameComponent } from './modules/dialogs/add-connection-dialog/add-connection-frame/add-connection-frame.component';
import { DayZeroDialogComponent } from './modules/dialogs/day-zero-dialog/day-zero-dialog.component';
import { EditTagsDialogComponent } from './modules/dialogs/edit-tags-dialog/edit-tags-dialog.component';
import { ManageAsDialogComponent } from './modules/dialogs/manage-as-dialog/manage-as-dialog.component';
import { NotificationsDialogComponent } from './modules/dialogs/notifications-dialog/notifications-dialog.component';
import { DevGuardService } from './dev-guard.service';
import { IFrameService } from './modules/iframe/iframe.service';
import { UserProfileService } from './modules/user-profile/user-profile.service';
import { ShellGuardService } from './shell-guard.service';
import { ShellComponent } from './shell.component';
import { ShellService } from './shell.service';
import { ApplicationErrorType, RouteHelpers } from './utility/route-helpers';
import { WebModeGuardService } from './web-mode-guard.service';
var AppModule = /** @class */ (function () {
    /**
     * Initializes a new instance of the AppModule class.
     * @param router the router object.
     */
    function AppModule(router, appContextService) {
        this.router = router;
        this.appContextService = appContextService;
        // override prime ng context menu
        SmeStylesComponent.overridePrimeNgContextMenu();
        // override navigate by url
        this.navigateByUrlOriginal = router.navigateByUrl.bind(router);
        router.navigateByUrl = this.navigateByUrlOverride.bind(this);
        // listen for forbidden changes from gatewayService
        // this subscription does not need to be cleaned up as it is for the lifetime of the entire application
        appContextService.gateway.onForbidden.subscribe(function () {
            RouteHelpers.navigateToError(router, ApplicationErrorType.Forbidden);
            router.navigateByUrl('/errors/forbidden');
        });
    }
    /*
    * Override for the routers main navigation method.
    *
    * WHY?: Angular does not provide a global implementation to preserve query parameters when routing.
    * The one capability they do provide is the 'preservequeryparams' flag in navigation extras.
    * However this does not work with query strings entered by the user on the first url of the site.
    * It also does not work for query strings on the root url. (ie: http://mygateway?param=x)
    *
    * SOLUTION: what we can do is wrap their function with our own that preserves known query parameters before navigating.
    * we do this by reading the current parameters and then merging them with what the router passed in extras.queryParams
    *
    * TODO:
    *   1. Every new version of angular we try, we should see if there is a new way to handle globally preserving query parameters
    *   2. We should provide this override in the our ng2 library so that tool modules can use the same functionality. (done)
    *
    * PROBLEMS:
    *   1. This method prevents the removal of query parameters. Currently this is not a problem but may be in the future.
    *
    */
    AppModule.prototype.navigateByUrlOverride = function (url, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        var queryParams = this.router.parseUrl(window.location.search).queryParams;
        if (!(url instanceof UrlTree)) {
            // url parameter preservation does not work on string urls either. convert to UrlTree.
            url = this.router.parseUrl(url);
        }
        // preserve the existing query params and extend with the new ones.
        if (url.queryParams) {
            queryParams = __assign({}, queryParams, url.queryParams);
        }
        url.queryParams = queryParams;
        extras.queryParams = queryParams;
        extras.queryParamsHandling = MsftSme.isNullOrUndefined(extras.queryParamsHandling) ? 'merge' : extras.queryParamsHandling;
        return this.navigateByUrlOriginal(url, extras);
    };
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AppComponent,
                        ShellComponent,
                        AboutDialogComponent,
                        AddConnectionDialogComponent,
                        AddConnectionFrameComponent,
                        DayZeroDialogComponent,
                        EditTagsDialogComponent,
                        ManageAsDialogComponent,
                        NotificationsDialogComponent
                    ],
                    imports: [
                        CoreServiceModule,
                        CommonModule,
                        BrowserModule,
                        DialogModule,
                        FormsModule,
                        SmeFormsModule,
                        SmeStylesModule,
                        IconModule,
                        LoadingWheelModule,
                        GuidedPanelModule,
                        PipesModule,
                        AppRoutingModule,
                        PipesModule,
                        AlertBarModule,
                        ReactiveFormsModule,
                        AppBarModule,
                        BackdropModule,
                        NodeCredentialsFormModule,
                        TooltipModule.forRoot()
                    ],
                    providers: [
                        ShellService,
                        ResourceService,
                        IFrameService,
                        ShellGuardService,
                        DevGuardService,
                        UserProfileService,
                        WebModeGuardService,
                        {
                            provide: ErrorHandler,
                            useClass: AppErrorHandler
                        }
                    ],
                    bootstrap: [AppComponent]
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = function () { return [
        { type: Router, },
        { type: AppContextService, },
    ]; };
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=data:application/json;base64,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