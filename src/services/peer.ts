import { Peer } from '@lib/webrtc';
import { PeerFactory, setPeerFactory } from '@entities/Peer';

let peerFabric: PeerFactory = () => new Peer();

setPeerFactory(peerFabric);
