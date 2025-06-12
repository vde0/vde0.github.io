import { Dict, LowercaseMap, MethodKey } from '@types';
import { EventWithoutData, Listener, ListenerDict } from './general';
import { doApi } from './helpers';
import { PrivateContext } from './PrivateContext';

export const LISTENER_CHEST_API: MethodKey<IListenerChest>[] = [
	'on',
	'off',
	'once',
	'offAll',
	'exec',
] as const;
Object.freeze(LISTENER_CHEST_API);

// === TYPES ===
export type IListenerChest<M extends Dict<LowercaseMap<M>> = {}> = {
	on<E extends keyof M>(event: E, listener: Listener<M[E]>): void;
	off<E extends keyof M>(event: E, listener: Listener<M[E]>): void;
	once<E extends keyof M>(event: E, listener: Listener<M[E]>): void;
	offAll(): void;
	exec<E extends keyof M>(event: E, data: M[E]): void;
	exec<E extends EventWithoutData<M>>(event: E): void;
};

// === PRIVATE CONTEXT ===
const privateContext = new PrivateContext<IListenerChest<{}>, PrivateProps>();

interface PrivateProps {
	onceSet: Set<Listener<unknown>>;
	listenerDict: ListenerDict<{}>;
}

// === CLASS DEFINITION ===
export class ListenerChest<M extends Dict<LowercaseMap<M>> = {}> implements IListenerChest<M> {
	static implementTo<L extends IListenerChest<Dict<{}>>>(obj: L, api: L) {
		doApi<IListenerChest>(obj, api, false, LISTENER_CHEST_API);
	}

	constructor(api?: IListenerChest<M>) {
		if (!api) {
			const privateProps: PrivateProps = {
				onceSet: new Set(),
				listenerDict: {},
			};
			privateContext.set(this, privateProps);
		}

		doApi<IListenerChest<M>>(this, api ? api : this, api ? false : true, LISTENER_CHEST_API);
	}

	// === API FRAGMENT ===
	on<E extends keyof M>(event: E, listener: Listener<M[E]>): void {
		const listenerDict: ListenerDict<M> = privateContext.get(this, 'listenerDict')!;
		if (listenerDict[event] === undefined) listenerDict[event] = new Set();
		listenerDict[event].add(listener);
	}
	off<E extends keyof M>(event: E, listener: Listener<M[E]>): void {
		const listenerDict: ListenerDict<M> = privateContext.get(this, 'listenerDict')!;
		const onceSet: Set<Listener<M[E]>> = privateContext.get(this, 'onceSet')!;

		if (listenerDict[event] === undefined) return;

		listenerDict[event].delete(listener);
		onceSet.delete(listener);

		if (listenerDict[event].size === 0) {
			delete listenerDict[event];
		}
	}
	once<E extends keyof M>(event: E, listener: Listener<M[E]>): void {
		const onceSet: Set<Listener<M[E]>> = privateContext.get(this, 'onceSet')!;

		this.on(event, listener);
		onceSet.add(listener);
	}
	offAll(): void {
		privateContext.set(this, 'listenerDict', {});
		privateContext.get(this, 'onceSet')!.clear();
	}
	exec<E extends keyof M>(event: E, data: M[E]): void;
	exec<E extends EventWithoutData<M>>(event: E): void;
	exec<E extends keyof M>(event: E, data?: M[E]): void {
		const listenerDict: ListenerDict<M> = privateContext.get(this, 'listenerDict')!;
		const onceSet: Set<Listener<M[E]>> = privateContext.get(this, 'onceSet')!;

		listenerDict[event]?.forEach((listener) => {
			listener(data as M[E]);
			if (onceSet.has(listener)) this.off(event, listener);
		});
	}
}
