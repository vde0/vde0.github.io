import TaskManager from "../TaskManager";
import { isMobile } from "../utils";
import { onResizeEnd, telegram, baseHeight } from "./utils";

// private static class fields
let lastEventVal = null;

export default class MKBController {

    static get lastEvent () { return lastEventVal }

    static open () {
        if (lastEventVal === "openkeyboard") return;
        this.makeOpenKeyboardEvent();

        if (isMobile) {
            onResizeEnd(_ => this.execWhenClosed(_ => this.makeCloseKeyboardEvent()), true);
        }
    }
    static close () {
        if (lastEventVal === "closekeyboard") return;
        this.makeCloseKeyboardEvent();
    }

    static get isOpened () {
        if (!isMobile) return null;
        const curHeight = telegram.viewportHeight;
        return curHeight / baseHeight <= 0.8;
    }
    static get isClosed () {
        if (!isMobile) return null;
        return telegram.viewportHeight === baseHeight;
    }

    static execWhenOpened (func) {
        TaskManager.setMacrotask(_ => {
            if ( this.isOpened ) { onResizeEnd(func, true); return; }
            this.execWhenOpened(func);
        });
    }
    static execWhenClosed (func) {
        TaskManager.setMacrotask(_ => {
            if ( this.isClosed ) { func(); return; }
            this.execWhenClosed(func);
        }, 10);
    }

    static makeOpenKeyboardEvent () {
        if (lastEventVal === "openkeyboard") return;
        lastEventVal = "openkeyboard";
        window.dispatchEvent( new Event("openkeyboard", {bubbles: true}) );
    }
    static makeCloseKeyboardEvent () {
        if (lastEventVal === "closekeyboard") return;
        lastEventVal = "closekeyboard";
        window.dispatchEvent( new Event("closekeyboard", {bubbles: true}) );
    }
    
    constructor () { throw Error("MKBController is a static class.") }
}
