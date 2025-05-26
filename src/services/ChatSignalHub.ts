import { Peer, PEER_EVENTS } from "@lib/webrtc";
import { Signal } from "./Signal";
import { DuoChatUnit } from "./DuoChatUnit";
import { Accessor, ListenerChest, When } from "@lib/pprinter-tools";
import { MsgItem } from "@lib/chat-history";
import { whenLocalMedia } from "./localMedia";
import { addDebug } from "@lib/utils";


// === API DESCRIPTION ===//
/**
 * CHAT_NAME: string
 * ACC_FLAGS: { UPPER_ACC: 'lower_acc', ... }
 * 
 * signalAccessor: Accessor by pprinter-tools
 * whenAccess: When by pprinter-tools
 * 
 * takePeer()
 * onUpdatePeer()
 * offUpdatePeer()
 * getChatUnit()
 * getSignal()
 * getPeer()
*/


// === API FIELDS ===
export const CHAT_NAME = "CHAT";
export const ACC_FLAGS = {
    PEER:               'peer',
    LOCAL_MEDIA:        'localmedia',
    PLAY_REMOTE_VIDEO:  'playremotevideo',
} as const;
Object.freeze(ACC_FLAGS);

// === INNER FIELDS ===
let peer:       Peer | null = null;
let signal:     Signal      = new Signal();
let chatUnit:   DuoChatUnit = new DuoChatUnit();

addDebug("chatUnit", chatUnit);

// === API EVENT SYSTEM ===
const signalAccessor    = new Accessor( Object.values(ACC_FLAGS) );
const whenAccess        = new When<{'ready': boolean}>();

signalAccessor.on("access", () => {
    whenAccess.occur("ready", true);
});

// LISTENER CHEST
const chest = new ListenerChest<{'updatepeer': Peer}>();


// === START SETTINGS ===
const startConfig = () => { peer!.addDataChannel(CHAT_NAME) }

signal.setStartConfig(startConfig);
chatUnit.history.on("add", sendHandler);


// === API FUNCS ===
function onUpdatePeer   (listener: (peerArg: Peer) => void) { chest.on("updatepeer", listener) }
function offUpdatePeer  (listener: (peerArg: Peer) => void) { chest.off("updatepeer", listener) }

function getChatUnit () { return chatUnit   }
function getPeer     () { return peer       }
function getSignal   () { return signal     }

function takePeer (peerArg: Peer): void {
    peer = peerArg;
    addDebug("peer", peer);

    signal.updatePeer(peer);
    peer.on(PEER_EVENTS.TEXT, receiveHandler);
    peer.on(PEER_EVENTS.MEDIA, remoteMediaHandler);

    whenLocalMedia(media => setLocalMedia(media));

    signalAccessor.set(ACC_FLAGS.PEER);
    whenAccess.when("ready", () => signal.signal());

    chest.exec("updatepeer", peerArg);
}


// === HANDLERS ===
function sendHandler ({item: { chatter, text }}: {item: MsgItem}) {
    if (chatter !== chatUnit.localChatter) return;
    peer!.send(text, CHAT_NAME);
}

function receiveHandler ({ data }: {data: string}) {
    chatUnit.history.add(data, chatUnit.remoteChatter);
}

function remoteMediaHandler ({ media }: {media: MediaStream}) {
    chatUnit.setMedia(chatUnit.remoteChatter, media);
    addDebug('remoteMedia', media)
}


// === HELPERS ===
function setLocalMedia (media: MediaStream): void {
    media.getTracks().forEach(track => peer!.addMediaTrack(track, media));
    chatUnit.setMedia(chatUnit.localChatter, media);
    
    addDebug("localMedia", media);
    signalAccessor.set(ACC_FLAGS.LOCAL_MEDIA);
}


// === EXPORT API ===
export const ChatSignalHub = {
    signalAccessor,
    whenAccess,

    takePeer,
    onUpdatePeer,
    offUpdatePeer,
    getChatUnit,
    getPeer,
    getSignal,
}