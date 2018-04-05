import { OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppContextService, CommonSettingsComponentBase, ConfirmationDialogOptions, DialogService, SettingsFormService } from '../../../../angular';
import { Subscription } from 'rxjs/Subscription';
export declare class PanelBaseComponent<TModelData> extends CommonSettingsComponentBase implements OnInit, OnDestroy {
    protected appContextService: AppContextService;
    protected router: Router;
    protected activatedRoute: ActivatedRoute;
    protected formbuilder: FormBuilder;
    protected settingsFormService: SettingsFormService;
    protected dialogService: DialogService;
    formErrors: any;
    validationMessages: any;
    protected modelData: TModelData;
    settingName: string;
    subscription: Subscription;
    saving: boolean;
    sampleForm: FormGroup;
    constructor(appContextService: AppContextService, router: Router, activatedRoute: ActivatedRoute, formbuilder: FormBuilder, settingsFormService: SettingsFormService, dialogService: DialogService, formErrors: any, validationMessages: any, modelData: TModelData, settingName: string);
    ngOnInit(): void;
    ngOnDestroy(): void;
    confirmContinueEditingDialogOptions(dirtyForm: FormGroup, allForms: FormGroup[]): ConfirmationDialogOptions;
    onSaveClick(): void;
    onDiscardClick(): void;
    private onValueChanged(data?);
}
