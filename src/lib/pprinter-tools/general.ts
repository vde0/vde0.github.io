import { Unsplit, UpperSnakeCase } from '@types';

export type DefaultPrivateProps = { [PK in PropertyKey]: any };
export type Dict<M extends Record<PropertyKey, any> = Record<PropertyKey, any>> = M & {
	[key: string]: unknown;
	[key: number | symbol]: never;
};

export type EventMap<M extends Dict = Dict> = Dict & {
	[K in keyof M as Lowercase<K & string>]: M[K];
};

export type ListenerDict<M extends EventMap> = {
	[E in keyof M]?: Set<Listener<M[E]>>;
};
export type Listener<D> = (data: D) => void;

export type EventsWithData<M extends EventMap> = {
	[E in keyof M]: M[E] extends undefined ? never : E;
}[keyof M];
export type EventsWithoutData<M extends EventMap> = {
	[E in keyof M]: M[E] extends undefined ? E : never;
}[keyof M];

export type EventKeys<U extends string> = { [K in UpperSnakeCase<U>]: Lowercase<Unsplit<K>> };

export type MethodKey<M extends Dict> = {
	[K in keyof M]: M[K] extends Function ? K : never;
}[keyof M];

export type Method<M extends Dict> = {
	[K in keyof M]: M[K] extends Function ? M[K] : never;
}[keyof M];

export type OnlyMethods<M extends Dict> = Pick<M, MethodKey<M>>;

export type FieldKey<M extends Dict> = {
	[K in keyof M]: M[K] extends Function ? never : K;
}[keyof M];

export type Field<M extends Dict> = {
	[K in keyof M]: M[K] extends Function ? never : M[K];
}[keyof M];

export type OnlyFields<M extends Dict> = Pick<M, FieldKey<M>>;
