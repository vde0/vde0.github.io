import { IListenerChest, ListenerChest } from "./ListenerChest";

export const ACCESSOR_EVENTS = {
    ACCESS: 'access' as AccessorEvent,
    DENIED: 'denied' as AccessorEvent,
} as const;
Object.freeze(ACCESSOR_EVENTS);


export type Accessor<F extends string> = IListenerChest<AccessorEvent> & {
    set         (flagName: F):  boolean;
    reset       (flagName: F):  boolean;
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
    function checkFlagName (flagName: F): boolean {
        if ( typeof flagName !== "string" ) throw TypeError("flagName must be string");
        if ( !flagSet.has(flagName) ) {
            console.error(
            `flagName (=${flagName}) isn't exist for Accessor`
            );
            return false;
        }
        return true;
    }

    function updateAccess (): boolean {
        if      (rest.size === 0 && state === false) {
            state = true;
            listener.exec(ACCESSOR_EVENTS.ACCESS);
            return true;
        }
        else if (rest.size !== 0 && state === true) {
            state = false;
            listener.exec(ACCESSOR_EVENTS.DENIED);
            return true;
        }
        return false;
    };

    const instance: Accessor<F> = {
        ...listener,
        set (flagName) {
            if ( !checkFlagName(flagName) ) return false;

            rest.delete(flagName);
            return updateAccess();
        },
        reset (flagName) {
            if ( !checkFlagName(flagName) ) return false;

            rest.add(flagName);
            return updateAccess();
        },

        getState () { return state },
    };

    Object.freeze(instance);
    return instance;
};