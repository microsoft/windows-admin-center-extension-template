import { TreeNodeDataItem } from '../../../../../angular/controls/data-table/data-table-contract';
export declare class TreeTableExampleComponent {
    private simpleTreeTable;
    tabIndex: number;
    sampleData1: TreeNodeDataItem[];
    selectedData2: TreeNodeDataItem[];
    constructor();
    refreshSampleData1(): void;
    getSampleDataItemIdentity(data: any): string;
    clickTab(tabIndex: number): void;
    clearSelection(): void;
    scrollSelectedDataIntoView(): void;
}
