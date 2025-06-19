import { LowercaseMap } from '@types';
import { Chat, IChat } from './Chat';
import { IUser, UserId } from './User';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';

// == EVENT SYSTEM ==
export const ROOM_EVENTS: EventKeys<keyof OrigRoomEventMap> = {
	ADD_USER: 'adduser',
	DEL_USER: 'deluser',
};
Object.freeze(ROOM_EVENTS);

type RoomChest = IListenerChest<RoomEventMap>;
export type RoomEvent = keyof RoomEventMap;
export type RoomEventMap = LowercaseMap<OrigRoomEventMap>;
type OrigRoomEventMap = {
	addUser: { userId: UserId; user: IUser<UserId> };
	delUser: { userId: UserId; user: IUser<UserId> };
};

// == FACTORY ===
export interface IRoom extends RoomChest {
	chat: IChat;
	addUser<ID extends UserId>(user: IUser<ID>): void;
	delUser<ID extends UserId>(user: IUser<ID>): boolean;
	hasUser<ID extends UserId>(user: IUser<ID>): boolean;
	getUserById<ID extends UserId>(userId: ID): IUser<ID> | undefined;
	getUserIdList(): UserId[];
}

type RoomConstructor = new () => IRoom;

export const Room: RoomConstructor = function (): IRoom {
	const chest: RoomChest = new ListenerChest();

	const chat: IRoom['chat'] = new Chat();
	const userMap: Map<UserId, IUser<UserId>> = new Map();

	const addUser: IRoom['addUser'] = function (user) {
		const userId = user.getId();

		if (userMap.has(userId)) return;
		userMap.set(userId, user);

		chest.exec(ROOM_EVENTS.ADD_USER, { userId, user });
	};
	const delUser: IRoom['delUser'] = function (user) {
		const userId = user.getId();
		const result = userMap.delete(userId);

		result && chest.exec(ROOM_EVENTS.DEL_USER, { userId, user });
		return result;
	};
	const hasUser: IRoom['hasUser'] = function (user) {
		return userMap.has(user.getId());
	};
	const getUserById: IRoom['getUserById'] = function <ID extends UserId>(
		userId: ID
	): IUser<ID> | undefined {
		return userMap.get(userId) as IUser<ID> | undefined;
	};
	const getUserIdList: IRoom['getUserIdList'] = function () {
		return [...userMap.keys()];
	};

	return {
		...chest,
		chat,
		addUser,
		delUser,
		hasUser,
		getUserById,
		getUserIdList,
	};
} as unknown as RoomConstructor;
