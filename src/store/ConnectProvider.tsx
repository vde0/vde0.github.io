import { createContext, useReducer, useState } from "react";


interface ConnectState {
    curUserId: string,
    outUserId: string,
}

interface ConnectValue {
    state: ConnectState,
    next: () => void,
}


const initConnectValue: ConnectValue = {
    state: { curUserId: '1', outUserId: '775'},
    next() {},
};

const ConnectContext = createContext<ConnectValue>( initConnectValue );


interface ConnectProviderProps {
    children?: React.ReactNode
}

const ConnectProvider: React.FC<ConnectProviderProps> = ({ children }) => {
    return (
        <ConnectContext value={initConnectValue}>
            {children}
        </ConnectContext>
    );
};


export default ConnectProvider