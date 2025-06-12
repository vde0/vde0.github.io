import { useChatHistory, useRoom } from '@hooks';
import { ChatHistoryEventMap } from '@lib/chat-history';
import { Listener } from '@lib/pprinter-tools';
import { createContext, useEffect, useState } from 'react';

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

	const connection = useRoom();
	const chatHistory = useChatHistory();

	useEffect(() => {
		setUnread(0);
	}, [connection]);

	useEffect(() => {
		if (readFlag) setUnread(0);
	}, [readFlag]);

	useEffect(() => {
		const addMsgHandler: Listener<ChatHistoryEventMap['add']> = () => {
			!readFlag && setUnread(unreadCount + 1);
		};
		chatHistory.on('add', addMsgHandler);

		return () => chatHistory.off('add', addMsgHandler);
	}, [unreadCount, chatHistory, readFlag]);

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
