import TaskManager from "../TaskManager";


const telegram  = window.Telegram.WebApp;

let isResizing = false;
let changeCount = 0;
let usefulChangeCount = 0;
let duray = 0;
window.addEventListener("load", _ => {
    let prevHeight = telegram.viewportHeight;
    checkResize();

    function checkResize () {
        TaskManager.setMacrotask(_ => {
            const curHeight = telegram.viewportHeight;
            if (curHeight !== prevHeight)   {isResizing = true; duray++; changeCount++;}
            else                            {isResizing = false; duray = 0;}
            prevHeight = curHeight;

            checkResize();
        });
    }
}, {once: true});


const resizeStartHandlers = {
    regular: new Set(),
    temp: new Set(),
};
function onResizeStart (func, once=false) {
    if (once)   resizeStartHandlers.temp.add(func);
    else        resizeStartHandlers.regular.add(func);
}
function offResizeStart (func, once=false) {
    if (once)   resizeStartHandlers.temp.delete(func);
    else        resizeStartHandlers.regular.delete(func);
}

const resizeEndHandlers = {
    regular: new Set(),
    temp: new Set(),
};
function onResizeEnd (func, once=false) {
    if (once)   resizeEndHandlers.temp.add(func);
    else        resizeEndHandlers.regular.add(func);
}
function offResizeEnd (func, once=false) {
    if (once)   resizeEndHandlers.temp.delete(func);
    else        resizeEndHandlers.regular.delete(func);
}

function execWhenResizeEnd (func) {

    let availableFails = 10;
    exec();

    function exec () {
        if (!isResizing) {
            if (availableFails-- > 0) { TaskManager.setMacrotask(exec); return; }
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


export {
    telegram,
    changeCount,
    usefulChangeCount,
    maxHeight,
    execWhenResizeEnd,
    duray,
}