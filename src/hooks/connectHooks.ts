import { Peer } from "@lib/webrtc";
import { ChatSignalHub } from "@services/ChatSignalHub";
import { Signal } from "@services/Signal";
import { useEffect, useState } from "react";


export const usePeer = (): Peer => {

    const [peer, setPeer] = useState(ChatSignalHub.getPeer());

    useEffect(() => {
        const updatePeerHandler = (peerArg: Peer): void => setPeer(peerArg);
        ChatSignalHub.onUpdatePeer(updatePeerHandler);
        return () => ChatSignalHub.offUpdatePeer(updatePeerHandler);
    }, []);

    return peer;
};

export const useSignal = (): Signal => { return ChatSignalHub.getSignal() };