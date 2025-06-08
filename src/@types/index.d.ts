export type PropsWithClassName = { className?: string };
export type BasicDataStruct = { [key: string | symbol | number]: any };
export type ContentMedia = MediaStream | null;

export type IsUncapitalized<L extends string> = Uncapitalize<L> extends L ? true : false;
export type IsCapitalized<L extends string> = Capitalize<L> extends L ? true : false;
export type IsUppercased<L extends string> = Uppercase<L> extends L ? true : false;
export type IsLowercased<L extends string> = Lowercase<L> extends L ? true : false;
export type IsEmpty<L extends string> = L extends '' ? true : false;

export type Cond<T extends boolean, Then = never, Else = never> = T extends true ? Then : Else;

export type Prefix<L extends string, C extends string> = `${C}${L}`;
export type Suffix<L extends string, C extends string> = `${L}${C}`;

export type IfUncapitalized<L extends string, Then = never, Else = never> = Cond<
	IsUncapitalized<L>,
	Then,
	Else
>;
export type IfCapitalized<L extends string, Then = never, Else = never> = Cond<
	IsCapitalized<L>,
	Then,
	Else
>;
export type IfUppercased<L extends string, Then = never, Else = never> = Cond<
	IsUppercased<L>,
	Then,
	Else
>;
export type IfLowercased<L extends string, Then = never, Else = never> = Cond<
	IsLowercased<L>,
	Then,
	Else
>;
export type IfEmpty<L extends string, Then = never, Else = never> = Cond<IsEmpty<L>, Then, Else>;

export type DefaultSplitter = '-' | '_' | '+' | '=' | ' ' | ',' | '.' | ':' | '|' | '	';

export type Unsplit<
	L extends string,
	C extends string = DefaultSplitter
> = L extends `${infer H}${infer T}`
	? H extends C
		? Unsplit<Capitalize<T>, C>
		: `${H}${Unsplit<T, C>}`
	: '';

/**
 * There are HBT branches of the string L, where each part can be capitalized or uncapitalized.
 * Before splitting, all possible splitters are removed from the string.
 *
 * H contains 1 symbol, B contains 1 symbol, and T is the rest of the string.
 * If T is equal to '', then we consider only the HB branch.
 * In that case, we only handle the final 2 characters.
 *
 * If T is not empty (HBT branch), then recursion is applied via Split<> until we reach the final HB.
 * Each recursion step is called a Step, and each Step handles exactly 1 symbol.
 * The splitter C is added only after the H part.
 * The splitting operation is called Split (without <>).
 *
 * Therefore, and since T is additional, the main decision point is B (in HBT).
 *
 * In the HB branch (T is empty):
 *   - If H is uncapitalized and B is capitalized → Split inserts C between H and B.
 *   - Otherwise → return HB as-is.
 *
 * In the HBT branch (T is not empty):
 *   - If B is uncapitalized → Step continues without splitting.
 *   - If H is uncapitalized and B is capitalized → Split and Step.
 *   - If H and B are capitalized, but T starts uncapitalized → Split and Step.
 *   - If H, B, and T are all capitalized → Step continues without splitting.
 */
export type Split<L extends string, C extends string = DefaultSplitter> = Unsplit<
	L,
	C & DefaultSplitter
> extends infer R
	? R extends `${infer H}${infer B}${infer T}`
		? IfEmpty<
				T,
				[H, B] extends [Uncapitalize<H>, Capitalize<B>]
					? `${Suffix<H, C>}${B}` // Case A: hB => h__B
					: `${H}${B}`, // Case B: hb | Hb | HB => Case B
				IfUncapitalized<
					B,
					`${H}${Split<`${B}${T}`, C>}`, // Case C: [hH] b [tT] => 1 Step by Case C
					IfUncapitalized<
						H,
						`${Suffix<H, C>}${Split<`${B}${T}`, C>}`, // Case D: hB [t/T] => h_B [t/T] and 1 Step
						IfUncapitalized<
							T,
							`${Suffix<H, C>}${Split<`${B}${T}`, C>}`, // Case E: HBt => H_Bt and 1 Step
							`${H}${Split<`${B}${T}`, C>}` // Case F: HBT => 1 Step by Case F
						>
					>
				>
		  >
		: R // '' | length = 1
	: never;

export type CamelCase<S extends string> = Unsplit<LowerSnakeCase<S>>;
export type PascalCase<S extends string> = Capitalize<CamelCase<S>>;

export type LowerSnakeCase<S extends string> = Lowercase<Split<S, '_'>>;

export type UpperSnakeCase<S extends string> = Uppercase<Split<S, '_'>>;

export type IsLowercasedMap<M extends object> = keyof M extends infer L
	? L extends keyof M
		? IfLowercased<Extract<L, string>, true, false>
		: never
	: never;

export type IfLowercasedMap<M extends object, Then = never, Else = never> = Cond<
	IsLowercasedMap<M>,
	Then,
	Else
>;

export type LowercaseMap<M extends object> = {
	[K in keyof M as K extends string ? Lowercase<K> : K]: M[K];
};

export type LowercasedMap<M extends object = {}> = IfLowercasedMap<M, M, never>;

export type Dict<M extends object = {}> = {
	[K in keyof M as K extends string ? K : never]: M[K];
} extends infer R
	? keyof R extends never
		? {
				[x: number | symbol]: never;
		  }
		: R & {
				[x: number | symbol]: never;
		  }
	: never;
export type Undict<M extends object = Record<string, unknown>> = {
	[K in keyof M as [number, M[K]] extends [K, never]
		? never
		: [symbol, M[K]] extends [K, never]
		? never
		: K]: M[K];
};

export type UnknownDict = Dict<{ [x: string]: unknown }>;
export type AnyDict = Dict<{ [x: string]: any }>;

export type IsDict<M extends object> = M extends Dict ? true : false;
export type IfDict<M extends object, Then = never, Else = never> = Cond<IsDict<M>, Then, Else>;

export type MethodKey<O extends object> = {
	[K in keyof O]: O[K] extends Function ? K : never;
}[keyof O];

export type Method<O extends object> = {
	[K in keyof O]: O[K] extends Function ? O[K] : never;
}[keyof O];

export type OnlyMethods<O extends object> = Pick<O, MethodKey<O>>;

export type FieldKey<O extends object> = {
	[K in keyof O]: O[K] extends Function ? never : K;
}[keyof O];

export type Field<O extends object> = {
	[K in keyof O]: O[K] extends Function ? never : O[K];
}[keyof O];

export type OnlyFields<O extends object> = Pick<O, FieldKey<O>>;

export type CleanPayload<M extends object> = {
	[K in keyof M as string extends K
		? never
		: number extends K
		? never
		: symbol extends K
		? never
		: K]: M[K];
};

export type KnownKeys<M extends object> = keyof CleanPayload<M>;
