import { addDebug } from "@lib/utils";
import { DuoChatUnit } from "@services/DuoChatUnit";
import { whenLocalMedia } from "@services/localMedia";
import { createContext, useEffect, useRef, useState } from "react";


interface ChatValue {
    chatUnit:   DuoChatUnit;
    writeState: [string, React.Dispatch<React.SetStateAction<string>>];
}


// Context obj
const ChatContext = createContext<ChatValue | null>( null );


// Provider obj
const ChatProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const chatUnitRef   = useRef<DuoChatUnit>( new DuoChatUnit() );
    const writeState    = useState<string>( "" );

    const chatUnit      = chatUnitRef.current;

    useEffect( () => addDebug("chatUnit", chatUnit), [] );
    useEffect( () => whenLocalMedia( media => chatUnit.setMedia(chatUnit.localChatter, media) ), [] );

    return (
        <ChatContext.Provider value={{ chatUnit, writeState }}>
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