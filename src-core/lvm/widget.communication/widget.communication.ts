import {
    WidgetMessage,
    WidgetRegistrationInformationMessage,
    WidgetUnregisterMessage,
    WidgetBroadcastMessage
} from '../models/widget.message';
import {IWidgetCommunication} from './contracts';
import {MessageType} from './message.type';
import {WidgetId} from '../api/contracts';
import {Guid} from '../guid';
import {Log} from '../services/log';

// idea
// each window has a WidgetCommunication instance
// it's dispatching all the messages
//   from the children to the parents
//   from the children to the root
//   form the root to all children
//   from a child to all its children

// is there still a need to store a unique identifier per widget? --> YES, easier to deal with for callbaks -> see ctor, register and unregister!
//  - without an identifier we can use the window instance itself (it's stored by ref and transmitted by H5 postMessage to other windows)
//  - we should prototype it without a didicated id first... if we need it later it's easy to add (see root and widget classes for this)

// questions raised while implementing this
// -- need the root all widgets (no matter how depp they're nested?)
//   -- if so see register method -> forward the call to _root

export class WidgetCommunication implements IWidgetCommunication {
    public static rootWidgetId = <WidgetId> 'root';
    public static parentWidgetId = <WidgetId> 'parent';
    private _childWidgets: any = {};
    private _rootUrl: string;
    private _root: Window;
    private _widgetId: WidgetId;
    private _onDataReceived: (message: WidgetMessage)=>void;
    private _awaitResults: any = {};
    private _enableVerboseLogging: boolean = true;

    constructor(widgetId: WidgetId, lasRootUrl?: string) {
        this._rootUrl = lasRootUrl || window.location.origin;
        this._widgetId = widgetId;
        this._root = window.top;

        if (this._enableVerboseLogging && this._widgetId !== WidgetCommunication.rootWidgetId) {
            this._widgetId = <WidgetId>document.title;
        }

        window.addEventListener('message', this.handleOnMessage.bind(this));
    }

    public send(message: WidgetMessage, targetId: WidgetId = WidgetCommunication.rootWidgetId): void {
        message.target = targetId;
        message.source = this._widgetId;
        message.id = Guid.NewGuid();

        Log.debug(`Sending message ${JSON.stringify(message)}`);

        this.internalSendTo(message);
    }

    public register(window: Window, onDataReceived: (data: WidgetMessage)=>void): void {
        this._onDataReceived = onDataReceived;
        var message = new WidgetRegistrationInformationMessage(null);
        this.sendToParent(message);
    }

    public unregister(): void {
        var message = new WidgetUnregisterMessage();
        this.sendToParent(message);
    }

    public awaitResult<T>(message: WidgetMessage, widgetId: WidgetId): Promise<T> {
        return new Promise((resolve, reject) => {
            this.send(message, widgetId);

            this._awaitResults[message.id] = {
                resolve: resolve,
                reject: reject,
                // For cleanup later
                startTime: new Date().getTime()
            };
        });
    }

    public broadcast(message: WidgetMessage, broadcastFromCurrent: boolean = false): void {
        message.source = this._widgetId;
        message.target = <WidgetId> 'broadcast';

        var broadcastMessage = new WidgetBroadcastMessage(message);

        if (broadcastFromCurrent) {
            throw new Error('Broadcasting from current location not supported yet');
        }

        if (this._widgetId === WidgetCommunication.rootWidgetId) {
            return this.handleBroadcastMessage(broadcastMessage);
        }

        this.send(message);
    }

    private internalSendTo(message: WidgetMessage) {
        if (message.target === WidgetCommunication.rootWidgetId) {
            Log.debug(`Sending to root ${JSON.stringify(message)}`);
            return this._root.postMessage(message, '*');
        }

        const target = this.getNext(message.target);
        if (target) {
            const child = this._childWidgets[<any>target];
            child.window.postMessage(message, child.origin);
            return;
        }

        Log.debug(`Sending to parent (${JSON.stringify(message)})`);
        window.parent.postMessage(message, '*');
    }

    private getNext(target: WidgetId): WidgetId {
        const wayOfCommunication = this.getWayOfCommunication(target, this._childWidgets);
        return wayOfCommunication[0];
    }

    private getWayOfCommunication(target: WidgetId, child): Array<WidgetId> {
        const result: Array<WidgetId> = [];
        const children = <Array<WidgetId>> Object.keys(child);

        if (children.indexOf(target) > -1) {
            result.push(target);
            return result;
        }

        for (let i = 0; i < children.length; i++) {
            const current = child[<any>children[i]];
            const possibleChildren = current.children;

            if (possibleChildren) {
                result.push(current.id);

                const next = this.getWayOfCommunication(target, possibleChildren);

                if (next.length === 0) {
                    result.pop();
                    continue;
                }

                if (next[0] === target) {
                    return result;
                }
            }
        }

        return result;
    }

    private sendToParent(message: WidgetMessage) {
        this.addWidgetIdToMessage(message);
        Log.debug(`Sending to parent (${JSON.stringify(message)})`);
        window.parent.postMessage(message, '*');
    }

    private addWidgetIdToMessage(message: WidgetMessage) {
        message.source = this._widgetId;
    }

    private handleOnMessage(event) {
        // Ignore our own events
        if (event.source === window) {
            return;
        }

        const message = <WidgetMessage> event.data;

        Log.debug(`Received message (${JSON.stringify(message)})`);

        switch (message.messageType) {
            case MessageType.REGISTRATION_INFORMATION:
                this.registerChildWidget(<WidgetRegistrationInformationMessage> message, event.source, event.origin);
                break;

            case MessageType.UNREGISTER_WIDGET:
                this.handleUnregisterWidget(<WidgetUnregisterMessage> message);
                break;

            case MessageType.BROADCAST:
                this.handleBroadcastMessage(<WidgetBroadcastMessage> message);
                break;

            default:
                // This message is not for us, we try to relay it
                if (message.target !== this._widgetId && message.target !== WidgetCommunication.parentWidgetId) {
                    message.relayedBy = message.relayedBy || [];
                    message.relayedBy.push(this._widgetId);

                    Log.debug(`Relaying message (${JSON.stringify(message)})`);
                    return this.internalSendTo(message);
                }
                break;
        }

        // Do we have a promise for the messageId?

        const callbacks = this._awaitResults[message.responseTo];
        if (callbacks) {
            delete this._awaitResults[message.responseTo];

            if (message.isError) {
                return callbacks.reject(message);
            }

            return callbacks.resolve(message);
        }

        if (this._onDataReceived) {
            this._onDataReceived(message);
        }
    }

    private handleBroadcastMessage(message: WidgetBroadcastMessage) {
        Log.debug(`Handling broadcast message (${JSON.stringify(message)})`);
        const keys = Object.keys(this._childWidgets);

        keys.forEach(key => {
            const child = this._childWidgets[key];

            this.send(message, <WidgetId> child.id);
        });
    }

    private registerChildWidget(message: WidgetRegistrationInformationMessage, window: Window, origin: string) {
        this._childWidgets[<any>message.source] = {
            id: message.source,
            window: window,
            origin: origin,
            children: message.childWidgetIds
        };

        const childrenToSend = Object.keys(this._childWidgets).map(key => {
            const child = this._childWidgets[key];

            return {
                id: child.id,
                origin: child.origin,
                children: child.children
            }
        });

        var message = new WidgetRegistrationInformationMessage(childrenToSend);
        this.sendToParent(message);
    }

    private handleUnregisterWidget(message: WidgetUnregisterMessage) {
        delete this._childWidgets[<any>message.source];

        var infoMessage = new WidgetRegistrationInformationMessage(this._childWidgets);
        this.sendToParent(infoMessage);
    }
}
