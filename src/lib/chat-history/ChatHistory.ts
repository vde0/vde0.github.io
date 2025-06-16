import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';

export const CHAT_HISTORY_EVENTS: EventKeys<ChatHistoryEvent> = {
	ADD: 'add',
	DELETE: 'delete',
	CLEAR: 'clear',
} as const;
Object.freeze(CHAT_HISTORY_EVENTS);

export interface MsgItem {
	text: MsgText;
	chatter: Chatter;
	read: boolean;
	toString(): string;
}
export type Chatter = Symbol | string;
export type MsgText = string;
export type MsgId = number;

export type ChatHistoryConstructor = new () => ChatHistory;
export type ChatHistory = Iterable<MsgItem> &
	IListenerChest<ChatHistoryEventMap> & {
		has(id: MsgId): boolean;
		get(id: MsgId): MsgItem | null;
		head(quant: number): MsgItem[];
		tail(quant: number): MsgItem[];
		getAll(): MsgItem[];

		add(chatter: Chatter, text: MsgText): MsgId;
		delete(id: MsgId): boolean;
		read(id: MsgId): boolean;
		clear(): void;

		length: number;
		forEach(callback: ForEachCallback): void;
		map<T = any>(callback: MapCallback<T>): T[];
	};

export type ChatHistoryEvent = keyof ChatHistoryEventMap;
export type ChatHistoryEventMap = {
	add: { item: MsgItem };
	delete: { item: MsgItem };
	clear: undefined;
};

type MapCallback<T> = (msgItem: MsgItem, msgId: MsgId, thisChatHistory: ChatHistory) => T;
type ForEachCallback = (msgItem: MsgItem, msgId: MsgId, thisChatHistory: ChatHistory) => void;

export const ChatHistory: ChatHistoryConstructor = function () {
	// === STORE ===
	const msgMap: Map<MsgId, MsgItem> = new Map();
	let thisChatHistory: ChatHistory;
	let firstMsgId: MsgId = -1;
	let lastMsgId: MsgId = -1;

	const listenerChest: IListenerChest<ChatHistoryEventMap> =
		new ListenerChest<ChatHistoryEventMap>();

	// === FUNCS 1 LVL ===
	const make = (text: MsgText, chatter: Chatter): MsgItem => ({
		text,
		chatter,
		read: false,
		toString() {
			return text;
		},
	});
	const length = (): number => msgMap.size;

	const has: ChatHistory['has'] = function (msgId) {
		return msgMap.has(msgId);
	};
	const get: ChatHistory['get'] = function (msgId) {
		return msgMap.get(msgId) ?? null;
	};

	const add: ChatHistory['add'] = function (chatter, text) {
		checkChatterType(chatter);
		checkMsgType(text);

		const item = make(text, chatter);
		msgMap.set(++lastMsgId, item);

		if (firstMsgId === -1) firstMsgId = lastMsgId;

		listenerChest.exec(CHAT_HISTORY_EVENTS.ADD, { item });
		return lastMsgId;
	};
	const remove: ChatHistory['delete'] = function (id) {
		if (typeof id !== 'number') throw TypeError('msgId must be number.');

		if (id === firstMsgId) firstMsgId = findMsgByCount(firstMsgId, 1);
		if (id === lastMsgId) lastMsgId = findMsgByCount(lastMsgId, -1);

		const item = msgMap.get(id);
		const result = msgMap.delete(id);

		if (length() === 0) {
			firstMsgId = -1;
			lastMsgId = -1;
		}

		item && listenerChest.exec(CHAT_HISTORY_EVENTS.DELETE, { item });
		return result;
	};
	const read: ChatHistory['read'] = function (id) {
		if (!msgMap.has(id) || msgMap.get(id)!['read']) return false;

		msgMap.get(id)!['read'] = true;
		return true;
	};
	const clear: ChatHistory['clear'] = function () {
		msgMap.clear();
		listenerChest.exec(CHAT_HISTORY_EVENTS.CLEAR);
	};

	// === ITERATORS ===
	function* msgIdIterator(start: MsgId, quant: number): Generator<MsgId> {
		if (!has(start)) return;

		const msgArr: MsgId[] = Array.from(msgMap.keys());

		const changer: number = quant > -1 ? +1 : -1;
		let curIndex: number | undefined = msgArr.find((id) => id === start);
		let count: number = Math.abs(quant);

		if (typeof curIndex === 'undefined') return;

		while (count > 0 && curIndex >= 0 && curIndex <= msgArr.length - 1) {
			yield msgArr[curIndex];
			curIndex += changer;

			count--;
		}
	}
	function* msgItemIterator(start: MsgId, quant: number): Generator<MsgItem> {
		if (!has(start)) return;

		const iterator1lvl: Iterator<MsgId> = msgIdIterator(start, quant);
		while (true) {
			const state: IteratorResult<MsgId> = iterator1lvl.next();
			if (state.done) break;
			yield get(state.value)!;
		}
	}

	// === FUNCS 2 LVL ===
	const findMsgByCount = (start: MsgId, count: number): MsgId => {
		if (!checkStartArg(start)) return -1;

		let result: MsgId = -1;
		for (let msgId of msgIdIterator(start, count)) result = msgId;

		return result;
	};
	const forEach = (
		callback: ForEachCallback,
		start: MsgId = firstMsgId,
		quant: number = length()
	): void => {
		checkStartArg(start);

		for (let msgId of msgIdIterator(start, quant)) {
			callback(get(msgId)!, msgId, thisChatHistory);
		}
	};
	const map = <T>(
		callback: MapCallback<T>,
		start: MsgId = firstMsgId,
		quant: number = length()
	): T[] => {
		if (!checkStartArg(start)) return [];

		const result: T[] = [];
		forEach((...args) => result.push(callback(...args)), start, quant);
		return result;
	};

	// === HELPERS ===
	function checkStartArg(start: MsgId): boolean {
		if (!has(start)) return false;
		return true;
	}

	// === RESULT INSTANCE ===
	const instance: ChatHistory = {
		...listenerChest,

		add,
		delete: remove,
		read,
		clear,

		has,
		get,

		getAll() {
			return map<MsgItem>((msgItem) => msgItem);
		},
		head(quant) {
			return map<MsgItem>((msgItem) => msgItem, firstMsgId, quant);
		},
		tail(quant) {
			return map<MsgItem>((msgItem) => msgItem, findMsgByCount(lastMsgId, -quant), quant);
		},

		get length() {
			return length();
		},
		forEach(callback) {
			forEach(callback);
		},
		map<T = any>(callback: MapCallback<T>) {
			return map<T>(callback);
		},
		[Symbol.iterator]() {
			return msgItemIterator(firstMsgId, length());
		},
	};
	Object.freeze(instance);
	thisChatHistory = instance;

	return instance;
} as unknown as ChatHistoryConstructor;

// === HELPERS ===
export function checkChatterType(chatter: Chatter): void {
	if (typeof chatter !== 'string' && typeof chatter !== 'symbol')
		throw TypeError('chatter must be string or Symbol.');
}
export function checkMsgType(msg: MsgText): void {
	if (typeof msg !== 'string') throw TypeError('msg must be string.');
}
