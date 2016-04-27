import {
    WidgetMessage,
    WidgetNavigationMessage,
    WidgetRegistrationInformationMessage,
    WidgetRunsInContextMessage,
    WidgetOpenPopupMessage,
    WidgetOpenDocumentMessage,
    WidgetDataMessage,
    WidgetValidationErrorsMessage
} from '../models/widget.message';
import {PopupOptions} from '../models/popup.options';
import {ILasApp, WidgetId} from './contracts';
import {IWidgetCommunication} from '../widget.communication/contracts';
import {WidgetCommunication} from '../widget.communication/widget.communication';
import {MessageType} from '../widget.communication/message.type';
import {Log} from '../services/log';
import {BrowserHistory} from '../services/browser.history';
import {ValidationMessage} from '../models/validation.message';

// idea
// root is used in the outer application
// it is responsible for defining the lifecycle of the application
// and responding to requests from children (eg show popup)

export class Root implements ILasApp {
    public onRouteChanged: (route: string, replaceBrowserHistory: boolean) => void;
    public onOpenPopup: (url: string, options: PopupOptions, openerWidgetId: string, messageId: string)=>void;
    public onOpenDocument: (url: string) => void;
    public onOpenValidationResult: (errors: Array<ValidationMessage>) => void;
    public onClosePopup: () => void;
    public onRootInstructionRequested: () => string;

    private _browserHistory: BrowserHistory = new BrowserHistory();
    private _widgetCommunication: IWidgetCommunication;

    constructor() {
        this._widgetCommunication = new WidgetCommunication(<WidgetId>'root');
        this._widgetCommunication.register(window, this._onMessageReceived.bind(this));
    }

    /**
     * Receive the entier browser history
     * @returns {BrowserHistory} browser history
     */
    public get browserHistory(): BrowserHistory {
        return this._browserHistory;
    }

    /**
     * Request a new modal dialog
     * @param url {string} Which site should be shown
     * @param options {PopupOptions} options for the modal dialog like title...
     * @returns {Promise<any>}
     */
    public openPopup(url: string, options: PopupOptions): Promise<any> {

        const message = new WidgetOpenPopupMessage(url, options);
        const promise = this._widgetCommunication.awaitResult<WidgetDataMessage>(message)
            .then(message => message.data);
        this.handleOpenPopup(message);
        return promise;
    }

    /**
     * Request a document to be shown in a new tab (eg PDF)
     * @param url {string} document url to be shown
     */
    public openDocument(url: string): void {

        const message = new WidgetOpenDocumentMessage(url);
        this._widgetCommunication.send(message);
        this.handleOpenDocument(message);
    }

    /**
     * Request the modal validation result to be shown
     * @param errors {Array<ValidationMessage>} a list of errors to be displayed
     */
    public openValidationResult(errors: Array<ValidationMessage>): void {
        const message = new WidgetValidationErrorsMessage(errors);
        this._widgetCommunication.send(message);
        this.handleOpenValidationResult(message);
    }

    public handleGetRootInstruction(message: WidgetMessage) {
        let result: WidgetMessage;

        if (this.onRootInstructionRequested) {
            const rootInstruction = this.onRootInstructionRequested();

            result = new WidgetDataMessage(rootInstruction);
            result.responseTo = message.id;
        }
        else {
            result = new WidgetDataMessage(null);
            result.isError = true;
        }

        this._widgetCommunication.send(result, message.source);

    }

    private _onMessageReceived(message: WidgetMessage): void {
        switch (message.messageType) {
            case MessageType.REGISTRATION_INFORMATION:
                this.handleRegistrationInformation(<WidgetRegistrationInformationMessage> message);
                break;

            case MessageType.ROUTE_CHANGED:
                this.handleRouteChanged(<WidgetNavigationMessage> message);
                break;

            case MessageType.OPEN_POPUP:
                this.handleOpenPopup(<WidgetOpenPopupMessage> message);
                break;

            case MessageType.CLOSE_POPUP:
                this.handleClosePopup();
                break;

            case MessageType.OPEN_DOCUMENT:
                this.handleOpenDocument(<WidgetOpenDocumentMessage> message);
                break;

            case MessageType.OPEN_VALIDATION_RESULT:
                this.handleOpenValidationResult(<WidgetValidationErrorsMessage> message);
                break;

            case MessageType.GET_ROOT_INSTRUCTION:
                this.handleGetRootInstruction(message);
                break;
        }
    }

    private handleOpenValidationResult(message: WidgetValidationErrorsMessage) {
        Log.info('Open Validation Result requested');
        if (this.onOpenValidationResult) {
            this.onOpenValidationResult(message.errors);
        }
    }

    private handleOpenPopup(message: WidgetOpenPopupMessage) {
        Log.info('Open popup requested');
        if (this.onOpenPopup) {
            this.onOpenPopup(message.url, message.options, <string> message.source, message.id);
        }
    }

    private handleOpenDocument(message: WidgetOpenDocumentMessage) {
        Log.info('Open document requested');
        if (this.onOpenDocument) {
            this.onOpenDocument(message.url);
        }
    }

    private handleClosePopup() {
        Log.info('Close popup requested');
        if (this.onClosePopup) {
            this.onClosePopup();
        }
    }

    private handleRegistrationInformation(message: WidgetRegistrationInformationMessage): void {
        Log.info('New widget registered on LAS-ROOT');
        this._widgetCommunication.broadcast(new WidgetRunsInContextMessage(), false);
    }

    private handleRouteChanged(message: WidgetNavigationMessage) {
        if (this.onRouteChanged) {
            this.onRouteChanged(message.data, message.replaceBrowserHistory);
        }
    }
}
