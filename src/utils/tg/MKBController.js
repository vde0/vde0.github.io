import TaskManager from "../TaskManager";
import { isMobile } from "../utils";
import { execWhenResizeEnd, telegram } from "./utils";

// private class fields
let lastEventVal = null;

export default class MKBController {

    get lastEvent () { return lastEventVal }

    open () { _ => this.execWhenOpened(_ => {
        this.makeOpenKeyboardEvent();
        lastEventVal = "openkeyboard";

        this.execWhenClosed(_ => {
            this.makeCloseKeyboardEvent();
            lastEventVal = "closekeyboard";
        });
    }) }

    get isOpened () {
        if (!isMobile) return null;
        const curHeight = telegram.viewportHeight;
        return curHeight / maxHeight <= 0.8;
    }
    get isClosed () {
        if (!isMobile) return null;
        return telegram.viewportHeight === maxHeight;
    }

    execWhenOpened (func) {
        TaskManager.setMacrotask(_ => {
            if ( this.isOpened() ) { execWhenResizeEnd(func); return; }
            this.execWhenClosed(func);
        });
    }
    execWhenClosed (func) {
        TaskManager.setMacrotask(_ => {
            if ( this.isClosed() ) { func(); return; }
            this.execWhenClosed(func);
        });
    }

    makeOpenKeyboardEvent () {
        window.dispatchEvent( new Event("openkeyboard", {bubbles: true}) ); }
    makeCloseKeyboardEvent () {
        window.dispatchEvent( new Event("closekeyboard", {bubbles: true}) ); }
}