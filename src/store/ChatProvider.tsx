import { createContext, useState } from "react";


type ChatValue = [string, React.Dispatch<React.SetStateAction<string>>];


// Context obj
const ChatContext = createContext<ChatValue | null>( null );


// Provider obj
const ChatProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const writeState    = useState<string>( "" );

    return (
        <ChatContext.Provider value={ writeState }>
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