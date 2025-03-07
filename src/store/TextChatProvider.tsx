import { createContext, useReducer } from "react";


interface TextChatState {
    chatData:   string[],
    write:      string,
}
type TextChatAction =
    | {type: "RESET"}
    | {type: "ADD", data: [string, string]}
    | {type: "WRITE", data: string};

interface TextChatValue {
    dispatch: (action: TextChatAction) => void,
    state: TextChatState,
}


// init
const CUR_USER: string = '1';
const OUT_USER: string = '775';

const initTextChatValue: TextChatValue = {
    dispatch(action) {},
    state: {
        chatData:   [CUR_USER, "Hey!", OUT_USER, "Hello."],
        write:    "",
    },
};


// Reducer func
const textChatReducer: React.Reducer<TextChatState, TextChatAction> = (state, action) => {
    
    switch (action.type) {
        case "RESET":
            return {
                chatData:   [],
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
            
            state.chatData.push(...action.data);
            return {
                ...state
            };
        case "WRITE":
            if ( !action.data ) {
                throw new TypeError(
                    "Missed action.data (undefined) object of the \"WRITE\" action type");}
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


interface TextChatProviderProps {
    children?: React.ReactNode,
}

// Provider obj
const TextChatProvider: React.FC<TextChatProviderProps> = ({children}) => {

    const [chatState, dispatchChat] = useReducer(textChatReducer, initTextChatValue.state);

    return (
        <TextChatContext.Provider value={{dispatch: dispatchChat, state: chatState}}>
            {children}
        </TextChatContext.Provider>
    );
};


export {TextChatContext};
export default TextChatProvider;