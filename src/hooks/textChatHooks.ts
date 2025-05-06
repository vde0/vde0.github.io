import { CHAT_HISTORY_EVENTS, ChatHistory, MsgItem } from "@lib/chat-history";
import { listen, unlisten } from "@lib/utils";
import { DUO_CHAT_UNIT_EVENTS, MediaEventPayload, SymbolChatter } from "@services/DuoChatUnit";
import { ChatContext } from "@store";
import { useCallback, useContext, useEffect, useState } from "react";


type Send       = (msgText: string) => void;
type SetWrite   = (msgText: string) => void;

export const useWrite = (): [string, SetWrite] => {
    const context = useContext(ChatContext);
    if (!context) { throw new Error("useWrite() must be used within a TextChatProvider") }

    const { writeState } = context;

    return writeState;
};

export const useChatHistory = (): ChatHistory => {
    const context = useContext(ChatContext);
    if (!context) { throw new Error("useMsgHistory() must be used within a TextChatProvider") }

    const { chatUnit } = context;

    return chatUnit.history;
};

export const useChatFeed = (): MsgItem[] => {
    const context = useContext(ChatContext);
    if (!context) { throw new Error("useChatFeed() must be used within a TextChatProvider") }

    const { chatUnit }      = context;
    const [feed, setFeed]   = useState<MsgItem[]>([]);

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

    return feed;
};

export const useLocalChatter = (): [SymbolChatter, Send, MediaStream | undefined] => {
    const context = useContext(ChatContext);
    if (!context) { throw new Error("useLocalChatter() must be used within a TextChatProvider") }

    const { chatUnit }  = context;
    const [localMedia, setLocalMedia] = useState<MediaStream | undefined>(
        chatUnit.getMedia(chatUnit.localChatter)
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

export const useRemoteChatter = (): [SymbolChatter, Send, MediaStream | undefined] => {
    const context = useContext(ChatContext);
    if (!context) { throw new Error("useRemoteChatter() must be used within a TextChatProvider") }

    const { chatUnit }                  = context;
    const [remoteMedia, setRemoteMedia] = useState<MediaStream | undefined>(
        chatUnit.getMedia(chatUnit.remoteChatter)
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
    const context = useContext(ChatContext);
    if (!context) { throw new Error("useLastMsg() must be used within a TextChatProvider") }

    const { chatUnit }          = context;
    const [lastMsg, setLastMsg] = useState<MsgItem | null>(null);

    const update    = useCallback( ({ item }: {item: MsgItem}) => setLastMsg(item), [] );

    useEffect(() => {

        chatUnit.history.on(CHAT_HISTORY_EVENTS.ADD, update);
        return () => chatUnit.history.off(CHAT_HISTORY_EVENTS.ADD, update);
    }, [chatUnit]);

    return lastMsg;
};