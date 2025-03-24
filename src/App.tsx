import React from 'react';
import Main from './containers/Main';
import TextChatProvider from '@store/TextChatProvider';
import ConnectProvider from '@store/ConnectProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';


const MemoMain              = React.memo( Main );
const MemoTextChatProvider  = React.memo( TextChatProvider );
const MemoConnectProvider   = React.memo( ConnectProvider );


const App: React.FC = () => (
    <WebAppProvider>

    <MemoConnectProvider>
        <MemoTextChatProvider>

            <MemoMain />

        </MemoTextChatProvider>
    </MemoConnectProvider>

    </WebAppProvider>
);


export default App