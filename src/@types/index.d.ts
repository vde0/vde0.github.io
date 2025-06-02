export type PropsWithClassName = { className?: string };
export type BasicDataStruct = { [key: string | symbol | number]: any };
export type ContentMedia = MediaStream | null;

export type IsUncapitalized<L extends string> = L extends Uncapitalize<L> ? true : false;
export type IsCapitalized<L extends string> = L extends Capitalize<L> ? true : false;
export type IsUpper<L extends string> = L extends Uppercase<L> ? true : false;
export type IsLower<L extends string> = L extends Lowercase<L> ? true : false;
export type IsEmpty<L extends string> = L extends '' ? true : false;

export type Prefix<L extends string, C extends string> = `${C}${L}`;
export type Suffix<L extends string, C extends string> = `${L}${C}`;

export type IfUncapitalized<L extends string, Then, Else> = IsUncapitalized<L> extends true
	? Then
	: Else;
export type IfCapitalized<L extends string, Then, Else> = IsCapitalized<L> extends true
	? Then
	: Else;
export type IfUpper<L extends string, Then, Else> = IsUpper<L> extends true ? Then : Else;
export type IfLower<L extends string, Then, Else> = IsLower<L> extends true ? Then : Else;
export type IfEmpty<L extends string, Then, Else> = IsEmpty<L> extends true ? Then : Else;

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
export type Split<L extends String, C extends string = DefaultSplitter> = L extends string
	? Unsplit<L, C & DefaultSplitter> extends `${infer H}${infer B}${infer T}`
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
		: L
	: never; // '' | length = 1

export type CamelCase<S extends string> = Unsplit<LowerSnakeCase<S>>;
export type PascalCase<S extends string> = Capitalize<CamelCase<S>>;

export type LowerSnakeCase<S extends string> = Lowercase<Split<S, '_'>>;

export type UpperSnakeCase<S extends string> = Uppercase<Split<S, '_'>>;
