import { Connection } from './Connection';
import { DuoChatUnit } from './DuoChatUnit';

export interface IRoom {
	chatUnit: DuoChatUnit;
	connection: Connection;
}

type RoomConstructor = new () => IRoom;

export const Room: RoomConstructor = function (): IRoom {
	const chatUnit = new DuoChatUnit();
	const connection = new Connection();

	return {
		chatUnit,
		connection,
	};
} as unknown as RoomConstructor;
