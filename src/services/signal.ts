import { listen } from '@lib/utils';
import { socket } from '@api/socket';
import { ActionMap, ACTIONS } from '../api/socket-api';
import { Signal } from '@entities/Signal';

listen<typeof socket, ActionMap>(socket, {
	[ACTIONS.ACCEPT_TARGET]: (payload) => {
		Signal.exec(ACTIONS.ACCEPT_TARGET, payload);
	},
	[ACTIONS.ACCEPT_SDP]: (payload) => {
		Signal.exec(ACTIONS.ACCEPT_SDP, payload);
	},
	[ACTIONS.ACCEPT_ICE]: (payload) => {
		Signal.exec(ACTIONS.ACCEPT_ICE, payload);
	},
});

listen<typeof Signal, ActionMap>(Signal, {
	[ACTIONS.RELAY_TARGET]: (payload) => {
		socket.exec(ACTIONS.RELAY_TARGET, payload);
	},
	[ACTIONS.RELAY_SDP]: (payload) => {
		socket.exec(ACTIONS.RELAY_SDP, payload);
	},
	[ACTIONS.RELAY_ICE]: (payload) => {
		socket.exec(ACTIONS.RELAY_ICE, payload);
	},
});
