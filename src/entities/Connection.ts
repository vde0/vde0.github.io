import { addDebug } from '@lib/utils';
import { Peer, PEER_EVENTS, PeerEventMap } from './Peer';
import { LowercaseMap } from '@types';
import { IListenerChest, Listener, ListenerChest } from '@lib/pprinter-tools';

// === STATIC DATA ===
const CONTROL_NAME = 'CONTROL';

const accessedStateUpdates: { [K in ConnectionState]?: Set<ConnectionState> } = {
	new: new Set(['connecting', 'closed']),
	connecting: new Set(['connected', 'closed']),
	connected: new Set(['reconnecting', 'closed']),
	reconnecting: new Set(['connected', 'closed']),
} as const;

export type Connection = ConnectionChest & {
	getPeer(): Peer;

	connect(): void;
	close(): void;
};
export type ConnectionState = 'new' | 'connecting' | 'connected' | 'reconnecting' | 'closed';
export type ConnectionChest = IListenerChest<LowercaseMap<ConnectionEventMap>>;

export type ConnectionEventMap = {
	stateUpdated: ConnectionState;
};

export function Connection(): Connection {
	// === FIELDS ===
	let peer: Peer = new Peer();

	let state: ConnectionState = 'new';
	let chest: ConnectionChest = new ListenerChest();

	// === DEV ===
	// addDebug('chatUnit', chatUnit); TODO: ADD FOR Room ENTITY
	addDebug('peer', peer);

	// === HANDLERS ===
	const peerStopHandler: Listener<PeerEventMap['text']> = ({ label }) => {
		if (label !== CONTROL_NAME) return;
		makeClosed() && stopPeer();
	};

	const peerUpdatedHandler: Listener<PeerEventMap['updated']> = ({ state: peerState }) => {
		switch (peerState) {
			case 'connected':
				makeConnected();
				break;

			case 'disconnected':
			case 'closed':
			case 'failed':
				if (state === 'closed') break;

				makeReconnecting();
				stopPeer();
				remakePeer();
				configurePeer();

				startPeer();
				break;
		}
	};

	// === HELPERS ===
	// state manipulates
	function updateState(newState: ConnectionState): void {
		if (accessedStateUpdates[state] === undefined)
			throw Error(`'${newState}' [Connection] state is not able to update.`);
		if (!accessedStateUpdates[state]!.has(newState))
			throw Error(
				`'${newState}' is not able next [Connection] state for current '${state}' state.`
			);

		state = newState;
		chest.exec('stateupdated', state);
	}

	function makeConnecting(): boolean {
		if (state !== 'new') return false;
		updateState('connecting');
		return true;
	}

	function makeReconnecting(): boolean {
		if (state !== 'connected') return false;
		updateState('reconnecting');
		return true;
	}

	function makeConnected(): boolean {
		if (state !== 'connecting' && state !== 'reconnecting') return false;
		updateState('connected');
		return true;
	}

	function makeClosed(): boolean {
		if (state === 'closed') return false;
		updateState('closed');
		return true;
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
	function remakePeer(): void {
		peer = new Peer();
	}
	function sendStop(): void {
		peer.send('stop', CONTROL_NAME);
	}
	function stopPeer(): void {
		peer.stop();
	}

	// === API ===
	function connect(): void {
		if (state !== 'new') {
			return console.error('[Connect].connect() is not able for used instance.');
		}
		makeConnecting();
		peer.start();
	}

	function close(): void {
		if (state === 'closed') {
			return console.error('[Connect].close() is not able for closed instance.');
		}
		makeClosed();
		sendStop();
	}

	// === EXEC CODE ===
	configurePeer();

	return {
		...chest,
		getPeer() {
			return peer;
		},

		connect,
		close,
	};
}
