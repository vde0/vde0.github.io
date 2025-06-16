import { Chat, IChat } from './Chat';
import { IUser, User, UserId } from './User';

export interface IRoom {
	chat: IChat;
	userMap: Map<UserId, IUser<UserId>>;
	addUser<ID extends UserId>(id: ID): IUser<ID>;
	delUser<ID extends UserId>(id: ID): boolean;
	getUser<ID extends UserId>(id: ID): IUser<ID> | undefined;
}

type RoomConstructor = new () => IRoom;

export const Room: RoomConstructor = function (): IRoom {
	const chat: IRoom['chat'] = new Chat();
	const userMap: IRoom['userMap'] = new Map();

	const addUser: IRoom['addUser'] = function (id) {
		return new User(id);
	};
	const delUser: IRoom['delUser'] = function (id) {
		return userMap.delete(id);
	};
	const getUser: IRoom['getUser'] = function (id) {
		return userMap.get(id) as IUser<typeof id> | undefined;
	};

	return {
		chat,
		userMap,
		addUser,
		delUser,
		getUser,
	};
} as unknown as RoomConstructor;
