export class TreeViewItem {
    public isExpanded: boolean = false;
    public additionalCssClasses: Array<string> = [];

    constructor(public name: string,
                public linkParams: Array = [],
                public children: Array<TreeViewItem> = []) {
        if (!this.linkParams || this.linkParams.length === 0) {
            // TODO: Fix this. Wrong route
            this.linkParams = ['Dashboard'];
        }
    }
}
