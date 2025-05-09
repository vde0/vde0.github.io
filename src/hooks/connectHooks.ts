import { Peer } from "@lib/webrtc";
import { Connection } from "@services/Connection";
import { ConnectContext, ConnectValue, NextSignature } from "@store";
import { useContext } from "react";


export const useNext = (): NextSignature => {

    const { next } = getConnectContext("useNext");
    return next;
};

export const usePeer = (): Peer => {

    const { peer } = getConnectContext("usePeer");
    return peer;
};

export const useConnection = (): Connection => {

    const { connection } = getConnectContext("useConnection");
    return connection;
};


// === HELPERS ===
function getConnectContext (hookName?: string): ConnectValue {

    // === SUCCESS ===
    const context: ConnectValue | null = useContext(ConnectContext);
    if (context) return context;

    // === FAIL ===
    let errMsg: string = "";

    if (hookName)   errMsg = `${hookName} must be used within a ConnectProvider.`;
    else            errMsg = "useContext(ConnectContext) should be called within the ConnectProvider.";

    throw new Error(errMsg);
};