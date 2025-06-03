import { Dict, EventMap, EventsWithoutData, Listener, ListenerDict, MethodKey } from './general';
import { doApi } from './helpers';
import { PrivateContext } from './PrivateContext';

export const WHEN_API: MethodKey<IWhen>[] = ['occur', 'when'] as const;
Object.freeze(WHEN_API);

export type IWhen<M extends EventMap = EventMap> = Dict & {
	occur<N extends EventsWithoutData<M>>(stateName: N): void;
	occur<N extends keyof M>(stateName: N, state: M[N]): void;
	when<N extends keyof M>(stateName: N, listener?: Listener<M[N]>): M[N] | undefined;
	unwhen<N extends keyof M>(stateName: N, listener: Listener<M[N]>): void;
};

const privateContext = new PrivateContext<IWhen<Dict>, PrivateProps>();

interface PrivateProps {
	stateDict: Partial<EventMap>;
	initSet: Set<any>;
	listenerDict: ListenerDict<EventMap>;
}

export class When<M extends EventMap = EventMap> implements IWhen<M> {
	[key: number]: never;
	[key: symbol]: never;
	[key: string]: unknown;

	static implementTo<W extends IWhen<Dict>>(obj: W, api: W) {
		doApi<IWhen<Dict>>(obj, api, false, WHEN_API);
	}

	constructor(stateDict: Partial<M> = {}) {
		const initSet: Set<keyof M> = new Set();
		for (let stateKey in stateDict) initSet.add(stateKey);

		privateContext.set(this, 'stateDict', stateDict);
		privateContext.set(this, 'initSet', initSet);
		privateContext.set(this, 'listenerDict', {});

		const api: MethodKey<IWhen<M>> = 'occur';
		this[api as MethodKey<IWhen<M>>];

		doApi<IWhen<M>>(this, this, true, WHEN_API);
	}

	occur<N extends EventsWithoutData<M>>(stateName: N): void;
	occur<N extends keyof M>(stateName: N, state: M[N]): void;
	occur<N extends keyof M>(stateName: N, state?: M[N]): void {
		const listenerDict: ListenerDict<M> = privateContext.get(this, 'listenerDict')!;
		const stateDict: Partial<M> = privateContext.get(this, 'stateDict')! as any;
		const initSet: Set<keyof M> = privateContext.get(this, 'initSet')!;

		if (state !== undefined) stateDict[stateName] = state;

		if (!initSet.has(stateName)) {
			initSet.add(stateName);
			listenerDict[stateName]?.forEach((listener) => listener(state as M[N]));
			delete listenerDict[stateName];
		}
	}

	when<N extends keyof M>(stateName: N, listener?: Listener<M[N]>): M[N] | undefined {
		const listenerDict: ListenerDict<M> = privateContext.get(this, 'listenerDict')!;
		const stateDict: Partial<M> = privateContext.get(this, 'stateDict')! as any;
		const initSet: Set<keyof M> = privateContext.get(this, 'initSet')!;

		if (!listener) return stateDict[stateName];

		if (initSet.has(stateName)) listener(stateDict[stateName]!);
		else {
			listenerDict[stateName] ??= new Set();
			listenerDict[stateName].add(listener);
		}

		return stateDict[stateName];
	}

	unwhen<N extends keyof M>(stateName: N, listener: Listener<M[N]>): void {
		const listenerDict: ListenerDict<M> = privateContext.get(this, 'listenerDict')!;
		if (!listenerDict[stateName]) return;

		listenerDict[stateName].delete(listener);
		listenerDict[stateName].size === 0 && delete listenerDict[stateName];
	}
}
