import { Dict, KnownKeys, Unsplit, UpperSnakeCase } from '@types';

export type DefaultPrivateProps = { [PK in PropertyKey]: any };

export type ListenerDict<M extends Dict> = KnownKeys<{
	[E in keyof M]?: Set<Listener<M[E]>>;
}>;
export type Listener<D> = (data: D) => void;

export type EventsWithData<M extends Dict> = KnownKeys<{
	[E in keyof M]: M[E] extends undefined ? never : E;
}> extends infer R
	? R[keyof R]
	: never;

export type EventsWithoutData<M extends Dict> = {
	[E in keyof M]: M[E] extends undefined ? E : never;
} extends infer R
	? R[keyof R]
	: never;

export type EventKeys<U extends string> = { [K in UpperSnakeCase<U>]: Lowercase<Unsplit<K>> };
