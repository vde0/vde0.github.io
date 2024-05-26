import TaskManager from "./TaskManager";

const telegram  = window.Telegram.WebApp;


function checkAncestor (el, selector) {
    return !!el.closest(selector);
}

function checkOwnershipToArea (el, selector) {
    return el.matches(selector) || !!el.closest(selector);
}


const mobile_events = new Set([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
]);
const isMobile = ('ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/)));
const isIOS     = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/);


function execWhenResizeEnd (func) {
    
    const curHeight = telegram.viewportHeight;
    trackResize(curHeight);

    function trackResize (prevHeight) {

        TaskManager.setMacrotask(_ => {
            const curHeight = telegram.viewportHeight;
            if (curHeight === prevHeight) func();
            else    trackResize(curHeight);
        }, 1);
    }
}

let startHeight     = null;
window.addEventListener("load", _ => {
    execWhenResizeEnd(_ => startHeight = telegram.viewportHeight);
}, {once: true});
// function resetStartHeight () {
//     startHeight     = telegram.viewportStableHeight;
// }

function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportStableHeight;
    return currentHeight / startHeight <= 0.8;
}


let wasInit = false;
const initApp = () => {
    if (wasInit) return;

    // resetStartHeight();
    // document.querySelector(":root").style.setProperty(
    //     "--tg-offset", (window.innerHeight - startHeight) + "px")
    document.documentElement.classList.add("root-document_placing_tg");

    window.dispatchEvent( new Event("initapp") );
    wasInit = true;
}


const appParams = {
    get startHeight () {
        return startHeight;
    },
    get wasInit () {
        return wasInit;
    },
    get isMobile () {
        return isMobile;
    },
    get isIOS () {
        return isIOS;
    },
    get mobileKeyboardState () {
        return checkMobileKeyboard();
    },
};


if (isMobile) {

    let prevKeyboardState = checkMobileKeyboard();

    const updateKeyboardState = () => {
        prevKeyboardState = checkMobileKeyboard();
    };

    // openkeyboard event define
    telegram.onEvent("viewportChanged", evt => {
        const isOpened  = checkMobileKeyboard();
        const eventName = "openkeyboard";

        if (prevKeyboardState === isOpened) return;

        if (!isOpened)                      return;

        const event = new Event(eventName);
        execWhenResizeEnd(_ => {
            window.dispatchEvent(event);
            updateKeyboardState();
        });
    });

    // closekeyboard event define
    telegram.onEvent("viewportChanged", evt => {
        const isOpened  = checkMobileKeyboard();
        const eventName = "closekeyboard";

        if (prevKeyboardState === isOpened) return;

        if (isOpened)                       return;

        const event = new Event(eventName);
        execWhenResizeEnd(_ => {
            window.dispatchEvent(event);
            updateKeyboardState();
        });
    });
}


export {
    initApp,
    checkAncestor,
    checkOwnershipToArea,
    telegram,
    appParams,
}