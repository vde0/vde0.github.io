import { io, Socket } from 'socket.io-client';
import { IListenerChest, Listener, ListenerChest } from '@lib/pprinter-tools';
import { addDebug, listen } from '@lib/utils';
import { ActionMap, ACTIONS } from './socket-api';

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
	[ACTIONS.ACCEPT_ICE]: (payload) => chest.exec(ACTIONS.ACCEPT_ICE, payload),
	[ACTIONS.ACCEPT_SDP]: (payload) => chest.exec(ACTIONS.ACCEPT_SDP, payload),
	[ACTIONS.ACCEPT_TARGET]: (payload) => chest.exec(ACTIONS.ACCEPT_TARGET, payload),
});
listen<typeof chest, ActionMap>(chest, {
	[ACTIONS.RELAY_ICE]: (payload) =>
		safeConnecting(() => webSocket.emit(ACTIONS.RELAY_ICE, payload)),
	[ACTIONS.RELAY_SDP]: (payload) =>
		safeConnecting(() => webSocket.emit(ACTIONS.RELAY_SDP, payload)),
	[ACTIONS.RELAY_TARGET]: (payload) =>
		safeConnecting(() => webSocket.emit(ACTIONS.RELAY_TARGET, payload)),
});

export { chest as socket };
