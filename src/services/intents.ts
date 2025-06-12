import { EventKeys, EventWithoutData, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { LowercaseMap, Unsplit, UpperSnakeCase } from '@types';

export type IntentEvent = Lowercase<keyof IntentEventMap>;
export type IntentEventMap = {
	next: undefined;
	toggleChat: boolean;
	addUser: undefined; // TODO
	startApp: undefined;
	requestUserMedia: undefined;
};

type LocalIntentChest = IListenerChest<LowercaseMap<IntentEventMap>>;
type Denied = 'exec' | 'offAll';

export const intentChest: Omit<LocalIntentChest, Denied> = new ListenerChest();
const orig: Partial<{ [D in Denied]: LocalIntentChest[D] }> = {};

denie('exec');
denie('offAll');

export const INTENT_EVENTS: EventKeys<keyof IntentEventMap> = {
	NEXT: 'next',
	TOGGLE_CHAT: 'togglechat',
	ADD_USER: 'adduser',
	START_APP: 'startapp',
	REQUEST_USER_MEDIA: 'requestusermedia',
};

export const INTENTS: {
	[I in keyof IntentEventMap as Lowercase<I>]: I extends EventWithoutData<IntentEventMap>
		? (data?: IntentEventMap[I]) => void
		: (data: IntentEventMap[I]) => void;
} = (() => {
	const result: typeof INTENTS = {} as typeof INTENTS;
	Object.values(INTENT_EVENTS).forEach((intentName) => {
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
