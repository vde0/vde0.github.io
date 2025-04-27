export interface MsgItem {
    text: Msg;
    user: Chatter;
    toString (): string;
}

export type Chatter    = Symbol | string;
export type Msg        = string;
export type MsgId      = number;
export type MsgHistoryConstructor = new () => MsgHistory;
export interface MsgHistory extends Iterable<MsgItem> {
    add     (chatter: Chatter, msg: Msg):   MsgId;
    rm      (msgId: MsgId):                 boolean;
    has     (msgId: MsgId):                 boolean;

    get     (msgId: MsgId):                 MsgItem | null;
    head    (quant: number):                MsgItem[];
    tail    (quant: number):                MsgItem[];
    getAllHistory ():                       MsgItem[];

    length: number;
    forEach ( callback: (msgItem: MsgItem, msgId: MsgId, thisMsgHistory: MsgHistory) => void ): void;
}


export const MsgHistory: MsgHistoryConstructor = function () {

    // === STORE ===
    const msgHistory:       Msg[]       = [];
    const chatterHistory:   Chatter[]   = [];

    // === PRIVATE VARS ===
    let thisMsgHistory:  MsgHistory;
    let deletedAmount:      number  = 0;
    let lastMsgId:          MsgId   = -1;
    let firstMsgId:         MsgId   = -1;
    
    // === FUNCS 1 LVL ===
    const shadowLength  = ():           number  => msgHistory.length;
    const length        = ():           number  => msgHistory.length - deletedAmount;
    const checkMsg  = (msgId: MsgId):    boolean => typeof msgId === "number" && !!msgHistory[msgId];
    const makeMsg   = (msgId: MsgId):    MsgItem | null => {
        if ( !checkMsg(msgId) ) return null;
        return {
            text: msgHistory[msgId as MsgId],
            user: chatterHistory[msgId as MsgId],
            toString () { return this.text },
        }
    };

    // === ITERATORS ===
    function* msgIdIterator (start: MsgId, quant: number): Generator<MsgId> {
        if ( !checkMsg(start) ) return;

        const   changer:    number  = quant > -1 ? +1 : -1;
        let     msgId:      MsgId   = start;
        let     count:      number  = Math.abs(quant);

        while (count > 0 && msgId >= firstMsgId && msgId <= lastMsgId ) {
            if ( !checkMsg(msgId) ) { msgId += changer; continue; }
            yield msgId;
            msgId += changer;
            count--;
        }
    }
    function* msgItemsIterator (start: MsgId, quant: number): Generator<MsgItem> {
        if ( !checkMsg(start) ) return;

        const iterator1lvl: Iterator<MsgId> = msgIdIterator(start, quant);
        while (true) {
            const state: IteratorResult<MsgId> = iterator1lvl.next();
            if (state.done) break;
            yield makeMsg(state.value)!;
        }
    }

    // === FUNCS 2 LVL ===
    const findMsgByCount = (start: MsgId, count: number): MsgId => {
        if ( !checkMsg(start) ) { console.error("'start' isn't existing MsgId."); return -1; }

        let     result:     MsgId = -1;
        for (let msgId of msgIdIterator(start, count)) result = msgId;
        return result;
    };
    const forEach   = (
        callback: (msgItem: MsgItem, msgId: MsgId, thisMsgHistory: MsgHistory) => void,
        start: MsgId    = firstMsgId,
        quant: number   = length()
    ): void => {
        if ( !checkMsg(start) ) { return console.error("'start' isn't existing MsgId."); }

        for (let msgId of msgIdIterator(start, quant)) {
            callback( makeMsg(msgId)!, msgId, thisMsgHistory );
        }
    };
    const map       = <T>(
        callback: (msgItem: MsgItem, msgId: MsgId, thisMsgHistory: MsgHistory) => T,
        start: MsgId    = firstMsgId,
        quant: number   = length()
    ): T[] => {
        if ( !checkMsg(start) ) { console.error("'start' isn't existing MsgId."); return []; }

        const result: T[] = [];
        for (let msgId of msgIdIterator(start, quant)) {
            result.push( callback( makeMsg(msgId)!, msgId, thisMsgHistory ) );
        }
        return result;
    };

    // === RESULT INSTANCE ===
    const instance: MsgHistory = {
        add (chatter, msg) {
            checkChatterType(chatter);
            checkMsgType(msg);

            chatterHistory.push(chatter);
            msgHistory.push(msg);

            const msgId: MsgId  = shadowLength() -1;

            if ( length() === 0 )   firstMsgId = msgId;
            lastMsgId = msgId;

            return msgId;
        },
        rm (msgId) {
            if ( typeof msgId !== "number" ) throw TypeError("msgId must be number.");
            if ( !checkMsg(msgId) ) return false;

            if (msgId === firstMsgId) firstMsgId    = findMsgByCount(firstMsgId, 1) as MsgId;
            if (msgId === lastMsgId)  lastMsgId     = findMsgByCount(lastMsgId, -1) as MsgId;
            deletedAmount++;

            delete msgHistory[msgId];
            delete chatterHistory[msgId];

            if ( length() === 0 ) {
                firstMsgId  = -1;
                lastMsgId   = -1;
            }

            return true;
        },
        has (msgId) { return checkMsg(msgId) },
        get (msgId) { return makeMsg(msgId) },
        getAllHistory () { return map<MsgItem>( msgItem => msgItem ) },
        head (quant) { return map<MsgItem>( msgItem => msgItem, firstMsgId, quant ) },
        tail (quant) {
            return map<MsgItem>(
                msgItem => msgItem, findMsgByCount(lastMsgId, -quant), quant
            );
        },

        get length () { return length() },
        forEach (callback) { forEach(callback) },
        [Symbol.iterator] () { return msgItemsIterator(firstMsgId, length()); },
    };
    Object.freeze(instance);
    thisMsgHistory = instance;

    return instance;
} as unknown as MsgHistoryConstructor;


// === HELPERS ===
export function checkChatterType (chatter: Chatter): void {
    if ( typeof chatter !== "string" && typeof chatter !== "symbol" ) throw TypeError(
        "chatter must be string or Symbol."
    );
}
export function checkMsgType (msg: Msg): void {
    if ( typeof msg !== "string" ) throw TypeError(
        "msg must be string."
    );
}