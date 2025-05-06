import React from 'react';
import Main from './containers/Main';
import TextChatProvider from '@store/ChatProvider';
import ConnectProvider from '@store/ConnectProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';


const MemoMain              = React.memo( Main );
const MemoTextChatProvider  = React.memo( TextChatProvider );
const MemoConnectProvider   = React.memo( ConnectProvider );


const App: React.FC = () => (
    <WebAppProvider>

    <MemoTextChatProvider>
        <MemoConnectProvider>

            <MemoMain />

        </MemoConnectProvider>
    </MemoTextChatProvider>

    </WebAppProvider>
);


export default App