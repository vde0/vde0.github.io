import React from 'react';
import Main from './containers/Main';
import ChatProvider from '@store/ChatProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { RoomProvider } from '@store/RoomProvider';

const MemoMain = React.memo(Main);
const MemoChatProvider = React.memo(ChatProvider);
const MemoRoomProvider = React.memo(RoomProvider);

const App: React.FC = () => (
	<WebAppProvider>
		<MemoRoomProvider>
			<MemoChatProvider>
				<MemoMain />
			</MemoChatProvider>
		</MemoRoomProvider>
	</WebAppProvider>
);

export default App;
