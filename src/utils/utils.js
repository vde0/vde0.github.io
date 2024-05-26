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
        }, 10);
    }
}

let maxHeight     = null;
let maxHeightCalcTime = 0;
window.addEventListener("load", _ => {
    execWhenResizeEnd(_ => {maxHeight = telegram.viewportHeight; maxHeightCalcTime++});
    // telegram.onEvent("viewportChanged", evt => {
    //     if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    // });
}, {once: true});
// function resetmaxHeight () {
//     maxHeight     = telegram.viewportStableHeight;
// }

function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportStableHeight;
    return currentHeight / maxHeight <= 0.8;
}


let wasInit = false;
const initApp = () => {
    if (wasInit) return;

    // resetmaxHeight();
    // document.querySelector(":root").style.setProperty(
    //     "--tg-offset", (window.innerHeight - maxHeight) + "px")
    document.documentElement.classList.add("root-document_placing_tg");

    window.dispatchEvent( new Event("initapp") );
    wasInit = true;
}


const appParams = {
    get maxHeight () {
        return maxHeight;
    },
    get maxHeightCalcTime () {
        return maxHeightCalcTime;
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

    // let prevKeyboardState = checkMobileKeyboard();

    // const updateKeyboardState = () => {
    //     prevKeyboardState = checkMobileKeyboard();
    // };

    let isCalc  = false;
    // openkeyboard event define
    telegram.onEvent("viewportChanged", evt => {
        if (isCalc) return;
        isCalc = true;

        const startHeight   = telegram.viewportHeight;
        // const isOpened  = checkMobileKeyboard();
        const openName  = "openkeyboard";
        const closeName = "closekeyboard";

        // if (prevKeyboardState === isOpened) return;

        // if (!isOpened)                      return;

        execWhenResizeEnd(_ => {
            const curHeight = telegram.viewportHeight;
            isCalc = false;
            // if (curHeight === startHeight) throw new ErrorEvent(`the start height (${startHeight}) and the current height (${curHeight}) are equal in the result of the generation closekeyboard and openkeyboard events.`)

            const eventName = curHeight > startHeight
                ? closeName
                : openName;
            const event     = new Event(eventName);
            window.dispatchEvent(event);
            // updateKeyboardState();
        });
    });

    // closekeyboard event define
    // telegram.onEvent("viewportChanged", evt => {
    //     const isOpened  = checkMobileKeyboard();
    //     const eventName = "closekeyboard";

    //     if (prevKeyboardState === isOpened) return;

    //     if (isOpened)                       return;

    //     const event = new Event(eventName);
    //     execWhenResizeEnd(_ => {
    //         window.dispatchEvent(event);
    //         updateKeyboardState();
    //     });
    // });
}


export {
    initApp,
    checkAncestor,
    checkOwnershipToArea,
    telegram,
    appParams,
}