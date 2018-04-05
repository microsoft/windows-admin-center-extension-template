var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Deprecated } from '../../common';
import { DialogService } from '../dialog.service';
var CommonDialogsComponent = /** @class */ (function () {
    /**
     * Initializes a new instance of the CommonDialogsComponent class.
     */
    function CommonDialogsComponent(dialogService) {
        this.dialogService = dialogService;
    }
    CommonDialogsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-common-dialogs',
                    template: "\n      <sme-message-dialog [id]=\"dialogService.commonIds.message\"></sme-message-dialog>\n      <sme-confirmation-dialog [id]=\"dialogService.commonIds.confirmation\"></sme-confirmation-dialog>\n    "
                },] },
    ];
    /** @nocollapse */
    CommonDialogsComponent.ctorParameters = function () { return [
        { type: DialogService, },
    ]; };
    CommonDialogsComponent = __decorate([
        Deprecated({
            deprecatedSince: '02/20/18',
            suppressForShell: true
        }),
        __metadata("design:paramtypes", [DialogService])
    ], CommonDialogsComponent);
    return CommonDialogsComponent;
}());
export { CommonDialogsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZGlhbG9nL2NvbW1vbi1kaWFsb2dzL2NvbW1vbi1kaWFsb2dzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFVLE1BQU8sZUFBQSxDQUFnQjtBQUcxQyxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sY0FBQSxDQUFlO0FBQzFDLE9BQU8sRUFBRSxhQUFBLEVBQWMsTUFBTyxtQkFBQSxDQUFvQjtBQU9sRDtJQUVJOztPQUVHO0lBQ0gsZ0NBQW1CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQy9DLENBQUM7SUFDRSxpQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSwyTUFHVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gscUNBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRztLQUN0QixFQUY2RixDQUU3RixDQUFDO0lBbkJXLHNCQUFzQjtRQUpsQyxVQUFVLENBQUM7WUFDUixlQUFlLEVBQUUsVUFBVTtZQUMzQixnQkFBZ0IsRUFBRSxJQUFJO1NBQ3pCLENBQUM7eUNBTW9DLGFBQWE7T0FMdEMsc0JBQXNCLENBb0JsQztJQUFELDZCQUFDO0NBcEJELEFBb0JDLElBQUE7U0FwQlksc0JBQXNCIiwiZmlsZSI6ImNvbW1vbi1kaWFsb2dzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=