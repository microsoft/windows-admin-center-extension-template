import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
/**
 * Blank implementation of the complete angular component lifecycle.
 * This enabled our bae components to implement the lifecycle even if they dont use all of its functions just yet.
 * That way if we do decide to use one of these hooks, we dont need to change every derieved component as
 * they should all be calling super() implementation anyway.
 */
export declare class NgLifecycleBaseComponent implements OnChanges, OnInit, DoCheck, OnDestroy, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
}
