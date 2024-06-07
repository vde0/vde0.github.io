import TaskManager from "./TaskManager";
import { isMobile } from "./utils";

const telegram  = window.Telegram.WebApp;

const openKeyboardEvent     = new Event("openkeyboard", {bubbles: true});
const closeKeyboardEvent    = new Event("closekeyboard", {bubbles: true});
const MKBController = {
    open: window.dispatchEvent.bind(window, openKeyboardEvent),
    close: window.dispatchEvent.bind(window, closeKeyboardEvent),
};

let isResizing = false;
let layerCount = 0;
let changeCount = 0;
let usefulChangeCount = 0;
window.addEventListener("load", _ => telegram.onEvent("viewportChanged", _ => {
    isResizing = true;
    layerCount++;
    changeCount++;

    TaskManager.setMacrotask(_ => {
        if (--layerCount === 0) {isResizing = false; usefulChangeCount++;} }, 10);
}), {once: true});

function execWhenResizeEnd (func) {
    if (!isResizing) return;

    const timerId = setInterval(_ => {
        if (!isResizing) { clearInterval(timerId); func(); }
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
// if (isMobile) {

//     let prevKeyboardState = checkMobileKeyboard();
//     let isCalc = false;

//     const updateKeyboardState = () => {
//         prevKeyboardState = checkMobileKeyboard();
//     };

//     // openkeyboard and closekeyboard events define
//     window.addEventListener("load", _ => execWhenResizeEnd(_ => {
//         telegram.onEvent("viewportChanged", _ => {
//             const isOpened          = checkMobileKeyboard();
//             const openEventName     = "openkeyboard";
//             const closeEventName    = "closekeyboard";
//             let eventName           = '';

//             if (prevKeyboardState === isOpened) return;

//             if (isCalc) return;
//             isCalc = true;

//             if (!prevKeyboardState)     eventName = openEventName;
//             else                        eventName = closeEventName;
            
//             if (!prevKeyboardState)     lastKeyboardEvent = openEventName;
//             else                        lastKeyboardEvent = closeEventName;

//             const event = new Event(eventName);

//             execWhenResizeEnd(_ => {
//                 window.dispatchEvent(event);
//                 updateKeyboardState();
//                 calcCount++;
//                 isCalc = false;
//             });
//         })
//     }), {once: true});
// }

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