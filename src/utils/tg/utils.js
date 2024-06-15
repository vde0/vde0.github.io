import TaskManager from "../TaskManager";


const telegram  = window.Telegram.WebApp;

let isResizing = false;
let changeCount = 0;
let usefulChangeCount = 0;
let duray = 0;


const onceHandlers = new Map();
const resizeHandlers = new Set();
const resizeEndHandlers = new Set();

function onResize (func, once=false) {
    if (!once)  {resizeHandlers.add(func); return;}
    
    resizeHandlers.add( makeHandlerOnce(func) );
}
function offResize (func, once=false) {
    if (!once)  {resizeHandlers.delete(func); return;}

    resizeHandlers.delete( onceHandlers.get(func) );
    onceHandlers.delete(func);
}

function onResizeEnd (func, once=false) {
    if (!once)  {resizeEndHandlers.add(func); return;}
    
    resizeEndHandlers.add( makeHandlerOnce(func) );
}
function offResizeEnd (func, once=false) {
    if (!once)  {resizeEndHandlers.delete(func); return;}

    resizeEndHandlers.delete( onceHandlers.get(func) );
    onceHandlers.delete(func);
}

function makeHandlerOnce (func) {
    function onceHandler (evt) {
        resizeHandlers.delete( onceHandlers.get(func) );
        resizeEndHandlers.delete( onceHandlers.get(func) );
        onceHandlers.delete(func);
        func(evt);
    }

    onceHandlers.set(func, onceHandler);
    return onceHandler;
}


window.addEventListener("load", _ => {
    let prevHeight = telegram.viewportHeight;
    checkResize();

    function checkResize () {
        TaskManager.setMacrotask(_ => {
            checkResize();

            const curHeight = telegram.viewportHeight;
            const isResized = curHeight !== prevHeight;
            prevHeight = curHeight;

            if (!isResized)   {isResizing = false; return;}
            
            if (!isResizing) duray=0;
            duray++; changeCount++;
            isResizing = true;

            const evt = {height: telegram.viewportHeight};

            for (let handler of resizeHandlers.values()) handler(evt);

            const timerId = setInterval(_ => {
                const curHeight     = telegram.viewportHeight;
                const isResizeEnd   = curHeight === prevHeight;

                if (!isResizeEnd) return;
                clearInterval(timerId);

                usefulChangeCount++;
                const evt = {height: telegram.viewportHeight};
                for (let handler of resizeEndHandlers.values()) handler(evt);
            });
        });
    }
}, {once: true});


let startHeight = null;
window.addEventListener("load", _ => {

    onResizeEnd(_ => onResizeEnd(_ => {
        const rootDom = document.querySelector(":root");
        rootDom.style.setProperty("--tg-height", telegram.viewportStableHeight + "px");
        startHeight = telegram.viewportStableHeight;
    }, true), true);

}, {once: true});

let nativeChangeCount = 0;
let sucCount = 0;
let failCount = 0;
window.addEventListener("load", _ => {

    let prevHeight = telegram.viewportHeight;

    telegram.onEvent("viewportChanged", _ => {
        const curHeight = telegram.viewportHeight;
        const isResized = curHeight !== prevHeight;
        prevHeight = curHeight;
        
        (isResized ? sucCount++ : failCount++);
        
        nativeChangeCount++;
    });
}, {once: true});


export {
    telegram,
    changeCount,
    usefulChangeCount,
    duray,

    nativeChangeCount,
    sucCount,
    failCount,

    startHeight,

    onResize,
    onResizeEnd,
    offResize,
    offResizeEnd,
}