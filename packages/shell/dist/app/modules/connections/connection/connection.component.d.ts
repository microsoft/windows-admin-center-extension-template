import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppContextService } from '../../../../angular';
import { GatewayInventory, GatewayMode } from '../../../../core';
import { ShellService } from '../../../shell.service';
export declare class ConnectionComponent implements OnInit, OnDestroy {
    private route;
    private router;
    private appContextService;
    private shellService;
    strings: {
        title: string;
        nodeNameHeader: string;
        nodeTypeHeader: string;
        nodeStatusHeader: string;
        nodeOsHeader: string;
        nodeManagingAsHeader: string;
        nodeTagsHeader: string;
        nodeLastConnectedHeader: string;
        connectionTypeHeader: string;
        neverConnectedText: string;
        actions: {
            add: string;
            remove: string;
            editTags: string;
            connect: string;
            manageAs: string;
            manageAsLaps: string;
            refreshServer: string;
            search: {
                placeholder: string;
            };
        };
        empty: {
            loading: string;
            none: string;
        };
        nodeOs: {
            Nano: string;
            Server2016: string;
            Server2012: string;
            cluster: string;
        };
        gettingStarted: {
            title: {
                format: string;
            };
        };
        serverStatus: {
            connecting: string;
            loading: string;
            unreachable: string;
            ready: string;
            unauthorized: string;
            unknown: string;
            untrusted: string;
            unsupported: string;
            wmiProvidersNotInstalled: string;
            wmfNotPresent: string;
            prerequisitesNotMet: string;
        };
        listStatus: {
            message: string;
        };
        dialogs: {
            remove: {
                title: string;
                messageFormat: string;
                multiMessageFormat: string;
                cancelButtonText: string;
                confirmButtonText: string;
                error: {
                    titleFormat: string;
                };
            };
            elevate: {
                confirmButtonText: string;
                cancelButtonText: string;
                elevateGatewayTitle: string;
                elevateGatewayMessage: string;
            };
            add: {
                title: string;
                typeTitleFormat: string;
                sideLoadWarning: string;
                tags: {
                    label: string;
                };
                buttons: {
                    cancel: string;
                };
            };
        };
        Dialogs: {
            Buttons: {
                Close: {
                    label: string;
                };
            };
        };
        User: {
            Error: {
                title: string;
            };
        };
        RbacBadge: {
            label: string;
            tooltip: string;
        };
    };
    connectionName: string;
    rbacConnection: boolean;
    gateway: GatewayInventory;
    gatewayMode: typeof GatewayMode;
    private subscription;
    private gatewaySubscription;
    constructor(route: ActivatedRoute, router: Router, appContextService: AppContextService, shellService: ShellService);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
