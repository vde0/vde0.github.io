import { CHAT_HISTORY_EVENTS, ChatHistory, MsgItem } from "@lib/chat-history";
import { addDebug, listen, unlisten } from "@lib/utils";
import { ChatSignalHub } from "@services/ChatSignalHub";
import { DUO_CHAT_UNIT_EVENTS, DuoChatUnit, MediaEventPayload, SymbolChatter } from "@services/DuoChatUnit";
import { ChatContext, ChatValue } from "@store";
import { useCallback, useContext, useEffect, useState } from "react";


type Send       = (msgText: string) => void;
type SetWrite   = (msgText: string) => void;

export const useWrite = (): [string, SetWrite] => { return getChatContext() };

export const useChatUnit = (): DuoChatUnit => { return ChatSignalHub.getChatUnit() };

export const useChatHistory = (): ChatHistory => { return ChatSignalHub.getChatUnit().history };

export const useChatFeed = (): MsgItem[] => {
    const chatUnit          = ChatSignalHub.getChatUnit();
    const [feed, setFeed]   = useState<MsgItem[]>( chatUnit.history.tail(100) );

    useEffect(() => {
        const update = () => setFeed( chatUnit.history.tail(100) );

        listen(chatUnit.history, {
            [CHAT_HISTORY_EVENTS.ADD]:      update,
            [CHAT_HISTORY_EVENTS.DELETE]:   update,
            [CHAT_HISTORY_EVENTS.CLEAR]:    update,
        });

        return () => unlisten(chatUnit.history, {
            [CHAT_HISTORY_EVENTS.ADD]:      update,
            [CHAT_HISTORY_EVENTS.DELETE]:   update,
            [CHAT_HISTORY_EVENTS.CLEAR]:    update,
        });
    }, [chatUnit]);

    addDebug("feed", feed);

    return feed;
};

export const useLocalChatter = (): [SymbolChatter, Send, MediaStream | null] => {
    const chatUnit                      = ChatSignalHub.getChatUnit();
    const [localMedia, setLocalMedia]   = useState<MediaStream | null>(
        chatUnit.getMedia(chatUnit.localChatter) ?? null
    );

    const send = useCallback<Send>(msgText => (
        chatUnit.history.add(msgText, chatUnit.localChatter)
    ), [chatUnit]);

    useEffect(() => {
        const update = ({ chatter, media }: {chatter: SymbolChatter, media: MediaStream}) => {
            if (chatter !== chatUnit.localChatter) return;
            setLocalMedia(media);
        };

        chatUnit.on(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
        return () => chatUnit.off(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
    }, [chatUnit]);

    return [chatUnit.localChatter, send, localMedia];
};

export const useRemoteChatter = (): [SymbolChatter, Send, MediaStream | null] => {
    const chatUnit                      = ChatSignalHub.getChatUnit();
    const [remoteMedia, setRemoteMedia] = useState<MediaStream | null>(
        chatUnit.getMedia(chatUnit.remoteChatter) ?? null
    );

    const send = useCallback<Send>(msgText => (
        chatUnit.history.add(msgText, chatUnit.remoteChatter)
    ), [chatUnit]);

    useEffect(() => {
        const update = ({ chatter, media }: MediaEventPayload) => {
            if (chatter !== chatUnit.remoteChatter) return;
            setRemoteMedia(media);
        };

        chatUnit.on(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
        return () => chatUnit.off(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
    }, [chatUnit]);
    
    return [chatUnit.remoteChatter, send, remoteMedia];
};

export const useLastMsg = (): MsgItem | null => {
    const chatUnit              = ChatSignalHub.getChatUnit();
    const [lastMsg, setLastMsg] = useState<MsgItem | null>(null);

    useEffect(() => {
        const update = ({ item }: {item: MsgItem}) => setLastMsg(item);

        chatUnit.history.on(CHAT_HISTORY_EVENTS.ADD, update);
        return () => chatUnit.history.off(CHAT_HISTORY_EVENTS.ADD, update);
    }, [chatUnit]);

    return lastMsg;
};


// === HELPERS ===
function getChatContext (hookName?: string): ChatValue {

    // === SUCCESS ===
    const context: ChatValue | null = useContext(ChatContext);
    if (context) return context;

    // === FAIL ===
    let errMsg: string = "";

    if (hookName)   errMsg = `${hookName} must be used within a ChatProvider.`;
    else            errMsg = "useContext(ChatContext) should be called within the ChatProvider.";

    throw new Error(errMsg);
};