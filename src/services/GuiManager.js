// private vars
let senderVal = () => {};

const OPEN_DIALOG_HANDLER   = Symbol("open dialog");
const ADD_USER_HANDLER      = Symbol("add user");
const REPORT_HANDLER        = Symbol("report");
const NEXT_HANDLER          = Symbol("next");

const handlers = {
    [OPEN_DIALOG_HANDLER]: () => {},
    [ADD_USER_HANDLER]: () => {},
    [REPORT_HANDLER]: () => {},
    [NEXT_HANDLER]: () => {},
};

let guiComponent = null;
const updateGuiComponent = () => {
    if (!guiComponent.state)    guiComponent.state = {};
    queueMicrotask( _ => guiComponent.setState({sender: senderVal}) );
};

let bottomMenuComponent = null;
const updateMenuBtnHandler = (handlerName) => {
    bottomMenuComponent.setState({[handlerName]: handlers[handlerName]});
};

export default class GuiManager {

    static get OPEN_DIALOG_HANDLER () { return OPEN_DIALOG_HANDLER; }
    static get ADD_USER_HANDLER () { return ADD_USER_HANDLER; }
    static get REPORT_HANDLER () { return REPORT_HANDLER; }
    static get NEXT_HANDLER () { return NEXT_HANDLER; }

    static linkMsgForm (sender) {
        senderVal = sender;
        if (guiComponent) updateGuiComponent();
    }
    static getSender () {
        return this.senderVal;
    }
    static initGuiComponent (component) {
        guiComponent = component;
        updateGuiComponent();
    }

    static setMenuBtnHandler (handlerName, handler) {
        if ( !(handlerName in handlers) ) throw Error("Incorrect the handlerName arg.");
        handlers[handlerName] = handler;
        updateMenuBtnHandler(handlerName);
    }
    static getMenuBtnHandler (handlerName) {
        if ( !(handlerName in handlers) ) throw Error("Incorrect the handlerName arg.");
        return handlers[handlerName];
    }
    static initBottomMenu (component) {
        bottomMenuComponent = component;
    }

    constructor () {
        throw Error("GuiManager is realized like Singleton.");
    }
}