import { useChat, useClientId, useRoom } from '@hooks';
import { ChatEventMap } from '@entities/Chat';
import { Listener } from '@lib/pprinter-tools';
import { createContext, useEffect, useState } from 'react';
import { INTENT_ACTIONS, IntentActionMap, intentChest } from '@services/intents';

type ChatCValue = {
	write: [string, React.Dispatch<React.SetStateAction<string>>];
	unread: [number, React.Dispatch<React.SetStateAction<boolean>>];
};

// Context obj
const ChatContext = createContext<ChatCValue | null>(null);

// Provider obj
const ChatProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const write = useState<string>('');
	const [unreadCount, setUnread] = useState<number>(0);
	const [readFlag, read] = useState<boolean>(false);

	const chat = useChat();
	const clientId = useClientId();

	useEffect(() => {
		const sendMessageHandler: Listener<IntentActionMap['sendmessage']> = function () {
			chat.add(clientId, write[0]);
			write[1]('');
		};

		intentChest.on(INTENT_ACTIONS.SEND_MESSAGE, sendMessageHandler);
		return () => intentChest.off(INTENT_ACTIONS.SEND_MESSAGE, sendMessageHandler);
	}, [chat, clientId, write[0]]);

	useEffect(() => {
		setUnread(0);
	}, [chat]);

	useEffect(() => {
		if (readFlag) setUnread(0);
	}, [readFlag]);

	useEffect(() => {
		if (!chat) return;

		const addMsgHandler: Listener<ChatEventMap['add']> = () => {
			!readFlag && setUnread(unreadCount + 1);
		};
		chat.on('add', addMsgHandler);

		return () => chat.off('add', addMsgHandler);
	}, [unreadCount, chat, readFlag]);

	return (
		<ChatContext.Provider value={{ write, unread: [unreadCount, read] }}>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
export { ChatContext };
// types
export { ChatCValue };
