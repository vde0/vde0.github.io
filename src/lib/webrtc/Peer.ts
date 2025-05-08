import "webrtc-adapter";
import freeice from "freeice";
import { IListenerChest, ListenerChest } from "@utils";
import * as sdpTransform from 'sdp-transform';


// === ANNOTATION ===
export type Peer = IListenerChest<PeerEvent> & {
    rtc: RTCPeerConnection;

    start   (startConfig?: StartConfig, ...args: any[]): void;
    stop    (): void;
    send    (msgText: string, channelName: string): void;

    setRemoteSdp (sdp: RTCSessionDescription): void;
    addCandidate (ice: RTCIceCandidate): void;

    addDataChannel  (name: string, config?: DataChannelConfig):     boolean;
    addMediaTrack   (track: MediaStreamTrack, stream: MediaStream): boolean;

    getDataChannel  (name: string):     RTCDataChannel | null;
    getMediaTrack   (id: string):       MediaStreamTrack | null;
    getMediaStream  (id: string):       MediaStream | null;

    getDataChannelLabels    (): string[];
    getMediaTrackIds        (): string[];
    getMediaStreamIds       (): string[];
}

export type PeerConstructor = new (config?: RTCConfiguration) => Peer;
export type PeerEvent = 'media' | 'text' | 'connect' | 'disconnect' | 'sdp' | 'ice';
export type StartConfig = (...args: any[]) => void;

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
    const rtc:              RTCPeerConnection           = new RTCPeerConnection(config);
    const listenerChest:    IListenerChest<PeerEvent>   = new ListenerChest<PeerEvent>();
    let isStarted:          boolean                     = false;

    let dataChannels:   Map<string, RTCDataChannel>         = new Map();
    let mediaTracks:    Map<string, MediaStreamTrack>       = new Map();
    let mediaStreams:   Map<string, MediaStream>            = new Map();

    const candidateBuffer: RTCIceCandidate[] = [];

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
    function doCandidateBuffer () {
        try {
            candidateBuffer.forEach( candidate => rtc.addIceCandidate(candidate) );
        } catch (err: any) {
            console.warn("ICE candidate failed:", err.message);
        }
        candidateBuffer.length = 0;
    }

    // === EXEC CODE ===
    rtc.onconnectionstatechange = () => {
        console.log("CONNECTION STATE:", rtc.connectionState);
    }
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
        async start (startConfig, ...args) {
            if (isStarted) return;
            isStarted = true;

            startConfig?.(...args);

            try {
                const offer: RTCSessionDescriptionInit = await rtc.createOffer();

                if (offer.sdp) {
                    const res: sdpTransform.SessionDescription = sdpTransform.parse(offer.sdp);
                    const videoMedia = res.media.find(m => m.type === "video");
                    if (videoMedia) {
                        videoMedia.rtp = videoMedia.rtp.filter(rtpItem => rtpItem.codec === "H264");
                        const videoPayloads = videoMedia.rtp.map(rtpItem => rtpItem.payload);
                        videoMedia.payloads = videoPayloads.join(" ");
                        videoMedia.fmtp = videoMedia.fmtp?.filter(fmtpItem => videoPayloads.includes(fmtpItem.payload)) ?? [];
                        videoMedia.rtcpFb = videoMedia.rtcpFb?.filter(rtcpFbItem => videoPayloads.includes(rtcpFbItem.payload)) ?? [];
                    }

                    offer.sdp = sdpTransform.write(res);
                }

                await rtc.setLocalDescription(offer);
                listenerChest.exec(PEER_EVENTS.SDP, { sdp: offer });
            } catch (err: any) { console.error("Error of offer generating:", err.message); }
        },
        stop () { rtc.close(); listenerChest.offAll(); },

        async setRemoteSdp (sdp) {
            await rtc.setRemoteDescription(sdp);
            doCandidateBuffer();

            if (isStarted) return;
            
            try {
                const answer: RTCSessionDescriptionInit = await rtc.createAnswer();
                await rtc.setLocalDescription(answer);
                listenerChest.exec(PEER_EVENTS.SDP, { sdp: answer });
            } catch (err: any) { console.error("Error of answer generating:", err.message); }
        },
        addCandidate (ice) {
            candidateBuffer.push(ice);
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