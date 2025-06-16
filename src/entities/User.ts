import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { LowercaseMap } from '@types';

// === EVENT SYSTEM ===
export const USER_EVENTS: EventKeys<keyof OrigUserEventMap> = {
	MEDIA: 'media',
};
Object.freeze(USER_EVENTS);

type UserListenerChest = IListenerChest<UserEventMap>;

export type UserEvent = keyof UserEventMap;
export type UserEventMap = LowercaseMap<OrigUserEventMap>;
type OrigUserEventMap = {
	media: { userId: UserId; media: ContentMedia };
};

// === USER INTERFACE ===
export interface IUser<ID extends UserId> extends UserListenerChest {
	getId(): ID;
	setMedia(media: ContentMedia): void;
	getMedia(): ContentMedia;
}

type UserConstructor = new <ID extends UserId>(id: ID) => IUser<ID>;

export type UserId = string;
export type ContentMedia = MediaStream | null;

export const User: UserConstructor = function <ID extends UserId>(userId: ID): IUser<ID> {
	let privateMedia: Parameters<IUser<ID>['setMedia']>[0] = null;

	const chest: IListenerChest<UserEventMap> = new ListenerChest();

	return {
		...chest,
		getId() {
			return userId;
		},
		setMedia(media) {
			privateMedia = media;
			chest.exec('media', { media, userId });
		},
		getMedia() {
			return privateMedia;
		},
	};
} as unknown as UserConstructor;
