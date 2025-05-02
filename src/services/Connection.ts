import { io, Socket } from "socket.io-client";
import { addDebug, IListenerChest, listen, ListenerChest, once } from "@utils";
import { Peer, PEER_EVENTS, PeerEvent } from "lib/webrtc";


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

    addDebug("peer", peer);

    const closeHandler = (): void => {
        socket?.disconnect();
        peer.stop();
        listenerChest.clear();
    };
    const initSocket = (): void => {
        socket = io(SIGNAL_SERVER);

        listen(socket, {
            "accepttarget": ({ target: id, offer }: {target: string, offer: boolean}) => {target = id; if (offer) peer.start(); },
            "acceptsdp": ({ sdp }: {sdp: RTCSessionDescription}) => {
                console.log("REMOTE SDP", JSON.stringify(sdp));
                peer.setRemoteSdp(sdp);
            },
            "acceptice": ({ ice }: {ice: RTCIceCandidate}) => peer.addCandidate(ice),
        });

        listen<PeerEvent>(peer, {
            [PEER_EVENTS.SDP]: ({ sdp }: {sdp: RTCSessionDescription}) => socket.emit("relaysdp", {target, sdp}),
            [PEER_EVENTS.ICE]: ({ candidate }: {candidate: RTCIceCandidate}) => socket.emit("relayice", {target, ice: candidate}),
            [PEER_EVENTS.CONNECT]: () => { socket.emit("success"); socket.disconnect(); },
            [PEER_EVENTS.DISCONNECT]: () => closeHandler(),
        });
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