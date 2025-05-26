import { Listener } from "@lib/pprinter-tools";
import { Peer, PeerEventMap } from "@lib/webrtc";
import { ChatSignalHub } from "@services/ChatSignalHub";
import { Signal } from "@services/Signal";
import { useEffect, useState } from "react";


export const usePeer = (): Peer | null => {

    const [peer, setPeer] = useState( ChatSignalHub.getPeer() );

    useEffect(() => {
        const updatePeerHandler = (peerArg: Peer): void => {
            setPeer(peerArg);
        };
        ChatSignalHub.onUpdatePeer(updatePeerHandler);
        return () => ChatSignalHub.offUpdatePeer(updatePeerHandler);
    }, []);

    return peer;
};

export const useSignal = (): Signal => { return ChatSignalHub.getSignal() };


export const usePeerState = (): RTCPeerConnection["connectionState"] | null => {

    const peer: Peer | null         = usePeer();
    const [peerState, setPeerState] = useState<RTCPeerConnection["connectionState"] | null>(
        peer?.state ?? null
    );

    useEffect(() => {
        if (!peer) return;

        setPeerState( peer.state );

        const updatePeerState: Listener<PeerEventMap['updated']> = ({ state }) => {
            setPeerState(state);
        };

        peer.on("updated", updatePeerState);
        return () => peer.off("updated", updatePeerState);
    }, [peer]);

    return peerState;
};