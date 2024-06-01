import TaskManager from "./TaskManager";
import { isMobile } from "./utils";

const telegram  = window.Telegram.WebApp;


function execWhenResizeEnd (func) {
    
    const exec = (prevHeight) => {
        
        const curHeight = telegram.viewportHeight;

        if (prevHeight === curHeight) {
            const checker = {1: null, 2: null, 3: null}

            TaskManager.setMacrotask(_ => checker["1"] = (prevHeight === curHeight), 2);
            TaskManager.setMacrotask(_ => checker["2"] = (prevHeight === curHeight), 4);
            TaskManager.setMacrotask(_ => checker["3"] = (prevHeight === curHeight), 6);

            const timerId   = setInterval(_ => {
                
                if (
                    checker["1"] === false ||
                    checker["2"] === false ||
                    checker["3"] === false
                ) {
                    exec(curHeight); console.log("fail"); }
                
                if (
                    checker["1"] === true &&
                    checker["2"] === true &&
                    checker["3"] === true
                ) {
                    func(); console.log("success exec"); }
                
                if (
                    checker["1"] !== null &&
                    checker["2"] !== null &&
                    checker["3"] !== null
                ) {
                    clearInterval(timerId); console.log("clear interval"); }
            });
        }
        else    TaskManager.setMacrotask(_ => exec(curHeight), 2);
    };

    TaskManager.setMacrotask(_ => exec(telegram.viewportHeight), 2);
    
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

let calcCount = 0;
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
        calcCount++;

        const startHeight   = telegram.viewportHeight;
        // const isOpened  = checkMobileKeyboard();
        const openName  = "openkeyboard";
        const closeName = "closekeyboard";

        // if (prevKeyboardState === isOpened) return;

        // if (!isOpened)                      return;

        execWhenResizeEnd(_ => {
            console.log("execed");
            const curHeight = telegram.viewportHeight;
            isCalc = false;
            // if (curHeight === startHeight) throw new ErrorEvent(`the start height (${startHeight}) and the current height (${curHeight}) are equal in the result of the generation closekeyboard and openkeyboard events.`)
            if (curHeight === startHeight) return;
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
    telegram,
    checkMobileKeyboard,
    calcCount,
}