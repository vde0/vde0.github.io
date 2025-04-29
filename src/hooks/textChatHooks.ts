import { MsgHistory, MsgItem, SymbolChatter } from "@lib/textchat-history";
import { TextChatContext } from "@store";
import { useContext } from "react";


type SetWrite       = (newMsg: string) => void;

export const useWrite = (): [string, SetWrite] => {
    const contextValue = useContext(TextChatContext);
    if (!contextValue) { throw new Error("useWrite() must be used within a TextChatProvider") }

    const {state: {write}, dispatch} = contextValue;

    return [write, (msg) => { dispatch({ type: "WRITE", data: msg }) }];
};


type DispatchMsgHistory = (actionType: "ADD" | "RESET", msgItem?: [SymbolChatter, string]) => void;

export const useMsgHistory = (): [MsgItem[], DispatchMsgHistory] => {

    const contextValue = useContext(TextChatContext);
    if (!contextValue) { throw new Error("useMsgHistory() must be used within a TextChatProvider") }

    const {state, dispatch} = contextValue;

    const dispatchAction: DispatchMsgHistory = (actionType, msgItem) => {
        switch (actionType) {

            case "ADD": {
                if (!msgItem) throw new Error("Missed msgItem");
                dispatch({ type: actionType, data: msgItem }); break;
            }
            case "RESET":   dispatch({ type: actionType }); break;
        }
    };

    return [state.chatData.getHistory(), dispatchAction];
};