import { LowercaseMap } from '@types';
import { Connection, IConnection } from './Connection';
import { chatPeerBridge, Destroy } from './helpers';
import { Profile } from './Profile';
import { IRoom, Room } from './Room';
import { Signal } from './Signal';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { UserId } from './User';

export type Client = UserId;
export type Target = UserId | null;

// === EVENT SYSTEM ===
const chest: SessionListenerChest = new ListenerChest();
export const SESSION_EVENTS: EventKeys<keyof OrigSessionEventMap> = {
	NEXT_TARGET: 'nexttarget',
};

type SessionListenerChest = IListenerChest<SessionEventMap>;

export type SessionEvent = keyof SessionEventMap;
export type SessionEventMap = LowercaseMap<OrigSessionEventMap>;
type OrigSessionEventMap = {
	nextTarget: {
		target: ISession['target'];
		connection: ISession['connection'];
		room: ISession['room'];
	};
};

// === DATA ===
let destroyChatPeerBridge: Destroy | null = null;

// === API ===
const CLIENT: ISession['client'] = Profile.id;

let target: ISession['target'] = null;
let connection: ISession['connection'] = null;
let room: ISession['room'];

const findTarget: ISession['findTarget'] = function () {
	destroyChatPeerBridge?.();

	target = null;
	connection = null;
	createRoom();

	// Emit
	chest.exec('nexttarget', { target, connection, room });
	Signal.exec('relaytarget', { target: CLIENT });

	// Listen
	Signal.once('accepttarget', ({ target: userId, offer }) => {
		target = userId;
		connection = new Connection(target);
		destroyChatPeerBridge = chatPeerBridge({
			client: CLIENT,
			target,
			chat: room.chat,
			peer: connection.getPeer(),
		});

		if (offer) connection.connect();
		chest.exec('nexttarget', { target, connection, room });
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
export interface ISession extends SessionListenerChest {
	client: Client;
	target: Target;
	connection: IConnection | null;
	room: IRoom;
	findTarget(): void;
}

export const Session: ISession = {
	...chest,
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
