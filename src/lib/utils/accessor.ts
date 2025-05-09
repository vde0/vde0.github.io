import { IListenerChest, ListenerChest } from "./ListenerChest";

export const ACCESSOR_EVENTS = {
    ACCESS: 'access' as AccessorEvent,
    DENIED: 'denied' as AccessorEvent,
} as const;
Object.freeze(ACCESSOR_EVENTS);


export type Accessor<F extends string> = IListenerChest<AccessorEvent> & {
    set         (flagName: F):  void;
    reset       (flagName: F):  void;
    getState    ():             boolean;
};

export type AccessorEvent = 'access' | 'denied';


export function makeAccessor <F extends string = string> (flagList: F[]): Accessor<F> {

    // STORE
    const rest:     Set<F>                          = new Set(flagList);
    const flagSet:  Set<F>                          = new Set(flagList);
    const listener: IListenerChest<AccessorEvent>   = new ListenerChest();

    let state:      boolean                         = false;

    // HELPERS
    function checkFlagName (flagName: F): void {
        if ( typeof flagName !== "string" ) throw TypeError("flagName must be string");
        if ( !flagSet.has(flagName) ) throw Error(
            `flagName (=${flagName}) isn't exist for Accessor`
        );
    }

    function updateAccess () {
        if      (rest.size === 0 && state === false) {
            state = true;
            listener.exec(ACCESSOR_EVENTS.ACCESS);
        }
        else if (rest.size !== 0 && state === true) {
            state = false;
            listener.exec(ACCESSOR_EVENTS.DENIED);
        }
    };

    const instance: Accessor<F> = {
        ...listener,
        set (flagName) {
            checkFlagName(flagName);

            rest.delete(flagName);
            updateAccess();
        },
        reset (flagName) {
            checkFlagName(flagName);

            rest.add(flagName);
            updateAccess();
        },

        getState () { return state },
    };

    Object.freeze(instance);
    return instance;
};