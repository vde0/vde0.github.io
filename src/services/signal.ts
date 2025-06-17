import { listen } from '@lib/utils';
import { socket } from '@api/socket';
import { SignalActionMap, SIGNAL_ACTIONS } from '../api/socket-api';
import { Signal } from '@entities/Signal';

listen<typeof socket, SignalActionMap>(socket, {
	[SIGNAL_ACTIONS.ACCEPT_TARGET]: (payload) => {
		Signal.exec(SIGNAL_ACTIONS.ACCEPT_TARGET, payload);
	},
	[SIGNAL_ACTIONS.ACCEPT_SDP]: (payload) => {
		Signal.exec(SIGNAL_ACTIONS.ACCEPT_SDP, payload);
	},
	[SIGNAL_ACTIONS.ACCEPT_ICE]: (payload) => {
		Signal.exec(SIGNAL_ACTIONS.ACCEPT_ICE, payload);
	},
});

listen<typeof Signal, SignalActionMap>(Signal, {
	[SIGNAL_ACTIONS.RELAY_TARGET]: (payload) => {
		socket.exec(SIGNAL_ACTIONS.RELAY_TARGET, payload);
	},
	[SIGNAL_ACTIONS.RELAY_SDP]: (payload) => {
		socket.exec(SIGNAL_ACTIONS.RELAY_SDP, payload);
	},
	[SIGNAL_ACTIONS.RELAY_ICE]: (payload) => {
		socket.exec(SIGNAL_ACTIONS.RELAY_ICE, payload);
	},
});
