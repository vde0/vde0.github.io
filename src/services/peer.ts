import { Peer } from '@lib/webrtc';
import { PeerFactory, setPeerFactory } from '@entities/PeerEntity';

let peerFabric: PeerFactory = () => new Peer();

setPeerFactory(peerFabric);
