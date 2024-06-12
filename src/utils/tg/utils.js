import TaskManager from "../TaskManager";


const telegram  = window.Telegram.WebApp;

let isResizing = false;
let changeCount = 0;
let usefulChangeCount = 0;
let duray = 0;


let maxHeight     = null;
window.addEventListener("load", _ => {
    maxHeight = telegram.viewportHeight;
    telegram.onEvent("viewportChanged", _ => {
        if (telegram.viewportHeight > maxHeight) maxHeight = telegram.viewportHeight;
    });
}, {once: true});


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

    onceHandlers.add(onceHandler);
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
            isResizing = true;

            if (!isResizing) duray=0;
            duray++; changeCount++;

            const evt = {height: telegram.viewportHeight};

            for (let handler of resizeHandlers.values()) handler(evt);

            const timerId = setInterval(_ => {
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

// function execWhenResizeEnd (func) {

//     let availableFails = 10;
//     exec();

//     function exec () {
//         if (!isResizing) {
//             if (availableFails-- > 0) { TaskManager.setMacrotask(exec); return; }
//         }
    
//         const timerId = setInterval(_ => {
//             if (isResizing) return;
//             usefulChangeCount++;
//             clearInterval(timerId);
//             func();
//         });
//     }
// }


export {
    telegram,
    changeCount,
    usefulChangeCount,
    maxHeight,
    duray,

    onResize,
    onResizeEnd,
    offResize,
    offResizeEnd,
}