import React from 'react';
import Main from './containers/Main';
import TextChatProvider from '@store/TextChatProvider';
import ConnectProvider from '@store/ConnectProvider';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import PlatformProvider from '@store/PlatformProvider';
import MobileKeyboardProvider from '@store/MobileKeyboardProvider';


const MemoMain              = React.memo( Main );
const MemoMobileKeyboardProvider = React.memo( MobileKeyboardProvider );
const MemoTextChatProvider  = React.memo( TextChatProvider );
const MemoConnectProvider   = React.memo( ConnectProvider );
const MemoPlatformProvider  = React.memo( PlatformProvider );


const App: React.FC = () => (
    <WebAppProvider>
    <MemoPlatformProvider>

    <MemoMobileKeyboardProvider>

    <MemoConnectProvider>
        <MemoTextChatProvider>

            <MemoMain />

        </MemoTextChatProvider>
    </MemoConnectProvider>

    </MemoMobileKeyboardProvider>

    </MemoPlatformProvider>
    </WebAppProvider>
);


export default App