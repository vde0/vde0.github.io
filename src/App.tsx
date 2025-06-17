import React from 'react';
import Main from './containers/Main';
import ChatProvider from '@store/ChatProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

const MemoMain = React.memo(Main);
const MemoChatProvider = React.memo(ChatProvider);

const App: React.FC = () => (
	<WebAppProvider>
		<MemoChatProvider>
			<MemoMain />
		</MemoChatProvider>
	</WebAppProvider>
);

export default App;
