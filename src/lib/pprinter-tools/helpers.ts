import { MethodKey } from '@types';

export function checkForPropertyKey(key: unknown): boolean {
	return typeof key === 'string' || typeof key === 'symbol' || typeof key === 'number';
}

export function doApi<A extends object>(
	target: A,
	api: A,
	bind: boolean,
	apiKeys: MethodKey<A>[]
): void {
	for (let methodName of apiKeys) {
		if (typeof api[methodName] === 'function') {
			target[methodName] = bind ? api[methodName].bind(api) : api[methodName];
		}
	}
}
