import { LowercaseMap } from '@types';
import { Connection, CONNECTION_EVENTS, ConnectionEventMap, IConnection } from './Connection';
import { chatPeerBridge, Destroy } from './helpers';
import { Profile } from './Profile';
import { Signal } from './Signal';
import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { IUser, User, UserId } from './User';
import { addDebug, listen } from '@lib/utils';
import { PEER_EVENTS } from '@lib/webrtc';

// === TYPES ==
export type TargetId = UserId | null;
export type Target = IUser<UserId> | null;
export type SessionConnection = IConnection | null;
export type SessionNext = () => void;

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
		targetId: TargetId;
		target: Target;
		connection: SessionConnection;
	};
};

// === DATA ===
let destroyChatPeerBridge: Destroy;

// === API ===
let targetId: TargetId = null;
let target: Target = null;
let connection: SessionConnection = null;

addDebug('target', targetId);

const next: SessionNext = function () {
	connection?.close();

	targetId = null;
	connection = null;

	// Emit
	chest.exec('nexttarget', { targetId, target, connection });
	Signal.exec('relaytarget', { target: Profile.id });

	// Listen
	Signal.once('accepttarget', ({ target: userId, offer }) => {
		targetId = userId;
		target = new User(targetId);

		const media = Profile.user.getMedia();
		if (!media) throw Error('Client Media is not found');
		connection = new Connection({ target: targetId, offer }, media);

		Profile.room.addUser(target);
		connection.getPeer().on(PEER_EVENTS.MEDIA, ({ media }) => target?.setMedia(media));

		destroyChatPeerBridge = chatPeerBridge({
			clientId: Profile.id,
			target: targetId,
			chat: Profile.room.chat,
			peer: connection.getPeer(),
		});

		listen<IConnection, ConnectionEventMap>(connection, {
			[CONNECTION_EVENTS.STATE_UPDATED]: ({ state }) => {
				if (!target) throw Error("'target' in not found");
				console.log('CONNECTION STATE', state);
				if (state === 'closed') {
					destroyChatPeerBridge();
				}
				if (state === 'connected') {
					target.setMedia;
				}
			},
			[CONNECTION_EVENTS.PEER_UPDATER]: ({ peer }) => {
				if (!targetId) throw Error("'targetId' in not found");
				if (!connection) throw Error("'connection' in not found");
				destroyChatPeerBridge();
				destroyChatPeerBridge = chatPeerBridge({
					clientId: Profile.id,
					target: targetId,
					chat: Profile.room.chat,
					peer,
				});
				connection.getPeer().on(PEER_EVENTS.MEDIA, ({ media }) => target?.setMedia(media));
			},
		});

		connection.connect();
		addDebug('target', targetId);
		chest.exec('nexttarget', { targetId, target, connection });
	});
};

// === DEFINE SESSION AND ITS INTERFACE
export interface ISession extends SessionListenerChest {
	targetId: TargetId;
	target: Target;

	connection: SessionConnection;

	next: SessionNext;
}

export const Session: ISession = {
	...chest,

	get targetId() {
		return targetId;
	},
	get target() {
		return target;
	},

	get connection() {
		return connection;
	},

	next,
};
