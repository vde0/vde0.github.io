import { CHAT_HISTORY_EVENTS, ChatHistory, ChatHistoryEventMap, MsgItem } from "@lib/chat-history";
import { addDebug, listen, unlisten } from "@lib/utils";
import { DUO_CHAT_UNIT_EVENTS, DuoChatUnit, DuoChatUnitEventMap, MediaEventPayload, SymbolChatter } from "@services/DuoChatUnit";
import { ChatContext, ChatCValue, ConnectionContext, ConnectionCValue } from "@store";
import { useCallback, useContext, useEffect, useState } from "react";
import { useConnection } from "./connectHooks";
import { Listener } from "@lib/pprinter-tools";


type Send       = (msgText: string) => void;

export const useWrite = (): ChatCValue['write'] => { return getChatContext()["write"] };
export const useUnread = (): ChatCValue['unread'] => { return getChatContext()["unread"] };

export const useChatUnit = (): DuoChatUnit => { return useConnection()[0].chatUnit };

export const useChatHistory = (): ChatHistory => { return useConnection()[0].chatUnit.history };

export const useChatFeed = (): MsgItem[] => {
    const history          = useChatHistory();
    const [feed, setFeed]   = useState<MsgItem[]>( history.tail(100) );

    useEffect(() => {
        const update: Listener<ChatHistory['add' | 'delete' | 'clear']> = () => setFeed( history.tail(100) );

        listen(history, {
            [CHAT_HISTORY_EVENTS.ADD]:      update,
            [CHAT_HISTORY_EVENTS.DELETE]:   update,
            [CHAT_HISTORY_EVENTS.CLEAR]:    update,
        });

        return () => unlisten(history, {
            [CHAT_HISTORY_EVENTS.ADD]:      update,
            [CHAT_HISTORY_EVENTS.DELETE]:   update,
            [CHAT_HISTORY_EVENTS.CLEAR]:    update,
        });
    }, [history]);

    addDebug("feed", feed);

    return feed;
};

export const useLocalChatter = (): [SymbolChatter, Send, MediaStream | null] => {
    const chatUnit                      = useChatUnit();
    const [localMedia, setLocalMedia]   = useState<MediaStream | null>(
        chatUnit.getMedia(chatUnit.localChatter) ?? null
    );

    const send = useCallback<Send>(msgText => (
        chatUnit.history.add(msgText, chatUnit.localChatter)
    ), [chatUnit]);

    useEffect(() => {
        const update: Listener<DuoChatUnitEventMap['media']> = ({ chatter, media }) => {
            if (chatter !== chatUnit.localChatter) return;
            setLocalMedia(media);
        };

        chatUnit.on(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
        return () => chatUnit.off(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
    }, [chatUnit]);

    return [chatUnit.localChatter, send, localMedia];
};

export const useRemoteChatter = (): [SymbolChatter, Send, MediaStream | null] => {
    const chatUnit                      = useChatUnit();
    const [remoteMedia, setRemoteMedia] = useState<MediaStream | null>(
        chatUnit.getMedia(chatUnit.remoteChatter) ?? null
    );

    const send = useCallback<Send>(msgText => (
        chatUnit.history.add(msgText, chatUnit.remoteChatter)
    ), [chatUnit]);

    useEffect(() => {
        const update: Listener<DuoChatUnitEventMap['media']> = ({ chatter, media }) => {
            if (chatter !== chatUnit.remoteChatter) return;
            setRemoteMedia(media);
        };

        chatUnit.on(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
        return () => chatUnit.off(DUO_CHAT_UNIT_EVENTS.MEDIA, update);
    }, [chatUnit]);
    
    return [chatUnit.remoteChatter, send, remoteMedia];
};


// === HELPERS ===
function getChatContext (hookName?: string): ChatCValue {

    // === SUCCESS ===
    const context: ChatCValue | null = useContext(ChatContext);
    if (context) return context;

    // === FAIL ===
    let errMsg: string = "";

    if (hookName)   errMsg = `${hookName} must be used within a ChatProvide.`;
    else            errMsg = "useContext(ChatContext) should be called within the ChatProvider";

    throw new Error(errMsg);
}