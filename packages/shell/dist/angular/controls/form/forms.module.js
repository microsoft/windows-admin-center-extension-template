import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes';
import { FieldsetDirective } from './fieldset/fieldset.directive';
import { CheckboxFormFieldComponent } from './form-field/checkbox/checkbox-form-field.component';
import { ChecklistFormFieldComponent } from './form-field/checklist/checklist-form-field.component';
import { FileFormFieldComponent } from './form-field/file/file-form-field.component';
import { FormFieldAccessorDirective } from './form-field/form-field-accessor.directive';
import { FormFieldValidatorDirective } from './form-field/form-field-validator.directive';
import { NumberFormFieldComponent } from './form-field/number/number-form-field.component';
import { FormFieldOptionComponent } from './form-field/options-form-field/form-field-option.component';
import { FormFieldOptionSubFormTemplateLoaderComponent } from './form-field/options-form-field/option-subform-template-loader.component';
import { PasswordFormFieldComponent } from './form-field/password/password-form-field.component';
import { RadioGroupFormFieldComponent } from './form-field/radio-group/radio-group-form-field.component';
import { ReadonlyFormFieldComponent } from './form-field/readonly/readonly-form-field.component';
import { SearchFormFieldComponent } from './form-field/search/search-form-field.component';
import { SelectFormFieldComponent } from './form-field/select/select-form-field.component';
import { SliderFormFieldComponent } from './form-field/slider/slider-form-field.component';
import { TagsFormFieldComponent } from './form-field/tags/tags-form-field.component';
import { TextFormFieldComponent } from './form-field/text/text-form-field.component';
import { ToggleSwitchFormFieldComponent } from './form-field/toggle-switch/toggle-switch-form-field.component';
import { ValidationAlertComponent } from './validation-alert/validation-alert.component';
import { CapsLockValidatorDirective } from './validators/capslock.directive';
var SmeFormsModule = /** @class */ (function () {
    function SmeFormsModule() {
    }
    SmeFormsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        // Form Field Components
                        CheckboxFormFieldComponent,
                        ChecklistFormFieldComponent,
                        FileFormFieldComponent,
                        NumberFormFieldComponent,
                        PasswordFormFieldComponent,
                        RadioGroupFormFieldComponent,
                        ReadonlyFormFieldComponent,
                        SearchFormFieldComponent,
                        SelectFormFieldComponent,
                        SliderFormFieldComponent,
                        TagsFormFieldComponent,
                        TextFormFieldComponent,
                        ToggleSwitchFormFieldComponent,
                        // Validators
                        CapsLockValidatorDirective,
                        // Suporting Components
                        FormFieldOptionSubFormTemplateLoaderComponent,
                        FormFieldOptionComponent,
                        ValidationAlertComponent,
                        FormFieldAccessorDirective,
                        FormFieldValidatorDirective,
                        FieldsetDirective
                    ],
                    exports: [
                        // Form Field Components
                        CheckboxFormFieldComponent,
                        ChecklistFormFieldComponent,
                        FileFormFieldComponent,
                        NumberFormFieldComponent,
                        PasswordFormFieldComponent,
                        RadioGroupFormFieldComponent,
                        ReadonlyFormFieldComponent,
                        SearchFormFieldComponent,
                        SelectFormFieldComponent,
                        SliderFormFieldComponent,
                        TagsFormFieldComponent,
                        TextFormFieldComponent,
                        ToggleSwitchFormFieldComponent,
                        // Validators
                        CapsLockValidatorDirective,
                        // Suporting Components
                        FormFieldOptionSubFormTemplateLoaderComponent,
                        FormFieldOptionComponent,
                        ValidationAlertComponent,
                        FormFieldAccessorDirective,
                        FormFieldValidatorDirective,
                        FieldsetDirective
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        PipesModule
                    ]
                },] },
    ];
    /** @nocollapse */
    SmeFormsModule.ctorParameters = function () { return []; };
    return SmeFormsModule;
}());
export { SmeFormsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvZm9ybS9mb3Jtcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQUEsRUFBYSxNQUFPLGlCQUFBLENBQWtCO0FBQy9DLE9BQU8sRUFBRSxRQUFBLEVBQVMsTUFBTyxlQUFBLENBQWdCO0FBQ3pDLE9BQU8sRUFBRSxXQUFBLEVBQWEsbUJBQUEsRUFBb0IsTUFBTyxnQkFBQSxDQUFpQjtBQUNsRSxPQUFPLEVBQUUsV0FBQSxFQUFZLE1BQU8sYUFBQSxDQUFjO0FBQzFDLE9BQU8sRUFBRSxpQkFBQSxFQUFrQixNQUFPLCtCQUFBLENBQWdDO0FBQ2xFLE9BQU8sRUFBRSwwQkFBQSxFQUEyQixNQUFPLHFEQUFBLENBQXNEO0FBQ2pHLE9BQU8sRUFBRSwyQkFBQSxFQUE0QixNQUFPLHVEQUFBLENBQXdEO0FBQ3BHLE9BQU8sRUFBRSxzQkFBQSxFQUF1QixNQUFPLDZDQUFBLENBQThDO0FBQ3JGLE9BQU8sRUFBRSwwQkFBQSxFQUEyQixNQUFPLDRDQUFBLENBQTZDO0FBQ3hGLE9BQU8sRUFBRSwyQkFBQSxFQUE0QixNQUFPLDZDQUFBLENBQThDO0FBQzFGLE9BQU8sRUFBRSx3QkFBQSxFQUF5QixNQUFPLGlEQUFBLENBQWtEO0FBQzNGLE9BQU8sRUFBRSx3QkFBQSxFQUF5QixNQUFPLDZEQUFBLENBQThEO0FBQ3ZHLE9BQU8sRUFBRSw2Q0FBQSxFQUE4QyxNQUFPLDBFQUFBLENBQTJFO0FBQ3pJLE9BQU8sRUFBRSwwQkFBQSxFQUEyQixNQUFPLHFEQUFBLENBQXNEO0FBQ2pHLE9BQU8sRUFBRSw0QkFBQSxFQUE2QixNQUFPLDJEQUFBLENBQTREO0FBQ3pHLE9BQU8sRUFBRSwwQkFBQSxFQUEyQixNQUFPLHFEQUFBLENBQXNEO0FBQ2pHLE9BQU8sRUFBRSx3QkFBQSxFQUF5QixNQUFPLGlEQUFBLENBQWtEO0FBQzNGLE9BQU8sRUFBRSx3QkFBQSxFQUF5QixNQUFPLGlEQUFBLENBQWtEO0FBQzNGLE9BQU8sRUFBRSx3QkFBQSxFQUF5QixNQUFPLGlEQUFBLENBQWtEO0FBQzNGLE9BQU8sRUFBRSxzQkFBQSxFQUF1QixNQUFPLDZDQUFBLENBQThDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBQSxFQUF1QixNQUFPLDZDQUFBLENBQThDO0FBQ3JGLE9BQU8sRUFBRSw4QkFBQSxFQUErQixNQUFPLCtEQUFBLENBQWdFO0FBQy9HLE9BQU8sRUFBRSx3QkFBQSxFQUF5QixNQUFPLCtDQUFBLENBQWdEO0FBQ3pGLE9BQU8sRUFBRSwwQkFBQSxFQUEyQixNQUFPLGlDQUFBLENBQWtDO0FBRzdFO0lBQUE7SUFtRUEsQ0FBQztJQW5Fb0MseUJBQVUsR0FBMEI7UUFDekUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUNyQixZQUFZLEVBQUU7d0JBQ1Ysd0JBQXdCO3dCQUN4QiwwQkFBMEI7d0JBQzFCLDJCQUEyQjt3QkFDM0Isc0JBQXNCO3dCQUN0Qix3QkFBd0I7d0JBQ3hCLDBCQUEwQjt3QkFDMUIsNEJBQTRCO3dCQUM1QiwwQkFBMEI7d0JBQzFCLHdCQUF3Qjt3QkFDeEIsd0JBQXdCO3dCQUN4Qix3QkFBd0I7d0JBQ3hCLHNCQUFzQjt3QkFDdEIsc0JBQXNCO3dCQUN0Qiw4QkFBOEI7d0JBRTlCLGFBQWE7d0JBQ2IsMEJBQTBCO3dCQUUxQix1QkFBdUI7d0JBQ3ZCLDZDQUE2Qzt3QkFDN0Msd0JBQXdCO3dCQUN4Qix3QkFBd0I7d0JBQ3hCLDBCQUEwQjt3QkFDMUIsMkJBQTJCO3dCQUMzQixpQkFBaUI7cUJBQ3BCO29CQUNELE9BQU8sRUFBRTt3QkFDTCx3QkFBd0I7d0JBQ3hCLDBCQUEwQjt3QkFDMUIsMkJBQTJCO3dCQUMzQixzQkFBc0I7d0JBQ3RCLHdCQUF3Qjt3QkFDeEIsMEJBQTBCO3dCQUMxQiw0QkFBNEI7d0JBQzVCLDBCQUEwQjt3QkFDMUIsd0JBQXdCO3dCQUN4Qix3QkFBd0I7d0JBQ3hCLHdCQUF3Qjt3QkFDeEIsc0JBQXNCO3dCQUN0QixzQkFBc0I7d0JBQ3RCLDhCQUE4Qjt3QkFFOUIsYUFBYTt3QkFDYiwwQkFBMEI7d0JBRTFCLHVCQUF1Qjt3QkFDdkIsNkNBQTZDO3dCQUM3Qyx3QkFBd0I7d0JBQ3hCLHdCQUF3Qjt3QkFDeEIsMEJBQTBCO3dCQUMxQiwyQkFBMkI7d0JBQzNCLGlCQUFpQjtxQkFDcEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLFdBQVc7cUJBQ2Q7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDZCQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0lBQ0YscUJBQUM7Q0FuRUQsQUFtRUMsSUFBQTtTQW5FWSxjQUFjIiwiZmlsZSI6ImZvcm1zLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=