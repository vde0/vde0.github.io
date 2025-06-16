export type UserId = string;
export type ContentMedia = MediaStream | null;

export interface IUser<ID extends UserId> {
	getId(): ID;
	setMedia(media: ContentMedia): void;
	getMedia(): ContentMedia;
}

type UserConstructor = new <ID extends UserId>(id: ID) => IUser<ID>;

export const User: UserConstructor = function <ID extends UserId>(id: ID): IUser<ID> {
	const chatterId: ReturnType<IUser<ID>['getId']> = id;
	let privateMedia: Parameters<IUser<ID>['setMedia']>[0] = null;

	return {
		getId() {
			return chatterId;
		},
		setMedia(media) {
			privateMedia = media;
		},
		getMedia() {
			return privateMedia;
		},
	};
} as unknown as UserConstructor;
