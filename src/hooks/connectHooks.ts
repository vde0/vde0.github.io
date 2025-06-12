import { Listener } from '@lib/pprinter-tools';
import { Peer, PeerEventMap } from '@entities/Peer';
import { ConnectionContext, ConnectionCValue } from '@store/ConnectionProvider';
import { useContext, useEffect, useState } from 'react';

export const useConnection = (): ConnectionCValue => {
	return getConnectionContext();
};

export const usePeer = (): Peer => {
	const [connection] = getConnectionContext();
	return connection.getPeer();
};

export const usePeerState = (): RTCPeerConnection['connectionState'] => {
	const peer: Peer = usePeer();
	const [peerState, setPeerState] = useState<RTCPeerConnection['connectionState']>(peer.getState());

	useEffect(() => {
		setPeerState(peer.getState());

		const updatePeerState: Listener<PeerEventMap['updated']> = ({ state }) => {
			setPeerState(state);
		};

		peer.on('updated', updatePeerState);
		return () => peer.off('updated', updatePeerState);
	}, [peer]);

	return peerState;
};

// === HELPERS ===
function getConnectionContext(hookName?: string): ConnectionCValue {
	// === SUCCESS ===
	const context: ConnectionCValue | null = useContext(ConnectionContext);
	if (context) return context;

	// === FAIL ===
	let errMsg: string = '';

	if (hookName) errMsg = `${hookName} must be used within a ConnectionProvider`;
	else errMsg = 'useContext(ConnectionContext) should be called within the ConnectionProvider';

	throw new Error(errMsg);
}
