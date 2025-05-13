export type DefaultPrivateProps = { [PK in PropertyKey]: any };
export type AnyDict             = {[key: string]: any};
export type UnknownDict         = {[key: string]: unknown};

export type ListenerDict    <M extends UnknownDict> = {
    [E in keyof M]?: Set< Listener<M[E]> >
};
export type Listener        <D>                     = (data: D) => void;

export type EventsWithData <M extends AnyDict> = {
    [E in keyof M]: M[E] extends undefined ? never : E;
}[keyof M];
export type EventsWithoutData <M extends AnyDict> = {
    [E in keyof M]: M[E] extends undefined ? E : never;
}[keyof M];

export type MethodKey <M extends AnyDict> = {
    [K in keyof M]: M[K] extends Function ? K : never
}[keyof M];

export type Method <M extends AnyDict> = {
    [K in keyof M]: M[K] extends Function ? M[K] : never
}[keyof M];

export type OnlyMethods <M extends AnyDict> = Pick<M, MethodKey<M>>;

export type FieldKey <M extends AnyDict> = {
    [K in keyof M]: M[K] extends Function ? never : K
}[keyof M];

export type Field <M extends AnyDict> = {
    [K in keyof M]: M[K] extends Function ? never : M[K]
}[keyof M];

export type OnlyFields <M extends AnyDict> = Pick<M, FieldKey<M>>;
