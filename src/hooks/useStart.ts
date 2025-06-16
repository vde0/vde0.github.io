import { EventWithData } from '@lib/pprinter-tools';
import { intentChest, IntentActionMap, INTENT_ACTIONS } from '@services/intents';
import { useEffect } from 'react';

type StartApp = typeof INTENT_ACTIONS.START_APP;

type UseStart = (
	startAppHandler: StartApp extends EventWithData<IntentActionMap>
		? (payload: IntentActionMap[StartApp]) => void
		: () => void
) => void;

export const useStart: UseStart = (startAppHandler) => {
	useEffect(() => {
		intentChest.on(INTENT_ACTIONS.START_APP, startAppHandler);
		return () => intentChest.off(INTENT_ACTIONS.START_APP, startAppHandler);
	}, []);
};
