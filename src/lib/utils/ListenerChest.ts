import { PrivateContext } from "@utils";


export const LISTENER_CHEST_API: (keyof IListenerChestApi<Record<string, any>>)[] = [
    'on', 'off', 'once', 'offAll', 'exec'
] as const;
Object.freeze(LISTENER_CHEST_API);

// === HELPERS ===
function doApi<I extends IListenerChestApi<Record<string, any>>> (
    action: (methodName: keyof I) => void,
    context: I
): void {
    for (let methodName of LISTENER_CHEST_API) {
        if (typeof context[methodName] === "function") action(methodName);
    }
}


// === TYPES ===
export interface IListenerChestApi <M extends Record<string, any>> {
    on      <K extends keyof M>                 (event: K, listener: Listener<M[K]>):   void;
    off     <K extends keyof M>                 (event: K, listener: Listener<M[K]>):   void;
    once    <K extends keyof M>                 (event: K, listener: Listener<M[K]>):   void;
    offAll                                      ():                                     void;
    exec    <K extends keyof M>                 (event: K, data: M[K]):                 void;
    exec    <K extends EventsWithoutData<M>>    (event: K):                             void;
}
export interface IListenerChest <M extends Record<string, any>> extends IListenerChestApi<M> {
    implement                                   (obj: object):                          void;
    api:                                                                                IListenerChestApi<M>;
}

export type ListenerMap <M extends Record<string, unknown>> = { [K in keyof M]?: Set< Listener<M[K]> > };
export type Listener    <D>                                 = (data: D) => void;

export type EventsWithData <M extends Record<PropertyKey, any>> = {
    [K in keyof M]: M[K] extends undefined ? never : K;
}[keyof M];
export type EventsWithoutData <M extends Record<PropertyKey, any>> = {
    [K in keyof M]: M[K] extends undefined ? K : never;
}[keyof M];


// === PRIVATE CONTEXT ===
const privateContext = new PrivateContext<IListenerChestApi<Record<string, unknown>>, PrivateProps>();

interface PrivateProps {
    listenerMap:        ListenerMap<Record<string, unknown>>;
    context:            object;
}


// === CLASS DEFINITION ===
export class ListenerChestApi<M extends Record<string, any> = Record<string, any>> implements IListenerChestApi<M> {

    constructor (api?: ListenerChestApi<M>) {
        !api && privateContext.set<'listenerMap'>(this, 'listenerMap', {});
        
        doApi<ListenerChestApi<M>>((methodName) => {
            this[methodName] = api
                ? (api[methodName] as Function).bind(this) as any
                : (this[methodName] as Function).bind(this) as any
        }, this);
    }

    // === API FRAGMENT ===
    on      <K extends keyof M>                 (event: K, listener: Listener<M[K]>):   void {
        const listenerMap: ListenerMap<M> = privateContext.get<'listenerMap'>(this, 'listenerMap')!;
        if ( !(event in listenerMap) )  listenerMap[event] = new Set();
        listenerMap[event]!.add(listener);
    }
    off     <K extends keyof M>                 (event: K, listener: Listener<M[K]>):   void {
        const listenerMap: ListenerMap<M> = privateContext.get<'listenerMap'>(this, 'listenerMap')!;
        listenerMap[event]?.delete(listener);
        if ( (event in listenerMap) && listenerMap[event]!.size === 0 ) {
            delete listenerMap[event];
        }
    }
    once    <K extends keyof M>                 (event: K, listener: Listener<M[K]>):   void {
        const listenerMap: ListenerMap<M> = privateContext.get<'listenerMap'>(this, 'listenerMap')!;
        if (event in listenerMap) return;

        const onceListener: Listener<M[K]> = () => {
            this.off(event, listener);
            this.off(event, onceListener);
        };

        this.on(event, listener);
        this.on(event, onceListener);
    }
    offAll                                      ():                                     void {
        privateContext.set<'listenerMap'>(this, 'listenerMap', {});
    }
    exec    <K extends keyof M>                 (event: K, data: M[K]):                 void;
    exec    <K extends EventsWithoutData<M>>    (event: K):                             void;
    exec    <K extends keyof M>                 (event: K, data?: M[K]):                void {
        const listenerMap: ListenerMap<M> = privateContext.get<'listenerMap'>(this, 'listenerMap')!;
        listenerMap[event]?.forEach( listener => listener(data as M[K]) );
    }
}

export class ListenerChest<M extends Record<string, any> = Record<string, any>> extends ListenerChestApi<M> implements IListenerChest<M> {

    static implementTo<O extends IListenerChest<Record<string, any>>> (obj: O, api: O) {

        doApi<typeof api>(methodName => obj[methodName] = api[methodName], api);
    };

    api: IListenerChestApi<M>;

    implement (obj: typeof this['api']): void {

        doApi<typeof this.api>(methodName => (obj[methodName] as any) = this.api[methodName], this.api);
    }

    constructor (api?: IListenerChestApi<M>) {
        super(api);
        if (!api)   this.api = new ListenerChestApi<M>(this);
        else        this.api = api;
    }
}
