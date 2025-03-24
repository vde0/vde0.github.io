import { deepCopy, wait } from "@utils";
import { TEventData, TEventHandler, TEventType, TWebApp } from "@tg-types";


let handlers: Partial<Record<TEventType, Map<TEventHandler, TEventHandler>>> = {};
const dispatchTEvent = (
    event: TEventType,
    eventData: TEventData = { isStateStable: true }
) => handlers[event]?.forEach(
    (handler: TEventHandler) => handler(eventData)
);

const DEFAULT_WEBAPP: TWebApp = {
    platform: "android",
    initData: "",
    initDataUnsafe: {
        auth_date: 0,
        hash: "",
    },
    colorScheme: "dark",
    themeParams: {},
    isExpanded: false,
    viewportHeight: 0,
    viewportStableHeight: 0,
    MainButton: {
        text: "",
        color: "",
        textColor: "",
        isActive: false,
        isVisible: false,
        isProgressVisible: false,
        setText () { return this; },
        show () { return this; },
        hide () { return this; },
        enable () { return this; },
        disable () { return this; },
        showProgress () { return this; },
        hideProgress () { return this; },
        onClick () { return this; },
        offClick () { return this; },
        setParams () { return this },
    },
    sendData () {},
    ready () {},
    expand () {},
    close () {},
    onEvent (event, handler) {
        if (!handlers[event]) handlers[event] = new Map();
        handlers[event].set(handler, handler.bind(window.Telegram.WebApp));
    },
    offEvent (event, handler) {
        if (!handlers[event]) handlers[event] = new Map();
        handlers[event].delete(handler);
    },
};

const mockTelegram = (): void => {
    if (!window.Telegram) window.Telegram = { WebApp: {} as TWebApp };
    global.window.Telegram.WebApp = deepCopy(DEFAULT_WEBAPP, {depth: -1}) as TWebApp;
    handlers = {};
};

const rushResizeTo      = (height: number): void => {
    if (height === window.Telegram?.WebApp.viewportHeight) return;
    const wapp: TWebApp         = window.Telegram.WebApp;
    wapp.viewportHeight         = height;
    wapp.viewportStableHeight   = height;
    dispatchTEvent("viewportChanged", { isStateStable: true });
};
const smoothResizeTo    = async (
    height: number, delayMs: number = 300, jumpVal: number = 15
): Promise<void> => {
    if (height === window.Telegram?.WebApp.viewportHeight) return;

    const wapp:         TWebApp = window.Telegram.WebApp;
    //
    const diff:         number  = Math.abs(wapp.viewportHeight - height);
    const isIncrease:   boolean = wapp.viewportHeight < height;
    const jumpAmount:   number  = Math.floor(diff / jumpVal);
    const stepDelay:    number  = delayMs / (jumpAmount +1);
    //
    const primeJump:    number  = isIncrease ? jumpVal : -jumpVal
    const lastJump:     number  = isIncrease ? diff % jumpVal : -(diff % jumpVal);
    
    for (let j = 0; j < jumpAmount; j++) {
        await wait(stepDelay);
        wapp.viewportHeight += primeJump;
        dispatchTEvent("viewportChanged", { isStateStable: false });
    }
    await wait(stepDelay);
    wapp.viewportHeight         += lastJump;
    wapp.viewportStableHeight   = height;
    dispatchTEvent("viewportChanged", { isStateStable: true });
};


export {
    mockTelegram, dispatchTEvent,
    rushResizeTo, smoothResizeTo,
};