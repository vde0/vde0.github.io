import { Chat } from './Chat';
import { IUser, User } from './User';

export interface IRoom {
	chat: Chat;
	userMap: Map<string, IUser<string>>;
	addUser<ID extends string>(id: ID): IUser<ID>;
	delUser<ID extends string>(id: ID): boolean;
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

	return {
		chat,
		userMap,
		addUser,
		delUser,
	};
} as unknown as RoomConstructor;
