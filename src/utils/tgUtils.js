import TaskManager from "./TaskManager";
import { isMobile } from "./utils";

const telegram  = window.Telegram.WebApp;


function execWhenResizeEnd (func) {
    
    const exec = (prevHeight) => {
        
        const curHeight = telegram.viewportHeight;

        if (prevHeight === curHeight) {
            const checker = {1: null, 2: null, 3: null, 4: null, 5: null}

            TaskManager.setMacrotask(_ => checker["1"] = (prevHeight === curHeight), 3);
            TaskManager.setMacrotask(_ => checker["2"] = (prevHeight === curHeight), 6);
            TaskManager.setMacrotask(_ => checker["3"] = (prevHeight === curHeight), 9);
            TaskManager.setMacrotask(_ => checker["4"] = (prevHeight === curHeight), 12);
            TaskManager.setMacrotask(_ => checker["5"] = (prevHeight === curHeight), 15);

            const timerId   = setInterval(_ => {
                
                if (
                    checker["1"] === false ||
                    checker["2"] === false ||
                    checker["3"] === false ||
                    checker["4"] === false ||
                    checker["5"] === false
                ) {
                    exec(curHeight); }
                
                if (
                    checker["1"] === true &&
                    checker["2"] === true &&
                    checker["3"] === true &&
                    checker["4"] === true &&
                    checker["5"] === true
                ) {
                    func(); }
                
                if (
                    checker["1"] !== null &&
                    checker["2"] !== null &&
                    checker["3"] !== null &&
                    checker["4"] !== null &&
                    checker["5"] !== null
                ) {
                    clearInterval(timerId); }
            });
        }
        else    TaskManager.setMacrotask(_ => exec(curHeight), 3);
    };

    TaskManager.setMacrotask(_ => exec(telegram.viewportHeight), 3);
    
    // const curHeight = telegram.viewportHeight;
    // trackResize(curHeight);

    // function trackResize (prevHeight) {

    //     TaskManager.setMacrotask(_ => {
    //         const curHeight = telegram.viewportHeight;
    //         if (curHeight === prevHeight) func();
    //         else    trackResize(curHeight);
    //     }, 10);
    // }
}

let maxHeight     = null;
window.addEventListener("load", _ => {
    maxHeight = telegram.viewportHeight
    telegram.onEvent("viewportChanged", _ => {
        if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    });
    // execWhenResizeEnd(_ => {maxHeight = telegram.viewportHeight; maxHeightCalcTime++});
    // telegram.onEvent("viewportChanged", evt => {
    //     if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    // });
}, {once: true});
// function resetmaxHeight () {
//     maxHeight     = telegram.viewportStableHeight;
// }

function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportHeight;
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

let calcCount = 0;
if (isMobile) {

    // let isCalc  = false;
    // // openkeyboard event define
    // telegram.onEvent("viewportChanged", evt => {
        
    //     if (isCalc) return;
    //     isCalc = true;
    //     calcCount++;

    //     const startHeight   = telegram.viewportHeight;
    //     // const isOpened  = checkMobileKeyboard();
    //     const openName  = "openkeyboard";
    //     const closeName = "closekeyboard";

    //     // if (prevKeyboardState === isOpened) return;

    //     // if (!isOpened)                      return;

    //     execWhenResizeEnd(_ => {
    //         const curHeight = telegram.viewportHeight;
    //         isCalc = false;
    //         // if (curHeight === startHeight) throw new ErrorEvent(`the start height (${startHeight}) and the current height (${curHeight}) are equal in the result of the generation closekeyboard and openkeyboard events.`)
    //         if (curHeight === startHeight) return;
    //         const eventName = curHeight > startHeight
    //             ? closeName
    //             : openName;
            
    //         const event     = new Event(eventName, {bubbles: true});
    //         window.dispatchEvent(event);
    //         // updateKeyboardState();
    //     });
    // });


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
        updateKeyboardState();

        setTimeout(_ => window.dispatchEvent(event), 200);
        // execWhenResizeEnd(_ => {
        //     window.dispatchEvent(event);
        //     updateKeyboardState();
        // });
    });
    // closekeyboard event define
    telegram.onEvent("viewportChanged", evt => {
        const isOpened  = checkMobileKeyboard();
        const eventName = "closekeyboard";

        if (prevKeyboardState === isOpened) return;

        if (isOpened)                       return;

        const event = new Event(eventName);
        updateKeyboardState();

        setTimeout(_ => window.dispatchEvent(event), 200);
        // execWhenResizeEnd(_ => {
        //     window.dispatchEvent(event);
        //     updateKeyboardState();
        // });
    });
}

export {
    telegram,
    checkMobileKeyboard,
    calcCount,
    maxHeight,
}