import TaskManager from "../TaskManager";
import { isMobile } from "../utils";
import { execWhenResizeEnd, maxHeight, telegram } from "./utils";

// private static class fields
let lastEventVal = null;

export default class MKBController {

    static get lastEvent () { return lastEventVal }

    static open () {
        this.makeOpenKeyboardEvent();
        lastEventVal = "openkeyboard";

        this.execWhenClosed(_ => {
            this.makeCloseKeyboardEvent();
            lastEventVal = "closekeyboard";
        });
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
            if ( this.isOpened ) { execWhenResizeEnd(func); return; }
            this.execWhenOpened(func);
        });
    }
    static execWhenClosed (func) {
        TaskManager.setMacrotask(_ => {
            if ( this.isClosed ) { func(); return; }
            this.execWhenClosed(func);
        });
    }

    static makeOpenKeyboardEvent () {
        window.dispatchEvent( new Event("openkeyboard", {bubbles: true}) ); }
    static makeCloseKeyboardEvent () {
        window.dispatchEvent( new Event("closekeyboard", {bubbles: true}) ); }
    
    constructor () { throw Error("MKBController is a static class.") }
}