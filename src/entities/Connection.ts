import { addDebug } from '@lib/utils';
import { IPeer, PEER_EVENTS, PeerEventMap } from '../lib/webrtc/Peer';
import { LowercaseMap } from '@types';
import {
	EventKeys,
	IListenerChest,
	IStateLeader,
	Listener,
	ListenerChest,
	StateLeader,
} from '@lib/pprinter-tools';
import { Destroy, peerSignalBridge } from './helpers';
import { PeerEntity } from './PeerEntity';
import { SignalActionMap } from '@api/socket-api';

// === STATIC DATA ===
const CONTROL_NAME = 'CONTROL';
export const CONNECTION_EVENTS: EventKeys<keyof OrigConnectionEventMap> = {
	STATE_UPDATED: 'stateupdated',
	PEER_UPDATER: 'peerupdater',
};

export type StateGraph = {
	new: ['connecting', 'closed'];
	connecting: ['connected', 'reconnecting', 'closed'];
	connected: ['reconnecting', 'closed'];
	reconnecting: ['connected', 'closed'];
	closed: [];
};

const stateGraph: StateGraph = {
	new: ['connecting', 'closed'],
	connecting: ['connected', 'reconnecting', 'closed'],
	connected: ['reconnecting', 'closed'],
	reconnecting: ['connected', 'closed'],
	closed: [],
} as const;

export interface IConnection extends ConnectionChest {
	getPeer(): IPeer;
	getState(): ConnectionState;

	connect(): void;
	close(): void;
}
export type ConnectionState = keyof StateGraph;
export type ConnectionChest = IListenerChest<ConnectionEventMap>;

type OrigConnectionEventMap = {
	stateUpdated: { state: ConnectionState };
	peerUpdater: { peer: IPeer };
};
export type ConnectionEventMap = LowercaseMap<OrigConnectionEventMap>;

// === `Connection` DEFINE
type ConnectionConstructor = new (
	targetPayload: SignalActionMap['accepttarget'],
	media: MediaStream
) => IConnection;

export const Connection: ConnectionConstructor = function (
	{ target, offer }: SignalActionMap['accepttarget'],
	media: MediaStream
): IConnection {
	// === FIELDS ===
	let peer: IPeer;
	let unsubFromSignal: Destroy;

	const stateLeader: IStateLeader<StateGraph> = new StateLeader('new', stateGraph);
	const chest: ConnectionChest = new ListenerChest();

	// === DEV ===
	addDebug('peer', peer!);

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
				setPeer();

				startPeer();
				break;
		}
	};

	// === EXEC ===
	setPeer();

	// === HELPERS ===
	// state manipulates
	function updateState(nextState: ConnectionState): void {
		if (stateIs(nextState)) return;
		if (!stateLeader.move(nextState))
			throw Error(
				`'${nextState}' is not able next [Connection] state for current '${getState()}' state.`
			);

		chest.exec(CONNECTION_EVENTS.STATE_UPDATED, { state: stateLeader.get() });
	}
	function getState(): ConnectionState {
		return stateLeader.get();
	}
	function stateIs(isState: ConnectionState): boolean {
		return stateLeader.is(isState);
	}

	// Peer manipulates
	function setPeer(): void {
		peer = new PeerEntity();

		peer.addDataChannel(CONTROL_NAME);
		media.getTracks().forEach((track) => peer.addMediaTrack(track, media));

		peer.on(PEER_EVENTS.TEXT, peerStopHandler);
		peer.on(PEER_EVENTS.UPDATED, peerUpdatedHandler);

		unsubFromSignal?.();
		unsubFromSignal = peerSignalBridge(peer, target);

		chest.exec(CONNECTION_EVENTS.PEER_UPDATER, { peer });
	}

	function startPeer(): void {
		peer.start();
	}
	function stopPeer(): void {
		peer.stop();
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
		offer && peer.start();
	}

	function close(): void {
		if (stateIs('closed')) {
			return console.warn('[Connect].close() is not able for closed instance.');
		}
		updateState('closed');
		sendStop();

		unsubFromSignal();
	}

	function getPeer() {
		return peer;
	}

	// getState -> [=== HELPERS ===] : [Peer manipulates]

	return {
		...chest,
		getPeer,
		getState,

		connect,
		close,
	};
} as unknown as ConnectionConstructor;
