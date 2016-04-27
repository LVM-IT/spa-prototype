import {WidgetMessage, WidgetDataMessage} from '../models/widget.message';
import {WidgetId} from '../api/contracts';

export interface IWidgetCommunication {

    /**
     * Send a message to an iFrame
     * @param {WidgetMessage} message
     * @param {WidgetId?} widgetId Leave empty to send to root
     */
    send(message: WidgetMessage, widgetId?: WidgetId): void;

    /**
     * Resolves or rejects a promise when an answer comes back
     * @param {WidgetMessage} message
     * @param {WidgetId?} widgetId Leave empty to send to root
     */
    awaitResult<T>(message: WidgetMessage, widgetId?: WidgetId): Promise<T>;

    /**
     * register a widget which and subscribe to it's post messages
     * @param {Window} window
     * @param {function} onDataReceived
     */
    register(window: Window, onDataReceived: (data: WidgetMessage)=> void): void;

    /**
     * Remove registered widget
     */
    unregister(): void;

    /**
     * Broadcasts a message
     *
     * @param {WidgetMessage} message
     * @param {boolean} broadcastFromCurrent Set to false to broadcast from root
     */
    broadcast(message: WidgetMessage, broadcastFromCurrent: boolean): void;
}
