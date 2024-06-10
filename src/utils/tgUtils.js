import TaskManager from "./TaskManager";
import { isMobile } from "./utils";

const telegram  = window.Telegram.WebApp;


let isResizing = false;
let changeCount = 0;
let usefulChangeCount = 0;
window.addEventListener("load", _ => {
    let prevHeight = telegram.viewportHeight;

    function checkResize () {
        TaskManager.setMacrotask(_ => {
            const curHeight = telegram.viewportHeight;
            if (curHeight !== prevHeight)   {isResizing = true; changeCount++;}
            else                            isResizing = false;
            prevHeight = curHeight;

            checkResize();
        });
    }
}, {once: true});

function execWhenResizeEnd (func) {

    let availableFails = 5;
    exec();

    function exec () {
        if (!isResizing) {
            if (availableFails-- === 0) return;
            TaskManager.setMacrotask(exec);
            return;
        }
    
        const timerId = setInterval(_ => {
            if (isResizing) return;
            usefulChangeCount++;
            clearInterval(timerId);
            func();
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
    const curHeight = telegram.viewportHeight;
    return curHeight / maxHeight <= 0.8;
}


let lastKeyboardEvent = null;

const getOpenKeyboardEvent     = () => new Event("openkeyboard", {bubbles: true});
const getCloseKeyboardEvent    = () => new Event("closekeyboard", {bubbles: true});
const MKBController = {
    open: _ => execWhenResizeEnd(_ => {
        if ( !checkMobileKeyboard() ) return;
        window.dispatchEvent( getOpenKeyboardEvent() ); lastKeyboardEvent="openkeyboard"; }),
    close: _ => execWhenResizeEnd(_ => {
        if ( checkMobileKeyboard() ) return;
        window.dispatchEvent( getCloseKeyboardEvent() ); lastKeyboardEvent="closekeyboard"; }),
};

export {
    telegram,
    checkMobileKeyboard,
    MKBController,
    changeCount,
    usefulChangeCount,
    maxHeight,
    isResizing,
    lastKeyboardEvent,
}