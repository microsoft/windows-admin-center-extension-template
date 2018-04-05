import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService } from '../../angular';
import { EnvironmentModuleEntryPoint, EnvironmentModuleEntryPointWithToolConditionResult, GatewayInventory, InventoryQueryCaches } from '../../core';
export interface ShellRoutingParameters {
    solutionFriendlyName?: string;
    solutionId?: string;
    solution?: EnvironmentModuleEntryPoint;
    toolId?: string;
    toolUrl?: string[];
    toolFriendlyName?: string;
    tool?: EnvironmentModuleEntryPoint;
    connectionName?: string;
    connectionType?: string;
    connectionFriendlyType?: string;
}
export declare const routeParts: {
    solutionId: string;
    toolId: string;
    toolUrl: string;
    tools: string;
    connections: string;
    connectionName: string;
    connectionType: string;
};
export declare enum ApplicationErrorType {
    UnsupportedBrowser = 0,
    Generic = 1,
    Forbidden = 2,
}
export declare class RouteHelpers {
    static appModeConnectionName: string;
    static queryParams: {
        disableDayZero: string;
    };
    static getFullRouteParams(route: ActivatedRouteSnapshot): MsftSme.StringMap<string>;
    static getFullShellRoutingParameters(route: ActivatedRouteSnapshot): ShellRoutingParameters;
    static getShellRoutingParameters(params: MsftSme.StringMap<string>): ShellRoutingParameters;
    private static resolveEntryPointOfType(id, entryPointType);
    static navigateToHome(router: Router): Promise<boolean>;
    static navigateToAppHome(router: Router, gateway: GatewayInventory): Promise<boolean>;
    /**
     * navigates to an error page
     * @param router The angular router
     * @param errorType the type of error to navigate to
     * @param queryParams the parameters for the error
     * @param navViaHref indicates that angular routing wont work, therfore use window.location.href
     */
    static navigateToError(router: Router, errorType: ApplicationErrorType, queryParams?: MsftSme.StringMap<string>, navViaHref?: boolean): Promise<boolean>;
    static navigateToSolution(router: Router, solutionEntryPoint: EnvironmentModuleEntryPoint): Promise<boolean>;
    static navigateToConnections(router: Router, solutionEntryPoint?: EnvironmentModuleEntryPoint): Promise<boolean>;
    static navigateToConnection(router: Router, connectionType: string, connectionName: string, solution?: EnvironmentModuleEntryPoint): Promise<boolean>;
    static navigateToTool(router: Router, params: ShellRoutingParameters, appendTools?: boolean): Promise<boolean>;
    static navigateByParams(router: Router, params: ShellRoutingParameters): Promise<boolean>;
    static getBaseToolsRoute(params: ShellRoutingParameters): string[];
    static queryToolsListFromShellParameters(appContextService: AppContextService, caches: InventoryQueryCaches, params: ShellRoutingParameters): Observable<EnvironmentModuleEntryPointWithToolConditionResult[]>;
    static getDefaultToolForSolution(appContextService: AppContextService, params: ShellRoutingParameters): EnvironmentModuleEntryPoint;
    static getToolsListFromShellParametersSimple(appContextService: AppContextService, params: ShellRoutingParameters): EnvironmentModuleEntryPoint[];
}
