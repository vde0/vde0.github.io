import { IListenerChest, Listener, ListenerChest } from '@lib/pprinter-tools';

let chest: IListenerChest<{ start: undefined }> | null = new ListenerChest();

let state: 'idle' | 'started' = 'idle';

export const start = (): void => {
	if (state !== 'idle') return;
	state = 'started';
	chest!.exec('start');
	chest = null;
};
export const onStart = (listener: Listener<undefined>): void => {
	state === 'idle' && chest!.once('start', listener);
};
export const getStarted = (): boolean => state === 'started';
