import { Chat, IChat } from './Chat';
import { IUser, User, UserId } from './User';

export interface IRoom {
	chat: IChat;
	addUser<ID extends UserId>(id: ID): IUser<ID>;
	delUser<ID extends UserId>(id: ID): boolean;
	getUser<ID extends UserId>(id: ID): IUser<ID> | undefined;
	hasUser<ID extends UserId>(id: ID): boolean;
}

type RoomConstructor = new () => IRoom;

export const Room: RoomConstructor = function (): IRoom {
	const chat: IRoom['chat'] = new Chat();
	const userMap: Map<UserId, IUser<UserId>> = new Map();

	const addUser: IRoom['addUser'] = function (id) {
		const user = new User(id);
		userMap.set(id, user);
		return user;
	};
	const delUser: IRoom['delUser'] = function (id) {
		return userMap.delete(id);
	};
	const getUser: IRoom['getUser'] = function (id) {
		return userMap.get(id) as IUser<typeof id> | undefined;
	};
	const hasUser: IRoom['hasUser'] = function (id) {
		return userMap.has(id);
	};

	return {
		chat,
		addUser,
		delUser,
		getUser,
		hasUser,
	};
} as unknown as RoomConstructor;
