// private vars
const USER      = Symbol("user");
const COMPANION = Symbol("companion");

const MSG_RECEIVED      = Symbol("msg received");
const UPDATE_UNREADS    = Symbol("update unreads");

const subs = {
    [MSG_RECEIVED]: new Set(),
    [UPDATE_UNREADS]: new Set(),
};
function execHandlers(updateType, event={}) {
    for (let handler of subs[updateType].values()) handler(event);
}

const companionInfo = {
    name: "Shrek",
}
const userInfo = {
    name: "Lolka",
}

const msgObj = {
    add (author, textContent, read=false) {
        const msgId = ++this.length;
        this[msgId] = {author: author, textContent: textContent, time: "18:00"};
        this.order.push(msgId);

        if (!read) {
            this._unreadMsgCount++;
            execHandlers(UPDATE_UNREADS, {count: this._unreadMsgCount});
        }
        execHandlers(MSG_RECEIVED, {msgId: msgId});

        return msgId;
    },
    get (msgId) {
        if (!this[msgId]) return null;
        return {...this[msgId]};
    },
    getMsgList () {
        return this.order.map(msgId => this.get( msgId ));
    },
    _unreadMsgCount: 5,
    get unreadMsgCount () { return this._unreadMsgCount },
    length: 5,
    order: [1, 2, 3, 4, 5],
    // msgID: {...}
    1: {
        author: USER,
        time: "15:06",
        textContent: "Как дела?",
    },
    2: {
        author: COMPANION,
        time: "15:00",
        textContent: "Норм. Уйди.",
    },
    3: {
        author: USER,
        time: "15:06",
        textContent: "Блин :( Ну вот. Ну блин :(",
    },
    4: {
        author: USER,
        time: "15:06",
        textContent: "Блин блинский :(",
    },
    5: {
        author: COMPANION,
        time: "15:00",
        textContent: "Хыыыы!",
    },
}


export default class SessionManager {

    // available authors
    static get USER () { return USER };
    static get COMPANION () { return COMPANION; }

    // update types
    static get MSG_RECEIVED () { return MSG_RECEIVED; }
    static get UPDATE_UNREADS () { return UPDATE_UNREADS; }

    static get unreadMsgCount () { return msgObj.unreadMsgCount; }

    static subscribe (updateType, handler) {
        if ( !(updateType in subs) ) throw Error(
            "Incorrect updateType arg by a SessionManager.subscribe() calling.");
        
        subs[updateType].add(handler);
    }
    static unsubscribe (updateType, handler) {
        if ( !(updateType in subs) ) throw Error(
            "Incorrect updateType arg by a SessionManager.unsubscribe() calling.");
        
        subs[updateType].delete(handler);
    }

    static sendMsg (text) {
        msgObj.add(USER, text, true);
    }
    static getMsg (msgId) {
        return msgObj.get(msgId);
    }
    static getMsgList () {
        return msgObj.getMsgList();
    }
}