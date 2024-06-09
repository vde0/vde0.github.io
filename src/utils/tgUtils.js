import TaskManager from "./TaskManager";
import { isMobile } from "./utils";

const telegram  = window.Telegram.WebApp;


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

    let availableFails = 5;
    exec();

    function exec () {
        if (!isResizing) {
            if (availableFails-- === 0) return;
            TaskManager.setMacrotask(exec, 3);
        }
    
        const startHeight = telegram.viewportHeight;
    
        const timerId = setInterval(_ => {
            if (isResizing) return;
            clearInterval(timerId);
            if (startHeight !== telegram.viewportHeight) { usefulChangeCount++; func(); }
        });
    }
}

let maxHeight     = null;
window.addEventListener("load", _ => {
    maxHeight = telegram.viewportHeight;
    telegram.onEvent("viewportChanged", _ => {
        if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    });
}, {once: true});

function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportHeight;
    return currentHeight / maxHeight <= 0.8;
}


let lastKeyboardEvent = null;


function execWhenKBOpened(func) {

    const startHeight = telegram.viewportHeight;

    const timerId = setInterval(_ => {
        if ( checkMobileKeyboard() ) return;
        clearInterval(timerId);
        execWhenResizeEnd(func);
    });
}
function execWhenKBClosed (func) {

    const timerId = setInterval(_ => {
        if (telegram.viewportHeight < maxHeight) return;
        clearInterval(timerId);
        usefulChangeCount++;
        func();
    });
}

const getOpenKeyboardEvent     = () => new Event("openkeyboard", {bubbles: true});
const getCloseKeyboardEvent    = () => new Event("closekeyboard", {bubbles: true});
const MKBController = {
    open: _ => execWhenKBOpened(_ => {
        window.dispatchEvent( getOpenKeyboardEvent() ); lastKeyboardEvent="openkeyboard"; }),
    close: _ => execWhenKBClosed(_ => {
        window.dispatchEvent( getCloseKeyboardEvent() ); lastKeyboardEvent="closekeyboard"; }),
};

export {
    telegram,
    checkMobileKeyboard,
    MKBController,
    changeCount,
    usefulChangeCount,
    maxHeight,
    lastKeyboardEvent,
}