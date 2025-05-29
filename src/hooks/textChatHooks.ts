import { CHAT_HISTORY_EVENTS, ChatHistory, ChatHistoryEventMap, MsgItem } from "@lib/chat-history";
import { addDebug, listen, unlisten } from "@lib/utils";
import { DUO_CHAT_UNIT_EVENTS, DuoChatUnit, DuoChatUnitEventMap, SymbolChatter } from "@services/DuoChatUnit";
import { ChatContext, ChatCValue } from "@store";
import { useCallback, useContext, useEffect, useState } from "react";
import { useConnection } from "./connectHooks";
import { Listener } from "@lib/pprinter-tools";


type Send       = (msgText: string) => void;

export const useWrite = (): ChatCValue['write'] => { return getChatContext()["write"] };
export const useUnread = (): ChatCValue['unread'] => { return getChatContext()["unread"] };

export const useChatUnit = (): DuoChatUnit => { return useConnection()[0].chatUnit };

export const useChatHistory = (): ChatHistory => { return useConnection()[0].chatUnit.history };

export const useChatFeed = (): MsgItem[] => {

    const FEED_COUNT = 100;

    const history           = useChatHistory();
    const [feed, setFeed]   = useState<MsgItem[]>( getFeed() );

    addDebug("feed", feed);

    // === HELPERS ===
    function getFeed (): MsgItem[] {
        return history.tail(FEED_COUNT);
    }

    useEffect(() => {

        setFeed( getFeed() );

        const update: Listener<ChatHistoryEventMap['add' | 'delete' | 'clear']> = () => setFeed( getFeed() );

        listen<ChatHistory, ChatHistoryEventMap>(history, {
            [CHAT_HISTORY_EVENTS.ADD]:      update,
            [CHAT_HISTORY_EVENTS.DELETE]:   update,
            [CHAT_HISTORY_EVENTS.CLEAR]:    update,
        });

        return () => unlisten<ChatHistory, ChatHistoryEventMap>(history, {
            [CHAT_HISTORY_EVENTS.ADD]:      update,
            [CHAT_HISTORY_EVENTS.DELETE]:   update,
            [CHAT_HISTORY_EVENTS.CLEAR]:    update,
        });
    }, [history]);


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