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
    peer:       Peer;
    next:       NextSignature;
    connection: Connection;
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
    
    // === HELPERS ===
    const next = useCallback(() => {
        const newPeer = new Peer();
        setPeer(newPeer);

        connection.current.updatePeer(newPeer);
    }, []);

    // === EFFECTS ===
    // Peer Setting
    useEffect(() => {
        whenLocalMedia(media => {
            media.getTracks().forEach(track => peer.addMediaTrack(track, media));
            addDebug("localMedia", media);
        });

        const startConfig = () => peer.addDataChannel(CHAT_NAME);
        connection.current.setStartConfig(startConfig);
    }, [peer]);

    useLayoutEffect(() => {
        const remoteMediaHandler = ({ media }: {media: MediaStream}) => {
            chatUnit.setMedia(chatUnit.remoteChatter, media);
            addDebug('remoteMedia', media);
        };

        peer.on(PEER_EVENTS.MEDIA, remoteMediaHandler);
        return () => peer.off(PEER_EVENTS.MEDIA, remoteMediaHandler);
    }, [peer, chatUnit]);

    useEffect(() => {
        const sendHandler = ({item: { chatter, text }}: {item: MsgItem}) => {
            if (chatter !== chatUnit.localChatter) return;
            peer.send(text, CHAT_NAME);
        };

        chatUnit.history.on(CHAT_HISTORY_EVENTS.ADD, sendHandler);
        return () => chatUnit.history.off(CHAT_HISTORY_EVENTS.ADD, sendHandler);
    }, [peer, chatUnit]);
    useEffect(() => {
        const receiveHandler = ({ data }: {data: string}) => {
            chatUnit.history.add(data, chatUnit.remoteChatter);
        };

        peer.on(PEER_EVENTS.TEXT, receiveHandler);
        return () => peer.off(PEER_EVENTS.TEXT, receiveHandler);
    }, [peer, chatUnit]);


    return (
        <ConnectContext.Provider value={{ peer, next, connection: connection.current }}>
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