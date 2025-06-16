import {
	CHAT_EVENTS,
	IChat,
	ChatEventMap,
	MsgItem,
	UserId,
	ContentMedia,
	IUser,
	Session,
	UserEventMap,
	USER_EVENTS,
	SessionEventMap,
	SESSION_EVENTS,
} from '@entities';
import { addDebug, listen, unlisten } from '@lib/utils';
import { ChatContext, ChatCValue } from '@store';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Listener } from '@lib/pprinter-tools';
import { IRoom } from '@entities/Room';
import { useSession } from './useSession';

type Send = (msgText: string) => void;

export const useWrite = (): ChatCValue['write'] => {
	return getChatContext()['write'];
};
export const useUnread = (): ChatCValue['unread'] => {
	return getChatContext()['unread'];
};

export const useRoom = (): IRoom => {
	return useSession().room;
};

export const useChat = (): IChat => {
	return useRoom().chat;
};

export const useChatFeed = (): MsgItem[] => {
	const FEED_COUNT = 100;

	const chat = useChat();
	const [feed, setFeed] = useState<MsgItem[]>(getFeed());

	addDebug('feed', feed);

	// === HELPERS ===
	function getFeed(): MsgItem[] {
		return chat.tail(FEED_COUNT);
	}

	useEffect(() => {
		setFeed(getFeed());

		const update: Listener<ChatEventMap['add' | 'delete' | 'clear']> = () => setFeed(getFeed());

		listen<IChat, ChatEventMap>(chat, {
			[CHAT_EVENTS.ADD]: update,
			[CHAT_EVENTS.DELETE]: update,
			[CHAT_EVENTS.CLEAR]: update,
		});

		return () =>
			unlisten<IChat, ChatEventMap>(chat, {
				[CHAT_EVENTS.ADD]: update,
				[CHAT_EVENTS.DELETE]: update,
				[CHAT_EVENTS.CLEAR]: update,
			});
	}, [chat]);

	return feed;
};

export const useClientId = (): UserId => {
	return Session.client;
};
export const useTargetId = (): UserId | null => {
	const [targetId, setTargetId] = useState(Session.target);

	useEffect(() => {
		const nextStateHandler: Listener<SessionEventMap['nexttarget']> = function ({ target }) {
			setTargetId(target);
		};

		Session.on(SESSION_EVENTS.NEXT_TARGET, nextStateHandler);
		return () => Session.off(SESSION_EVENTS.NEXT_TARGET, nextStateHandler);
	}, []);

	return targetId;
};

export const useUser = <ID extends UserId>(id: ID): IUser<ID> | undefined => {
	return useRoom().getUser(id);
};

export const useClientUser = (): IUser<UserId> => {
	return useUser(useClientId())!;
};

export const useTargetUser = (): IUser<UserId> | undefined => {
	const target = useTargetId();
	if (!target) return;
	return useUser(target);
};

export const useUserMeta = (userId: UserId): [UserId, Send, ContentMedia] => {
	const chat = useChat();
	const user = useUser(userId);

	if (user === undefined) throw Error(`user '${userId}' is undefined`);

	const [userMedia, setUserMedia] = useState<ContentMedia>(user.getMedia());

	const send = useCallback<Send>((msgText) => chat.add(userId, msgText), [chat]);

	// Update Media
	useEffect(() => {
		const update: Listener<UserEventMap['media']> = ({ userId: id, media }) => {
			if (userId !== id) return;
			setUserMedia(media);
		};

		user.on(USER_EVENTS.MEDIA, update);
		return () => user.off(USER_EVENTS.MEDIA, update);
	}, [user]);

	return [userId, send, userMedia];
};

export const useClientMeta = (): [UserId, Send, ContentMedia] => {
	const clientId = useClientId();

	return useUserMeta(clientId);
};

export const useTargetMeta = (): [UserId | undefined, Send, ContentMedia | undefined] => {
	const targetId = useTargetId();
	if (!targetId) return [undefined, (msgText) => {}, undefined];

	return useUserMeta(targetId);
};

// === HELPERS ===
function getChatContext(hookName?: string): ChatCValue {
	// === SUCCESS ===
	const context: ChatCValue | null = useContext(ChatContext);
	if (context) return context;

	// === FAIL ===
	let errMsg: string = '';

	if (hookName) errMsg = `${hookName} must be used within a ChatProvider`;
	else errMsg = 'useContext(ChatContext) should be called within the ChatProvider';

	throw new Error(errMsg);
}
