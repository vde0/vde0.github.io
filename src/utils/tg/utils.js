import TaskManager from "../TaskManager";
import { isMobile } from "../utils";


const telegram  = window.Telegram.WebApp;

let isResizing = false;
let changeCount = 0;
let usefulChangeCount = 0;
let appHeight = 0;
let duray = 0;

function updateAppHeight () {
    appHeight = telegram.viewportHeight;
    rootDom.style.setProperty("--tg-height", appHeight + "px");
}


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


const rootDom = document.querySelector(":root");

window.addEventListener("load", _ => {
    TaskManager.setMacrotask(_ => rootDom.classList.add("root-document_placing_tg"));
}, {once: true});


let baseHeight     = 0;
let baseOffset     = 0;
window.addEventListener("load", _ => {
    baseHeight = telegram.viewportHeight;
    baseOffset     = window.innerHeight = baseHeight;
    telegram.onEvent("viewportChanged", _ => {
        if (telegram.viewportHeight > baseHeight) {
            baseHeight = telegram.viewportHeight;
            updateOffset();
        }
    });

    let maxInnerHeight = 0;
    window.addEventListener("resize", _ => {
        if (window.innerHeight > maxInnerHeight) {
            maxInnerHeight = window.innerHeight;
            updateOffset();
        }
    })
}, {once: true});

function updateOffset () {
    baseOffset = window.innerHeight - baseHeight;
    rootDom.style.setProperty("--tg-offset", baseOffset + "px");
}

window.addEventListener("load", _ => {

    checkResize();

    let prevHeight = telegram.viewportHeight;
    const baseAvailableAmount = 10;
    let availableFails = baseAvailableAmount;

    function checkResize () {
        TaskManager.setMacrotask(_ => {
            checkResize();

            const curHeight = telegram.viewportHeight;
            const isResized = curHeight !== prevHeight;

            const evt = makeResizeEvent();
            prevHeight = curHeight;

            if (!isResized)   {
                if (isResizing) checkResizeEnd();

                isResizing = false;
                return;
            }
            
            if (!isResizing) duray=0;
            duray++; changeCount++;
            isResizing = true;
            updateAppHeight();

            const handlerList = Array.from(resizeHandlers.values());

            for (let handler of resizeHandlers.values()) handler(evt);
        });
    }

    function checkResizeEnd () {
        TaskManager.setMacrotask(_ => {

            if (isResizing) {availableFails = baseAvailableAmount; return;}
            if (availableFails > 0) {availableFails--; checkResizeEnd(); return;}
            availableFails = baseAvailableAmount;

            usefulChangeCount++;
            const evt = makeResizeEvent();
            const handlerList = Array.from(resizeEndHandlers.values());

            for (let handler of handlerList) handler(evt);
        });
    }

    function makeResizeEvent () {
        return {
            height: telegram.viewportHeight,
            diff: baseHeight - appHeight,
            step: telegram.viewportHeight - prevHeight,
        };
    }
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

    appHeight,
    baseHeight,
    baseOffset,

    onResize,
    onResizeEnd,
    offResize,
    offResizeEnd,
}