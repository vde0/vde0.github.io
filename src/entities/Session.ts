import { Connection } from './Connection';
import { chatPeerBridge, Destroy } from './helpers';
import { Profile } from './Profile';
import { IRoom, Room } from './Room';
import { Signal } from './Signal';

// === DATA ===
let destroyChatPeerBridge: Destroy | null = null;

// === API ===
const CLIENT: ISession['client'] = Profile.id;

let target: ISession['target'] = null;
let connection: ISession['connection'] = null;
let room: ISession['room'];

const findTarget: ISession['findTarget'] = function () {
	Signal.exec('relaytarget', { target: CLIENT });
	Signal.once('accepttarget', ({ target: userId, offer }) => {
		destroyChatPeerBridge?.();
		createRoom();

		target = userId;
		connection = new Connection(target);
		destroyChatPeerBridge = chatPeerBridge(room.chat, connection.getPeer());

		if (offer) connection.connect();
	});
};

// === EXEC ===
createRoom();

// === HELPERS ===
function createRoom() {
	room = new Room();
	room.addUser(CLIENT);
}

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
