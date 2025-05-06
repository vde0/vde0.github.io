import { IListenerChest, ListenerChest } from "@lib/utils";


export const CHAT_HISTORY_EVENTS: { [key: string]: ChatHistoryEvent } = {
    ADD:        "add",
    DELETE:     "delete",
    CLEAR:      "clear",
};
Object.freeze(CHAT_HISTORY_EVENTS);


export interface MsgItem {
    text: MsgText;
    chatter: Chatter;
    toString (): string;
}
export type Chatter     = Symbol | string;
export type MsgText     = string;
export type MsgId       = number;

export type ChatHistoryConstructor = new () => ChatHistory;
export type ChatHistory =  Iterable<MsgItem> & IListenerChest<ChatHistoryEvent> & {    
    has     (msgId: MsgId):                 boolean;
    get     (msgId: MsgId):                 MsgItem | null;
    head    (quant: number):                MsgItem[];
    tail    (quant: number):                MsgItem[];
    getAllHistory ():                       MsgItem[];

    add     (msg: MsgText, chatter: Chatter):   MsgId;
    delete  (msgId: MsgId):                     boolean;
    clear   ():                                 void;

    length: number;
    forEach         ( callback: ForEachCallback ):  void;
    map <T = any>   ( callback: MapCallback<T> ):   T[];
}
export type ChatHistoryEvent = 'add' | 'delete' | 'clear';

type MapCallback<T>     = (msgItem: MsgItem, msgId: MsgId, thisChatHistory: ChatHistory) => T;
type ForEachCallback    = (msgItem: MsgItem, msgId: MsgId, thisChatHistory: ChatHistory) => void;


export const ChatHistory: ChatHistoryConstructor = function () {

    // === STORE ===
    const msgMap:           Map<MsgId, MsgItem> = new Map();
    let thisChatHistory:    ChatHistory;
    let firstMsgId:         MsgId               = 0;
    let lastMsgId:          MsgId               = firstMsgId;

    const listenerChest:    IListenerChest<ChatHistoryEvent> = new ListenerChest();
    
    // === FUNCS 1 LVL ===
    const make      = (text: MsgText, chatter: Chatter):   MsgItem => ({ text, chatter, toString () { return text; } });
    const length    = ():                               number  => msgMap.size;
    
    const has       = (msgId: MsgId):   boolean         => msgMap.has(msgId);
    const get       = (msgId: MsgId):   MsgItem | null  => msgMap.get(msgId) ?? null;

    const add       = (text: MsgText, chatter: Chatter):   number => {

        const item      = make(text, chatter);
        msgMap.set(++lastMsgId, item);

        listenerChest.exec(CHAT_HISTORY_EVENTS.ADD, { item });
        return lastMsgId;
    };
    const remove    = (msgId: MsgId):                   boolean => {

        const item      = msgMap.get(msgId);
        const result    = msgMap.delete(msgId);

        item && listenerChest.exec(CHAT_HISTORY_EVENTS.DELETE, { item });
        return result;
    };
    const clear     = ():                                void => {
        msgMap.clear();
        listenerChest.exec(CHAT_HISTORY_EVENTS.CLEAR);
    };

    // === ITERATORS ===
    function* msgIdIterator (start: MsgId, quant: number): Generator<MsgId> {
        if ( !has(start) ) return;

        const msgArr: MsgId[] = Array.from( msgMap.keys() );

        const   changer:    number              = quant > -1 ? +1 : -1;
        let     curIndex:   number | undefined  = msgArr.find(id => id === start);
        let     count:      number              = Math.abs(quant);

        if (!curIndex) return;


        while (count > 0 && curIndex >= 0 && curIndex <= msgArr.length -1 ) {
            yield msgArr[curIndex];
            curIndex += changer;

            count--;
        }
    }
    function* msgItemIterator (start: MsgId, quant: number): Generator<MsgItem> {
        if ( !has(start) ) return;

        const iterator1lvl: Iterator<MsgId> = msgIdIterator(start, quant);
        while (true) {
            const state: IteratorResult<MsgId> = iterator1lvl.next();
            if (state.done) break;
            yield get(state.value)!;
        }
    }

    // === FUNCS 2 LVL ===
    const findMsgByCount = (start: MsgId, count: number): MsgId => {
        if ( !has(start) ) { console.error("'start' isn't existing MsgId."); return -1; }

        let     result:     MsgId = -1;
        for (let msgId of msgIdIterator(start, count)) result = msgId;
        return result;
    };
    const forEach   = (
        callback: ForEachCallback,
        start: MsgId    = firstMsgId,
        quant: number   = length()
    ): void => {
        if ( !has(start) ) { return console.error("'start' isn't existing MsgId."); }

        for (let msgId of msgIdIterator(start, quant)) {
            callback( get(msgId)!, msgId, thisChatHistory );
        }
    };
    const map       = <T>(
        callback: MapCallback<T>,
        start: MsgId    = firstMsgId,
        quant: number   = length()
    ): T[] => {
        if ( !has(start) ) { console.error("'start' isn't existing MsgId."); return []; }

        const result: T[] = [];
        forEach( (...args) => result.push(callback(...args)), start, quant );
        return result;
    };

    // === RESULT INSTANCE ===
    const instance: ChatHistory = {
        ...listenerChest,
        add (msgText, chatter) {
            checkChatterType(chatter);
            checkMsgType(msgText);

            return add(msgText, chatter);
        },
        delete (msgId) {
            if ( typeof msgId !== "number" ) throw TypeError("msgId must be number.");

            if (msgId === firstMsgId) firstMsgId    = findMsgByCount(firstMsgId, 1) as MsgId;
            if (msgId === lastMsgId)  lastMsgId     = findMsgByCount(lastMsgId, -1) as MsgId;

            if ( length() === 0 ) {
                firstMsgId  = -1;
                lastMsgId   = -1;
            }

            return remove(msgId);
        },
        clear()     { clear();          },
        has (msgId) { return has(msgId) },
        get (msgId) { return get(msgId) },
        getAllHistory () { return map<MsgItem>( msgItem => msgItem ) },
        head (quant) { return map<MsgItem>( msgItem => msgItem, firstMsgId, quant ) },
        tail (quant) {
            return map<MsgItem>(
                msgItem => msgItem, findMsgByCount(lastMsgId, -quant), quant
            );
        },

        get length () { return length(); },
        forEach (callback) { forEach(callback); },
        map     <T = any>(callback: MapCallback<T>) { return map<T>(callback); },
        [Symbol.iterator] () { return msgItemIterator(firstMsgId, length()); },
    };
    Object.freeze(instance);
    thisChatHistory = instance;

    return instance;
} as unknown as ChatHistoryConstructor;


// === HELPERS ===
export function checkChatterType (chatter: Chatter): void {
    if ( typeof chatter !== "string" && typeof chatter !== "symbol" ) throw TypeError(
        "chatter must be string or Symbol."
    );
}
export function checkMsgType (msg: MsgText): void {
    if ( typeof msg !== "string" ) throw TypeError(
        "msg must be string."
    );
}