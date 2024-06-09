import TaskManager from "./TaskManager";
import { isMobile } from "./utils";

const telegram  = window.Telegram.WebApp;

const getOpenKeyboardEvent     = () => new Event("openkeyboard", {bubbles: true});
const getCloseKeyboardEvent    = () => new Event("closekeyboard", {bubbles: true});
const MKBController = {
    open: _ => execWhenResizeEnd(_ => window.dispatchEvent( getOpenKeyboardEvent() )),
    close: _ => execWhenResizeEnd(_ => window.dispatchEvent( getCloseKeyboardEvent() )),
};

let isResizing = false;
let stack = 0;
let changeCount = 0;
let usefulChangeCount = 0;
window.addEventListener("load", _ => telegram.onEvent("viewportChanged", _ => {
    isResizing = true;
    stack++;
    changeCount++;

    TaskManager.setMacrotask(_ => {
        if (--stack === 0) isResizing = false; }, 10);
}), {once: true});

function execWhenResizeEnd (func) {
    if (!isResizing) return;

    const startHeight = tg.viewportHeight;

    const timerId = setInterval(_ => {
        if (!isResizing) clearInterval(timerId);
        if (startHeight !== tg.viewportHeight) { usefulChangeCount++; func(); }
    });
}

let maxHeight     = null;
window.addEventListener("load", execWhenResizeEnd(_ => {
    maxHeight = telegram.viewportHeight
    telegram.onEvent("viewportChanged", _ => {
        if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    });
}), {once: true});

function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportHeight;
    return currentHeight / maxHeight <= 0.8;
}


let calcCount = 0;
let lastKeyboardEvent = null;

export {
    telegram,
    checkMobileKeyboard,
    MKBController,
    calcCount,
    changeCount,
    usefulChangeCount,
    maxHeight,
    lastKeyboardEvent,
}