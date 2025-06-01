import { Accessor, When } from '@lib/pprinter-tools';

export const ACC_FLAGS = {
	LOCAL_MEDIA: 'localmedia',
	PLAY_REMOTE_VIDEO: 'playremotevideo',
} as const;
Object.freeze(ACC_FLAGS);

export const WHEN_READY_FLAG = 'ready';

let state: 'unaccess' | 'access' = 'unaccess';

const accessor = new Accessor(Object.values(ACC_FLAGS));
const whenAccess = new When<{ ready: undefined }>();

accessor.on('access', () => {
	whenAccess.occur('ready');
});

whenAccess.when('ready', () => {
	state = 'access';
});

export const getAccess = (): boolean => state === 'access';
export const set = accessor.set.bind(accessor);
export const when = whenAccess.when.bind(whenAccess, 'ready');
