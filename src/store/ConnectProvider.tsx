import { Connect, ConnectInstance} from "api/signalling";
import { createContext, useCallback, useLayoutEffect, useRef, useState } from "react";


type NextSignature = () => void;
interface ConnectValue {
    state: ConnectInstance | null;
    next: NextSignature;
}


// Context obj
const ConnectContext = createContext<ConnectValue | null>( null );


// Provider obj
const ConnectProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [connectState, setConnectState]   = useState<ConnectInstance | null>(null);
    const localMedia                        = useRef<MediaStream | null>(null);
    
    const nextHandler: NextSignature = useCallback(() => {
        if (!localMedia.current) return;
        connectState?.close();
        setConnectState( new Connect(localMedia.current) );
    }, [connectState]);

    useLayoutEffect(() => {
        let isMounted = true; // флаг для проверки
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => { if (!isMounted) return; localMedia.current = stream; nextHandler(); })
            .catch(err => { if (!isMounted) return; console.error("Error getting user media:", err)});
        
        return () => { isMounted = false; };
    }, []);


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