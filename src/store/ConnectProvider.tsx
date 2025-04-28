import { Connection } from "@services/Connection";
import { whenLocalMedia } from "@services/localMedia";
import { addDebug } from "@utils";
import { Peer, PEER_EVENTS } from "@lib/webrtc";
import { createContext, useCallback, useLayoutEffect, useRef, useState } from "react";


type NextSignature = () => void;
interface ConnectValue {
    state: Peer;
    next: NextSignature;
}


// Context obj
const ConnectContext = createContext<ConnectValue | null>( null );


// Provider obj
const ConnectProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    // === DATA ===
    const connection                        = useRef<Connection>( new Connection() );
    const localMedia                        = useRef<MediaStream | null>(null);
    const [connectState, setConnectState]   = useState<Peer>(connection.current.peer);
    const [isClosed, setIsClosed]           = useState<boolean>(false);
    
    // === HELPERS ===
    const updateConnection = useCallback(() => {
        connection.current.stop();
        connection.current = new Connection();
        setConnectState(connection.current.peer);
    }, []);
    const writeLocalMedia = useCallback((media: MediaStream) => {
        localMedia.current = media;
        media.getTracks().forEach( track => connectState.addMediaTrack(track, media) );
    }, [connectState]);
    const remoteMediaHandler = useCallback(({streams: [stream]}: {streams: MediaStream[]}) => {
        addDebug('remoteMedia', stream);
    }, [connectState]);

    // === HANDLERS ===
    const nextHandler: NextSignature = useCallback(() => {
        updateConnection();
        if (localMedia.current) writeLocalMedia(localMedia.current);
    }, []);

    // === EFFECTS ===
    useLayoutEffect(() => {
        let isMounted = true; // флаг для проверки
        whenLocalMedia( (stream) => {
            if (!isMounted) return;
            writeLocalMedia(stream);
            addDebug("localMedia", localMedia.current);
        } );
        
        return () => { isMounted = false; };
    }, []);

    useLayoutEffect(() => {
        connectState?.on(PEER_EVENTS.MEDIA, remoteMediaHandler);
        return () => connectState?.off(PEER_EVENTS.MEDIA, remoteMediaHandler);
    }, [connectState]);


    return (
        <ConnectContext.Provider value={{state: connectState, next: nextHandler}}>
            {children}
        </ConnectContext.Provider>
    );
};


export default ConnectProvider
export {ConnectContext};
// types
export {
    NextSignature,
    ConnectValue,
};