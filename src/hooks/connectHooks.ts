import { ConnectContext, NextSignature } from "@store";
import { CONNECT_EVENTS, SendSignature } from "api/signalling";
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";


export const useLocalMedia = (): MediaStream | null => {
    const context = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    //
    const { state: connect } = context;

    const [localMedia, setLocalMedia] = useState<MediaStream | null>(connect?.localMedia ?? null);

    useLayoutEffect(() => {
        setLocalMedia(connect?.localMedia ?? null);
    }, [connect]);

    return localMedia;
};
export const useRemoteMedia = (): MediaStream | null => {
    const context = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    //
    const { state: connect } = context;

    const [remoteMedia, setRemoteMedia] = useState<MediaStream | null>(connect?.remoteMedia ?? null);
    const update = useCallback(() => setRemoteMedia(connect?.remoteMedia ?? null), [connect]);

    useLayoutEffect(() => {
        update();
        connect?.on(CONNECT_EVENTS.MEDIA, update);
        return () => connect?.off(CONNECT_EVENTS.MEDIA, update);
    }, [connect]);

    return remoteMedia;
};

export const useTextChannel = (): [string, SendSignature] => {
    const context       = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    //
    const { state: connect } = context;

    const nullSend      = useCallback<SendSignature>((msg) => {}, []);

    // States
    const [textState, setTextState] = useState<string>(connect?.text ?? "");
    const [sendFunc, setSendFunc] = useState<SendSignature>(connect?.send ?? nullSend);

    // updaters / handlers
    const updateTextState = useCallback(() => {
        setTextState(connect?.text ?? "");
    }, [connect]);
    const updateSendFunc = useCallback(() => {
        setSendFunc(connect?.send ?? nullSend);
    }, [connect]);

    // Effects
    useLayoutEffect(() => {
        updateTextState();
        connect?.on(CONNECT_EVENTS.TEXT, updateTextState);
        return () => connect?.off(CONNECT_EVENTS.TEXT, updateTextState);
    }, [connect]);
    useLayoutEffect(() => {
        updateSendFunc();
    }, [connect]);

    // Return textState and sendFunc
    return [textState, sendFunc];
};

export const useNext = (): NextSignature => {
    const context   = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    
    const { next } = context;
    return next;
};