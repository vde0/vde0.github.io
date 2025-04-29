import { MsgHistory, MsgItem } from "@lib/textchat-history/MsgHistory";


export type SymbolChatter = symbol;

export type TextChatConstructor = new () => TextChatController;
export interface TextChatController {
    remoteChatter:  SymbolChatter;
    localChatter:   SymbolChatter;
    length:         number;

    addMsg:         (chatter: SymbolChatter, msgText: string) => void;
    getHistory:     () => MsgItem[];
};


export const TextChatController: TextChatConstructor = function () {

    const msgHistory:       MsgHistory  = new MsgHistory();

    const remoteChatter:    SymbolChatter     = Symbol("REMOTE_CHATTER");
    const localChatter:     SymbolChatter     = Symbol("LOCAL_CHATTER");

    const checkIsKnownChatter = (chatter: SymbolChatter): boolean => (
        chatter === remoteChatter || chatter === localChatter
    );

    const instance: TextChatController = {
        addMsg (chatter, msgText) { 
            if ( !checkIsKnownChatter(chatter) ) throw Error("Unknown chatter symbol provided.");
            if ( typeof msgText !== "string" ) throw TypeError("msgText arg must be string.")
            msgHistory.add(chatter, msgText);
        },
        getHistory () {
            return msgHistory.getAllHistory();
        },

        get length () { return msgHistory.length; },

        remoteChatter:  remoteChatter,
        localChatter:   localChatter,
    };
    Object.freeze(instance);

    return instance;
} as unknown as TextChatConstructor;
