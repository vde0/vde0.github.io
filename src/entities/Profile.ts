import { v4 as uuidv4 } from 'uuid';
import { IRoom, Room, ROOM_EVENTS } from './Room';
import { IUser, User, UserId } from './User';
import { LowercaseMap } from '@types';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { addDebug } from '@lib/utils';

// == TYPES ==
export type ClientId = UserId;
export type Client = IUser<ClientId>;
export type CurrentRoom = IRoom;

// == EVENT SYSTEM ==
export const PROFILE_EVENTS: EventKeys<keyof OrigProfileEventMap> = {
	UPDATE_ROOM: 'updateroom',
};
Object.freeze(PROFILE_EVENTS);

type ProfileChest = IListenerChest<ProfileEventMap>;
export type ProfileEvent = keyof ProfileEventMap;
export type ProfileEventMap = LowercaseMap<OrigProfileEventMap>;
type OrigProfileEventMap = {
	updateRoom: { room: CurrentRoom };
};

// == DAEMON ==
const ID: ClientId = uuidv4();
const USER: Client = new User(ID);

addDebug('client', ID);

let room: CurrentRoom = new Room();
let chest: ProfileChest = new ListenerChest();

function makeRoom() {
	room.offAll();
	room = new Room();
	chest.exec(PROFILE_EVENTS.UPDATE_ROOM, { room });
}

chest.on(PROFILE_EVENTS.UPDATE_ROOM, ({ room }) => room.addUser(USER));
makeRoom();

export interface IProfile extends ProfileChest {
	id: ClientId;
	user: IUser<ClientId>;
	room: CurrentRoom;

	updateRoom(): void;
}

export const Profile: IProfile = {
	...chest,
	get id() {
		return ID;
	},
	get user() {
		return USER;
	},
	get room() {
		return room;
	},

	updateRoom() {
		makeRoom();
	},
};
