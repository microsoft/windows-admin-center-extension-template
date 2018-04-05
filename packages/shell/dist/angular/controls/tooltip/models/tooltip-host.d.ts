import { TooltipOptions } from './tooltip-options';
/**
 * Defines a tooltip host
 */
export interface TooltipHost {
    isFocused: boolean;
    isHovered: boolean;
    show(options: TooltipOptions): void;
    hide(id: string): void;
    isShown(id: string): void;
    update(options: TooltipOptions): void;
}
