import { listen, ListenerCollection, unlisten } from "@utils";
import { Peer, PEER_EVENTS, PeerEvent, PeerEventMap } from "lib/webrtc";
import { Signal, SIGNAL_EVENTS, SignalEvent, SignalEventMap } from "@api/Signal";



export function SignalPeerBus (signal: Signal, peer: Peer): { destroy(): void } {


    const signalListeners: ListenerCollection<SignalEventMap> = {
        [SIGNAL_EVENTS.OFFER]:  ()          => { peer.start()           },
        [SIGNAL_EVENTS.SDP]:    ({ sdp })   => { peer.setRemoteSdp(sdp) },
        [SIGNAL_EVENTS.ICE]:    ({ ice })   => { peer.addCandidate(ice) },
    };

    const peerListeners: ListenerCollection<PeerEventMap> = {
        [PEER_EVENTS.SDP]:      ({ sdp })       => { signal.relaySdp(sdp)       },
        [PEER_EVENTS.ICE]:      ({ candidate }) => { signal.relayIce(candidate) },
        [PEER_EVENTS.STOP]:     ()              => { signal.stop(); },     
    };


    listen<Signal, SignalEventMap>(signal, signalListeners);
    listen<Peer, PeerEventMap>(peer, peerListeners);


    return {
        destroy () {
            unlisten<Signal, SignalEventMap>(signal, signalListeners);
            unlisten<Peer, PeerEventMap>(peer, peerListeners);
        }
    };
}