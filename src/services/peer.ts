import { Peer } from '@lib/webrtc';
import { PeerFabric, setPeerFabric } from '@entities/Connection';

let peerFabric: PeerFabric = () => new Peer();

setPeerFabric(peerFabric);
