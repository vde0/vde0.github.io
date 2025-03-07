import React from 'react';
import Main from './containers/Main';
import TextChatProvider from '@store/TextChatProvider';
import ConnectProvider from '@store/ConnectProvider';


const MemoMain              = React.memo( Main );
const MemoTextChatProvider  = React.memo( TextChatProvider );

const App: React.FC = () => (
    <ConnectProvider>
        <MemoTextChatProvider>
            <MemoMain />
        </MemoTextChatProvider>
    </ConnectProvider>
);


export default App