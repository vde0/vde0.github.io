import { createContext, useState } from "react";


interface ConnectState {
    curUserId: string;
    outUserId: string;
}

interface ConnectValue {
    state: ConnectState;
    next: () => void;
}


// init
const initConnectValue: ConnectValue = {
    state: { curUserId: '1', outUserId: '775'},
    next() {},
};


// Context obj
const ConnectContext = createContext<ConnectValue | null>( null );


// Provider obj
const ConnectProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [connectState, setConnectState] = useState<ConnectState>(initConnectValue.state);

    const nextHandler = () => {};

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
    ConnectState,
    ConnectValue,
};