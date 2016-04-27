import {Component, Input, AfterViewInit, ElementRef} from 'angular2/core';
import {TreeViewItem} from '../../../models/tree.view.item';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'customer-overview-tree-view-item',
    templateUrl: 'app/components/customer/treeview/treeview.item.html',
    directives: [CustomerOverviewTreeViewItemComponent, RouterLink]
})
export class CustomerOverviewTreeViewItemComponent implements AfterViewInit {
    @Input()
    public item: TreeViewItem;

    @Input()
    public treeLevel: number = 0;

    constructor(private _elementRef: ElementRef) {

    }

    public get nextTreeLevel(): number {
        return this.treeLevel + 1;
    }

    public ngAfterViewInit(): any {
        this._elementRef.nativeElement.classList.add('tree-view-level-' + this.treeLevel);
    }
}
