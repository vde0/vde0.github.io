import { SymbolChatter, TextChatController } from "@lib/textchat-history";
import { addDebug } from "@utils";
import { createContext, useReducer } from "react";


interface TextChatState {
    chatData:   TextChatController;
    write:      string;
}
type TextChatAction =
    | {type: "RESET"}
    | {type: "ADD", data: [SymbolChatter, string]}
    | {type: "WRITE", data: string};

interface TextChatValue {
    dispatch: (action: TextChatAction) => void;
    state: TextChatState;
}


// Reducer func
const textChatReducer: React.Reducer<TextChatState, TextChatAction> = (state, action) => {
    
    switch (action.type) {
        case "RESET":
            return {
                chatData:   new TextChatController(),
                write:      "",
            };
        case "ADD":
            if ( !action.data ) {
                throw new TypeError(
                    "Missed action.data[] (undefined) object of the \"ADD\" action type");}
            if ( !Array.isArray(action.data) ) {
                throw new TypeError(
                    "Incorrect action.data[] data type of the \"ADD\" action type");}
            if ( action.data.length != 2 ) {
                throw new Error(
                    "Invalid action.data[id: string, msgText: string]. Unrightly have filled the array. There needs 2 elems only for the \"ADD\" action type");}
            if ( typeof(action.data[0]) !== "string" || typeof(action.data[1]) !== "string") {
                throw new TypeError(
                    "Invalid action.data[id: string, msgText: string]. Was taken incorrect data type for the \"ADD\" action type");}
            
            state.chatData.addMsg(...action.data);
            return {
                ...state
            };
        case "WRITE":
            if ( !action.data && typeof action.data !== "string") {
                throw new TypeError(
                    "Missed action.data <string> of the \"WRITE\" action type");}
            if ( typeof(action.data) !== "string" ) {
                throw new TypeError(
                    "Incorrect action.data data type (needs string) of the \"WRITE\" action type");}
            
            return {
                chatData:   state.chatData,
                write:      action.data,
            };
        default:
            throw new Error("Uknown action type");
    }
};


// Context obj
const TextChatContext = createContext<TextChatValue | null>( null );


// Provider obj
const TextChatProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const [chatState, dispatchChat] = useReducer(textChatReducer, {
        write: "",
        chatData: new TextChatController(),
    });

    addDebug("chatData", {...chatState.chatData});

    return (
        <TextChatContext.Provider value={{dispatch: dispatchChat, state: chatState}}>
            {children}
        </TextChatContext.Provider>
    );
};


export default TextChatProvider
export {TextChatContext};
// types
export {
    TextChatAction,
    TextChatState,
    TextChatValue,
};