import { io, Socket } from "socket.io-client";
import { addDebug, listen } from "@utils";
import { Peer, PEER_EVENTS, PeerEvent, StartConfig } from "lib/webrtc";


// === GENERAL DATA ===
addDebug("signalHost", process.env.SIGNAL);
export const SIGNAL_SERVER = process.env.SIGNAL ?? 'https://vde0.chat';


// === TYPES ===
export type ConnectionConctructor = new (peer: Peer) => Connection;
export interface Connection {
    signal          ():                                         void;
    updatePeer      (peer: Peer):                               void;
    setStartConfig  (startConfig: StartConfig, ...args: any[]): void;
}


// === FABRIC OF CONNECTION ===
export const Connection: ConnectionConctructor = function (peer: Peer): Connection {

    // === PRIVATE FIELDS AND METHODS ===
    let socket: Socket;
    let target: string;

    let config:     StartConfig | undefined;
    let configArgs: any[]   = [];


    const stopPeer      = (): void => {
        peer.stop();
        config              = undefined;
        configArgs.length   = 0;
        configArgs          = [];
    };
    const initSocket    = (): void => {
        socket = io(SIGNAL_SERVER);

        listen(socket, {
            "accepttarget": ({ target: id, offer }: {target: string, offer: boolean}) => {
                target = id;
                if (offer) peer.start(config, ...configArgs);
            },
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
            [PEER_EVENTS.DISCONNECT]: () => { socket.disconnect(); stopPeer() },
        });
    };

    // === RESULT INSTANCE ===
    return {
        signal () {
            if (peer.rtc.connectionState !== "new") throw Error (
                "Connection.signal() should be with correct \"new\" Peer."
            );
            socket?.disconnect();
            initSocket();
        },
        updatePeer (argPeer) {
            stopPeer();
            peer = argPeer;
        },
        setStartConfig (startConfig, ...args) {
            config      = startConfig;
            configArgs  = args;
        },
    };
} as unknown as ConnectionConctructor;