import { addDebug } from "@lib/utils";
import { Peer, PEER_EVENTS } from "@lib/webrtc";
import { Signal } from "./Signal";
import { DuoChatUnit } from "./DuoChatUnit";
import { Accessor, IWhen, ListenerChest, When } from "@lib/pprinter-tools";
import { whenLocalMedia } from "./localMedia";
import { ChatPeerBus } from "./ChatPeerBus";
import { SignalPeerBus } from "./SignalPeerBus";


// === API FIELDS ===
export const CONTROL_NAME   = "CONTROL";


export const ACC_FLAGS = {
    LOCAL_MEDIA:        'localmedia',
    PLAY_REMOTE_VIDEO:  'playremotevideo',
} as const;
Object.freeze(ACC_FLAGS);

export const WHEN_READY_FLAG = "ready";


export interface Connection {
    whenAccess:     IWhen<{'ready': undefined}>,
    signalAccessor: Accessor<typeof ACC_FLAGS[keyof typeof ACC_FLAGS]>,

    chatUnit:       DuoChatUnit,
    peer:           Peer,
    signal:         Signal,

    connect     (): void;
    disconnect  (): void;
    destroy     (): void;
}


export function Connection (): Connection {

    // === INNER FIELDS ===
    const peer:     Peer        = new Peer();
    const signal:   Signal      = new Signal();
    const chatUnit: DuoChatUnit = new DuoChatUnit();

    let state:      'new' | 'connecting' | 'connected' | 'disconnected' = "new";

    addDebug("chatUnit", chatUnit);
    addDebug("peer", peer);


    // === API EVENT SYSTEM ===
    const accessor      = new Accessor( Object.values(ACC_FLAGS) );
    const whenAccess    = new When<{'ready': undefined}>();

    accessor.on("access", () => {
        whenAccess.occur("ready");
    });

    // === HELPERS ===
    function sendStop (): void {
        peer.send("stop", CONTROL_NAME);
    }

    function setLocalMedia (media: MediaStream): void {
        media.getTracks().forEach(track => peer.addMediaTrack(track, media));
        chatUnit.setMedia(chatUnit.localChatter, media);
        
        accessor.set(ACC_FLAGS.LOCAL_MEDIA);
    }

    function stopPeer () {
        peer.stop();
    }
    function stopSignal () { signal.stop() }


    // === HANDLERS ===
    function stopHandler ({ label }: {data: string, label: string}) {
        if (label !== CONTROL_NAME) return;
        stopPeer();
    }


    // === EXEC ===
    const chatPeerBus   = ChatPeerBus(chatUnit, peer);
    const signalPeerBus = SignalPeerBus(signal, peer);

    peer.addDataChannel(CONTROL_NAME);
    peer.on(PEER_EVENTS.TEXT, stopHandler);

    whenLocalMedia(media => setLocalMedia(media));


    return {
        whenAccess,
        signalAccessor: accessor,

        chatUnit,
        peer,
        signal,

        connect () {
            if (state !== "new") return;
            state = "connecting";
            whenAccess.when("ready", () => signal.start() );

            peer.once(PEER_EVENTS.CONNECTED, () => { state = "connected" });
        },

        disconnect () {
            if (state !== "connecting" && state !== "connected") return;
            state = "disconnected"
            sendStop();

            stopPeer();
            stopSignal();

            this.destroy();
        },

        destroy () {
            chatPeerBus.destroy();
            signalPeerBus.destroy();
        },
    };
}