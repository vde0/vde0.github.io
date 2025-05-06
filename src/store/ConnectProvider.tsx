import { Connection } from "@services/Connection";
import { whenLocalMedia } from "@services/localMedia";
import { addDebug } from "@utils";
import { Peer, PEER_EVENTS, StartConfig } from "@lib/webrtc";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CHAT_HISTORY_EVENTS, MsgItem } from "@lib/chat-history";
import { ChatContext, ChatValue } from "./ChatProvider";


export const CHAT_NAME = "CHAT";


type NextSignature = () => void;
interface ConnectValue {
    peer: Peer;
    next: NextSignature;
}


// Context obj
const ConnectContext = createContext<ConnectValue | null>( null );


// Provider obj
const ConnectProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    // === DATA ===
    const [peer, setPeer]   = useState<Peer>( new Peer() );
    const textChat          = useContext(ChatContext);
    const connection        = useRef<Connection>( new Connection(peer) );

    if (textChat === null) throw Error("TextChatContext must be used within ChatProvider.");
    const { chatUnit }: ChatValue = textChat;

    const startConfig = useCallback<StartConfig>(() => peer.addDataChannel(CHAT_NAME), [peer]);
    
    // === HELPERS ===
    const next = useCallback(() => {
        const newPeer = new Peer();
        setPeer(newPeer);

        whenLocalMedia( media => media.getTracks().forEach(track => newPeer.addMediaTrack(track, media)) );
        whenLocalMedia( media => addDebug("localMedia", media) );

        connection.current.updatePeer(newPeer);
        connection.current.setStartConfig(startConfig);

        connection.current.signal();
    }, [startConfig]);

    // === HANDLERS ===
    const remoteMediaHandler = useCallback(({ media }: {media: MediaStream}) => {
        chatUnit.setMedia(chatUnit.remoteChatter, media);
        addDebug('remoteMedia', media);
    }, []);
    const sendHandler = useCallback(({ chatter: user, text }: MsgItem) => {
        if (user !== chatUnit.remoteChatter) return;
        peer.send(text, "Chat");
    }, [peer, chatUnit]);
    const receiveHandler = useCallback(({ data }: {data: string}) => {
        chatUnit.history.add(data, chatUnit.remoteChatter);
    }, [chatUnit]);

    // === EFFECTS ===
    useLayoutEffect(() => next(), []);

    useLayoutEffect(() => {
        peer.on(PEER_EVENTS.MEDIA, remoteMediaHandler);
        return () => peer.off(PEER_EVENTS.MEDIA, remoteMediaHandler);
    }, [peer, remoteMediaHandler]);

    useEffect(() => {
        chatUnit.history.on(CHAT_HISTORY_EVENTS.ADD, sendHandler);
        return () => chatUnit.history.off(CHAT_HISTORY_EVENTS.ADD, sendHandler);
    }, [chatUnit, sendHandler]);
    useEffect(() => {
        peer.on(PEER_EVENTS.TEXT, receiveHandler);
        return () => peer.off(PEER_EVENTS.TEXT, receiveHandler);
    }, [peer, receiveHandler]);


    return (
        <ConnectContext.Provider value={{ peer, next }}>
            {children}
        </ConnectContext.Provider>
    );
};


export default ConnectProvider
export {ConnectContext};
// types
export {
    NextSignature,
    ConnectValue,
};