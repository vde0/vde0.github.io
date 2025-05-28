import React from 'react';
import Main from './containers/Main';
import ChatProvider from '@store/ChatProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { ConnectionProvider } from '@store/ConnectionProvider';


const MemoMain                  = React.memo( Main );
const MemoChatProvider          = React.memo( ChatProvider );
const MemoConnectionProvider    = React.memo( ConnectionProvider );



const App: React.FC = () => (
    <WebAppProvider>

    <MemoChatProvider>
    <MemoConnectionProvider>

        <MemoMain />

    </MemoConnectionProvider>
    </MemoChatProvider>

    </WebAppProvider>
);


export default App