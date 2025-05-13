import React from 'react';
import Main from './containers/Main';
import TextChatProvider from '@store/ChatProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';


const MemoMain              = React.memo( Main );
const MemoTextChatProvider  = React.memo( TextChatProvider );


const App: React.FC = () => (
    <WebAppProvider>

    <MemoTextChatProvider>

        <MemoMain />

    </MemoTextChatProvider>

    </WebAppProvider>
);


export default App