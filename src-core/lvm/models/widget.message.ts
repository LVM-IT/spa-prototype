import {PopupOptions} from './popup.options';
import {MessageType} from '../widget.communication/message.type';
import {WidgetId} from '../api/contracts';
import {ValidationMessage} from './validation.message';

export abstract class WidgetMessage {

    constructor(identifier: MessageType) {
        this.messageType = identifier;
    }

    public id: string;
    public responseTo: string;
    // Used for promise based message results
    public isError: boolean;
    public messageType: MessageType;
    public source: WidgetId;
    public target: WidgetId;
    public relayedBy: Array<WidgetId>;
}

export class WidgetRegistrationInformationMessage extends WidgetMessage {
    public childWidgetIds: any;

    constructor(children: any) {
        super(MessageType.REGISTRATION_INFORMATION);
        this.childWidgetIds = children;
    }
}

export class WidgetRunsInContextMessage extends WidgetMessage {
    constructor() {
        super(MessageType.RUNS_IN_CONTEXT);
    }
}

export class WidgetUnregisterMessage extends WidgetMessage {
    constructor() {
        super(MessageType.UNREGISTER_WIDGET);
    }
}

export class WidgetDataMessage extends WidgetMessage {
    public data: any;

    constructor(data: any) {
        super(MessageType.DATA);
        this.data = data;
    }
}

export class WidgetNavigationMessage extends WidgetDataMessage {
    public replaceBrowserHistory: boolean;

    constructor(route: any, replaceBrowserHistory: boolean = false) {
        super(route);
        this.messageType = MessageType.ROUTE_CHANGED;
        this.replaceBrowserHistory = replaceBrowserHistory;
    }
}

export class WidgetOpenPopupMessage extends WidgetMessage {
    public url: string;
    public options: PopupOptions;

    constructor(url: string, options: PopupOptions) {
        super(MessageType.OPEN_POPUP);
        this.url = url;
        this.options = options;
    }
}

export class WidgetClosePopupMessage extends WidgetMessage {
    constructor() {
        super(MessageType.CLOSE_POPUP);
    }
}

export class WidgetPopupResultMessage extends WidgetDataMessage {
    constructor(responseTo: string, data: any) {
        super(data);
        this.messageType = MessageType.POPUP_RESULT;
        this.responseTo = responseTo;
    }
}

export class WidgetOpenDocumentMessage extends WidgetMessage {
    public url: string;

    constructor(url: string) {
        super(MessageType.OPEN_DOCUMENT);
        this.url = url;
    }
}

export class WidgetBroadcastMessage extends WidgetDataMessage {
    constructor(messageToBroadcast: WidgetMessage) {
        super(messageToBroadcast);
        this.messageType = MessageType.BROADCAST;
    }
}

export class WidgetBoundingRectChangedMessage extends WidgetDataMessage {
    constructor(clientBoundingRect: ClientRect) {
        super(clientBoundingRect);
        this.messageType = MessageType.BOUNDING_RECT_CHANGED;
    }
}

export class WidgetValidationErrorsMessage extends WidgetMessage {
    public errors: Array<ValidationMessage>;

    constructor(errors: Array<ValidationMessage>) {
        super(MessageType.OPEN_VALIDATION_RESULT);
        this.errors = errors;
    }
}

export class WidgetSchufaChangedMessage extends WidgetDataMessage {
    constructor(customerHasAccepted: boolean) {
        super(customerHasAccepted);
        this.messageType = MessageType.SCHUFA_CHANGED;
    }
}

export class WidgetGetRootInstructionMessage extends WidgetMessage {
    constructor() {
        super(MessageType.GET_ROOT_INSTRUCTION);
    }
}
