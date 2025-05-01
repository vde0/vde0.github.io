import { ConnectContext, NextSignature } from "@store";
import { whenLocalMedia } from "@services/localMedia";
import { PEER_EVENTS } from "@lib/webrtc";
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";


export const useLocalMedia = (): MediaStream | null => {
    const [localMedia, setLocalMedia] = useState<MediaStream | null>(null);

    useLayoutEffect(() => {
        let isMounted: boolean = true;
        whenLocalMedia( stream => { if (!isMounted) return; setLocalMedia(stream); } );
        return () => { isMounted = false; };
    }, []);

    return localMedia;
};
export const useLocalVideo = (): MediaStream | null => {
    const [localVideo, setLocalVideo] = useState<MediaStream | null>(null);

    useLayoutEffect(() => {
        let isMounted: boolean = true;
        whenLocalMedia( stream => {
            setLocalVideo(stream);
            if (!isMounted) return;
            const video = new MediaStream();
            stream.getVideoTracks().forEach(track => video.addTrack(track));
            setLocalVideo(video);
        } );
        return () => { isMounted = false; };
    }, []);

    return localVideo;
};
export const useRemoteMedia = (): MediaStream | null => {
    const context = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    //
    const { state: peer } = context;

    const getRemoteMedia = useCallback(() => peer.getMediaStream(peer.getMediaStreamIds()[0]), [peer]);

    const [remoteMedia, setRemoteMedia] = useState<MediaStream | null>(getRemoteMedia() ?? null);
    const update = useCallback(() => setRemoteMedia(getRemoteMedia() ?? null), [peer]);

    useLayoutEffect(() => {
        update();
        peer?.on(PEER_EVENTS.MEDIA, update);
        return () => peer?.off(PEER_EVENTS.MEDIA, update);
    }, [peer]);

    return remoteMedia;
};

type SendSignature = (msgText: string, channelLabel: string) => void;
export const useTextChannel = (): [string, SendSignature] => {
    const context       = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    //
    const { state: peer } = context;

    // States
    const [textState, setTextState] = useState<string>("");
    const [sendFunc, setSendFunc]   = useState<SendSignature>(peer.send);

    // updaters / handlers
    const updateTextState = useCallback((msgText: string) => setTextState(msgText), [peer]);
    const updateSendFunc = useCallback(() => setSendFunc(peer.send), [peer]);

    // Effects
    useLayoutEffect(() => {
        peer.on(PEER_EVENTS.TEXT, updateTextState);
        return () => peer.off(PEER_EVENTS.TEXT, updateTextState);
    }, [peer]);
    useLayoutEffect(() => {
        updateSendFunc();
    }, [peer]);

    // Return textState and sendFunc
    return [textState, sendFunc];
};

export const useNext = (): NextSignature => {
    const context   = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    
    const { next } = context;
    return next;
};