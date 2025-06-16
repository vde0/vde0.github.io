import { IPeer, PeerConstructor } from '@lib/webrtc';

// === `Peer` FACTORY
export type PeerFactory = () => IPeer;

let createPeer: PeerFactory | null = null;

export function setPeerFactory(peerFactory: PeerFactory) {
	createPeer = peerFactory;
}

export const Peer: PeerConstructor = function (): IPeer {
	if (createPeer === null) throw Error('`peerFactory` is not defined.');
	return createPeer();
} as unknown as PeerConstructor;
