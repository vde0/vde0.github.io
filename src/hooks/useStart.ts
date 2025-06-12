import { EventWithData } from '@lib/pprinter-tools';
import { intentChest, IntentEventMap } from '@services/intents';
import { useEffect, useState } from 'react';

type StartApp = 'startApp';

type UseStart = (
	startAppHandler: StartApp extends EventWithData<IntentEventMap>
		? (payload: IntentEventMap['startApp']) => void
		: () => void
) => void;

export const useStart: UseStart = (startAppHandler) => {
	useEffect(() => {
		intentChest.on('startapp', startAppHandler);
		return () => intentChest.off('startapp', startAppHandler);
	}, []);
};
