var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Net, NotificationState } from '../../../core';
import { AppContextService } from '../../service/app-context.service';
import { Deprecated } from '../common';
import { DialogCloseReason } from './dialog.component';
var DialogService = /** @class */ (function () {
    function DialogService(appContext) {
        this.appContext = appContext;
        this.commonIds = {
            confirmation: 'sme-common-confirmation-dialog',
            confirmationList: 'sme-common-confirmation-list-dialog',
            message: 'sme-common-message-dialog',
            notifications: 'sme-common-notifications-pane',
            settings: 'sme-common-settings-pane',
            help: 'sme-common-help-pane',
            userPane: 'sme-common-user-pane',
            manageAs: 'sme-common-manage-as-dialog'
        };
        this.activeDialogsStack = [];
        this.componentMap = {};
        this.dialogOrigins = {};
    }
    /**
     * Registers the dialog with the service.
     *
     * @type TOptions the type of the dialog options.
     * @type TResult the type of the dialog results.
     * @param id The unique identifier of the dialog.
     * @param component The dialog component.
     */
    DialogService.prototype.register = function (id, component) {
        if (!id) {
            throw new Error('DialogService.register: ID is required to register a dialog.');
        }
        if (!component) {
            throw new Error('DialogService.register: A dialog is required to register a dialog.');
        }
        /**
         * removing until we understand cases where angular can call ngOnInit twice.
         * see: http://stackoverflow.com/questions/42700116/angular2-routing-issue-and-ngoninit-called-twice
         * and @msft-sme/local-users-groups for examples
         */
        // if (this.componentMap[id]) {
        //     console.warn(`DialogService.register: A dialog with the ID \'${id}\' has already been registered`);
        // }
        this.componentMap[id] = component;
    };
    /**
     * Unregisters the dialog with the service.
     *
     * @param id The unique identifier of the dialog.
     */
    DialogService.prototype.unregister = function (id) {
        if (this.componentMap[id]) {
            delete this.componentMap[id];
        }
        if (this.activeDialogsStack && this.activeDialogsStack.length > 0 && MsftSme.last(this.activeDialogsStack).id === id) {
            this.activeDialogsStack.pop();
        }
    };
    /**
     * Shows the dialog.
     *
     * @type TOptions The type of the dialog options.
     * @type TResult The result of the dialog.
     * @param id The unique identifier of the dialog.
     * @param options The dialog options.
     */
    DialogService.prototype.show = function (id, options) {
        var _this = this;
        if (!id) {
            throw new Error('DialogService.show: ID is required to show a dialog.');
        }
        if (!this.componentMap[id]) {
            throw new Error("DialogService.show: No dialog associated with provided ID '" + id + "'.");
        }
        var newDialog = this.componentMap[id];
        var oldDialog = MsftSme.last(this.activeDialogsStack);
        // accessibility
        if (options && !options.isFromRpc) {
            var origin = document.activeElement;
            if (origin) {
                this.dialogOrigins[id] = origin;
            }
        }
        // dont do anything unless we have a subscriber
        return Observable.of(oldDialog).flatMap(function (it) {
            // create a placeholder for the new dialog result
            var resultObservable;
            // remember if there was an active dialog when we started
            var existingActiveDialog = !!oldDialog;
            if (existingActiveDialog) {
                if (oldDialog.keepOpen) {
                    // If the currently active dialog wants to stay open, then keep it open and show the new dialog on top
                    _this.activeDialogsStack.push(newDialog);
                    _this.overlayOpen(true, newDialog.id);
                    // we set the dilaog level as the length of the active dialogs stack
                    newDialog.setLevel(_this.activeDialogsStack.length);
                    _this.activeDialogResult = newDialog.show(options).map(function (result) {
                        _this.overlayOpen(false, newDialog.id);
                        _this.activeDialogsStack.pop();
                        if (oldDialog) {
                            oldDialog.autoFocus();
                        }
                        return result;
                    });
                    resultObservable = _this.activeDialogResult;
                }
                else {
                    // if there is an active dialog, wait for it to complete, then show a the new one
                    resultObservable = _this.activeDialogResult
                        .takeLast(1)
                        .flatMap(function () {
                        return _this.show(id, options);
                    });
                }
            }
            else {
                // if there is no active dialog, then just show the new one      
                _this.activeDialogsStack.push(newDialog);
                _this.overlayOpen(true, newDialog.id);
                _this.activeDialogResult = newDialog.show(options).map(function (result) {
                    _this.overlayOpen(false, newDialog.id);
                    if (oldDialog) {
                        oldDialog.autoFocus();
                    }
                    _this.activeDialogsStack.pop();
                    return result;
                });
                resultObservable = _this.activeDialogResult;
            }
            // if we had an active dialog, request the previous dialog to close unless it wants to stay open
            if (existingActiveDialog && !oldDialog.keepOpen) {
                oldDialog.closeRequested(DialogCloseReason.CompetingDialog);
            }
            return resultObservable;
        });
    };
    /**
     * Shows a message dialog with the given options
     *
     * @param options The dialog options.
     * @returns A subject that will be published one time with the dialog result
     */
    DialogService.prototype.showMessage = function (options) {
        // if running from shell, manually launch dialog
        if (this.appContext.rpc.isShell) {
            return this.show(this.commonIds.message, options);
        }
        else {
            // otherwise ask the shell to do it for us.
            return this.appContext.frame.showDialogMessage({
                buttonText: options.buttonText,
                checkboxText: options.checkboxText,
                externalLink: options.externalLink,
                message: options.message,
                title: options.title
            });
        }
    };
    /**
     * Hide a message dialog.
     */
    DialogService.prototype.hideMessage = function () {
        this.hide(this.commonIds.message);
    };
    /**
     * Shows a confirmation dialog with the given options
     *
     * @param options The dialog options.
     * @returns A subject that will be published one time with the dialog result
     */
    DialogService.prototype.showConfirmation = function (options) {
        // if running from shell, manually launch dialog
        if (this.appContext.rpc.isShell) {
            return this.show(this.commonIds.confirmation, options);
        }
        else {
            // otherwise ask the shell to do it for us.
            return this.appContext.frame.showDialogConfirmation({
                cancelButtonText: options.cancelButtonText,
                checkboxText: options.checkboxText,
                confirmButtonText: options.confirmButtonText,
                doubleCheckText: options.doubleCheckText,
                message: options.message,
                title: options.title
            });
        }
    };
    /**
     * Hide a confirmation dialog.
     */
    DialogService.prototype.hideConfirmation = function () {
        this.hide(this.commonIds.confirmation);
    };
    /**
     * Shows a confirmation list dialog with the given options
     *
     * @param options The dialog options.
     * @returns A subject that will be published one time with the dialog result
     */
    DialogService.prototype.showConfirmationList = function (options) {
        return this.show(this.commonIds.confirmationList, options);
        // TODO: Cannot default confirmation list to rpc dialog because 'list' property has diverged 
        // from ConfirmationListDialogOptions and RpcConfirmationListDialogOptions
        // if (this.appContext.rpc.isShell) {
        //     return this.show(this.commonIds.confirmationList, options);
        // } else {            
        //     return this.appContext.frame.showDialogConfirmationList({
        //         cancelButtonText: options.cancelButtonText,
        //         checkboxText: options.checkboxText,
        //         confirmButtonText: options.confirmButtonText,
        //         list: options.listDataSource,
        //         listFooterText: options.listFooterText,
        //         listHeaderText: options.listHeaderText,
        //         title: options.title
        //     });
        // }
    };
    /**
     * Hide a confirmation list  dialog.
     */
    DialogService.prototype.hideConfirmationList = function () {
        this.hide(this.commonIds.confirmationList);
    };
    /**
     * Hides the dialog.
     *
     * @type TResult The type of the dialog result.
     * @param id The unique identifier of the dialog.
     * @param result The result of the dialog.
     */
    DialogService.prototype.hide = function (id, result) {
        if (!id) {
            throw new Error('DialogService.hide: ID is required to hide a dialog.');
        }
        if (!this.componentMap[id]) {
            throw new Error("DialogService.hide: No dialog associated with provided ID '" + id + "'.");
        }
        this.componentMap[id].hide(result);
    };
    /**
     * Send Rpc request to shell to add/remove overlay
     * @param overlay true: add, false: remove
     * @param id id of the dialog
     */
    DialogService.prototype.overlayOpen = function (overlay, id) {
        var _this = this;
        if (!this.appContext.rpc.isShell) {
            // there could be multiple dialog service instances for some reason
            this.appContext.registerDialogService(this, id);
            this.appContext.frame.overlayOpen(overlay, id).catch(function (error) {
                _this.appContext.notification.alert('', NotificationState.Error, Net.getErrorMessage(error));
                return Observable.empty();
            });
        }
    };
    /**
     * Handle clicking on dialog background in shell
     * @param dialogId id of dialog whose background was clicked
     */
    DialogService.prototype.overlayClicked = function (dialogId) {
        var lastDialog = MsftSme.last(this.activeDialogsStack);
        if (lastDialog && lastDialog.id === dialogId) {
            lastDialog.onBackgroundClicked();
            return true;
        }
        return false;
    };
    /**
     * Resume focus back to the original element that shows the dialog.
     * @param id The id of dialog
     * @param delay If provided, delays resuming focus for a period of time in ms
     */
    DialogService.prototype.resumeFocus = function (id, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        // check to see if there is a dialog stack currently.
        var wasInDialogStack = this.activeDialogsStack && this.activeDialogsStack.length > 0;
        if (this.dialogOrigins[id]) {
            setTimeout(function () {
                var isInDialogStack = _this.activeDialogsStack && _this.activeDialogsStack.length > 0;
                if (!wasInDialogStack && isInDialogStack) {
                    // a dialog was opened during the setTimeout. 
                    // This means that the new dialog will resume focus to the wrong element and the new dialog will open unfocused.
                    _this.dialogOrigins[_this.activeDialogsStack[0].id] = _this.dialogOrigins[id];
                    delete _this.dialogOrigins[id];
                }
                else if (_this.appContext.frame.activeRpcDialogsOrigins.size > 0) {
                    // an rpc dialog was opened during the setTimeout. So just wait a little longer and then refocus
                    _this.resumeFocus(id, 100);
                }
                else {
                    _this.dialogOrigins[id].focus();
                    delete _this.dialogOrigins[id];
                }
            }, delay);
        }
    };
    DialogService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DialogService.ctorParameters = function () { return [
        { type: AppContextService, },
    ]; };
    __decorate([
        Deprecated({
            deprecatedSince: '02/20/18',
            alternateSignature: 'AppContextService.frame.showDialogMessage',
            suppressForShell: true
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Observable)
    ], DialogService.prototype, "showMessage", null);
    __decorate([
        Deprecated({
            deprecatedSince: '02/20/18',
            alternateSignature: 'AppContextService.frame.showDialogConfirmation',
            suppressForShell: true
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Observable)
    ], DialogService.prototype, "showConfirmation", null);
    return DialogService;
}());
export { DialogService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGlhbG9nL2RpYWxvZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxlQUFBLENBQWdCO0FBQzNDLE9BQU8sRUFBRSxVQUFBLEVBQXlCLE1BQU8sTUFBQSxDQUFPO0FBQ2hELE9BQU8sRUFBbUMsR0FBQSxFQUFLLGlCQUFBLEVBQWtCLE1BQU8sZUFBQSxDQUFnQjtBQUV4RixPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyxtQ0FBQSxDQUFvQztBQUN0RSxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sV0FBQSxDQUFZO0FBSXZDLE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLG9CQUFBLENBQXFCO0FBSXZEO0lBa0JJLHVCQUFvQixVQUE2QjtRQUE3QixlQUFVLEdBQVYsVUFBVSxDQUFtQjtRQWpCMUMsY0FBUyxHQUFHO1lBQ2YsWUFBWSxFQUFFLGdDQUFnQztZQUM5QyxnQkFBZ0IsRUFBRSxxQ0FBcUM7WUFDdkQsT0FBTyxFQUFFLDJCQUEyQjtZQUNwQyxhQUFhLEVBQUUsK0JBQStCO1lBQzlDLFFBQVEsRUFBRSwwQkFBMEI7WUFDcEMsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFFBQVEsRUFBRSw2QkFBNkI7U0FDMUMsQ0FBQztRQUVLLHVCQUFrQixHQUF1RCxFQUFFLENBQUM7UUFFM0UsaUJBQVksR0FBMEUsRUFBRSxDQUFDO1FBRXpGLGtCQUFhLEdBQXFDLEVBQUUsQ0FBQztJQUc3RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGdDQUFRLEdBQWYsVUFDSSxFQUFVLEVBQ1YsU0FBaUQ7UUFFakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQ3BGLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FB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