export class BrowserHistory {
    public changeTo(route: string) {
        console.log('Rewriting browser history to', route);
        history.pushState(null, document.title, route);
    }

    public replaceTo(route: string) {
        console.log('Replacing browser history with', route);
        history.replaceState(null, document.title, route);
    }
}
