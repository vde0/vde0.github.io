import { ChatHistory } from '@lib/chat-history/ChatHistory';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { addDebug } from '@lib/utils';
import { ContentMedia } from '@types';

export const DUO_CHAT_UNIT_EVENTS: EventKeys<DuoChatUnitEvent> = {
	MEDIA: 'media',
} as const;
Object.freeze(DUO_CHAT_UNIT_EVENTS);

export type SymbolChatter = symbol;
export type MediaEventPayload = { chatter: SymbolChatter; media: ContentMedia };

export type DuoChatUnitEvent = keyof DuoChatUnitEventMap;
export type DuoChatUnitEventMap = {
	media: MediaEventPayload;
};

export type DuoChatUnitConstructor = new () => DuoChatUnit;
export type DuoChatUnit = IListenerChest<DuoChatUnitEventMap> & {
	remoteChatter: SymbolChatter;
	localChatter: SymbolChatter;

	history: ChatHistory;

	setMedia(chatter: SymbolChatter, media: ContentMedia): void;
	getMedia(chatter: SymbolChatter): ContentMedia | undefined;
};

export const DuoChatUnit: DuoChatUnitConstructor = function () {
	const history: ChatHistory = new ChatHistory();

	const remoteChatter: SymbolChatter = Symbol('REMOTE_CHATTER');
	const localChatter: SymbolChatter = Symbol('LOCAL_CHATTER');

	const mediaMap: Map<SymbolChatter, ContentMedia> = new Map();
	const listener: IListenerChest<DuoChatUnitEventMap> = new ListenerChest();

	const instance: DuoChatUnit = {
		...listener,
		history,
		remoteChatter,
		localChatter,

		setMedia(chatter, media) {
			if (chatter === localChatter) addDebug('localMedia', media);
			if (chatter === remoteChatter) addDebug('remoteMedia', media);
			listener.exec(DUO_CHAT_UNIT_EVENTS.MEDIA, { chatter, media });
			mediaMap.set(chatter, media);
		},
		getMedia(chatter) {
			return mediaMap.get(chatter);
		},
	};
	Object.freeze(instance);

	return instance;
} as unknown as DuoChatUnitConstructor;
