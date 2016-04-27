import {Component, Input} from 'angular2/core';
import {TreeView} from '../../../models/tree.view';
import {CustomerOverviewTreeViewItemComponent} from './treeview.item';

@Component({
    selector: 'customer-overview-tree-view',
    templateUrl: 'app/components/customer/treeview/treeview.html',
    directives: [CustomerOverviewTreeViewItemComponent]
})
export class CustomerOverviewTreeViewComponent {
    @Input()
    public treeView: TreeView;
}
