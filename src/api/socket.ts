import { io, Socket } from 'socket.io-client';
import { IListenerChest, Listener, ListenerChest } from '@lib/pprinter-tools';
import { addDebug, listen } from '@lib/utils';
import { SignalActionMap, SIGNAL_ACTIONS } from './socket-api';

// === GENERAL DATA ===
addDebug('signalHost', process.env.SIGNAL);
export const SIGNAL_SERVER = process.env.SIGNAL ?? 'https://vde0.chat';

// === PRIVATE FIELDS AND METHODS ===
const webSocket: Socket<{ [E in keyof SignalActionMap]: Listener<SignalActionMap[E]> }> = io(
	SIGNAL_SERVER,
	{
		autoConnect: false,
	}
);
const chest: IListenerChest<SignalActionMap> = new ListenerChest();

// === HELPERS ===
const safeConnecting = (f: CallableFunction): void => {
	if (webSocket.disconnected) webSocket.connect();
	f();
};

// === MAKE LISTENING ===
listen<Socket, SignalActionMap>(webSocket, {
	[SIGNAL_ACTIONS.ACCEPT_ICE]: (payload) => chest.exec(SIGNAL_ACTIONS.ACCEPT_ICE, payload),
	[SIGNAL_ACTIONS.ACCEPT_SDP]: (payload) => chest.exec(SIGNAL_ACTIONS.ACCEPT_SDP, payload),
	[SIGNAL_ACTIONS.ACCEPT_TARGET]: (payload) => chest.exec(SIGNAL_ACTIONS.ACCEPT_TARGET, payload),
});
listen<typeof chest, SignalActionMap>(chest, {
	[SIGNAL_ACTIONS.RELAY_ICE]: (payload) =>
		safeConnecting(() => webSocket.emit(SIGNAL_ACTIONS.RELAY_ICE, payload)),
	[SIGNAL_ACTIONS.RELAY_SDP]: (payload) =>
		safeConnecting(() => webSocket.emit(SIGNAL_ACTIONS.RELAY_SDP, payload)),
	[SIGNAL_ACTIONS.RELAY_TARGET]: (payload) =>
		safeConnecting(() => webSocket.emit(SIGNAL_ACTIONS.RELAY_TARGET, payload)),
});

export { chest as socket };
