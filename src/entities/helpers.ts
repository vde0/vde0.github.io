import { IPeer, PEER_EVENTS, PeerEventMap } from '@lib/webrtc/Peer';
import { CHAT_EVENTS, IChat, ChatEventMap } from './Chat';
import { listen, ListenerCollection, unlisten } from '@lib/utils';
import { ISignal, Signal } from './Signal';
import { ActionMap, ACTIONS } from '../api/socket-api';
import { UserId } from './User';

export const CHAT_NAME = 'CHAT';

export type Destroy = () => void;

export function chatPeerBridge({
	client,
	target,
	chat,
	peer,
}: {
	client: UserId;
	target: UserId;
	chat: IChat;
	peer: IPeer;
}): Destroy {
	peer.addDataChannel(CHAT_NAME);

	const peerListeners: ListenerCollection<PeerEventMap> = {
		[PEER_EVENTS.TEXT]: ({ data: text, label }) => {
			if (label !== CHAT_NAME) return;
			chat.add(target, text);
		},
	};

	const historyListeners: ListenerCollection<ChatEventMap> = {
		[CHAT_EVENTS.ADD]: ({ item: { userId, text } }) => {
			if (userId !== client) return;
			peer.send(text, CHAT_NAME);
		},
	};

	listen<IPeer, PeerEventMap>(peer, peerListeners);
	listen<IChat, ChatEventMap>(chat, historyListeners);

	return () => {
		unlisten<IPeer, PeerEventMap>(peer, peerListeners);
		unlisten<IChat, ChatEventMap>(chat, historyListeners);
	};
}

export function peerSignalBridge(peer: IPeer, target: string): Destroy {
	// === LISTENERS
	const signalListeners: ListenerCollection<ActionMap> = {
		[ACTIONS.ACCEPT_TARGET]: ({ target: id, offer }) => {
			if (target !== id) return;
			offer && peer.start();
		},
		[ACTIONS.ACCEPT_SDP]: ({ target: id, sdp }) => {
			if (target !== id) return;
			peer.setRemoteSdp(sdp);
		},
		[ACTIONS.ACCEPT_ICE]: ({ target: id, ice }) => {
			if (target !== id) return;
			peer.addCandidate(ice);
		},
	};

	const peerListeners: ListenerCollection<PeerEventMap> = {
		[PEER_EVENTS.SDP]: ({ sdp }) => {
			Signal.exec(ACTIONS.RELAY_SDP, { target, sdp });
		},
		[PEER_EVENTS.ICE]: ({ candidate }) => {
			Signal.exec(ACTIONS.RELAY_ICE, { target, ice: candidate });
		},
	};

	// === HELPERS ===
	const listenSignal = (): void => listen<ISignal, ActionMap>(Signal, signalListeners);
	const unlistenSignal = (): void => unlisten<ISignal, ActionMap>(Signal, signalListeners);

	const listenPeer = (): void => listen<IPeer, PeerEventMap>(peer, peerListeners);
	const unlistenPeer = (): void => unlisten<IPeer, PeerEventMap>(peer, peerListeners);

	// === EXEC ===
	listenPeer();
	listenSignal();

	return () => {
		unlistenPeer();
		unlistenSignal();
	};
}
