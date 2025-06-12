import { Dict, Unsplit, UpperSnakeCase } from '@types';

export type DefaultPrivateProps = { [PK in PropertyKey]: any };

export type ListenerDict<M extends Dict<M>> = {
	[E in keyof M]?: Set<Listener<M[E]>>;
};
export type Listener<D> = (data: D) => void;

export type NonPayload = undefined | null | void;

export type EventWithData<M extends Dict<M>> = {
	[E in keyof M]: M[E] extends NonPayload ? never : E;
}[keyof M];

export type EventWithoutData<M extends Dict<M>> = {
	[E in keyof M]: M[E] extends NonPayload ? E : never;
}[keyof M];
export type EventKeys<U extends string> = { [K in UpperSnakeCase<U>]: Lowercase<Unsplit<K>> };

export type StateGraph<M extends Dict<M>> = {
	[S in keyof M]: (keyof M)[];
};

export type StateMap<M extends Dict<M>> = {
	[S in keyof M]?: M[S] extends string[] ? Set<M[S][number]> : never;
};

export type FinalState<M extends Dict<M>> = {
	[S in keyof M]: M[S] extends NonPayload | [] ? S : never;
}[keyof M];

export type NonFinalState<M extends Dict<M>> = {
	[S in keyof M]: M[S] extends NonPayload | [] ? never : S;
}[keyof M];
