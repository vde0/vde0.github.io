import { ChatHistory } from "@lib/chat-history/ChatHistory";
import { IListenerChest, ListenerChest } from "@lib/utils";


export const DUO_CHAT_UNIT_EVENTS: DuoChatUnitEvents = {
    MEDIA: "media",
};
Object.freeze(DUO_CHAT_UNIT_EVENTS);


export type SymbolChatter       = symbol;
export type MediaEventPayload   = { chatter: SymbolChatter, media: MediaStream };
export type DuoChatUnitEvent    = 'media';
export type DuoChatUnitEvents   = {
    MEDIA: 'media';
};

export type DuoChatUnitConstructor = new () => DuoChatUnit;
export type DuoChatUnit = IListenerChest<DuoChatUnitEvent> & {
    remoteChatter:  SymbolChatter;
    localChatter:   SymbolChatter;

    history:        ChatHistory;

    setMedia    (chatter: SymbolChatter, media: MediaStream):   void;
    getMedia    (chatter: SymbolChatter):                       MediaStream | undefined;
};


export const DuoChatUnit: DuoChatUnitConstructor = function () {
    
    const history:          ChatHistory     = new ChatHistory();

    const remoteChatter:    SymbolChatter   = Symbol("REMOTE_CHATTER");
    const localChatter:     SymbolChatter   = Symbol("LOCAL_CHATTER");

    const mediaMap:         Map<SymbolChatter, MediaStream>     = new Map();
    const listener:         IListenerChest<DuoChatUnitEvent>    = new ListenerChest();

    const instance: DuoChatUnit = {
        ...listener,
        history,
        remoteChatter,
        localChatter,

        setMedia (chatter, media)   {
            listener.exec(DUO_CHAT_UNIT_EVENTS.MEDIA, { chatter, media });
            mediaMap.set(chatter, media);
        },
        getMedia (chatter)          { return mediaMap.get(chatter); },
    };
    Object.freeze(instance);

    return instance;
} as unknown as DuoChatUnitConstructor;
