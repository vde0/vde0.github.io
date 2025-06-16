import { EventKeys, EventWithoutData, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { LowercaseMap, Unsplit, UpperSnakeCase } from '@types';

export type IntentAction = keyof IntentActionMap;
export type IntentActionMap = LowercaseMap<OrigIntentActionMap>;
type OrigIntentActionMap = {
	next: undefined;
	toggleChat: boolean;
	addUser: undefined; // TODO
	startApp: undefined;
};

type LocalIntentChest = IListenerChest<IntentActionMap>;
type Denied = 'exec' | 'offAll';

export const intentChest: Omit<LocalIntentChest, Denied> = new ListenerChest();
const orig: Partial<{ [D in Denied]: LocalIntentChest[D] }> = {};

denie('exec');
denie('offAll');

export const INTENT_ACTIONS: EventKeys<keyof OrigIntentActionMap> = {
	NEXT: 'next',
	TOGGLE_CHAT: 'togglechat',
	ADD_USER: 'adduser',
	START_APP: 'startapp',
};

export const DO_INTENT: {
	[I in keyof IntentActionMap as Lowercase<I>]: I extends EventWithoutData<IntentActionMap>
		? (data?: IntentActionMap[I]) => void
		: (data: IntentActionMap[I]) => void;
} = (() => {
	const result: typeof DO_INTENT = {} as typeof DO_INTENT;
	Object.values(INTENT_ACTIONS).forEach((intentName) => {
		result[intentName] = (payload) => {
			orig.exec!(intentName, payload);
		};
	});
	return result;
})();

function denie<P extends Denied>(prop: P): void {
	(orig[prop] as any) = (intentChest as LocalIntentChest)[prop].bind(
		intentChest as LocalIntentChest
	);
	(intentChest as LocalIntentChest)[prop] = new Proxy((intentChest as LocalIntentChest)[prop], {
		apply() {
			throw Error('Denied access for call of intentChest.' + prop);
		},
	});
}
