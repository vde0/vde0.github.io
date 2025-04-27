import { MsgHistory, MsgItem } from "@utils";


export type SymbolChatter = symbol;

export type TextChatConstructor = new () => TextChatController;
export interface TextChatController {
    remoteSymbolChatter:  SymbolChatter;
    localSymbolChatter:   SymbolChatter;
    length:         number;

    addMsg:         (chatter: SymbolChatter, msgText: string) => void;
    getHistory:     () => MsgItem[];
};


export const TextChatController: TextChatConstructor = function () {

    const msgHistory:       MsgHistory  = new MsgHistory();

    const remoteSymbolChatter:    SymbolChatter     = Symbol("REMOTE_CHATTER");
    const localSymbolChatter:     SymbolChatter     = Symbol("LOCAL_CHATTER");

    const checkIsKnownSymbolChatter = (chatter: SymbolChatter): boolean => (
        chatter === remoteSymbolChatter || chatter === localSymbolChatter
    );

    const instance: TextChatController = {
        addMsg (chatter, msgText) { 
            if ( !checkIsKnownSymbolChatter(chatter) ) throw Error("Unknown chatter symbol provided.");
            if ( typeof msgText !== "string" ) throw TypeError("msgText arg must be string.")
            msgHistory.add(chatter, msgText);
        },
        getHistory () {
            return msgHistory.getAllHistory();
        },

        get length () { return msgHistory.length; },

        remoteSymbolChatter:  remoteSymbolChatter,
        localSymbolChatter:   localSymbolChatter,
    };
    Object.freeze(instance);

    return instance;
} as unknown as TextChatConstructor;
