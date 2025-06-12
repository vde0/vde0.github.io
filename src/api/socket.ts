import { io, Socket } from 'socket.io-client';
import { IListenerChest, Listener, ListenerChest } from '@lib/pprinter-tools';
import { addDebug, listen } from '@lib/utils';
import { ACTIONS } from '@api/socket-api';

// ACTIONS - EVENTS FOR REAL CONNECTION VIA WEB-SOCKET, POLLING
type ActionMap = {
	success: undefined;
	acceptice: { ice: RTCIceCandidate | null };
	acceptsdp: { sdp: RTCSessionDescription | RTCSessionDescriptionInit };
	accepttarget: { target: string; offer: boolean };
	relayice: { target: string; ice: RTCIceCandidate | null };
	relaysdp: { target: string; sdp: RTCSessionDescription | RTCSessionDescriptionInit };
	relaytarget: never;
};

// === GENERAL DATA ===
addDebug('signalHost', process.env.SIGNAL);
export const SIGNAL_SERVER = process.env.SIGNAL ?? 'https://vde0.chat';

// === PRIVATE FIELDS AND METHODS ===
const webSocket: Socket<{ [E in keyof ActionMap]: Listener<ActionMap[E]> }> = io(SIGNAL_SERVER, {
	autoConnect: false,
});
const chest: IListenerChest<ActionMap> = new ListenerChest();

// === HELPERS ===
const safeConnecting = (f: CallableFunction): void => {
	if (webSocket.disconnected) webSocket.connect();
	f();
};

// === MAKE LISTENING ===
listen<Socket, ActionMap>(webSocket, {
	[ACTIONS.SUCCESS]: () => {
		webSocket.close();
		chest.exec(ACTIONS.SUCCESS);
	},
	[ACTIONS.ACCEPT_ICE]: (payload) => chest.exec(ACTIONS.ACCEPT_ICE, payload),
	[ACTIONS.ACCEPT_SDP]: (payload) => chest.exec(ACTIONS.ACCEPT_SDP, payload),
	[ACTIONS.ACCEPT_TARGET]: (payload) => chest.exec(ACTIONS.ACCEPT_TARGET, payload),
});
listen<typeof chest, ActionMap>(chest, {
	[ACTIONS.RELAY_ICE]: (payload) =>
		safeConnecting(() => webSocket.emit(ACTIONS.RELAY_ICE, payload)),
	[ACTIONS.RELAY_SDP]: (payload) =>
		safeConnecting(() => webSocket.emit(ACTIONS.RELAY_SDP, payload)),
});

// === API EXPORT ===
const onSocket = chest.on;
const onceSocket = chest.once;
const offSocket = chest.off;

const relayIce = (payload: ActionMap[typeof ACTIONS.RELAY_ICE]) =>
	chest.exec(ACTIONS.RELAY_ICE, payload);

const relaySdp = (payload: ActionMap[typeof ACTIONS.RELAY_SDP]) =>
	chest.exec(ACTIONS.RELAY_SDP, payload);

export const socket = {
	on: onSocket,
	once: onceSocket,
	off: offSocket,
	relayIce,
	relaySdp,
};
