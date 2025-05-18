import { AnyDict, EventsWithoutData, Listener, ListenerDict, MethodKey, UnknownDict } from "./general";
import { doApi } from "./helpers";
import { PrivateContext } from "./PrivateContext";


export const LISTENER_CHEST_API: MethodKey<IListenerChest<AnyDict>>[] = [
    'on', 'off', 'once', 'offAll', 'exec'
] as const;
Object.freeze(LISTENER_CHEST_API);


// === TYPES ===
export interface IListenerChest <M extends UnknownDict> {
    on      <E extends keyof M>                 (event: E, listener: Listener<M[E]>):   void;
    off     <E extends keyof M>                 (event: E, listener: Listener<M[E]>):   void;
    once    <E extends keyof M>                 (event: E, listener: Listener<M[E]>):   void;
    offAll                                      ():                                     void;
    exec    <E extends keyof M>                 (event: E, data: M[E]):                 void;
    exec    <E extends EventsWithoutData<M>>    (event: E):                             void;
}


// === PRIVATE CONTEXT ===
const privateContext = new PrivateContext<IListenerChest<UnknownDict>, PrivateProps>();

interface PrivateProps {
    onceSet:            Set<Listener<unknown>>
    listenerDict:       ListenerDict<UnknownDict>;
}


// === CLASS DEFINITION ===
export class ListenerChest<M extends UnknownDict = AnyDict> implements IListenerChest<M> {

    static implementTo<L extends IListenerChest<AnyDict>> (obj: L, api: L) {

        doApi<IListenerChest<AnyDict>>(obj, api, false, LISTENER_CHEST_API);
    };

    constructor (api?: ListenerChest<M>) {
        if(!api) {
            const privateProps: PrivateProps = {
                "onceSet":      new Set(),
                "listenerDict": {},
            };
            privateContext.set(this, privateProps);
        }
        
        doApi<IListenerChest<M>>(
            this,
            api ? api   : this,
            api ? false : true,
            LISTENER_CHEST_API
        );
    }

    // === API FRAGMENT ===
    on      <E extends keyof M>                 (event: E, listener: Listener<M[E]>):   void {
        const listenerDict: ListenerDict<M> = privateContext.get(this, "listenerDict")!;
        if ( !(event in listenerDict) )  listenerDict[event] = new Set();
        listenerDict[event]!.add(listener);
    }
    off     <E extends keyof M>                 (event: E, listener: Listener<M[E]>):   void {
        const listenerDict: ListenerDict<M>     = privateContext.get(this, "listenerDict")!;
        const onceSet:      Set<Listener<M[E]>> = privateContext.get(this, "onceSet")!;

        listenerDict[event]?.delete(listener);
        onceSet.delete(listener);

        if ( listenerDict[event]!.size === 0 ) {
            delete listenerDict[event];
        }
    }
    once    <E extends keyof M>                 (event: E, listener: Listener<M[E]>):   void {
        const onceSet:      Set<Listener<M[E]>> = privateContext.get(this, "onceSet")!;

        this.on(event, listener);
        onceSet.add(listener);
    }
    offAll                                      ():                                     void {
        privateContext.set(this, "listenerDict", {});
        privateContext.get(this, "onceSet")!.clear();
    }
    exec    <E extends keyof M>                 (event: E, data: M[E]):                 void;
    exec    <E extends EventsWithoutData<M>>    (event: E):                             void;
    exec    <E extends keyof M>                 (event: E, data?: M[E]):                void {
        const listenerDict: ListenerDict<M> = privateContext.get(this, "listenerDict")!;
        const onceSet:      Set<Listener<M[E]>> = privateContext.get(this, "onceSet")!;

        listenerDict[event]?.forEach( listener => {
            listener(data as M[E]);
            if ( onceSet.has(listener) ) this.off(event, listener);
        } );
    }
}
