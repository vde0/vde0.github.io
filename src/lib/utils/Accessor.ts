import { IListenerChest, IListenerChestApi, ListenerChest, ListenerChestApi } from "./ListenerChest";
import { IPrivateContext, PrivateContext } from "./PrivateContext";

export const ACCESSOR_EVENTS = {
    ACCESS: 'access',
    DENIED: 'denied',
} as const;
Object.freeze(ACCESSOR_EVENTS);


export type IAccessor<F extends string> = IListenerChestApi<AccessorEventMap> & {
    set         (flagName: F):  boolean;
    reset       (flagName: F):  boolean;
    getState    ():             boolean;
};

export type AccessorEventName   = 'access' | 'denied';
export type AccessorEventMap    = Record<AccessorEventName, undefined>;

const privateContext = new PrivateContext<IAccessor<string>, PrivateProps>();

type PrivateProps = {
    rest:       Set<string>;
    flagSet:    Set<string>;
    listener:   IListenerChest<AccessorEventMap>;
    state:      boolean;

    checkFlagName (flagName: string): boolean;
    updateAccess (): boolean;
};


export class Accessor <F extends string = string> extends ListenerChestApi<AccessorEventMap> implements IAccessor<F> {

    constructor (flagList: F[]) {
        super();

        const privatePlace: Partial<PrivateProps> = {
            rest:       new Set(flagList),
            flagSet:    new Set(flagList),
            state:      false,
            checkFlagName (this: IAccessor<F>, flagName) {
                if ( typeof flagName !== "string" ) throw TypeError("flagName must be string");

                const flagSet = privateContext.get(this, "flagSet")!;

                if ( !flagSet.has(flagName) ) {
                    console.error(
                    `flagName (=${flagName}) isn't exist for Accessor`
                    );
                    return false;
                }
                return true;
            },
            updateAccess (this: IAccessor<F>) {
                const rest = privateContext.get(this, "rest")!;
                const state = privateContext.get(this, "state")!;

                if      (rest.size === 0 && state === false) {
                    privateContext.set(this, "state", true);
                    this.exec(ACCESSOR_EVENTS.ACCESS);
                    return true;
                }
                else if (rest.size !== 0 && state === true) {
                    privateContext.set(this, "state", false);
                    this.exec(ACCESSOR_EVENTS.DENIED);
                    return true;
                }
                return false;
            },
        };
        
        privateContext.set<keyof PrivateProps>(this, privatePlace);
    }

    set (flagName: F): boolean {
        const checkFlagName = privateContext.get(this, "checkFlagName")!;
        const updateAccess  = privateContext.get(this, "updateAccess")!;
        const rest          = privateContext.get(this, "rest")!;

        if ( !checkFlagName(flagName) ) return false;

        rest.delete(flagName);
        return updateAccess();
    }
    reset (flagName: F): boolean {
        const checkFlagName = privateContext.get(this, "checkFlagName")!;
        const updateAccess  = privateContext.get(this, "updateAccess")!;
        const rest          = privateContext.get(this, "rest")!;

        if ( !checkFlagName(flagName) ) return false;

        rest.add(flagName);
        return updateAccess();
    }

    getState (): boolean { return privateContext.get(this, "state")! }
}