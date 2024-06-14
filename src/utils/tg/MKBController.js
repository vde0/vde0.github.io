import TaskManager from "../TaskManager";
import { isMobile } from "../utils";
import { onResizeEnd, telegram } from "./utils";

let maxHeight     = null;
window.addEventListener("load", _ => {
    maxHeight = telegram.viewportHeight;
    telegram.onEvent("viewportChanged", _ => {
        if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    });
}, {once: true});

// private static class fields
let lastEventVal = null;

export default class MKBController {

    static get lastEvent () { return lastEventVal }

    static open () {
        if (!isMobile) throw Error("MKBController.open() may be called if only isMobile=true.");
        
        this.makeOpenKeyboardEvent();

        onResizeEnd(_ => this.execWhenClosed(_ => this.makeCloseKeyboardEvent()), true);
    }

    static get isOpened () {
        if (!isMobile) return null;
        const curHeight = telegram.viewportHeight;
        return curHeight / maxHeight <= 0.8;
    }
    static get isClosed () {
        if (!isMobile) return null;
        return telegram.viewportHeight === maxHeight;
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
        lastEventVal = "openkeyboard";
        window.dispatchEvent( new Event("openkeyboard", {bubbles: true}) );
    }
    static makeCloseKeyboardEvent () {
        lastEventVal = "closekeyboard";
        window.dispatchEvent( new Event("closekeyboard", {bubbles: true}) );
    }
    
    constructor () { throw Error("MKBController is a static class.") }
}

export { maxHeight }