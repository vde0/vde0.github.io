import { listen, ListenerCollection, unlisten } from '@utils';
import { Peer, PEER_EVENTS, PeerEventMap } from '../entities/Peer';
import { Signal, signal, SIGNAL_EVENTS, SignalEventMap } from './signal';

// === PRIVATE FIELDS ===
let peer: Peer | null = null;

// === LISTENERS AND FUNCTIONS TO MANIPULATE THEM
const signalListeners: ListenerCollection<SignalEventMap> = {
	[SIGNAL_EVENTS.OFFER]: () => {
		const ensuredPeer: Peer = ensurePeer(peer);
		ensuredPeer.start();
	},
	[SIGNAL_EVENTS.SDP]: ({ sdp }) => {
		const ensuredPeer: Peer = ensurePeer(peer);
		ensuredPeer.setRemoteSdp(sdp);
	},
	[SIGNAL_EVENTS.ICE]: ({ ice }) => {
		const ensuredPeer: Peer = ensurePeer(peer);
		ensuredPeer.addCandidate(ice);
	},
};

const peerListeners: ListenerCollection<PeerEventMap> = {
	[PEER_EVENTS.SDP]: ({ sdp }) => {
		signal.relaySdp(sdp);
	},
	[PEER_EVENTS.ICE]: ({ candidate }) => {
		signal.relayIce(candidate);
	},
};

const configureSignal = (): void => listen<Signal, SignalEventMap>(signal, signalListeners);
const configurePeer = (): void => {
	const ensuredPeer: Peer = ensurePeer(peer);
	listen<Peer, PeerEventMap>(ensuredPeer, peerListeners);
};
const resetPeer = (): void => {
	const ensuredPeer: Peer = ensurePeer(peer);
	unlisten<Peer, PeerEventMap>(ensuredPeer, peerListeners);
};

// === HELPERS ===
function ensurePeer(peerArg: typeof peer): Peer {
	if (!peerArg) throw Error('Peer is not set.');
	return peerArg;
}

// === EXEC CODE ===
configureSignal();

// === API ===
function setPeer(peerArg: Peer): void {
	resetPeer();

	peer = peerArg;
	configurePeer();
}

export const signalPeerBus = {
	setPeer,
};
