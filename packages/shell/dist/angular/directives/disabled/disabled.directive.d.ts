import { ElementRef } from '@angular/core';
export declare class DisabledDirective {
    private host;
    smeDisabled: boolean;
    readonly attrDisabled: boolean;
    private internalDisabled;
    constructor(host: ElementRef);
    private removeFocus();
}
