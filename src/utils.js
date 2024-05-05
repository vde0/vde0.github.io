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


// Solution source: https://stackoverflow.com/questions/54424729/ios-show-keyboard-on-input-focus/55425845
// Author: (n8jadams) https://stackoverflow.com/users/7176651/n8jadams
// Code is changed
function focusAndOpenKeyboard (el) {
    if (!el) throw SyntaxError(
        "focusAndOpenKeyboard() must have only one argument: element of the document");

    // Align temp input element approximately where the input element is
    // so the cursor doesn't jump around
    var __tempEl__ = document.createElement('input');
    __tempEl__.style.position = 'absolute';
    __tempEl__.style.top = (el.offsetTop + 7) + 'px';
    __tempEl__.style.left = el.offsetLeft + 'px';
    __tempEl__.style.height = 0;
    __tempEl__.style.opacity = 0;
    // Put this temp element as a child of the page <body> and focus on it
    document.body.appendChild(__tempEl__);
    __tempEl__.focus();

    // The keyboard is open. Now do a delayed focus on the target element
    setTimeout(function() {
        el.focus();
        // Remove the temp element
        document.body.removeChild(__tempEl__);
    });
}


const mobile_events = new Set([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
]);
const isMobile = ('ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/)));


const startHeight = window.innerHeight;
function checkMobileKeyboard () {
    if (!isMobile) return false;
    const currentHeight = window.innerHeight;
    return currentHeight / startHeight <= 0.8;
}

if (isMobile) {

    let prevKeyboardState = checkMobileKeyboard();

    const updateKeyboardState = () => {
        prevKeyboardState = checkMobileKeyboard();
    };

    // openkeyboard event define
    window.addEventListener("resize", evt => {
        const isOpened  = checkMobileKeyboard();
        const eventName = "openkeyboard";

        queueMicrotask(updateKeyboardState);

        if (prevKeyboardState === isOpened) return;
        if (!isOpened)                      return;

        const event = new Event(eventName, {bubbles: true});
        window.dispatchEvent(event);
    });

    // closekeyboard event define
    window.addEventListener("resize", evt => {
        const isOpened  = checkMobileKeyboard();
        const eventName = "closekeyboard";

        queueMicrotask(updateKeyboardState);

        if (prevKeyboardState === isOpened) return;
        if (isOpened)                       return;

        const event = new Event(eventName, {bubbles: true});
        window.dispatchEvent(event);
    });
}


export {
    checkAncestor,
    checkClickByArea,
    getClassLine,
    getComponentUpdateHook,
    checkMobileKeyboard,
    focusAndOpenKeyboard,
    isMobile
}