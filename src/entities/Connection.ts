import { addDebug } from '@lib/utils';
import { Peer, PEER_EVENTS, PeerEventMap } from './Peer';
import { LowercaseMap } from '@types';
import {
	IListenerChest,
	IStateLeader,
	Listener,
	ListenerChest,
	StateLeader,
} from '@lib/pprinter-tools';

// === STATIC DATA ===
const CONTROL_NAME = 'CONTROL';

export type StateGraph = {
	new: ['connecting', 'closed'];
	connecting: ['connected', 'closed'];
	connected: ['reconnecting', 'closed'];
	reconnecting: ['connected', 'closed'];
	closed: [];
};

const stateGraph: StateGraph = {
	new: ['connecting', 'closed'],
	connecting: ['connected', 'closed'],
	connected: ['reconnecting', 'closed'],
	reconnecting: ['connected', 'closed'],
	closed: [],
} as const;

export type Connection = ConnectionChest & {
	getPeer(): Peer;
	getState(): ConnectionState;

	connect(): void;
	close(): void;
};
export type ConnectionState = keyof StateGraph;
export type ConnectionChest = IListenerChest<LowercaseMap<ConnectionEventMap>>;

export type ConnectionEventMap = {
	stateUpdated: ConnectionState;
};

export function Connection(): Connection {
	// === FIELDS ===
	let peer: Peer = new Peer();

	const stateLeader: IStateLeader<StateGraph> = new StateLeader('new', stateGraph);
	const chest: ConnectionChest = new ListenerChest();

	// === DEV ===
	// addDebug('chatUnit', chatUnit); TODO: ADD FOR Room ENTITY
	addDebug('peer', peer);

	// === HANDLERS ===
	const peerStopHandler: Listener<PeerEventMap['text']> = ({ label }) => {
		if (label !== CONTROL_NAME) return;
		updateState('closed');
		stopPeer();
	};

	const peerUpdatedHandler: Listener<PeerEventMap['updated']> = ({ state: peerState }) => {
		switch (peerState) {
			case 'connected':
				updateState('connected');
				break;

			case 'disconnected':
			case 'closed':
			case 'failed':
				if (stateIs('closed')) break;

				updateState('reconnecting');
				stopPeer();
				remakePeer();
				configurePeer();

				startPeer();
				break;
		}
	};

	// === HELPERS ===
	// state manipulates
	function updateState(nextState: ConnectionState): void {
		if (!stateLeader.move(nextState))
			throw Error(
				`'${nextState}' is not able next [Connection] state for current '${getState}' state.`
			);

		chest.exec('stateupdated', stateLeader.get());
	}
	function getState(): ConnectionState {
		return stateLeader.get();
	}
	function stateIs(isState: ConnectionState): boolean {
		return stateLeader.is(isState);
	}

	// Peer manipulates
	function configurePeer(): void {
		peer.addDataChannel(CONTROL_NAME);
		peer.on(PEER_EVENTS.TEXT, peerStopHandler);
		peer.on(PEER_EVENTS.UPDATED, peerUpdatedHandler);
	}

	function startPeer(): void {
		peer.start();
	}
	function stopPeer(): void {
		peer.stop();
	}
	function remakePeer(): void {
		peer = new Peer();
	}
	function sendStop(): void {
		peer.send('stop', CONTROL_NAME);
	}

	// === API ===
	function connect(): void {
		if (!stateIs('new')) {
			return console.warn('[Connect].connect() is not able for used instance.');
		}
		updateState('connecting');
		peer.start();
	}

	function close(): void {
		if (stateIs('closed')) {
			return console.warn('[Connect].close() is not able for closed instance.');
		}
		updateState('closed');
		sendStop();
	}

	function getPeer() {
		return peer;
	}

	// getState -> [=== HELPERS ===] : [Peer manipulates]

	// === EXEC CODE ===
	configurePeer();

	return {
		...chest,
		getPeer,
		getState,

		connect,
		close,
	};
}
