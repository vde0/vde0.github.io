import { Connection } from './Connection';
import { Profile } from './Profile';
import { IRoom, Room } from './Room';

// === API ===
const CLIENT: ISession['client'] = Profile.id;

let target: ISession['target'] = null;
let connection: ISession['connection'] = null;
let room: IRoom;

async function findTarget() {
	connection = new Connection();
}

// === HELPERS ===
function createRoom() {
	room = new Room();
	room.addUser(CLIENT);
}

// === EXEC ===
createRoom();

// === DEFINE SESSION AND ITS INTERFACE
export interface ISession {
	client: string;
	target: string | null;
	connection: Connection | null;
	room: IRoom;
	findTarget(): void;
}

export const Session: ISession = {
	get client() {
		return CLIENT;
	},
	get target() {
		return target;
	},
	get connection() {
		return connection;
	},
	get room() {
		return room;
	},
	findTarget,
};
