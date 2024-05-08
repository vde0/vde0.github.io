const telegram  = window.Telegram.WebApp;


function checkAncestor (el, selector) {
    return !!el.closest(selector);
}

function checkClickByArea (evt, selector) {
    const el = evt.target;
    return el.matches(selector) || checkAncestor(el, selector);
}


function getClassLine (classList) {
    const classLine = {
        [Symbol.toPrimitive] (hint) { return this.classList.join(" "); },

        add (className) {
            if (typeof(className) !== "string") throw TypeError("\"add\" method of the classLine object only takes a string arg");
            className.trim();
            if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
            if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

            if ( !this.classList.includes(className) ) this.classList.push(className);
            return this;
        },

        remove (className) {
            if (typeof(className) !== "string") throw TypeError("\"remove\" method of the classLine object only takes a string arg");
            className.trim();
            if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
            if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

            const index = this.classList.indexOf(className);
            if ( ~index ) this.classList.splice(index, 1);

            return this;
        },

        toggle (className) {
            if (typeof(className) !== "string") throw TypeError("\"toggle\" method of the classLine object only takes a string arg");
            className.trim();
            if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
            if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

            (this.classList.includes(className) ? this.remove(className) : this.add(className));
            return this;
        },

        load (classList) {
            if ( typeof(classList) === "string" ) {
                let newFragment = classList;
                newFragment.trim();

                newFragment = newFragment.split(" ");
                newFragment.forEach( className => this.add(className) );
            }
            else if ( Array.isArray(classList) ) {
                classList.forEach( className => this.add(className) );
            }
            else if ( typeof(classList) === "object" ) {
                if ( !Array.isArray(classList.classList) ) throw SyntaxError;
                classList.classList.forEach( className => this.add(className) );
            }
            else    throw TypeError;

            return this;
        },

        contains (className) {
            if (typeof(className) !== "string") throw TypeError("\"contains\" method of the classLine object only takes a string arg");
            className.trim();
            if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
            if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

            return this.classList.includes(className);
        },

        getLine () {
            return this.classList.join(" ");
        },

        classList: [],
    };

    if (classList) classLine.load(classList);
    return classLine;
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


const mobile_events = new Set([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
]);
const isMobile = ('ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/)));
const isIOS = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/);


const startHeight   = telegram.viewportStableHeight;
function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = telegram.viewportStableHeight;
    return currentHeight / startHeight <= 0.8;
}

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

    window.addEventListener("load", evt => {
        window.dispatchEvent(new Event("touchend"));
    }, {once: true});
}


export {
    checkAncestor,
    checkClickByArea,
    getClassLine,
    getComponentUpdateHook,
    checkMobileKeyboard,
    telegram,
    isMobile,
    isIOS,
    startHeight,
}