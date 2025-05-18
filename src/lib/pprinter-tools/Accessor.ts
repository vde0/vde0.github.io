import { IListenerChest, ListenerChest } from "./ListenerChest";
import { PrivateContext } from "./PrivateContext";

export const ACCESSOR_EVENTS = {
    ACCESS: 'access',
    DENIED: 'denied',
} as const;
Object.freeze(ACCESSOR_EVENTS);


export type IAccessor<F extends string> = IListenerChest<AccessorEventMap> & {
    set         (flagName: F):  boolean;
    reset       (flagName: F):  boolean;
    getState    ():             boolean;
};

export type AccessorEventName   = 'access' | 'denied';
export type AccessorEventMap    = Record<AccessorEventName, undefined>;

const privateContext = new PrivateContext<IAccessor<string>, PrivateProps>();

interface PrivateProps {
    rest:       Set<string>;
    flagSet:    Set<string>;
    chest:      IListenerChest<AccessorEventMap>;
    state:      boolean;

    checkFlagName (flagName: string): boolean;
    updateAccess (): boolean;
}


export class Accessor <F extends string = string> implements IAccessor<F> {

    constructor (flagList: F[]) {

        const privatePlace: Partial<PrivateProps> = {
            rest:       new Set(flagList),
            flagSet:    new Set(flagList),
            state:      false,
            chest:      new ListenerChest<AccessorEventMap>(),
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
                const rest      = privateContext.get(this, "rest")!;
                const state     = privateContext.get(this, "state")!;
                const chest     = privateContext.get(this, "chest")!;
                
                if      (rest.size === 0 && state === false) {
                    privateContext.set(this, "state", true);
                    chest.exec(ACCESSOR_EVENTS.ACCESS);
                    return true;
                }
                else if (rest.size !== 0 && state === true) {
                    privateContext.set(this, "state", false);
                    chest.exec(ACCESSOR_EVENTS.DENIED);
                    return true;
                }
                return false;
            },
        };
        
        privateContext.set<keyof PrivateProps>(this, privatePlace);
    }

    get on      (): IListenerChest<AccessorEventMap>['on']       { return privateContext.get(this, "chest")!.on      }
    get off     (): IListenerChest<AccessorEventMap>['off']      { return privateContext.get(this, "chest")!.off     }
    get once    (): IListenerChest<AccessorEventMap>['once']     { return privateContext.get(this, "chest")!.once    }
    get offAll  (): IListenerChest<AccessorEventMap>['offAll']   { return privateContext.get(this, "chest")!.offAll  }
    get exec    (): IListenerChest<AccessorEventMap>['exec']     { return privateContext.get(this, "chest")!.exec    }

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