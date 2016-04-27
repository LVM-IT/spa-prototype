import {Guid} from '../guid';
import {PopupOptions} from '../models/popup.options';
import {
    WidgetMessage,
    WidgetNavigationMessage,
    WidgetOpenPopupMessage,
    WidgetPopupResultMessage,
    WidgetDataMessage,
    WidgetClosePopupMessage,
    WidgetOpenDocumentMessage,
    WidgetValidationErrorsMessage,
    WidgetBroadcastMessage,
    WidgetBoundingRectChangedMessage,
    WidgetSchufaChangedMessage,
    WidgetGetRootInstructionMessage
} from '../models/widget.message';
import {ILasWidget, WidgetId} from './contracts';
import {WidgetCommunication} from '../widget.communication/widget.communication';
import {IWidgetCommunication} from '../widget.communication/contracts';
import {MessageType} from '../widget.communication/message.type';
import {Log} from '../services/log';
import {ValidationMessage} from '../../../src-contract-app/lvm/models/validation.message';
import {BoundingRect} from '../models/bounding.rect';

// idea
// every UI Component like JOB_SEARCH or SHUFA_REQUEST is a widget
// widgets normally will have the following demands
// - request something from the root (eg Popup, ValidationWindow)
// - promote navigation to the parent -> parent to it's parent, ....
// - access data from inner widgets (lifecycle) -> onInit onSave onFoo

export class Widget implements ILasWidget {
    public onBoundingRectChanged: (boundingRect: BoundingRect) => void;
    public onSchufaChanged: (clientAccepted: boolean) => void;

    private _widgetCommunication: IWidgetCommunication;
    private _id: WidgetId;
    private _timeout: number;
    private _hostedInLAS: boolean = false;

    constructor(lasRootUrl: string, timeout: number = 3000) {
        this._id = <WidgetId> Guid.NewGuid();
        this._timeout = timeout;

        // WidgetCommunication will automatically set the root of the application...
        // should widgets register on their parent or on the root?
        this._widgetCommunication = new WidgetCommunication(this._id, lasRootUrl);
    }

    /**
     * Register your widget (aka App) on the parent
     */
    public register() {
        // think about job search which is hosted in contract app
        // contract app itself is hosted in LVM prototyp root app
        // (JOB_SEARCH <-> CONTRACT_APP <-> LVM_ROOT)
        // (JOB_SEARCH <------------------> LVM_ROOT)
        this._widgetCommunication.register(window, this.onDataReceived.bind(this));
        setTimeout(this.ensureLAS.bind(this), this._timeout);
    }

    /**
     * Request a popup (rendered by LVM prototype root application)
     * @param {string} url
     * @param {PopupOptions} options
     */
    public openPopup(url: string, options: PopupOptions): Promise<any> {
        const message = new WidgetOpenPopupMessage(url, options);

        return this._widgetCommunication.awaitResult<WidgetDataMessage>(message)
            .then(message => message.data);
    }

    /**
     * Close a currently shown modal dialog
     */
    public closePopup(): void {
        const message = new WidgetClosePopupMessage();

        this._widgetCommunication.send(message);
    }

    /**
     * Send a modal dialog response message to a child widget
     * @param targetWidgetId {WidgetId}
     * @param responseTo {string}
     * @param data {any}
     */
    public sendPopupResponse(targetWidgetId: WidgetId, responseTo: string, data: any) {
        const message = new WidgetPopupResultMessage(responseTo, data);

        this._widgetCommunication.send(message, targetWidgetId);
    }

    /**
     * Send route changed information to LAS-Root
     * @param route {string}
     * @param replaceBrowserHistory {boolean}
     */
    public routeChanged(route: string, replaceBrowserHistory: boolean = false) {
        var message = new WidgetNavigationMessage(route, replaceBrowserHistory);
        this._widgetCommunication.send(message);
    }

    /**
     * Request a document to be shown by LAS-ROOT (opens document in new tab)
     * @param url {string}
     */
    public openDocument(url: string) {
        const message = new WidgetOpenDocumentMessage(url);
        this._widgetCommunication.send(message);
    }

    /**
     * Notify parent when dimensions of the current widget had changed
     * @param boundingRect
     */
    public boundingRectChanged(boundingRect: BoundingRect): void {
        var message = new WidgetBoundingRectChangedMessage(boundingRect);
        this._widgetCommunication.send(message, WidgetCommunication.parentWidgetId);
    }

    /**
     * example for use case oriented API -> schufa validation has changed
     * @param clientAccepted {boolean} indicates wether Schufa check was positive or not
     */
    public schufaChanged(clientAccepted: boolean): void {
        var message = new WidgetSchufaChangedMessage(clientAccepted);
        this._widgetCommunication.send(message, WidgetCommunication.parentWidgetId);
    }

    /**
     * Tell LAS-Root to show the default modal validation result
     * @param errors {Array<ValidationMessage>} a list of validation messages
     */
    public openValidationResult(errors: Array<ValidationMessage>) {
        const message = new WidgetValidationErrorsMessage(errors);
        this._widgetCommunication.send(message);
    }

    /**
     * Get routing instructions from the Root app
     * @returns {Promise<string>}
     */
    public getRootInstruction(): Promise<string> {
        const message = new WidgetGetRootInstructionMessage();
        return this._widgetCommunication.awaitResult(message);
    }

    private ensureLAS() {
        if (!this._hostedInLAS) {
            throw new Error("NOT RUNNING IN LAS CONTEXT");
        }

        Log.info('Widget is running in LAS Context')
    }

    private onDataReceived(message: WidgetMessage): void {
        switch (message.messageType) {
            case MessageType.BROADCAST:
                const m = <WidgetBroadcastMessage> message;
                this.onDataReceived(<WidgetMessage> m.data);
                break;

            case MessageType.RUNS_IN_CONTEXT:
                this._hostedInLAS = true;
                break;

            case MessageType.BOUNDING_RECT_CHANGED:
                if (this.onBoundingRectChanged) {
                    const m = <WidgetBoundingRectChangedMessage> message;
                    this.onBoundingRectChanged(<BoundingRect> m.data);
                }
                break;

            case MessageType.SCHUFA_CHANGED:
                if (this.onSchufaChanged) {
                    const m = <WidgetSchufaChangedMessage> message;
                    this.onSchufaChanged(<boolean> m.data);
                }
                break;
        }
    }
}
