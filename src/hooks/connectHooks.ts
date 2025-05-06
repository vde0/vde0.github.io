import { ConnectContext, NextSignature } from "@store";
import { useContext } from "react";


export const useNext = (): NextSignature => {
    const context   = useContext(ConnectContext);
    if (!context) throw new Error("ConnectContext must be used within a ConnectProvider");
    
    const { next } = context;
    return next;
};