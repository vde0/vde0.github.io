import TaskManager from "../TaskManager";


const telegram  = window.Telegram.WebApp;

let isResizing = false;
let changeCount = 0;
let usefulChangeCount = 0;
window.addEventListener("load", _ => {
    let prevHeight = telegram.viewportHeight;
    checkResize();

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
}