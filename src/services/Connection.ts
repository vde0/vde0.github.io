import { addDebug } from '@lib/utils';
import { Peer, PEER_EVENTS } from '@lib/webrtc';
import { Signal } from '@api/Signal';
import { DuoChatUnit } from './DuoChatUnit';
import { whenLocalMedia } from '@api/localMedia';
import { ChatPeerBus } from './ChatPeerBus';
import { SignalPeerBus } from './SignalPeerBus';
import { when as whenAccess } from './AppAccessor';
import { ContentMedia } from '@types';

// === API FIELDS ===
export const CONTROL_NAME = 'CONTROL';

export interface Connection {
	chatUnit: DuoChatUnit;
	peer: Peer;
	signal: Signal;

	connect(): void;
	disconnect(): void;
	destroy(): void;
}

export function Connection(): Connection {
	// === INNER FIELDS ===
	const peer: Peer = new Peer();
	const signal: Signal = new Signal();
	const chatUnit: DuoChatUnit = new DuoChatUnit();

	let state: 'new' | 'connecting' | 'connected' | 'disconnected' = 'new';

	addDebug('chatUnit', chatUnit);
	addDebug('peer', peer);

	// === HELPERS ===
	function sendStop(): void {
		peer.send('stop', CONTROL_NAME);
	}

	function setLocalMedia(media: ContentMedia): void {
		media?.getTracks().forEach((track) => peer.addMediaTrack(track, media));
		chatUnit.setMedia(chatUnit.localChatter, media);
	}

	function stopPeer() {
		peer.stop();
	}
	function stopSignal() {
		signal.stop();
	}

	// === HANDLERS ===
	function stopHandler({ label }: { data: string; label: string }) {
		if (label !== CONTROL_NAME) return;
		stopPeer();
	}

	// === EXEC ===
	const chatPeerBus = ChatPeerBus(chatUnit, peer);
	const signalPeerBus = SignalPeerBus(signal, peer);

	peer.addDataChannel(CONTROL_NAME);
	peer.on(PEER_EVENTS.TEXT, stopHandler);

	whenLocalMedia((media) => setLocalMedia(media));

	return {
		chatUnit,
		peer,
		signal,

		connect() {
			if (state !== 'new') return;
			state = 'connecting';
			whenAccess(() => signal.start());

			peer.once(PEER_EVENTS.CONNECTED, () => {
				state = 'connected';
			});
		},

		disconnect() {
			if (state !== 'connecting' && state !== 'connected') return;
			state = 'disconnected';
			sendStop();

			stopPeer();
			stopSignal();

			this.destroy();
		},

		destroy() {
			chatPeerBus.destroy();
			signalPeerBus.destroy();
		},
	};
}
