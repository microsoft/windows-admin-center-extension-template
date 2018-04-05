import { ElementRef, EventEmitter, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { Strings } from '../../../generated/strings';
import { BaseComponent } from '../common/base.component';
import { Layout } from '../common/interfaces';
export declare class DetailsComponent extends BaseComponent<Strings> implements OnChanges {
    private layout;
    minExpanderHeight: string;
    expander: ElementRef;
    readonly ariaExpanded: string;
    initialHeightPercentage: number;
    title: string;
    isExpanded: boolean;
    isExpandedChange: EventEmitter<boolean>;
    private hasExpanedLayoutOccured;
    constructor(injector: Injector, layout: Layout);
    ngOnChanges(changes: SimpleChanges): void;
    toggleExpansion(): void;
    private onLayoutChanged();
    protected getInitialHostClasses(): string[];
}
