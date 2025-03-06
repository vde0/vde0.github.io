import { createContext, useReducer, useState } from "react";


interface ConnectState {
    curUserId: string,
    outUserId: string,
}

interface ConnectValue {
    state: ConnectState,
    next: () => void,
}


// init
const initConnectValue: ConnectValue = {
    state: { curUserId: '1', outUserId: '775'},
    next() {},
};


// Context obj
const ConnectContext = createContext<ConnectValue | null>( null );


interface ConnectProviderProps {
    children?: React.ReactNode
}

// Provider obj
const ConnectProvider: React.FC<ConnectProviderProps> = ({ children }) => {
    return (
        <ConnectContext value={initConnectValue}>
            {children}
        </ConnectContext>
    );
};


export {ConnectContext};
export default ConnectProvider