import { createContext, useState } from "react";


type ChatValue = {
    write:  [string, React.Dispatch<React.SetStateAction<string>>];
    unread: [number, React.Dispatch<React.SetStateAction<number>>];
};


// Context obj
const ChatContext = createContext<ChatValue | null>( null );


// Provider obj
const ChatProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const write     = useState<string>( "" );
    const unread    = useState<number>( 0 );

    return (
        <ChatContext.Provider value={{ write, unread }}>
            {children}
        </ChatContext.Provider>
    );
};


export default ChatProvider
export { ChatContext };
// types
export {
    ChatValue,
};