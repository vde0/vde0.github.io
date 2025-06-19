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
	TargetId,
	ClientId,
	Profile,
	CurrentRoom,
	PROFILE_EVENTS,
	ProfileEventMap,
	Client,
	Target,
} from '@entities';
import { addDebug, listen, unlisten } from '@lib/utils';
import { ChatContext, ChatCValue } from '@store';
import { useContext, useEffect, useState } from 'react';
import { Listener } from '@lib/pprinter-tools';
import { IRoom, ROOM_EVENTS, RoomEventMap } from '@entities/Room';

// PROVIDER HOOKS
export const useWrite = (): ChatCValue['write'] => {
	return getChatContext()['write'];
};
export const useUnread = (): ChatCValue['unread'] => {
	return getChatContext()['unread'];
};

// ROOM
export const useRoom = (): CurrentRoom => {
	const [room, setRoom] = useState(Profile.room);

	useEffect(() => {
		const roomUpdatedHandler: Listener<ProfileEventMap['updateroom']> = function ({ room }) {
			console.log('UPDATE ROOM AT HOOK', room);
			setRoom(room);
		};

		Profile.on(PROFILE_EVENTS.UPDATE_ROOM, roomUpdatedHandler);
		return () => Profile.off(PROFILE_EVENTS.UPDATE_ROOM, roomUpdatedHandler);
	}, []);

	return room;
};

// CHAT
export const useChat = (): IChat => useRoom().chat;

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

// CLIENT
export const useClientId = (): ClientId => {
	useEffect(() => {});

	return Profile.id;
};

export const useClient = (): Client => {
	useEffect(() => {});

	return Profile.user;
};

// TARGET
export const useTargetId = (): TargetId => {
	const [targetIdState, setTargetIdState] = useState(Session.targetId);

	useEffect(() => {
		const nextTargetHandler: Listener<SessionEventMap['nexttarget']> = function ({ targetId }) {
			setTargetIdState(targetId);
		};

		Session.on(SESSION_EVENTS.NEXT_TARGET, nextTargetHandler);
		return () => Session.off(SESSION_EVENTS.NEXT_TARGET, nextTargetHandler);
	}, []);

	return targetIdState;
};
export const useTarget = (): Target => {
	const [targetState, setTargetState] = useState(Session.target);

	useEffect(() => {
		const nextTargetHandler: Listener<SessionEventMap['nexttarget']> = function ({ target }) {
			setTargetState(target);
		};

		Session.on(SESSION_EVENTS.NEXT_TARGET, nextTargetHandler);
		return () => Session.off(SESSION_EVENTS.NEXT_TARGET, nextTargetHandler);
	}, []);

	return targetState;
};

// GENERAL USER
export const useUser = (id: UserId | null): IUser<UserId> | undefined => {
	const room = useRoom();
	const [user, setUser] = useState<IUser<UserId> | undefined>(getUser());

	function getUser() {
		if (id === null) return;
		return room.getUserById(id);
	}

	useEffect(() => {
		setUser(getUser());
		if (id === null) return;

		const updateUserHandler: Listener<RoomEventMap['adduser']> & Listener<RoomEventMap['deluser']> =
			function ({ userId, user }) {
				if (userId !== id) return;
				setUser(user);
			};

		listen<IRoom, RoomEventMap>(room, {
			[ROOM_EVENTS.ADD_USER]: updateUserHandler,
			[ROOM_EVENTS.DEL_USER]: updateUserHandler,
		});
		return () =>
			unlisten<IRoom, RoomEventMap>(room, {
				[ROOM_EVENTS.ADD_USER]: updateUserHandler,
				[ROOM_EVENTS.DEL_USER]: updateUserHandler,
			});
	}, [room, id]);

	return user;
};

export const useUserMedia = (userId: UserId | null): ContentMedia => {
	const user: IUser<UserId> | undefined = useUser(userId);

	const [userMedia, setUserMedia] = useState<ContentMedia>(user?.getMedia() ?? null);

	// Update Media
	useEffect(() => {
		console.log('UPDATE USER', user);
		console.log('IS CLIENT', userId === Profile.id);
		console.log('IS TARGET', userId === Session.targetId);

		setUserMedia(user ? user.getMedia() : null);
		if (!user) return;

		const update: Listener<UserEventMap['media']> = ({ userId: id, media }) => {
			console.log('UPDATE USER MEDIA');
			if (userId !== id) return;
			setUserMedia(media);
		};

		console.log('ON UPDATE MEDIA LISTENER');
		user.on(USER_EVENTS.MEDIA, update);

		return () => {
			console.log('OFF UPDATE MEDIA LISTENER');
			user.off(USER_EVENTS.MEDIA, update);
		};
	}, [user]);

	return userMedia;
};
export const useClientMedia = (): ContentMedia => {
	const clientId = useClientId();

	return useUserMedia(clientId);
};
export const useTargetMedia = (): ContentMedia => {
	const targetId = useTargetId();

	return useUserMedia(targetId);
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
