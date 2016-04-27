export enum MessageType{
    // Generic data from widget to widget
    DATA,
    // Message when a widget is registered
    REGISTRATION_INFORMATION,
    // Message when a widget get's unregistered
    UNREGISTER_WIDGET,
    // Is send to the parent when the route changed
    ROUTE_CHANGED,
    // Root will send this to a widget if it runs in an LAS context
    RUNS_IN_CONTEXT,
    OPEN_POPUP,
    POPUP_RESULT,
    CLOSE_POPUP,
    OPEN_DOCUMENT,
    OPEN_VALIDATION_RESULT,
    BROADCAST,
    BOUNDING_RECT_CHANGED,
    SCHUFA_CHANGED,
    GET_ROOT_INSTRUCTION
}
