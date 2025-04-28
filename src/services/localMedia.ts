import { once } from "@utils";

// === DATA ===
export type LocalMediaHandler = (localMedia: MediaStream) => void;
const handlers: Set<LocalMediaHandler> = new Set();
let localMedia: MediaStream | null = null;

// === HELPERS ===
const execHandlers = (stream: MediaStream): void => {
    for (let h of handlers) h(stream);
    handlers.clear();
};

const lazyInit = once( (): void => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => { localMedia = stream; execHandlers(stream) })
    .catch(err => { console.error("Error getting local media stream:", err) });
} );

// === PUBLIC API ===
export const whenLocalMedia = (handler: LocalMediaHandler): void => {
    lazyInit();
    if (!localMedia) { handlers.add(handler); return; }
    handler(localMedia);
};

export const getLocalMedia = (): MediaStream | null => { lazyInit(); return localMedia; };