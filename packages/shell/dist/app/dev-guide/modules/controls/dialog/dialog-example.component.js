import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from '../../../../../angular';
import { RpcAlertSeverity } from '../../../../../core/rpc/rpc-dialogs';
var DialogExampleComponent = /** @class */ (function () {
    /**
     * Initializes a new instance of the DialogExampleComponent class.
     *
     * @param dialogService The dialog service provider.
     */
    function DialogExampleComponent(dialogService) {
        this.dialogService = dialogService;
    }
    DialogExampleComponent.navigationTitle = function (appContextService, snapshot) {
        return 'sme-dialog';
    };
    /**
     * The method to run when the message dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickMessageDialog = function () {
        var subject = this.dialogService.show('message-dialog', {
            buttonText: 'Button Text',
            message: 'My message!',
            title: 'My title!'
        });
        subject.subscribe(function (result) {
            //
        });
    };
    /**
     * The method to run when the message dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickMessageDialogWithLink = function () {
        var subject = this.dialogService.show('message-dialog', {
            buttonText: 'Button Text2',
            message: 'Check out microsoft site for more information!',
            title: 'My title2!',
            externalLink: { url: 'http://www.microsoft.com', title: 'Microsoft' }
        });
        subject.subscribe(function (result) {
            //
        });
    };
    /**
     * The method called when the message dialog with checkbox button is clicked.
     */
    DialogExampleComponent.prototype.onClickMessageDialogWithCheckbox = function () {
        var subject = this.dialogService.show('message-dialog', {
            buttonText: 'Button Text2',
            message: 'Check out microsoft site for more information!',
            title: 'My title2!',
            checkboxText: 'Do not show this message again'
        });
        subject.subscribe(function (result) {
            console.log(result);
        });
    };
    /**
     * The method to run when the confirmation dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickConfirmationDialog = function () {
        var subject = this.dialogService.show('confirmation-dialog', {
            cancelButtonText: 'Cancel',
            checkboxText: 'Click here to do a thing!',
            confirmButtonText: 'OK',
            message: 'My message!',
            title: 'My title!'
        });
        subject.subscribe(function (result) {
            //
        });
    };
    /**
     * The method to run when the double check confirmation dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickDoubleCheckConfirmationDialog = function () {
        var subject = this.dialogService.show('confirmation-dialog', {
            cancelButtonText: 'Cancel',
            checkboxText: 'Click here to do a thing!',
            doubleCheckText: 'Click here to enable the confirm button!',
            confirmButtonText: 'OK',
            message: 'My message!',
            title: 'My title!'
        });
        subject.subscribe(function (result) {
            //
        });
    };
    /**
     * The method to run when the alert confirmation dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickAlertConfirmationDialog = function (severity) {
        var subject = this.dialogService.show('confirmation-dialog', {
            cancelButtonText: 'Cancel',
            confirmButtonText: 'OK',
            message: 'My message!',
            title: 'My title!',
            alert: { severity: RpcAlertSeverity[severity], message: 'My alert message!' }
        });
        subject.subscribe(function (result) {
            //
        });
    };
    /**
     * The method to run when the alert confirmation dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickConfirmationDialogWithAlertStyleButton = function (severity) {
        var alertButtonStyle = severity ? RpcAlertSeverity[severity] : null;
        var options = {
            cancelButtonText: 'Cancel',
            confirmButtonText: 'OK',
            message: 'My message!',
            title: 'My title!',
            alertButtonStyle: alertButtonStyle
        };
        var subject = this.dialogService.show('confirmation-dialog', options);
        subject.subscribe(function (result) {
            //
        });
    };
    /**
     * The method to run when the confirmation dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickConfirmationListDialog = function (listT) {
        var strings = [];
        for (var i = 0; i < 50; i++) {
            strings.push({ title: 'list item #' + i, value: 'list item #' + i });
            // strings.push('list item ' + i);
        }
        var obs = Observable.timer(2000).flatMap(function (_) { return Observable.of(strings); });
        var subject = this.dialogService.show('confirmation-list-dialog', {
            cancelButtonText: 'Cancel',
            checkboxText: 'Click here to do a thing!',
            confirmButtonText: 'OK',
            listDataSource: obs,
            listType: listT,
            title: 'My title!',
            listFooterText: 'This is the list footer.',
            listHeaderText: 'The list header:'
        });
        subject.subscribe(function (result) {
            // handle result
        });
    };
    /**
     * The method to run when the full screen dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickFullScreenDialog = function () {
        var subject = this.dialogService.show('full-screen-dialog', {
            title: 'Full screen!',
            label: 'Very sad label in a huge dialog.'
        });
        subject.subscribe(function (result) {
            // handle result
        });
    };
    /**
     * The method to run when the confirmation dialog button is clicked.
     */
    DialogExampleComponent.prototype.onClickConfirmationDialogChain = function () {
        var subject = this.dialogService.show('dialog-chain', {
            cancelButtonText: 'Cancel',
            checkboxText: 'Do not show another dialog confirmation dialog',
            confirmButtonText: 'OK',
            message: 'This should open another dialog when you click OK and the checkbox is unchecked',
            title: 'first dialog'
        });
        subject.subscribe(function (result) {
            // handle the result
        });
    };
    DialogExampleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-ng2-controls-dialog-example',
                    template: "\n      <div class=\"m-l-xxs tool-container\">\n        <div>\n          <h3>Message Dialog Example</h3>\n          <button (click)=\"onClickMessageDialog()\">Click me for a message dialog!</button>\n        </div>\n\n        <div>\n          <h3>Message Dialog with Link Example</h3>\n          <button (click)=\"onClickMessageDialogWithLink()\">Click me for a message dialog with link!</button>\n        </div>\n\n        <div>\n          <h3>Message Dialog with Checkbox Example</h3>\n          <button (click)=\"onClickMessageDialogWithCheckbox()\">Click me for a message dialog with a checkbox!</button>\n        </div>\n\n        <div>\n          <h3>Confirmation Dialog Example</h3>\n          <button (click)=\"onClickConfirmationDialog()\">Click me for a confirmation dialog!</button>\n        </div>\n\n        <div>\n          <h3>Confirmation Dialog Double Check Example</h3>\n          <button (click)=\"onClickDoubleCheckConfirmationDialog()\">Click me for a confirmation dialog with a double check (confirm button disabled if double check box unchecked)!</button>\n        </div>\n\n        <div>\n            <h3>Confirmation Dialog With Alert Example</h3>\n            <div>\n              <button (click)=\"onClickAlertConfirmationDialog('Error')\">Click me for a confirmation dialog with an Error alert message.</button>\n            </div>\n            <div>\n              <button (click)=\"onClickAlertConfirmationDialog('Warning')\">Click me for a confirmation dialog with an Warning alert message.</button>\n            </div>\n            <div>\n              <button (click)=\"onClickAlertConfirmationDialog('Informational')\">Click me for a confirmation dialog with an Informational alert message.</button>\n            </div>\n        </div>\n\n\n        <div>\n          <h3>Confirmation Dialog With Alert-Style Button But No Alert Example</h3>\n          <div>\n            <button (click)=\"onClickConfirmationDialogWithAlertStyleButton('Error')\">Click me for a confirmation dialog with Critical button but no alert.</button>\n          </div>\n          <div>\n            <button (click)=\"onClickConfirmationDialogWithAlertStyleButton('Warning')\">Click me for a confirmation dialog with an Warning button but no alert.</button>\n          </div>\n          <div>\n            <button (click)=\"onClickConfirmationDialogWithAlertStyleButton('AnythingElse')\">Click me for a regular confirmation dialog.</button>\n          </div>\n        </div>\n\n        <div>\n          <h3>Confirmation List Dialog Example</h3>\n          <button (click)=\"onClickConfirmationListDialog()\">Click me for a confirmation dialog with a list!</button>\n          <button (click)=\"onClickConfirmationListDialog('radio')\">Click me for a confirmation dialog with a radio list!</button>\n        </div>\n\n        <div>\n          <h3>Custom Full screen Dialog Example</h3>\n          <button (click)=\"onClickFullScreenDialog()\">Click me for a full screen dialog!</button>\n        </div>\n        <div>\n          <h3>Custom dialog that opens a dialog</h3>\n          <button (click)=\"onClickConfirmationDialogChain()\">Click me for a dialog that opens another dialog!</button>\n        </div>\n      </div>\n\n      <sme-message-dialog id=\"message-dialog\"></sme-message-dialog>\n      <sme-confirmation-dialog id=\"confirmation-dialog\"></sme-confirmation-dialog>\n      <sme-confirmation-list-dialog id=\"confirmation-list-dialog\"></sme-confirmation-list-dialog>\n      <sme-dialog-example-full-screen-dialog id=\"full-screen-dialog\"></sme-dialog-example-full-screen-dialog>\n      <sme-dialog-example-dialog-chain id=\"dialog-chain\"></sme-dialog-example-dialog-chain>\n    "
                },] },
    ];
    /** @nocollapse */
    DialogExampleComponent.ctorParameters = function () { return [
        { type: DialogService, },
    ]; };
    return DialogExampleComponent;
}());
export { DialogExampleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9kZXYtZ3VpZGUvbW9kdWxlcy9jb250cm9scy9kaWFsb2cvZGlhbG9nLWV4YW1wbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTyxlQUFBLENBQWdCO0FBRzFDLE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxNQUFBLENBQU87QUFFbEMsT0FBTyxFQVFILGFBQWEsRUFHaEIsTUFBTSx3QkFBQSxDQUF5QjtBQUVoQyxPQUFPLEVBQUUsZ0JBQUEsRUFBaUIsTUFBTyxxQ0FBQSxDQUFzQztBQUt2RTtJQU1JOzs7O09BSUc7SUFDSCxnQ0FBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFBSSxDQUFDO0lBVHZDLHNDQUFlLEdBQTdCLFVBQThCLGlCQUFvQyxFQUFFLFFBQWdDO1FBQ2hHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQVNEOztPQUVHO0lBQ0kscURBQW9CLEdBQTNCO1FBQ0ksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDcEQsVUFBVSxFQUFFLGFBQWE7WUFDekIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsS0FBSyxFQUFFLFdBQVc7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQU07WUFDckIsRUFBRTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNkRBQTRCLEdBQW5DO1FBQ0ksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQXFDLGdCQUFnQixFQUFFO1lBQ3hGLFVBQVUsRUFBRSxjQUFjO1lBQzFCLE9BQU8sRUFBRSxnREFBZ0Q7WUFDekQsS0FBSyxFQUFFLFlBQVk7WUFDbkIsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLDBCQUEwQixFQUFFLEtBQUssRUFBRSxXQUFX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QztTQUM1QyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBcUM7WUFDcEQsZ0JBQWdCO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0ksK0RBQThCLEdBQXJDO1FBQ0ksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRTtZQUN2RyxnQkFBZ0IsRUFBRSxRQUFRO1lBQzFCLFlBQVksRUFBRSxnREFBZ0Q7WUFDOUQsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixPQUFPLEVBQUUsaUZBQWlGO1lBQzFGLEtBQUssRUFBRSxjQUFjO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO1lBQ3JCLG9CQUFvQjtRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRSxpQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxpQ0FBaUM7b0JBQzNDLFFBQVEsRUFBRSx3bkhBMkVUO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxxQ0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsYUFBYSxHQUFHO0tBQ3RCLEVBRjZGLENBRTdGLENBQUM7SUFDRiw2QkFBQztDQXBSRCxBQW9SQyxJQUFBO1NBcFJZLHNCQUFzQiIsImZpbGUiOiJkaWFsb2ctZXhhbXBsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9