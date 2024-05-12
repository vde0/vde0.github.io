
const telegram  = window.Telegram.WebApp;


function checkAncestor (el, selector) {
    return !!el.closest(selector);
}

function checkClickByArea (evt, selector) {
    const el = evt.target;
    return el.matches(selector) || checkAncestor(el, selector);
}


function getComponentUpdateHook () {
    return {
        connect (updateFunc, context) {
            this._customUpdate      = updateFunc.bind(context);
            this._componentUpdate   = context.componentDidUpdate?.bind(context);

            context.componentDidUpdate  = this._update.bind(this);
        },
        on () {
            this._on = true;
        },
        _update () {
            this._componentUpdate?.();

            if (!this._on) return;
            this._customUpdate();
            this._on = false;
        },
    };
}


// private consts
const TOP_DIRECT    = Symbol("TOP");
const RIGHT_DIRECT  = Symbol("RIGHT");
const BOTTOM_DIRECT = Symbol("BOTTOM");
const LEFT_DIRECT   = Symbol("LEFT");
const surfaceTable  = {
    // direct: [piston-surface, movable-surfase]
    [TOP_DIRECT]    : ["top"    ,   "bottom"    ,   "height"],
    [RIGHT_DIRECT]  : ["right"  ,   "left"      ,   "width" ],
    [BOTTOM_DIRECT] : ["bottom" ,   "top"       ,   "height"],
    [LEFT_DIRECT]   : ["left"   ,   "right"     ,   "width" ],
};
function getStickyPiston (pistonEl, movableEl = null) {

    // private vars
    let pistonBlock     = pistonEl;
    let movableBlock    = movableEl;
    let curDirect       = TOP_DIRECT;
    let pistonSurface   = null;
    let movableSurface  = null;
    
    // private methods
    const setSurfaces = () => {
        pistonSurface   = pistonBlock?.getBoundingClientRect()[ surfaceTable[curDirect][0] ];
        movableSurface  = movableBlock?.getBoundingClientRect()[ surfaceTable[curDirect][1] ];
    }

    setSurfaces();

    return {
        get TOP ()      { return TOP_DIRECT; },
        get RIGHT ()    { return RIGHT_DIRECT; },
        get BOTTOM ()   { return BOTTOM_DIRECT; },
        get LEFT ()     { return LEFT_DIRECT; },

        get piston () { return pistonBlock; },
        set piston (el) { pistonBlock = el; setSurfaces(); },

        get movable () { return movableBlock; },
        set movable (el) { movableBlock = el; setSurfaces(); },

        get direction () { return curDirect; },
        set direction (symb) { 
            if (
                symb !== TOP_DIRECT     &&
                symb !== RIGHT_DIRECT   &&
                symb !== BOTTOM_DIRECT  &&
                symb !== LEFT_DIRECT
            ) {
                throw SyntaxError;
            }

            curDirect = symb;
            setSurfaces();
        },

        get pistonSurface () { return pistonSurface },
        get movableSurface () { return movableSurface },

        press () {
            const offset        = pistonSurface - movableSurface;
            const curHeight     = movableBlock.offsetHeight;
            const resultHeight  = curHeight + offset >= 0 ? curHeight + offset : 0;

            if (Number.isNaN(resultHeight)) return;

            movableBlock.style.setProperty(
                surfaceTable[curDirect][2], resultHeight + "px");
            setSurfaces();
        },
    };
}


const mobile_events = new Set([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
]);
const isMobile = ('ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/)));
const isIOS     = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/);


let startHeight     = telegram.viewportStableHeight;
function resetStartHeight () {
    startHeight     = telegram.viewportStableHeight;
}

function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportStableHeight;
    return currentHeight / startHeight <= 0.8;
}


let wasInit = false;
const initApp = () => {
    if (wasInit) return;

    resetStartHeight();
    document.querySelector(":root").style.setProperty(
        "--tg-offset", (window.innerHeight - startHeight) + "px")
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
        updateKeyboardState();

        const event = new Event(eventName);
        window.dispatchEvent(event);
    });

    // closekeyboard event define
    telegram.onEvent("viewportChanged", evt => {
        const isOpened  = checkMobileKeyboard();
        const eventName = "closekeyboard";

        if (prevKeyboardState === isOpened) return;

        if (isOpened)                       return;
        updateKeyboardState();

        const event = new Event(eventName);
        window.dispatchEvent(event);
    });
}


export {
    initApp,
    checkAncestor,
    checkClickByArea,
    getStickyPiston,
    getComponentUpdateHook,
    telegram,
    appParams,
}