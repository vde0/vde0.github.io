const { EventEmitter } = require('events');

const DISCONNECT_DELAY = 10000;


const EVENT_ATOM = {
    ICE:    'ice',
    SDP:    'sdp',
    TARGET: 'target',
};
Object.freeze(EVENT_ATOM);
const DATA_NAME = {
    [EVENT_ATOM.ICE]:    'ice',
    [EVENT_ATOM.SDP]:    'sdp',
    [EVENT_ATOM.TARGET]: 'offer',
};
Object.freeze(DATA_NAME);
const ACTIONS = {
    SUCCESS: 'success',

    get RELAY_SDP ()    { return this.getRelay(EVENT_ATOM.SDP) },
    get RELAY_ICE ()    { return this.getRelay(EVENT_ATOM.ICE) },
    get RELAY_TARGET () { return this.getRelay(EVENT_ATOM.TARGET) },

    get ACCEPT_SDP ()       { return this.getAccept(EVENT_ATOM.SDP) },
    get ACCEPT_ICE ()       { return this.getAccept(EVENT_ATOM.ICE) },
    get ACCEPT_TARGET ()    { return this.getAccept(EVENT_ATOM.TARGET) },

    getRelay    (atom) { return `relay${atom}`; },
    getAccept   (atom) { return `accept${atom}`; },
};
Object.freeze(ACTIONS);


module.exports = async function SocketIo (server) {
    // === DATA ===
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const freeSockets = new Set();
    const emitterMap = new Map();

    let getSocket;
    {   
        const sockets = io.of("/").sockets;
        getSocket = socketId => sockets.get(socketId);
    }

    // === CONNECTING LOOP ===
    const connectCheckingDelay = 500;
    setInterval(makeConnect, connectCheckingDelay);

    // === SERVICES ===
    function wait (socket) {
        freeSockets.add(socket);
    }
    function dewait (socket) {
        freeSockets.delete(socket);
    }

    let isConnecting = false;
    function makeConnect () {
        if (isConnecting)           return;
        if (freeSockets.size < 2)   return;
        isConnecting = true;

        let userCount = 2;
        const users = [];

        const motor = freeSockets.values();
        while (userCount > 0) {
            const { value } = motor.next();
            if ( !value ) throw Error("At the connectManager() socket was undefined.");
            users.push(value)

            userCount--;
        }

        console.log("RELAY TARGET");
        relay(users[0].id, users[1].id, EVENT_ATOM.TARGET, true);
        relay(users[1].id, users[0].id, EVENT_ATOM.TARGET, false);
        freeSockets.delete(users[0]);
        freeSockets.delete(users[1]);

        isConnecting = false;
    }

    // === HELPERS ===
    function findFreeSocket (exceptSocketIds = []) {
        let returnSocket = null;
        for (let socket of freeSockets.values()) {
            if ( checkForExcept(socket.id) ) continue;
            returnSocket = socket;
            break;
        }

        function checkForExcept (socketId) {
            for (let id of exceptIds) if (socketId === id) return true;
            return false;
        }
        return returnSocket;
    }
    function relay (senderId, targetId, atom, data) {
        console.log(`relay ${senderId} -> ${targetId}`);

        const senderSocket = getSocket(senderId);
        const targetSocket = getSocket(targetId);
        if ( !senderSocket ) { console.warn("Failed to find the Sender Socket."); return; }
        if ( !targetSocket ) { console.warn("Failed to find the Target Socket."); return; }

        const [acceptWay, dataName] = defineAcceptState(atom);

        emitterMap.get(targetId)?.emit(acceptWay, { target: senderId, [dataName]: data });
        targetSocket?.emit(acceptWay, { target: senderId, [dataName]: data });
    }
    function defineAcceptState (atom) {
        return [ ACTIONS.getAccept(atom), DATA_NAME[atom] ];
    }


    // === SOCKET LISTENING ===
    io.on("connection", socket => {
        console.log("connect", socket.id);
        let successTimerId;
        let dataRelayed = false;
        let dataAccepted = false;

        const socketEmitter = new EventEmitter();
        const on = socketEmitter.on.bind(socketEmitter);
        emitterMap.set(socket.id, socketEmitter);

        // SUCCESS -> disconnect
        socket.on(ACTIONS.SUCCESS, _ => { console.log("SUCCESS"); checkForDisconnect(0); });
        socket.on("disconnect", closeHandler);

        // RELAY_ICE -> trigger ACCEPT_ICE
        socket.on(ACTIONS.RELAY_ICE, ({ target: targetId, ice }) => {
            console.log("RELAY_ICE");
            relay(socket.id, targetId, EVENT_ATOM.ICE, ice);
            checkForDisconnect(DISCONNECT_DELAY);
        });
        // RELAY_SDP -> trigger ACCEPT_SDP
        socket.on(ACTIONS.RELAY_SDP, ({ target: targetId, sdp }) => {
            console.log("RELAY_SDP");
            relay(socket.id, targetId, EVENT_ATOM.SDP, sdp);
            dataRelayed = true;
        });

        // ACCEPT_TARGET
        on(ACTIONS.ACCEPT_TARGET, _ => console.log("ACCEPT_TARGET"));
        // ACCEPT_SDP
        on(ACTIONS.ACCEPT_SDP, _ => { console.log("ACCEPT_SDP"); dataAccepted = true; });
        // ACCEPT_ICE
        on(ACTIONS.ACCEPT_ICE, _ => console.log("ACCEPT_ICE"));


        // === INIT FOR FREE SOCKETS ===
        wait(socket);


        // === HELPERS ===
        function checkForDisconnect (delay) {
            clearTimeout(successTimerId);

            if ( !dataRelayed && !dataAccepted ) return;
            successTimerId = setTimeout(_ => close(), delay);
        }
        function close () {
            socket.disconnect();
        }
        function closeHandler () {
            console.log("CLOSE");
            safeClosing();
        }
        function safeClosing () {
            emitterMap.delete(socket.id);
            dewait(socket);
        }
    });

    return io;
}