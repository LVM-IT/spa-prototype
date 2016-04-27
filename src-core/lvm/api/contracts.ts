import {PopupOptions} from '../models/popup.options';
import {BrowserHistory} from '../services/browser.history';
import {ValidationMessage} from '../models/validation.message';
import {BoundingRect} from '../models/bounding.rect';

export interface ILasApp {
    browserHistory: BrowserHistory;
    onRootInstructionRequested: () => string;
    onRouteChanged: (route: string, replaceBrowserHistory: boolean) => void;
    onOpenPopup: (url: string, options: PopupOptions, openerWidgetId: string, messageId: string) => void;
    onOpenDocument: (url: string) => void;
    onClosePopup: () => void;
    onOpenValidationResult: (errors: Array<ValidationMessage>) => void;

    openPopup(url: string, options: PopupOptions): Promise<any>;
    openDocument(url: string): void;
    openValidationResult(errors: Array<ValidationMessage>): void;
}

export interface ILasWidget {
    register: () => void;
    routeChanged: (route: string, replaceBrowserHistory: boolean) => void;
    boundingRectChanged: (boundingRect: BoundingRect) => void;
    schufaChanged: (clientAccepted: boolean) => void;
    openPopup: (url: string, options: PopupOptions) => Promise<any>;
    closePopup: () => void;
    getRootInstruction: () => Promise<string>;
    onBoundingRectChanged: (boundingRect: BoundingRect) => void;
    onSchufaChanged: (clientAccepted) => void;
    
    sendPopupResponse(targetWidgetId: WidgetId, responseTo: string, data: any);
    openDocument(url: string): void;
    openValidationResult(errors: Array<ValidationMessage>): void;
}

export class WidgetId extends String {
}
