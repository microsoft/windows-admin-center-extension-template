var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CommonSettingsComponentBase } from '../../../../angular';
var PanelBaseComponent = /** @class */ (function (_super) {
    __extends(PanelBaseComponent, _super);
    function PanelBaseComponent(appContextService, router, activatedRoute, formbuilder, settingsFormService, dialogService, formErrors, validationMessages, modelData, settingName) {
        var _this = _super.call(this) || this;
        _this.appContextService = appContextService;
        _this.router = router;
        _this.activatedRoute = activatedRoute;
        _this.formbuilder = formbuilder;
        _this.settingsFormService = settingsFormService;
        _this.dialogService = dialogService;
        _this.formErrors = formErrors;
        _this.validationMessages = validationMessages;
        _this.modelData = modelData;
        _this.settingName = settingName;
        _this.saving = false;
        return _this;
    }
    PanelBaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sampleForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    };
    PanelBaseComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    PanelBaseComponent.prototype.confirmContinueEditingDialogOptions = function (dirtyForm, allForms) {
        throw new Error('Method not implemented.');
    };
    PanelBaseComponent.prototype.onSaveClick = function () {
        var _this = this;
        this.saving = true;
        // remote action started
        setTimeout(function () {
            // remote action finished
            _this.saving = false;
            _this.modelData = _this.sampleForm.value;
            _this.sampleForm.reset(_this.modelData);
            _this.sampleForm.markAsUntouched();
        }, 1000);
    };
    PanelBaseComponent.prototype.onDiscardClick = function () {
        // revert data
        this.sampleForm.reset(this.modelData);
        this.sampleForm.markAsPristine();
    };
    PanelBaseComponent.prototype.onValueChanged = function (data) {
        if (!this.sampleForm) {
            return;
        }
        var form = this.sampleForm;
        for (var field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                var control = form.get(field);
                if (control && control.dirty && !control.valid) {
                    var messages = this.validationMessages[field];
                    for (var key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    };
    return PanelBaseComponent;
}(CommonSettingsComponentBase));
export { PanelBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL3BhbmVsLWJhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxPQUFPLEVBQXFCLDJCQUEyQixFQUNZLE1BQU0scUJBQXFCLENBQUM7QUFJL0Y7SUFBb0Qsc0NBQTJCO0lBTzNFLDRCQUFzQixpQkFBb0MsRUFDcEMsTUFBYyxFQUNkLGNBQThCLEVBQzlCLFdBQXdCLEVBQ3hCLG1CQUF3QyxFQUN4QyxhQUE0QixFQUMvQixVQUFlLEVBQ2Ysa0JBQXVCLEVBQ3BCLFNBQXFCLEVBQ3hCLFdBQW1CO1FBVHRDLFlBVWdCLGlCQUFPLFNBQ3RCO1FBWHFCLHVCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixpQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLG1CQUFhLEdBQWIsYUFBYSxDQUFlO1FBQy9CLGdCQUFVLEdBQVYsVUFBVSxDQUFLO1FBQ2Ysd0JBQWtCLEdBQWxCLGtCQUFrQixDQUFLO1FBQ3BCLGVBQVMsR0FBVCxTQUFTLENBQVk7UUFDeEIsaUJBQVcsR0FBWCxXQUFXLENBQVE7UUFiL0IsWUFBTSxHQUFHLEtBQUssQ0FBQzs7SUFldEIsQ0FBQztJQUVNLHFDQUFRLEdBQWY7UUFBQSxpQkFJQztRQUhHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztRQUUxRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLHdDQUFXLEdBQWxCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLGdFQUFtQyxHQUExQyxVQUEyQyxTQUFvQixFQUFFLFFBQXFCO1FBQ2xGLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sd0NBQVcsR0FBbEI7UUFBQSxpQkFZQztRQVhHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLHdCQUF3QjtRQUN4QixVQUFVLENBQ047WUFDSSx5QkFBeUI7WUFDekIsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUN2QyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN0QyxDQUFDLEVBQ0QsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDO0lBRU0sMkNBQWMsR0FBckI7UUFDSSxjQUFjO1FBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVPLDJDQUFjLEdBQXRCLFVBQXVCLElBQVU7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUU3QixHQUFHLENBQUMsQ0FBQyxJQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLHdDQUF3QztnQkFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzVCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRWhDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzdDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDaEQsR0FBRyxDQUFDLENBQUMsSUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUNsRCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FoRkEsQUFnRkMsQ0FoRm1ELDJCQUEyQixHQWdGOUUiLCJmaWxlIjoicGFuZWwtYmFzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9