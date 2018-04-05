import { Injector, OnInit } from '@angular/core';
import { Strings } from '../../../../generated/strings';
import { BaseComponent } from '../../common/base.component';
/**
 * Directive for applying standard classes and attributes to fieldsets to automatically apply aria attributes when enabled/disabled.
 * TODO: there is an angular bug where fieldsets do not correctly replicate there disabeld state to child ngmodels.
 * See if there is a way we can fix it.
 */
export declare class FieldsetDirective extends BaseComponent<Strings> implements OnInit {
    /**
     * Indicates that this fieldset is disabled
     */
    disabled: boolean;
    /**
     * Internal placeholder for the value of 'disabled'
     */
    private internalDisabled;
    /**
     * Constructs a new instance of @see FieldsetDirective
     * @param injector the angular injection service for the base classes @SmeInjectable Annotation.
     */
    constructor(injector: Injector);
}
