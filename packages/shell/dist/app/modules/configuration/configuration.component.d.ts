import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppContextService, CommonSettingsComponentBase, CommonSettingsNavigationItem, ConfirmationDialogOptions } from '../../../angular';
import { Strings } from '../../../generated/Strings';
export declare class ConfigurationComponent extends CommonSettingsComponentBase implements OnInit {
    private appContextService;
    private router;
    strings: Strings;
    settingItems: CommonSettingsNavigationItem[];
    private statusSubscription;
    private accessSubscription;
    static navigationTitle(appContextService: AppContextService, snapshot: ActivatedRouteSnapshot): string;
    constructor(appContextService: AppContextService, router: Router);
    confirmContinueEditingDialogOptions(dirtyForm: FormGroup, allForms: FormGroup[]): ConfirmationDialogOptions;
    ngOnInit(): void;
    onDestroy(): void;
    private showAlert(message, state);
    onCloseClick(): void;
}
