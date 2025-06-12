import { Peer, PEER_EVENTS, PeerEventMap } from './Peer';
import { DuoChatUnit } from './DuoChatUnit';
import { CHAT_HISTORY_EVENTS, ChatHistory, ChatHistoryEventMap } from '@lib/chat-history';
import { addDebug, listen, ListenerCollection, unlisten } from '@lib/utils';

// === API FIELDS ===
export const CHAT_NAME = 'CHAT';

export function ChatPeerBus(chat: DuoChatUnit, peer: Peer): { destroy(): void } {
	peer.addDataChannel(CHAT_NAME);

	const peerListeners: ListenerCollection<PeerEventMap> = {
		[PEER_EVENTS.TEXT]: ({ data, label }) => {
			if (label !== CHAT_NAME) return;
			chat.history.add(data, chat.remoteChatter);
		},
		[PEER_EVENTS.MEDIA]: ({ media }) => {
			chat.setMedia(chat.remoteChatter, media);
			addDebug('remoteMedia', media);
		},
	};

	const historyListeners: ListenerCollection<ChatHistoryEventMap> = {
		[CHAT_HISTORY_EVENTS.ADD]: ({ item: { chatter, text } }) => {
			if (chatter !== chat.localChatter) return;
			peer.send(text, CHAT_NAME);
		},
	};

	listen<Peer, PeerEventMap>(peer, peerListeners);
	listen<ChatHistory, ChatHistoryEventMap>(chat.history, historyListeners);

	return {
		destroy() {
			unlisten<Peer, PeerEventMap>(peer, peerListeners);
			unlisten<ChatHistory, ChatHistoryEventMap>(chat.history, historyListeners);
		},
	};
}
