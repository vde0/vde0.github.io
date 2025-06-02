import { io, Socket } from 'socket.io-client';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { addDebug, listen } from '@lib/utils';

// === GENERAL DATA ===
addDebug('signalHost', process.env.SIGNAL);
export const SIGNAL_SERVER = process.env.SIGNAL ?? 'https://vde0.chat';

// === TYPES ===
export type SignalConstructor = new () => Signal;
export type Signal = IListenerChest<SignalEventMap> & {
	start(): void;
	stop(): void;

	relayIce(ice: RTCIceCandidate | null): void;
	relaySdp(sdp: RTCSessionDescription | RTCSessionDescriptionInit): void;
};

export type SignalEventMap = {
	start: undefined;
	stop: undefined;
	setConfig: undefined;

	offer: undefined;
	sdp: { sdp: RTCSessionDescription | RTCSessionDescriptionInit };
	ice: { ice: RTCIceCandidate | null };
};
export type SignalEvent = keyof SignalEventMap;
export const SIGNAL_EVENTS: EventKeys<SignalEvent> = {
	START: 'start',
	STOP: 'stop',
	SET_CONFIG: 'setconfig',

	OFFER: 'offer',
	SDP: 'sdp',
	ICE: 'ice',
} as const;
Object.freeze(SIGNAL_EVENTS);

// === FABRIC OF CONNECTION ===
export const Signal: SignalConstructor = function (): Signal {
	// === PRIVATE FIELDS AND METHODS ===
	let socket: Socket;
	let target: string;

	let state: 'new' | 'started' | 'stopped' = 'new';

	const chest: IListenerChest<SignalEventMap> = new ListenerChest();

	const signal = (): void => {
		socket = io(SIGNAL_SERVER);

		listen(socket, {
			accepttarget: ({ target: id, offer }: { target: string; offer: boolean }) => {
				target = id;
				offer && chest.exec(SIGNAL_EVENTS.OFFER);
			},
			acceptsdp: ({ sdp }: { sdp: RTCSessionDescription | RTCSessionDescriptionInit }) => {
				chest.exec(SIGNAL_EVENTS.SDP, { sdp });
			},
			acceptice: ({ ice }: { ice: RTCIceCandidate | null }) => {
				chest.exec(SIGNAL_EVENTS.ICE, { ice });
			},
		});
	};

	chest.once('start', () => {
		signal();
	});

	// === RESULT INSTANCE ===
	return {
		...chest,
		start() {
			if (state !== 'new') return;
			state = 'started';
			chest.exec(SIGNAL_EVENTS.START);
		},
		stop() {
			if (state !== 'started') return;
			state = 'stopped';
			socket.emit('success');
			chest.exec(SIGNAL_EVENTS.STOP);
		},

		relaySdp(sdp) {
			socket.emit('relaysdp', { target, sdp });
		},
		relayIce(ice) {
			socket.emit('relayice', { target, ice });
		},
	};
} as unknown as SignalConstructor;
