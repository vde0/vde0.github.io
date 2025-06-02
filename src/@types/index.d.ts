export type PropsWithClassName = { className?: string };
export type BasicDataStruct = { [key: string | symbol | number]: any };
export type ContentMedia = MediaStream | null;

export type IsUncapitalized<L extends string> = L extends Uncapitalize<L> ? true : false;
export type IsCapitalized<L extends string> = L extends Capitalize<L> ? true : false;
export type IsUpper<L extends string> = L extends Uppercase<L> ? true : false;
export type IsLower<L extends string> = L extends Lowercase<L> ? true : false;
export type IsEmpty<L extends string> = L extends '' ? true : false;

export type IfUncapitalized<L extends string, Then, Else> = IsUncapitalized<L> extends true
	? Then
	: Else;
export type IfCapitalized<L extends string, Then, Else> = IsCapitalized<L> extends true
	? Then
	: Else;
export type IfUpper<L extends string, Then, Else> = IsUpper<L> extends true ? Then : Else;
export type IfLower<L extends string, Then, Else> = IsLower<L> extends true ? Then : Else;
export type IfEmpty<L extends string, Then, Else> = IsEmpty<L> extends true ? Then : Else;

export type WithoutSplitters<
	L extends string,
	C extends string = '-' | '_'
> = L extends `${infer H}${infer T}`
	? H extends C
		? WithoutSplitters<Capitalize<T>>
		: `${H}${WithoutSplitters<T>}`
	: '';

export type CamelCase<S extends string> = WithoutSplitters<LowerSnakeCase<S>>;
export type PascalCase<S extends string> = Capitalize<CamelCase<S>>;

export type LowerSnakeCase<S extends string> =
	WithoutSplitters<S> extends `${infer H}${infer B}${infer T}`
		? IfUncapitalized<
				H,
				IfUncapitalized<
					B,
					IfUncapitalized<
						T,
						`${H}${B}${LowerSnakeCase<T>}`, // hbt...
						`${H}${B}_${LowerSnakeCase<T>}` // hbT...
					>,
					`${H}_${LowerSnakeCase<`${B}${T}`>}` // hBt | hBT...
				>,
				IfUncapitalized<
					B,
					IfUncapitalized<
						T,
						`${Lowercase<H>}${B}${LowerSnakeCase<T>}`, // Hbt...
						`${Lowercase<H>}${B}_${LowerSnakeCase<T>}` // HbT...
					>,
					IfUncapitalized<
						T,
						IfEmpty<
							T,
							`${Lowercase<H>}${Lowercase<B>}`, // HB
							`${Lowercase<H>}_${LowerSnakeCase<`${B}${T}`>}` // HBt... !!!
						>,
						`${Lowercase<H>}${LowerSnakeCase<`${B}${T}`>}` // HBT...
					>
				>
		  >
		: Lowercase<S>;

export type UpperSnakeCase<S extends string> = Uppercase<LowerSnakeCase<S>>;
