import { MsgItem, SymbolChatter } from "@lib/textchat-history";
import { TextChatContext } from "@store";
import { useCallback, useContext, useMemo } from "react";


type Send       = (msgText: string) => void;
type SetWrite   = (msgText: string) => void;

export const useWrite = (): [string, SetWrite] => {
    const contextValue = useContext(TextChatContext);
    if (!contextValue) { throw new Error("useWrite() must be used within a TextChatProvider") }

    const { state: {write}, dispatch } = contextValue;
    const setWrite = useCallback<SetWrite>(msgText => dispatch({ type: "WRITE", data: msgText }), []);

    return [write, setWrite];
};

export const useMsgHistory = (): MsgItem[] => {

    const contextValue = useContext(TextChatContext);
    if (!contextValue) { throw new Error("useMsgHistory() must be used within a TextChatProvider") }

    const { state } = contextValue;
    const history = useMemo<MsgItem[]>(() => state.chatData.getHistory(), [contextValue]);

    return history;
};

export const useLocalChatter = (): [SymbolChatter, Send] => {
    const contextValue = useContext(TextChatContext);
    if (!contextValue) { throw new Error("useLocalChatter() must be used within a TextChatProvider") }

    const send = useCallback<Send>(msgText => contextValue.dispatch({
        type: "ADD",
        data: [contextValue.state.chatData.localChatter, msgText],
    }), [contextValue.state.chatData.localChatter]);

    return [contextValue.state.chatData.localChatter, send];
};

export const useRemoteChatter = (): [SymbolChatter, Send] => {
    const contextValue = useContext(TextChatContext);
    if (!contextValue) { throw new Error("useRemoteChatter() must be used within a TextChatProvider") }

    const send = useCallback<Send>(msgText => contextValue.dispatch({
        type: "ADD",
        data: [contextValue.state.chatData.remoteChatter, msgText],
    }), [contextValue.state.chatData.remoteChatter]);
    
    return [contextValue.state.chatData.remoteChatter, send];
};