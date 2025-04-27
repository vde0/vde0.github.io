import { makePrivateContext, PrivateContext } from "@utils";
import { once } from "@utils";


// === TYPES ===
export interface IListenerChest<E extends string = string> {
    on (event: E, listener: CallableFunction): void;
    off (event: E, listener: CallableFunction): void;
    onOnce (event: E, listener: CallableFunction): void;
    exec (event: E, data?: any): void;
    clear (): void;
}
export type ListenerMap<E extends string = string> = Map<E, Set<CallableFunction>>;


// === PRIVATE CONTEXT ===
let privateContext: PrivateContext<IListenerChest, PrivateProps>;
const lazyInit = once( () => (privateContext = makePrivateContext<IListenerChest, PrivateProps>()) );

interface PrivateProps {
    listenerMap:    ListenerMap<string>;
    context:        object;
}


// === CLASS DEFINITION ===
export class ListenerChest<E extends string = string> implements IListenerChest<E> {

    constructor () {
        this.on     = this.on.bind(this);
        this.off    = this.off.bind(this);
        this.onOnce = this.onOnce.bind(this);
        this.exec   = this.exec.bind(this);
        this.clear  = this.clear.bind(this);
    }

    _init (): void {
        lazyInit();
        if ( !privateContext.has(this, 'listenerMap') ) {
            privateContext.set(this, 'listenerMap', new Map() as ListenerMap<E>);
        }
    }

    // === API FRAGMENT ===
    on (event: E, listener: CallableFunction): void {
        this._init();
        const listenerMap: ListenerMap<E> = privateContext.get(this, 'listenerMap') as ListenerMap<E>;
        if ( !listenerMap.has(event) )  listenerMap.set(event, new Set());
        listenerMap.get(event)!.add(listener);
    }
    off (event: E, listener: CallableFunction): void {
        this._init();
        const listenerMap: ListenerMap<E> = privateContext.get(this, 'listenerMap') as ListenerMap<E>;
        listenerMap.get(event)?.delete(listener);
        if ( listenerMap.has(event) && listenerMap.get(event)!.size === 0 ) {
            listenerMap.delete(event);
        }
    }
    onOnce (event: E, listener: CallableFunction): void {
        const onceListener = (data: any): void => {
            listener(data);
            this.off(event, onceListener);
        }
        this.on(event, onceListener);
    }
    exec (event: E, data?: any): void {
        this._init();
        const listenerMap: ListenerMap<E> = privateContext.get(this, 'listenerMap') as ListenerMap<E>;
        listenerMap.get(event)?.forEach( listener => listener(data) );
    }
    clear (): void {
        this._init();
        const listenerMap: ListenerMap<E> = privateContext.get(this, 'listenerMap') as ListenerMap<E>;
        listenerMap.clear();
    }
}
