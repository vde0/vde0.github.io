import { io, Socket } from "socket.io-client";
import { addDebug, IListenerChest, ListenerChest, once } from "@utils";
import { Peer, PEER_EVENTS } from "lib/webrtc";


// === GENERAL DATA ===
addDebug("signalHost", process.env.SIGNAL);
export const SIGNAL_SERVER = process.env.SIGNAL ?? 'https://vde0.chat';


// === TYPES ===
export type ConnectionConctructor = new () => Connection;
export type ConnectionEvent = 'media' | 'text' | 'connect' | 'disconnect';
export type Connection = IListenerChest<ConnectionEvent> & {
    start(): void;
    stop(): void;
    peer: Peer;
    isStarted: boolean;
}


// === FABRIC OF CONNECTION ===
export const Connection: ConnectionConctructor = function (): Connection {

    // === PRIVATE FIELDS AND METHODS ===
    const listenerChest = new ListenerChest<ConnectionEvent>();
    const peer: Peer = new Peer();
    let socket: Socket;
    let target: string;
    let isStarted = false;

    const closeHandler = (): void => {
        socket?.disconnect();
        peer.stop();
        listenerChest.clear();
    };
    const initSocket = (): void => {
        socket = io(SIGNAL_SERVER);

        socket.on("accepttarget", ({ target: id, offer }) => { target = id; if (offer) peer.start(); });
        socket.on("acceptsdp", ({ target, sdp }) => peer.setRemoteSdp(sdp) );
        socket.on("acceptice", ({ target, ice }) => peer.addCandidate(ice) );

        peer.on(PEER_EVENTS.SDP, ({ sdp }: {sdp: RTCSessionDescription}) => socket.emit("relaysdp", {target, sdp}));
        peer.on(PEER_EVENTS.ICE, ({ candidate }: {candidate: RTCIceCandidate}) => socket.emit("relayice", {target, ice: candidate}));
        peer.on(PEER_EVENTS.CONNECT, () => { socket.emit("success"); socket.disconnect(); });
        peer.on(PEER_EVENTS.DISCONNECT, () => closeHandler());
    };

    // === RESULT INSTANCE ===
    return {
        ...listenerChest as IListenerChest<ConnectionEvent>,
        get peer () { return peer },
        get isStarted () { return isStarted },
        start () {
            if (isStarted) return;
            isStarted = true;
            initSocket();
        },
        stop () {
            closeHandler();
        },
    };
} as unknown as ConnectionConctructor;