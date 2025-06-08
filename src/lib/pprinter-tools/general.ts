import { Dict, Unsplit, UpperSnakeCase } from '@types';

export type DefaultPrivateProps = { [PK in PropertyKey]: any };

export type ListenerDict<M extends Dict> = {
	[E in keyof M]?: Set<Listener<M[E]>>;
};
export type Listener<D> = (data: D) => void;

export type EventsWithData<M extends Dict> = {
	[E in keyof M]: M[E] extends undefined ? never : E;
}[keyof M];

export type EventsWithoutData<M extends Dict> = {
	[E in keyof M]: M[E] extends undefined ? E : never;
}[keyof M];
export type EventKeys<U extends string> = { [K in UpperSnakeCase<U>]: Lowercase<Unsplit<K>> };
