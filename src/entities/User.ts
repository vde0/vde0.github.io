export interface IUser<ID extends string> {
	getId(): ID;
	setMedia(media: MediaStream | null): void;
	getMedia(): MediaStream | null;
}

type UserConstructor = new <ID extends string>(id: ID) => IUser<ID>;

export const User: UserConstructor = function <ID extends string>(id: ID): IUser<ID> {
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
