import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {Dossier} from '../models/dossier';

@Injectable()
export class InteractionService {
    private _enableScope = new Subject<any>();
    private _actionRequested = new Subject<string>();
    private _highlightField = new Subject<string>();
    private _switchDossier = new Subject<Dossier>();
    private _save = new Subject<any>();
    private _close = new Subject<any>();
    private _approveClose = new Subject<any>();
    private _updateTree = new Subject<any>();
    private _shortcuts: any;

    /* tslint:disable:member-ordering */
    public scopeEnabled$ = this._enableScope.asObservable();
    public highlightFieldRequested$ = this._highlightField.asObservable();
    public actionRequested$ = this._actionRequested.asObservable();
    public switchDossierRequested$ = this._switchDossier.asObservable();
    public saveRequested$ = this._save.asObservable();
    public closeRequested$ = this._close.asObservable();
    public closeApproved$ = this._approveClose.asObservable();
    public updateTreeRequested$ = this._updateTree.asObservable();
    constructor() {
        this._shortcuts = {};
        window.addEventListener('keyup', this.shortcutDispatcher.bind(this));
        window.addEventListener('keydown', this.preventShortcut.bind(this));
    }

    public enableScope(scope: string, scopeId?: number = null) {
        this._enableScope.next({
            scope: scope,
            scopeId: scopeId
        });
    }

    public highlightField(fieldName: string) {
        this._highlightField.next(fieldName);
    }

    public requestAction(action: string) {
        this._actionRequested.next(action);
    }

    public requestTreeUpdate() {
        this._updateTree.next(null);
    }

    public requestClose() {
        this._close.next(null);
    }

    public approveClose() {
        this._approveClose.next(null);
    }

    public requestSave() {
        this._save.next(null);
    }

    public switchToDossier(newDossier: Dossier) {
        this._switchDossier.next(newDossier);
    }

    public registerGlobalShortcut(shortcut: string, action: string) {
        if (this._shortcuts.hasOwnProperty(shortcut)) {
            throw new Error("Shortcut already registered");
        }
        this._shortcuts[shortcut] = action;
    }

    public removeGlobalShortcut(shortcut: string) {
        if (this._shortcuts.hasOwnProperty(shortcut)) {
            delete this._shortcuts[shortcut];
        }
    }

    private preventShortcut(keyboardEventArgs) {
        for (var shortcut in this._shortcuts) {
            if (this.isMatching(keyboardEventArgs, shortcut)) {
                keyboardEventArgs.preventDefault();
                keyboardEventArgs.stopPropagation();
            }
        }
    }

    private shortcutDispatcher(keyboardEventArgs) {
        for (var shortcut in this._shortcuts) {
            if (this.isMatching(keyboardEventArgs, shortcut)) {
                this.requestAction(this._shortcuts[shortcut]);
                keyboardEventArgs.preventDefault();
                keyboardEventArgs.stopPropagation();
            }
        }
    }

    private isMatching(keyboardEventArgs, shortcut: string): boolean {
        var modifiers = shortcut.split('|')[0];
        var shortcutKey = shortcut.split('|')[1];
        if (modifiers.toLowerCase().indexOf('ctrl') > -1) {
            if (!keyboardEventArgs.ctrlKey) {
                return false;
            }
        }

        if (modifiers.toLowerCase().indexOf('shift') > -1) {
            if (!keyboardEventArgs.shiftKey) {
                return false;
            }
        }

        if (modifiers.toLowerCase().indexOf('alt') > -1) {
            if (!keyboardEventArgs.altKey) {
                return false;
            }
        }
        return shortcutKey.toLowerCase() === String.fromCharCode(keyboardEventArgs.keyCode).toLowerCase();
    }

}
