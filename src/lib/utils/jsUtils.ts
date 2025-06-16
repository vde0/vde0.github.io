import { Listener } from '@lib/pprinter-tools';
import { BasicDataStruct, Dict, UnknownDict } from '@types';

export type Options = {
	copyDict?: boolean;
	copyArray?: boolean;
	depth?: number;
	underGround?: boolean;
};

export function deepCopyDict<D extends {}>(
	dict: D,
	{ copyDict = true, copyArray = false, depth = 3, underGround = false }: Options = {}
): BasicDataStruct {
	return deepCopy<D>(dict, { copyDict, copyArray, depth, underGround });
}
export function deepCopyArr<A extends any[]>(
	arr: A,
	{ copyDict = false, copyArray = true, depth = 3, underGround = false }: Options = {}
): BasicDataStruct {
	return deepCopy<A>(arr, { copyDict, copyArray, depth, underGround });
}

export function deepCopy<T extends BasicDataStruct>(
	obj: T,
	{ copyDict = true, copyArray = true, depth = 3, underGround = false }: Options = {},
	memo: Map<BasicDataStruct, BasicDataStruct> = new Map()
): BasicDataStruct {
	const isArray: boolean = Array.isArray(obj);

	// Depth Checking
	// if -1 -> Full depth
	if (depth === 0) {
		if (underGround) return obj;
		return isArray ? [] : {};
	}

	// Memo Checking
	if (memo.has(obj)) return memo.get(obj) as T;

	// Check for ban to copy the Object type
	if ((isArray && !copyArray) || (!isArray && !copyDict)) return obj;

	const resultObj: BasicDataStruct = isArray ? [] : {};
	memo.set(obj, resultObj);

	const options: Options = { copyArray, copyDict, depth: depth - 1, underGround };
	for (let [key, val] of Object.entries(obj)) {
		if (typeof val === 'object' && val !== null) {
			resultObj[key] = deepCopy(val, options, memo);
			continue;
		}
		resultObj[key as keyof T] = val;
	}

	return resultObj;
}

export const wait = async (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export function addDebug(prop: string, val: any) {
	if (!window.debug) window.debug = {};
	window.debug[prop] = val;
}

export function once(callback: CallableFunction): () => boolean {
	let called = false;
	return (...args) => {
		if (called) return false;
		called = true;
		callback(...args);
		return true;
	};
}

export type ListenerCollection<M extends Dict<M>> = {
	[E in keyof M]?: Listener<M[E]>;
};

export function manageListeners<I extends Record<string, any>, M extends Dict<M> = UnknownDict>(
	master: I,
	listeners: { [E in keyof M]?: Listener<M[E]> },
	toolName: string
): void {
	if (typeof master?.[toolName] !== 'function') {
		console.error(`Method "${toolName}" is not found on:`, master);
		return;
	}
	for (let event in listeners) {
		if (typeof listeners[event] !== 'function') continue;
		master[toolName](event, listeners[event]);
	}
}
export function listen<I extends object, M extends Dict<M> = UnknownDict>(
	master: I,
	listeners: { [E in keyof M]?: Listener<M[E]> },
	toolName: string = 'on'
): void {
	manageListeners(master, listeners, toolName);
}
export function listenOnce<I extends object, M extends Dict<M> = UnknownDict>(
	master: I,
	listeners: { [E in keyof M]?: Listener<M[E]> },
	toolName: string = 'once'
): void {
	manageListeners(master, listeners, toolName);
}
export function unlisten<I extends object, M extends Dict<M> = UnknownDict>(
	master: I,
	listeners: { [E in keyof M]?: Listener<M[E]> },
	toolName: string = 'off'
): void {
	manageListeners(master, listeners, toolName);
}
