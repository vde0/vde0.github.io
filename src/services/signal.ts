import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { listen } from '@lib/utils';
import { LowercaseMap } from '@types';
import { socket } from '@api/socket';

// === CONST ===
export const SIGNAL_EVENTS: EventKeys<keyof SignalEventMap> = {
	OFFER: 'offer',
	SDP: 'sdp',
	ICE: 'ice',
} as const;
Object.freeze(SIGNAL_EVENTS);

// === TYPES ===
export type Signal = IListenerChest<LowercaseMap<SignalEventMap>> & {
	relayIce(ice: RTCIceCandidate | null): void;
	relaySdp(sdp: RTCSessionDescription | RTCSessionDescriptionInit): void;
};

export type SignalEventMap = {
	offer: undefined;
	sdp: { sdp: RTCSessionDescription | RTCSessionDescriptionInit };
	ice: { ice: RTCIceCandidate | null };
};
export type SignalEvent = Lowercase<keyof SignalEventMap>;

// === PRIVATE FIELDS AND METHODS ===
let target: string;
const chest: IListenerChest<LowercaseMap<SignalEventMap>> = new ListenerChest();

// === LISTENERS ===
const accepttarget = ({ target: id, offer }: { target: string; offer: boolean }) => {
	target = id;
	offer && chest.exec(SIGNAL_EVENTS.OFFER);
};
const acceptsdp = ({ sdp }: { sdp: RTCSessionDescription | RTCSessionDescriptionInit }) => {
	chest.exec(SIGNAL_EVENTS.SDP, { sdp });
};
const acceptice = ({ ice }: { ice: RTCIceCandidate | null }) => {
	chest.exec(SIGNAL_EVENTS.ICE, { ice });
};

// === DO LISTEN ===
listen(socket, {
	acceptice,
	acceptsdp,
	accepttarget,
});

// === RESULT INSTANCE ===
export const signal: Signal = {
	...chest,

	relaySdp(sdp) {
		socket.relaySdp({ target, sdp });
	},
	relayIce(ice) {
		socket.relayIce({ target, ice });
	},
};
