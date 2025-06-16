import 'webrtc-adapter';
import freeice from 'freeice';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import * as sdpTransform from 'sdp-transform';

// === MODULE VARS / STATIC FIELDS ===
export const DEFAULT_CONFIG: RTCConfiguration = {
	iceServers: [
		...freeice(),

		// Metered.ca — TURN (бесплатен для тестов, требует ограничений по трафику/частоте)
		{
			urls: 'turn:global.relay.metered.ca:443',
			username: 'openrelayproject',
			credential: 'openrelayproject',
		},
		{
			urls: 'turn:relay.metered.ca:80',
			username: 'openrelayproject',
			credential: 'openrelayproject',
		},

		// Backup TURN (anon.turn.ovh) — нестабильно, использовать с осторожностью
		{
			urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
			username: 'webrtc',
			credential: 'webrtc',
		},
	],
	iceTransportPolicy: 'all',
};

// === ANNOTATION ===
export interface IPeer extends IListenerChest<PeerEventMap> {
	rtc: RTCPeerConnection;
	getState(): RTCPeerConnection['connectionState'];

	start(): void;
	stop(): void;
	send(msgText: string, channelName: string): void;

	setRemoteSdp(sdp: RTCSessionDescription | RTCSessionDescriptionInit): void;
	addCandidate(ice: RTCIceCandidate | null): void;

	addDataChannel(name: string, config?: DataChannelConfig): boolean;
	addMediaTrack(track: MediaStreamTrack, stream: MediaStream): boolean;

	getDataChannel(name: string): RTCDataChannel | null;
	getMediaTrack(id: string): MediaStreamTrack | null;
	getMediaStream(id: string): MediaStream | null;

	getDataChannelLabels(): string[];
	getMediaTrackIds(): string[];
	getMediaStreamIds(): string[];
}

export interface DataChannelConfig {
	reliable?: boolean; // default: true
	ordered?: boolean; // default: true
	maxRetransmits?: number; // default: undefined
	maxPacketLifeTime?: number; // default: undefined
	protocol?: string; // default: ""
	negotiated?: boolean; // default: false
	id?: number; // default: undefined
}

export type PeerConstructor = new (config?: RTCConfiguration) => IPeer;

export const PEER_EVENTS: EventKeys<PeerEvent> = {
	CLOSED: 'closed',
	CONNECTED: 'connected',
	CONNECTING: 'connecting',
	DISCONNECTED: 'disconnected',
	FAILED: 'failed',
	NEW: 'new',

	UPDATED: 'updated',

	START: 'start',
	STOP: 'stop',

	MEDIA: 'media',
	TEXT: 'text',
	SDP: 'sdp',
	ICE: 'ice',
} as const;

export type PeerEvent = keyof PeerEventMap;
export type PeerEventMap = {
	[E in RTCPeerConnectionState]: undefined;
} & {
	media: { media: MediaStream };
	text: { label: RTCDataChannel['label']; data: string };
	sdp: { sdp: RTCSessionDescriptionInit };
	ice: RTCPeerConnectionIceEvent;

	start: undefined;
	stop: undefined;

	updated: { state: RTCPeerConnectionState };
};

// === LOCKING ===
Object.freeze(DEFAULT_CONFIG);
Object.freeze(PEER_EVENTS);

// === CONSTRUCTOR ===
export const Peer: PeerConstructor = function (config = DEFAULT_CONFIG) {
	// === PRIVATE FIELDS ===
	const rtc: RTCPeerConnection = new RTCPeerConnection(config);
	const chest: IListenerChest<PeerEventMap> = new ListenerChest<PeerEventMap>();
	let isStarted: boolean = false;

	let dataChannels: Map<string, RTCDataChannel> = new Map();
	let mediaTracks: Map<string, MediaStreamTrack> = new Map();
	let mediaStreams: Map<string, MediaStream> = new Map();

	const candidateBuffer: (RTCIceCandidate | null)[] = [];

	// === LOCAL HELPERS / PRIVATE METHODS ===
	function initDataChannel(dc: RTCDataChannel) {
		const label = dc.label;
		dc.onmessage = (ev: MessageEvent<string>) =>
			chest.exec(PEER_EVENTS.TEXT, {
				label,
				data: ev.data,
			});
		dataChannels.set(label, dc);
	}
	function initMediaTrack(track: MediaStreamTrack) {
		mediaTracks.set(track.id, track);
	}
	function initMediaStream(stream: MediaStream) {
		mediaStreams.set(stream.id, stream);
		chest.exec(PEER_EVENTS.MEDIA, { media: stream });
	}
	function doCandidateBuffer() {
		try {
			candidateBuffer.forEach((candidate) => rtc.addIceCandidate(candidate));
		} catch (err: any) {
			console.warn('ICE candidate failed:', err.message);
		}
		candidateBuffer.length = 0;
	}

	function execUpdateState() {
		chest.exec(PEER_EVENTS.UPDATED, { state: rtc.connectionState });
		chest.exec(rtc.connectionState);
	}

	// === EXEC CODE ===
	rtc.onicecandidate = (ev: RTCPeerConnectionIceEvent) => chest.exec(PEER_EVENTS.ICE, ev);
	rtc.onconnectionstatechange = () => {
		if (rtc.connectionState === 'closed') return;
		execUpdateState();
	};
	rtc.ondatachannel = (ev: RTCDataChannelEvent) => {
		initDataChannel(ev.channel);
	};
	rtc.ontrack = (ev: RTCTrackEvent) => {
		initMediaTrack(ev.track);
		ev.streams.forEach((stream) => initMediaStream(stream));
	};

	// === INSTANCE ===
	const peerInstance: IPeer = {
		// === LISTENERS CONTROLLING ===
		...chest,

		// === RTC OBJECT ===
		rtc,
		getState() {
			return rtc.connectionState;
		},

		// === CONNECT CONTROLLING ===
		async start() {
			if (isStarted) return;
			isStarted = true;

			chest.exec('start');

			try {
				const offer: RTCSessionDescriptionInit = await rtc.createOffer();

				if (offer.sdp) {
					const res: sdpTransform.SessionDescription = sdpTransform.parse(offer.sdp);
					const videoMedia = res.media.find((m) => m.type === 'video');
					if (videoMedia) {
						videoMedia.rtp = videoMedia.rtp.filter((rtpItem) => rtpItem.codec === 'H264');
						const videoPayloads = videoMedia.rtp.map((rtpItem) => rtpItem.payload);
						videoMedia.payloads = videoPayloads.join(' ');
						videoMedia.fmtp =
							videoMedia.fmtp?.filter((fmtpItem) => videoPayloads.includes(fmtpItem.payload)) ?? [];
						videoMedia.rtcpFb =
							videoMedia.rtcpFb?.filter((rtcpFbItem) =>
								videoPayloads.includes(rtcpFbItem.payload)
							) ?? [];
					}

					offer.sdp = sdpTransform.write(res);
				}

				await rtc.setLocalDescription(offer);
				chest.exec(PEER_EVENTS.SDP, { sdp: offer });
			} catch (err: any) {
				console.error('Error of offer generating:', err.message);
			}
		},
		stop() {
			chest.exec('stop');
			chest.once(PEER_EVENTS.CLOSED, () => chest.offAll());
			rtc.close();

			execUpdateState();
		},

		async setRemoteSdp(sdp) {
			await rtc.setRemoteDescription(sdp);
			doCandidateBuffer();

			if (isStarted) return;

			try {
				const answer: RTCSessionDescriptionInit = await rtc.createAnswer();
				await rtc.setLocalDescription(answer);
				chest.exec(PEER_EVENTS.SDP, { sdp: answer });
			} catch (err: any) {
				console.error('Error of answer generating:', err.message);
			}
		},
		addCandidate(ice) {
			candidateBuffer.push(ice);
		},

		// === DATA CONTROLLING ===
		send(msgText, name) {
			dataChannels.get(name)?.send(msgText);
		},
		addDataChannel(name, config) {
			if (isStarted) return false;
			chest.on('start', () => initDataChannel(rtc.createDataChannel(name, config)));
			return true;
		},
		addMediaTrack(track, stream) {
			if (isStarted) return false;
			rtc.addTrack(track, stream);
			return true;
		},

		// === GET ITEM ===
		getMediaStream(id) {
			return mediaStreams.get(id) ?? null;
		},
		getMediaTrack(id) {
			return mediaTracks.get(id) ?? null;
		},
		getDataChannel(label) {
			return dataChannels.get(label) ?? null;
		},

		// === GET COLLECTION OF KEYS ===
		getMediaTrackIds() {
			return Array.from(mediaTracks.keys());
		},
		getMediaStreamIds() {
			return Array.from(mediaStreams.keys());
		},
		getDataChannelLabels() {
			return Array.from(dataChannels.keys());
		},
	};

	return peerInstance;
} as unknown as PeerConstructor;
