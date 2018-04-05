import { ElementRef, TemplateRef } from '@angular/core';
import { TooltipPlacement } from './tooltip-placement';
/**
 * The options that define a tooltip
 */
export interface TooltipOptions {
    targetid: string;
    contentId: string;
    title: string;
    template: TemplateRef<any>;
    context: any;
    placement: TooltipPlacement;
    element: ElementRef;
    onStateChanged: MsftSme.Action;
}
