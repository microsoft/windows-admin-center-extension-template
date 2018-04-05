import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppContextService } from '../../service/app-context.service';
export declare class BackdropComponent implements OnChanges {
    private appContext;
    private static readonly zIndexPerLevel;
    showBackdrop: boolean;
    level: number;
    clicked: EventEmitter<void>;
    zindex: number;
    constructor(appContext: AppContextService);
    /**
     * emits clicked event
     */
    onClick(): void;
    ngOnChanges(changes: SimpleChanges): void;
    getCssClass(): string;
}
