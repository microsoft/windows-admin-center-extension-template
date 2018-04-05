import { AjaxResponse } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { AppContextService } from '../../../../../angular';
import { QueryCache } from '../../../../../core';
export declare class AccessService {
    private appContextService;
    usersQueryCache: QueryCache<any, {}>;
    adminsQueryCache: QueryCache<any, {}>;
    constructor(appContextService: AppContextService);
    addSecurityGroup(name: string, type: string, section: string): Observable<boolean>;
    deleteSecurityGroup(name: string, type: string, section: string): Observable<boolean>;
    enableAadAuthentication(): Observable<AjaxResponse>;
    disableAadAuthentication(): Observable<AjaxResponse>;
    getAzureApplicationInfo(): Observable<any>;
    private getUsersSecurityGroups();
    private getAdminsSecurityGroups();
}
