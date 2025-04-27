import "webrtc-adapter";
import freeice from "freeice";
import { IListenerChest, ListenerChest } from "@utils";


// === ANNOTATION ===
export type Peer = IListenerChest<PeerEvent> & {
    rtc: RTCPeerConnection;

    start   (): void;
    stop    (): void;
    send    (msgText: string, channelName: string): void;

    setRemoteSdp (sdp: RTCSessionDescription): void;
    addCandidate (ice: RTCIceCandidate): void;

    addDataChannel  (label: string, config?: DataChannelConfig): boolean;
    addMediaTrack   (track: MediaStreamTrack, stream: MediaStream): boolean;

    getDataChannel  (label: string):    RTCDataChannel | null;
    getMediaTrack   (id: string):       MediaStreamTrack | null;
    getMediaStream  (id: string):       MediaStream | null;

    getDataChannelLabels    (): string[];
    getMediaTrackIds        (): string[];
    getMediaStreamIds       (): string[];
}

export type PeerConstructor = new (config?: RTCConfiguration) => Peer;
export type PeerEvent = 'media' | 'text' | 'connect' | 'disconnect' | 'sdp' | 'ice';

export interface DataChannelConfig {
    reliable?: boolean; // default: true
    ordered?: boolean; // default: true
    maxRetransmits?: number; // default: undefined
    maxPacketLifeTime?: number; // default: undefined
    protocol?: string; // default: ""
    negotiated?: boolean; // default: false
    id?: number; // default: undefined
}


// === MODULE VARS / STATIC FIELDS ===
export const DEFAULT_CONFIG: RTCConfiguration = {
    iceServers: freeice(), // Automatically generate ICE servers using freeice
    iceTransportPolicy: "all", // Allow using all possible transport paths for ICE
};
export const PEER_EVENTS: {[key: string]: PeerEvent} = {
    MEDIA:      "media",
    TEXT:       "text",
    CONNECT:    "connect",
    DISCONNECT: "disconnect",
    SDP:        "sdp",
    ICE:        "ice",
};

// === LOCKING ===
Object.freeze(DEFAULT_CONFIG);
Object.freeze(PEER_EVENTS);


// === CONSTRUCTOR ===
export const Peer: PeerConstructor = function (config = DEFAULT_CONFIG) {

    // === PRIVATE FIELDS ===
    const rtc: RTCPeerConnection = new RTCPeerConnection(config);
    const listenerChest: IListenerChest<PeerEvent> = new ListenerChest<PeerEvent>();
    let isStarted: boolean = false;

    let dataChannels:   Map<string, RTCDataChannel>         = new Map();
    let mediaTracks:    Map<string, MediaStreamTrack>       = new Map();
    let mediaStreams:   Map<string, MediaStream>            = new Map();

    // === LOCAL HELPERS / PRIVATE METHODS ===
    function initDataChannel (dc: RTCDataChannel) {
        dc.onmessage = (ev: MessageEvent) => listenerChest.exec(PEER_EVENTS.TEXT, ev);
        dataChannels.set(dc.label, dc);
    }
    function initMediaTrack (track: MediaStreamTrack) {
        mediaTracks.set(track.id, track); 
    }
    function initMediaStream (stream: MediaStream) {
        mediaStreams.set(stream.id, stream);
        listenerChest.exec(PEER_EVENTS.MEDIA, { media: stream });
    }

    // === EXEC CODE ===
    rtc.onicecandidate = (ev: RTCPeerConnectionIceEvent) => listenerChest.exec(PEER_EVENTS.ICE, ev);
    rtc.onconnectionstatechange = ev => {
        const connectionState: RTCPeerConnectionState= rtc.connectionState;
        switch (connectionState) {
            case "closed":
            case "disconnected":
                listenerChest.exec(PEER_EVENTS.DISCONNECT, { connectionState });
                break;
            case "connected":
                listenerChest.exec(PEER_EVENTS.CONNECT, { connectionState });
                break;
        }
    };
    rtc.ondatachannel = (ev: RTCDataChannelEvent) => {
        initDataChannel(ev.channel);
    };
    rtc.ontrack = (ev: RTCTrackEvent) => {
        initMediaTrack(ev.track)
        ev.streams.forEach( stream => initMediaStream(stream) );
    };
    
    // === INSTANCE ===
    const peerInstance: Peer = {
        // === LISTENERS CONTROLLING ===
        ...listenerChest,

        // === RTC OBJECT ===
        get rtc () { return rtc },

        // === CONNECT CONTROLLING ===
        start () {
            isStarted = true;
            rtc.createOffer()
                .then(offer => {
                    rtc.setLocalDescription(offer);
                    listenerChest.exec(PEER_EVENTS.SDP, { sdp: offer });
                })
                .catch(err => console.error("Error of offer generating:", err.message));
        },
        stop () { rtc.close(); listenerChest.clear(); },

        setRemoteSdp (sdp) {
            rtc.setRemoteDescription(sdp);
            if (!isStarted) rtc.createAnswer()
                .then(answer => {
                    rtc.setLocalDescription(answer);
                    listenerChest.exec(PEER_EVENTS.SDP, { sdp: answer });
                })
                .catch(err => console.error("Error of answer generating:", err.message));
        },
        addCandidate (ice) {
            rtc.addIceCandidate(ice);
        },

        // === DATA CONTROLLING ===
        send (msgText, name) { dataChannels.get(name)?.send(msgText); },
        addDataChannel (name, config) {
            if (isStarted) return false;
            initDataChannel( rtc.createDataChannel(name, config) );
            return true;
        },
        addMediaTrack (track, stream) {
            if (isStarted) return false;
            rtc.addTrack(track, stream);
            return true;
        },

        // === GET ITEM ===
        getMediaStream (id) {
            return mediaStreams.get(id) ?? null;
        },
        getMediaTrack (id) {
            return mediaTracks.get(id) ?? null;
        },
        getDataChannel (label) {
            return dataChannels.get(label) ?? null;
        },

        // === GET COLLECTION OF KEYS ===
        getMediaTrackIds () { return Array.from( mediaTracks.keys() ) },
        getMediaStreamIds () { return Array.from( mediaStreams.keys() ) },
        getDataChannelLabels () { return Array.from( dataChannels.keys() ) },
    }
    
    return peerInstance;
} as unknown as PeerConstructor