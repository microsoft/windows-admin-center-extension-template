import { OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppContextService } from '../../../angular';
import { ShellService } from '../../shell.service';
export declare class OverviewComponent implements OnInit, OnDestroy {
    private appContextService;
    private shellService;
    strings: {
        Overview: {
            title: string;
            gatewayStatus: {
                header: string;
                versionHeader: string;
                lastUpdatedHeader: string;
                buildNumberHeader: string;
                updateAvailable: string;
                smeUpdate: string;
                smeUpdateUri: string;
                error: string;
            };
            feedback: {
                header: string;
                link: {
                    text: string;
                    href: string;
                };
            };
        };
        Connections: {
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
        Shell: {
            applicationTitle: string;
            applicationVersionFormat: string;
            applicationTitleAppModeSuffix: string;
            welcomeMessage: string;
            settings: string;
            nodeLabel: string;
            userLabel: string;
            changeConnection: string;
            getUserProfileError: string;
        };
        AppBar: {
            Buttons: {
                Notifications: {
                    title: string;
                    desc: {
                        format: string;
                    };
                };
                Settings: {
                    title: string;
                };
                Help: {
                    title: string;
                };
            };
            Logo: {
                title: string;
            };
            Nav: {
                Landmark: {
                    Primary: {
                        aria: {
                            label: string;
                        };
                    };
                };
            };
        };
        Errors: {
            UnsupportedBrowser: {
                title: string;
            };
            UnsupportedBrowserCommon: {
                message: string;
            };
            UnsupportedBrowserFootBegin: {
                message: string;
            };
            UnsupportedBrowserBody: {
                message: string;
            };
            UnsupportedBrowserFootEnd: {
                message: string;
            };
            GenericError: {
                navigationTitle: string;
                title: string;
                message: string;
                refreshText: string;
                feedbackInstructions: string;
            };
            ForbiddenError: {
                navigationTitle: string;
                title: string;
                message: string;
            };
            UserProfile: {
                Get: {
                    formatMessage: string;
                };
                Put: {
                    formatMessage: string;
                };
            };
        };
        Sidebar: {
            launchTitle: string;
            menuTitle: string;
            homeTitle: string;
            connectionsTitle: string;
            generalTitle: string;
            sideLoadWarning: string;
            connectionOverviewTitle: string;
            toolsTitle: string;
            expand: string;
            collapse: string;
            searchPlaceholder: string;
            Nav: {
                Landmark: {
                    Secondary: {
                        aria: {
                            label: string;
                        };
                    };
                };
            };
            Aria: {
                selected: string;
                nonSelected: string;
            };
        };
        SolutionsList: {
            solutionSelector: string;
            installedSolutions: string;
            sideLoadWarning: string;
            getMore: string;
            settings: string;
        };
        SolutionConnections: {
            connections: {
                title: {
                    format: string;
                };
                sidebar: {
                    landmark: {
                        aria: {
                            label: string;
                        };
                    };
                };
            };
        };
        IFrame: {
            Reload: {
                label: string;
            };
            Cancel: {
                label: string;
            };
            FailedLoad: {
                title: string;
                message: string;
            };
            ErrorDescription: {
                title: string;
            };
            LoadTime: {
                message: string;
            };
            LoadingCanceled: {
                message: string;
            };
            TakingLonger: {
                message: string;
            };
            TakingLongerCancelling: {
                message: string;
            };
        };
        AboutDialog: {
            Disclosure: {
                text: string;
            };
            EULA: {
                text: string;
            };
            KeyboardShortcuts: {
                text: string;
                DataTable: {
                    text: string;
                };
                Global: {
                    text: string;
                };
            };
            Privacy: {
                text: string;
            };
            Version: {
                label: string;
            };
        };
        KeyboardShortcuts: {
            DataTable: {
                HomeEnd: {
                    description: string;
                };
                LeftRightArrows: {
                    description: string;
                };
                PageUpPageDown: {
                    description: string;
                };
                UpDownArrows: {
                    description: string;
                };
            };
            Global: {
                Arrows: {
                    description: string;
                };
                CtrlAltA: {
                    description: string;
                };
                HomeEnd: {
                    description: string;
                };
                TabShiftTab: {
                    description: string;
                };
            };
        };
        ManageAsDialog: {
            messageFormat: string;
            messageCountFormat: string;
            title: string;
            validatingMessage: string;
            authError: string;
        };
        EditTagsDialog: {
            title: string;
            AddTags: {
                label: string;
            };
            RemoveTags: {
                label: string;
            };
        };
        NotificationsState: {
            failed: string;
            succeeded: string;
            inProgress: string;
        };
        NotificationsDialog: {
            clear: string;
            clearAll: string;
            goTo: string;
            title: string;
            Details: {
                AriaTitle: string;
            };
            IndeterminateProgress: {
                AriaValueText: string;
                AriaLabel: string;
            };
            DeterminateProgress: {
                AriaLabel: string;
            };
        };
        SettingsDialog: {
            title: string;
            language: string;
            general: string;
            manageExtensions: string;
            extensions: string;
            connection: string;
            port: string;
            certificateThumbprint: string;
            azure: {
                title: string;
                aad: string;
                notConfigured: string;
                configureHelp: string;
                setupAad: string;
                tenant: string;
                currentUser: string;
                modifyOrDisableAad: string;
                createAccount: string;
                signOut: string;
            };
            ConfirmationDialog: {
                Discard: string;
                Continue: string;
                Message: string;
                Title: string;
            };
            access: {
                search: string;
                description: string;
                gatewayUsers: string;
                gatewayAdmins: string;
                addSecurityGroupHeader: string;
                addSecurityGroupMessage: string;
                securityGroupName: string;
                securityGroupType: string;
                securityGroup: string;
                smartCardSecurityGroup: string;
                machineSecurityGroup: string;
                save: string;
                cancel: string;
                close: string;
                toolTitle: string;
                users: string;
                admins: string;
                NameTitle: string;
                typeTitle: string;
                startedAddingGroup: string;
                addedGroup: string;
                removedGroup: string;
                add: string;
                delete: string;
                deleteConfirmation: string;
                yes: string;
                no: string;
                nameTitle: string;
                currentType: string;
                changeType: string;
                learnMore: string;
                learnMoreAboutControlling: string;
                controlUsing: string;
                onPrem: string;
                azureAd: string;
                connectToGateway: string;
                connectToGatewayDesc: string;
                connectToGatewayTitle: string;
                connectStep1: string;
                connectStep2: string;
                connectStep3: string;
                manageTitle: string;
                manageDesc: string;
                manageSubTitle: string;
                manageStep1: string;
                manageStep2: string;
                manageStep3: string;
                manageStep4: string;
                saveWarning: string;
                manageGuide: string;
                manageNote: string;
                aadSuccessMessage: string;
                adSuccessMessage: string;
                accessControlType: {
                    azureAD: string;
                    onPrem: string;
                };
            };
        };
        DayZeroDialog: {
            Next: string;
            Back: string;
            Finish: string;
            SkipTour: string;
            Page1: {
                Title: string;
                Subtext: string;
            };
            Page2: {
                Title: string;
                Subtext: string;
            };
        };
    };
    gatewayError: string;
    gatewayLastUpdated: string;
    statusSubscription: Subscription;
    isUpdateAvailable: boolean;
    latestGatewayVersion: string;
    constructor(appContextService: AppContextService, shellService: ShellService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private getGatewayInventory();
}
