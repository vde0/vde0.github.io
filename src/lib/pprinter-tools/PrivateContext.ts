import { DefaultPrivateProps } from './general';
import { checkForPropertyKey } from './helpers';

// === INTERFACE ===
export interface IPrivateContext<O extends object, P extends DefaultPrivateProps> {
	set<K extends keyof P>(obj: O, prop: K, value: P[K]): void;
	set<K extends keyof P>(obj: O, props: { [J in K]?: P[J] }): void;
	get<K extends keyof P>(obj: O, prop: K): P[K] | undefined;
	get<K extends keyof P>(obj: O, propNames: K[]): { [J in K]?: P[J] };
	get(obj: O): Partial<P>;
	has<K extends keyof P>(obj: O, prop: K): boolean;
	delete<K extends keyof P>(obj: O, prop: K): boolean;
}

// === PRIVATE DATA ===
const context = new WeakMap<object, DefaultPrivateProps>();

// === Make-util OF FABRIC PATTERN ===
export class PrivateContext<O extends object, P extends DefaultPrivateProps = DefaultPrivateProps>
	implements IPrivateContext<O, P>
{
	// === API OBJECT ===
	set<K extends keyof P>(obj: O, prop: K, value: P[K]): void;
	set<K extends keyof P>(obj: O, props: { [J in K]?: P[J] }): void;
	set<K extends keyof P>(obj: O, propOrProps: K | { [J in K]?: P[J] }, value?: P[K]): void {
		if (!context.has(obj)) context.set(obj, {});
		const privatePlace = context.get(obj)!;

		const [prop, props] = [propOrProps, propOrProps];

		if (checkForPropertyKey(prop)) {
			if (value === undefined) throw Error("'value' arg is undefined");

			if (typeof value === 'function') value = value.bind(obj);
			privatePlace[prop as PropertyKey] = value;
			return;
		}
		if (typeof props === 'object') {
			for (let methodName in props) {
				if (typeof props[methodName] === 'function') {
					props[methodName] = props[methodName].bind(obj);
				}
			}

			Object.assign(privatePlace, props);
			return;
		}
	}
	get<K extends keyof P>(obj: O, prop: K): P[K] | undefined;
	get<K extends keyof P>(obj: O, propNames: K[]): { [J in K]?: P[J] };
	get(obj: O): Partial<P>;
	get<K extends keyof P>(
		obj: O,
		propOrPropNames?: K | K[]
	): P | P[K] | { [J in K]?: P[J] } | undefined {
		const privatePlace: Partial<P> | undefined = context.get(obj);
		if (!privatePlace) throw Error("'obj' did not set for its PrivateContext");

		const [prop, propNames] = [propOrPropNames, propOrPropNames];

		if (typeof propOrPropNames === 'undefined') return { ...privatePlace };
		if (checkForPropertyKey(prop)) return privatePlace[prop as PropertyKey];
		if (typeof propNames === 'object') {
			if (!Array.isArray(propNames)) throw Error("'propNames' arg must be array");

			const result: { [J in K]?: P[J] } = {};
			propNames.forEach((propName) => (result[propName] = privatePlace[propName]));
			return result;
		}

		throw TypeError(
			`'prop' (string) or 'propNames' (string[]) arg: ${typeof propOrPropNames} has incorrect type`
		);
	}
	has<K extends keyof P>(obj: O, prop: K): boolean {
		const privatePlace = context.get(obj);
		return privatePlace ? prop in privatePlace : false;
	}
	delete<K extends keyof P>(obj: O, prop: K): boolean {
		const privatePlace = context.get(obj);
		if (!privatePlace) return false;
		return delete privatePlace[prop];
	}
}
