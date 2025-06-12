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

// == API ==
const getAccess = (): boolean => state === 'access';
const set = accessor.set.bind(accessor);
const when = whenAccess.when.bind(whenAccess, 'ready');

export const appAcessor = {
	getAccess,
	set,
	when,
} as const;
