import "webrtc-adapter";
//
import { io } from "socket.io-client";
import Peer, { Instance as PeerInstance } from "simple-peer";
import freeice from "freeice";
import { once } from "@utils";


const SIGNAL_SERVER = 'http://localhost:6001';


export type ConnectEvent = 'media' | 'text';
export type SendSignature = (msg: string) => void;
//
export type ConnectConstructor = new (localStream?: MediaStream | null) => ConnectInstance;
export interface ConnectInstance {
    localMedia: MediaStream | null;
    remoteMedia:  MediaStream | null;
    text:   string | null;
    send: SendSignature;
    on: (event: ConnectEvent, listener: CallableFunction) => void;
    off: (event: ConnectEvent, listener: CallableFunction) => void;
    close: () => void;
}


export const CONNECT_EVENTS: { [key: string]: ConnectEvent } = {
    MEDIA:  'media',
    TEXT:   'text',
};
Object.freeze(CONNECT_EVENTS);

export const Connect: ConnectConstructor = function (localStream = null) {

    const socket = io(SIGNAL_SERVER);
    let peer:   PeerInstance | null = null;
    let target: string | null       = null;
    let media:  MediaStream | null  = null;
    let text:   string              = "";

    const signalBuffer: any[] = [];

    const listeners: Map<ConnectEvent, Set<CallableFunction>> = new Map();

    const returnable: ConnectInstance = {
        get localMedia () { return localStream },
        get remoteMedia () { return media },
        get text () { return text },

        send (msg) {
            peer?.send(msg);
        },
        close () { peer?.destroy(); peer = null; },

        on (event, listener) {
            if ( !listeners.get(event) ) listeners.set(event, new Set());
            listeners.get(event)?.add?.(listener);
        },
        off (event, listener) {
            const result: boolean = listeners.get(event)?.delete?.(listener) ?? false;
            if ( listeners.get(event)?.size === 0 ) listeners.delete(event);
            return result;
        },
    };
    Object.freeze(returnable);

    const targetHandler = once(
        ({ target: id, offer: isOffer }: { target: string, offer: boolean }) => {
            if (typeof id !== 'string' || typeof isOffer !== 'boolean') {
                socket?.close();
                console.error("Failed to handle a 'target' socket event.");
                return;
            }

            target  = id;
            peer    = new Peer({
                initiator: isOffer,
                stream: localStream ?? undefined,
                config: { iceServers: freeice() },
                trickle: true,
                channelName: "Text Chat",
                objectMode: false,
                channelConfig: { ordered: true, negotiated: true }
            });
            initPeer();
        }
    );

    socket.on('target', targetHandler);

    socket.on('acceptsignal', ({ data }) => {
        if (!peer) signalBuffer.push(data);
        else peer.signal(data);
    });


    function initPeer (): void {
        if (!peer) return console.warn("peer is undefined.");

        peer.on('signal', data => {
            if (!target) return console.error("target is undefined.");
            socket.emit('relaysignal', { target, data });
        });
        peer.on('connect', () => {
            socket.emit('success');
            socket.close();
        });
        peer.on('stream', stream => {
            media = stream;
            listeners.get(CONNECT_EVENTS.MEDIA)?.forEach( listener => listener(stream) );
        });
        peer.on('data', data => {
            text = typeof data === 'string' ? data : "";
            listeners.get(CONNECT_EVENTS.TEXT)?.forEach( listener => listener(data) );
        });

        // flush signalBuffer
        signalBuffer.forEach(data => peer?.signal(data));
    }

    return returnable;
} as unknown as ConnectConstructor;