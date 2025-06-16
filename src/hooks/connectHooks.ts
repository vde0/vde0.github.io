import { Listener } from '@lib/pprinter-tools';
import { Peer, PeerEventMap } from '@lib/webrtc/Peer';
import { RoomContext, RoomCValue } from '@store/RoomProvider';
import { useContext, useEffect, useState } from 'react';

export const useRoom = (): RoomCValue => {
	return getRoomContext();
};

export const usePeer = (): Peer => {
	const [room] = getRoomContext();
	return room.connection.getPeer();
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
function getRoomContext(hookName?: string): RoomCValue {
	// === SUCCESS ===
	const context: RoomCValue | null = useContext(RoomContext);
	if (context) return context;

	// === FAIL ===
	let errMsg: string = '';

	if (hookName) errMsg = `${hookName} must be used within a ConnectionProvider`;
	else errMsg = 'useContext(ConnectionContext) should be called within the ConnectionProvider';

	throw new Error(errMsg);
}
