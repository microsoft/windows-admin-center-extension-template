import { Observable } from 'rxjs';
import { AppContextService, DialogService } from '../../../../../../angular';
import { AccessService } from '../access.service';
import { SecurityGroupsData } from '../model/security-groups-data';
import { SecurityGroupActionBase } from './security-group-action.base';
export declare class AddSecurityGroupAction extends SecurityGroupActionBase<SecurityGroupsData> {
    protected appContextService: AppContextService;
    private accessService;
    protected dialogService: DialogService;
    section: string;
    text: string;
    iconClass: string;
    constructor(appContextService: AppContextService, accessService: AccessService, dialogService: DialogService, section: string);
    protected onExecute(target: SecurityGroupsData): Observable<SecurityGroupsData>;
    protected calculateEnabled(target: SecurityGroupsData): boolean;
}
