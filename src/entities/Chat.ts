import { EventKeys, IListenerChest, ListenerChest } from '@lib/pprinter-tools';
import { UserId } from './User';

export const CHAT_EVENTS: EventKeys<ChatEvent> = {
	ADD: 'add',
	DELETE: 'delete',
	CLEAR: 'clear',
} as const;
Object.freeze(CHAT_EVENTS);

export interface MsgItem {
	text: MsgText;
	userId: UserId;
	read: boolean;
	toString(): string;
}

export type MsgText = string;
export type MsgId = number;

export type ChatConstructor = new () => Chat;
export type Chat = Iterable<MsgItem> &
	IListenerChest<ChatEventMap> & {
		has(msgId: MsgId): boolean;
		get(msgId: MsgId): MsgItem | null;
		head(quant: number): MsgItem[];
		tail(quant: number): MsgItem[];
		getAll(): MsgItem[];

		add(userId: UserId, text: MsgText): MsgId;
		delete(msgId: MsgId): boolean;
		read(msgId: MsgId): boolean;
		clear(): void;

		length: number;
		forEach(callback: ForEachCallback): void;
		map<T = any>(callback: MapCallback<T>): T[];
	};

export type ChatEvent = keyof ChatEventMap;
export type ChatEventMap = {
	add: { item: MsgItem };
	delete: { item: MsgItem };
	clear: undefined;
};

type MapCallback<T> = (msgItem: MsgItem, msgId: MsgId, thisChatHistory: Chat) => T;
type ForEachCallback = (msgItem: MsgItem, msgId: MsgId, thisChatHistory: Chat) => void;

export const Chat: ChatConstructor = function () {
	// === STORE ===
	const msgMap: Map<MsgId, MsgItem> = new Map();
	let thisChat: Chat;
	let firstMsgId: MsgId = -1;
	let lastMsgId: MsgId = -1;

	const listenerChest: IListenerChest<ChatEventMap> = new ListenerChest<ChatEventMap>();

	// === FUNCS 1 LVL ===
	const make = (text: MsgText, userId: UserId): MsgItem => ({
		text,
		userId,
		read: false,
		toString() {
			return text;
		},
	});
	const length = (): number => msgMap.size;

	const has: Chat['has'] = function (msgId) {
		return msgMap.has(msgId);
	};
	const get: Chat['get'] = function (msgId) {
		return msgMap.get(msgId) ?? null;
	};

	const add: Chat['add'] = function (userId, text) {
		checkChatterType(userId);
		checkMsgType(text);

		const item = make(text, userId);
		msgMap.set(++lastMsgId, item);

		if (firstMsgId === -1) firstMsgId = lastMsgId;

		listenerChest.exec(CHAT_EVENTS.ADD, { item });
		return lastMsgId;
	};
	const remove: Chat['delete'] = function (msgId) {
		if (typeof msgId !== 'number') throw TypeError('msgId must be number.');

		if (msgId === firstMsgId) firstMsgId = findMsgByCount(firstMsgId, 1);
		if (msgId === lastMsgId) lastMsgId = findMsgByCount(lastMsgId, -1);

		const item = msgMap.get(msgId);
		const result = msgMap.delete(msgId);

		if (length() === 0) {
			firstMsgId = -1;
			lastMsgId = -1;
		}

		item && listenerChest.exec(CHAT_EVENTS.DELETE, { item });
		return result;
	};
	const read: Chat['read'] = function (msgId) {
		if (!msgMap.has(msgId) || msgMap.get(msgId)!['read']) return false;

		msgMap.get(msgId)!['read'] = true;
		return true;
	};
	const clear: Chat['clear'] = function () {
		msgMap.clear();
		listenerChest.exec(CHAT_EVENTS.CLEAR);

		firstMsgId = -1;
		lastMsgId = -1;
	};

	// === ITERATORS ===
	function* msgIdIterator(start: MsgId, quant: number): Generator<MsgId> {
		if (!has(start)) return;

		const msgArr: MsgId[] = Array.from(msgMap.keys());

		const changer: number = quant > -1 ? +1 : -1;
		let curIndex: number | undefined = msgArr.find((msgId) => msgId === start);
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
			callback(get(msgId)!, msgId, thisChat);
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
	const instance: Chat = {
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
	thisChat = instance;

	return instance;
} as unknown as ChatConstructor;

// === HELPERS ===
export function checkChatterType(userId: UserId): void {
	if (typeof userId !== 'string' && typeof userId !== 'symbol')
		throw TypeError('userId must be string.');
}
export function checkMsgType(msg: MsgText): void {
	if (typeof msg !== 'string') throw TypeError('msg must be string.');
}
